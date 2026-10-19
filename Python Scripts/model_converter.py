import json
import os
from tkinter import Tk
from tkinter.filedialog import askdirectory

# ---------------------------------------------------------------------------
# Config: what Bedrock needs for held items to render correctly
# ---------------------------------------------------------------------------

MODEL_EXTENSION = ".csjsmodel"

# Held-item bones. If the source already has a node with this name, it just
# gets the binding. Otherwise it's created under `parent` (if that bone exists)
# using the pivot below, which is in final Bedrock space (not mirrored again).
HELD_ITEMS = [
    {"name": "rightItem", "parent": "ArmLeftLower", "pivot": [-6, 13, 1], "binding": "'leftitem'"},
    {"name": "leftItem", "parent": "ArmRightWrist", "pivot": [6, 13, 1], "binding": "'leftitem'"},
]

# Locators to attach to existing bones: {bone name: {locator name: position}}
LOCATORS = {
    "ArmRightWrist": {
        "left_item_sound": [6, 12, 0],
        "lead_hold": [6, 12, 0],
    },
}

# Root chain appended only if the source doesn't already define these bones.
ROOT_CHAIN = [
    {"name": "root", "pivot": [0, 0, 0]},
    {"name": "body", "parent": "root", "pivot": [0, 24, 0]},
    {"name": "leftArm", "parent": "body", "pivot": [5, 22, 0]},
    {"name": "rightArm", "parent": "body", "pivot": [-5, 22, 0]},
]

VISIBLE_BOUNDS = {
    "visible_bounds_width": 4,
    "visible_bounds_height": 3.5,
    "visible_bounds_offset": [0, 1.25, 0],
}

# ---------------------------------------------------------------------------


def convert_node(node, accum, bones, parent_name=None):
    """
    Recursively converts each node into a flat bone list with parent references.
    accum: cumulative position + offsetFromPivot from all ancestors
    parent_name: string name of the parent bone, or None for root bones
    """
    pos = node.get("position", [0, 0, 0])
    offset = node.get("offsetFromPivot", [0, 0, 0])
    size = node.get("size", [0, 0, 0])
    tex = node.get("texOffset", [0, 0])

    # Cube origin and pivot in source space
    origin = [accum[i] + pos[i] + offset[i] - size[i] / 2.0 for i in range(3)]
    pivot = [origin[i] + size[i] / 2.0 - offset[i] for i in range(3)]

    # Mirror across X and Z for Bedrock. Origin is the min corner, so it moves
    # to the opposite edge after negation.
    origin[0] = -(origin[0] + size[0])
    origin[2] = -(origin[2] + size[2])
    pivot[0] = -pivot[0]
    pivot[2] = -pivot[2]

    bone = {"name": node["name"]}

    if parent_name:
        bone["parent"] = parent_name

    bone["pivot"] = pivot

    # Mirroring X and Z together flips rotations about X and Z.
    # The two flips on Y cancel, so Y stays the same.
    rot = node.get("rotation", [0, 0, 0])
    if any(r != 0 for r in rot):
        bone["rotation"] = [-rot[0], rot[1], -rot[2]]

    # Pure transform bones (zero size) get no cubes
    if any(s != 0 for s in size):
        bone["cubes"] = [{"origin": origin, "size": size, "uv": tex, "mirror": True}]

    bones.append(bone)

    new_accum = [accum[i] + pos[i] + offset[i] for i in range(3)]
    for child in node.get("children", []):
        convert_node(child, new_accum, bones, node["name"])


def find_bone(bones, name):
    return next((b for b in bones if b["name"] == name), None)


def convert_model(input_model, label):
    """Convert one loaded model into a bone list. `label` is used in warnings."""
    bones = []

    for root_node in input_model.get("tree", []):
        convert_node(root_node, [0, 0, 0], bones)

    # Locators (e.g. the item sound anchor on the wrist)
    for bone_name, locs in LOCATORS.items():
        bone = find_bone(bones, bone_name)
        if bone:
            bone.setdefault("locators", {}).update(locs)
        else:
            print(f"  Warning [{label}]: bone '{bone_name}' not found, "
                  f"skipped locators {list(locs)}")

    # Held-item bones with bindings
    for item in HELD_ITEMS:
        existing = find_bone(bones, item["name"])
        if existing:
            existing["binding"] = item["binding"]
            continue

        parent_idx = next(
            (i for i, b in enumerate(bones) if b["name"] == item["parent"]), None
        )
        if parent_idx is None:
            print(f"  Warning [{label}]: parent '{item['parent']}' not found, "
                  f"skipped '{item['name']}'")
            continue

        # Insert directly after its parent, matching the sample ordering
        bones.insert(parent_idx + 1, {
            "name": item["name"],
            "parent": item["parent"],
            "pivot": item["pivot"],
            "binding": item["binding"],
        })

    # Root chain for held-item rendering
    for entry in ROOT_CHAIN:
        if not find_bone(bones, entry["name"]):
            bones.append(dict(entry))

    return bones


def unique_identifier(base, used):
    """Make sure every geometry identifier in the output is unique."""
    identifier = f"geometry.{base}"
    if identifier not in used:
        used.add(identifier)
        return identifier
    n = 2
    while f"{identifier}_{n}" in used:
        n += 1
    identifier = f"{identifier}_{n}"
    used.add(identifier)
    return identifier


def main():
    script_dir = os.path.dirname(os.path.realpath(__file__))

    root = Tk()
    root.withdraw()
    input_dir = askdirectory(title="Select folder containing model files")
    root.destroy()

    if not input_dir:
        print("No folder selected. Exiting.")
        exit(1)

    filenames = sorted(
        f for f in os.listdir(input_dir)
        if f.lower().endswith(MODEL_EXTENSION)
        and os.path.isfile(os.path.join(input_dir, f))
    )

    if not filenames:
        print(f"No {MODEL_EXTENSION} files found in: {input_dir}")
        exit(1)

    geometries = []
    used_identifiers = set()

    for filename in filenames:
        path = os.path.join(input_dir, filename)
        print(f"Converting {filename}")

        try:
            with open(path, "r") as f:
                input_model = json.load(f)
        except (json.JSONDecodeError, OSError) as e:
            print(f"  Skipped {filename}: {e}")
            continue

        # Fall back to the file name if the model has no title
        base_name = input_model.get("title") or os.path.splitext(filename)[0]
        bones = convert_model(input_model, filename)

        geometries.append({
            "description": {
                "identifier": unique_identifier(base_name, used_identifiers),
                "texture_width": 64,
                "texture_height": 64,
                **VISIBLE_BOUNDS,
            },
            "bones": bones,
        })

    if not geometries:
        print("No models could be converted. Exiting.")
        exit(1)

    output = {
        "format_version": "1.16.0",
        "minecraft:geometry": geometries,
    }

    output_path = os.path.join(script_dir, "output.geo.json")
    with open(output_path, "w") as out_file:
        json.dump(output, out_file, indent=4)

    print(f"Exported {len(geometries)} geometries to: {output_path}")


if __name__ == "__main__":
    main()
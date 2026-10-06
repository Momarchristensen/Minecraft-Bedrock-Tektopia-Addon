import json
import os
from tkinter import Tk
from tkinter.filedialog import askopenfilename

# ---------------------------------------------------------------------------
# Config: what Bedrock needs for held items to render correctly
# ---------------------------------------------------------------------------

# Held-item bones. If the source already has a node with this name, it just
# gets the binding. Otherwise it's created under `parent` (if that bone exists)
# using the pivot below, which is in final Bedrock space (not mirrored again).
HELD_ITEMS = [
    {"name": "rightItem", "parent": "ArmLeftLower", "pivot": [-6, 13, 1], "binding": "'leftitem'"},
    {"name": "leftItem", "parent": "ArmRightWrist", "pivot": [6, 13, 1], "binding": "'leftitem'"},
]

# Locators to attach to existing bones: {bone name: {locator name: position}}
LOCATORS = {
    "ArmRightWrist": {"left_item_sound": [0, 0, 0]},
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

script_dir = os.path.dirname(os.path.realpath(__file__))

root = Tk()
root.withdraw()
input_path = askopenfilename(
    title="Select model JSON file",
    filetypes=[("Model Files", "*.csjsmodel")],
)
root.destroy()

if not input_path:
    print("No input file selected. Exiting.")
    exit(1)

with open(input_path, "r") as f:
    input_model = json.load(f)

bones = []


def convert_node(node, accum, parent_name=None):
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
        convert_node(child, new_accum, node["name"])


for root_node in input_model.get("tree", []):
    convert_node(root_node, [0, 0, 0])


def find_bone(name):
    return next((b for b in bones if b["name"] == name), None)


# Locators (e.g. the item sound anchor on the wrist)
for bone_name, locs in LOCATORS.items():
    bone = find_bone(bone_name)
    if bone:
        bone.setdefault("locators", {}).update(locs)
    else:
        print(f"Warning: bone '{bone_name}' not found, skipped locators {list(locs)}")

# Held-item bones with bindings
for item in HELD_ITEMS:
    existing = find_bone(item["name"])
    if existing:
        existing["binding"] = item["binding"]
        continue

    parent_idx = next((i for i, b in enumerate(bones) if b["name"] == item["parent"]), None)
    if parent_idx is None:
        print(f"Warning: parent '{item['parent']}' not found, skipped '{item['name']}'")
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
    if not find_bone(entry["name"]):
        bones.append(dict(entry))

geometry = {
    "format_version": "1.16.0",
    "minecraft:geometry": [
        {
            "description": {
                "identifier": f"geometry.{input_model.get('title', 'model')}",
                "texture_width": 64,
                "texture_height": 64,
                **VISIBLE_BOUNDS,
            },
            "bones": bones,
        }
    ],
}

output_path = os.path.join(script_dir, "output.geo.json")
with open(output_path, "w") as out_file:
    json.dump(geometry, out_file, indent=4)

print(f"Geometry exported to: {output_path}")
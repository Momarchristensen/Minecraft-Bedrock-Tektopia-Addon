import copy
import json
from pathlib import Path
import tkinter as tk
from tkinter import filedialog, messagebox

# Defaults used by the game for legacy (1.8.0) models without explicit size.
LEGACY_DEFAULT_TEXTURE_WIDTH = 64
LEGACY_DEFAULT_TEXTURE_HEIGHT = 32


def strip_json_comments(text):
    """Remove // and /* */ comments (Bedrock files may contain them)."""
    out = []
    i = 0
    n = len(text)
    in_string = False

    while i < n:
        c = text[i]

        if in_string:
            out.append(c)
            if c == "\\" and i + 1 < n:
                out.append(text[i + 1])
                i += 2
                continue
            if c == '"':
                in_string = False
            i += 1
        elif c == '"':
            in_string = True
            out.append(c)
            i += 1
        elif text.startswith("//", i):
            j = text.find("\n", i)
            i = n if j == -1 else j
        elif text.startswith("/*", i):
            j = text.find("*/", i + 2)
            i = n if j == -1 else j + 2
        else:
            out.append(c)
            i += 1

    return "".join(out)


def load_json(path):
    text = Path(path).read_text(encoding="utf-8-sig")
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        return json.loads(strip_json_comments(text))


def index_models(models_dir, errors):
    """
    Read every *.geo.json under models_dir once and build a lookup:
        identifier -> {"kind": "modern" | "legacy", "data": ..., "path": ...,
                       "parent": <identifier or None>  (legacy only)}

    Modern files use "minecraft:geometry": [ {description, bones}, ... ].
    Legacy (1.8.0) files use top-level keys such as
        "geometry.child:geometry.parent": { bones, texturewidth, ... }
    """
    index = {}
    model_files = (
        sorted(models_dir.rglob("*.geo.json")) if models_dir.is_dir() else []
    )

    for model_path in model_files:
        try:
            data = load_json(model_path)
        except (OSError, json.JSONDecodeError) as exc:
            errors.append(f"{model_path}: {exc}")
            continue

        if not isinstance(data, dict):
            continue

        # Modern format.
        modern = data.get("minecraft:geometry")
        if isinstance(modern, list):
            for geometry in modern:
                if not isinstance(geometry, dict):
                    continue
                identifier = geometry.get("description", {}).get("identifier")
                if identifier and identifier not in index:
                    index[identifier] = {
                        "kind": "modern",
                        "data": geometry,
                        "path": model_path,
                    }

        # Legacy 1.8.0 format.
        for key, value in data.items():
            if not key.startswith("geometry.") or not isinstance(value, dict):
                continue

            identifier, _, parent = key.partition(":")
            identifier = identifier.strip()
            parent = parent.strip() or None

            if identifier not in index:
                index[identifier] = {
                    "kind": "legacy",
                    "data": value,
                    "parent": parent,
                    "path": model_path,
                }

    return index


def merge_bone(parent_bone, child_bone):
    """Child bone adds its cubes to the parent's; other fields override."""
    merged = copy.deepcopy(parent_bone)

    for key, value in child_bone.items():
        if key == "cubes":
            merged.setdefault("cubes", []).extend(copy.deepcopy(value))
        elif key == "locators" and isinstance(value, dict):
            merged.setdefault("locators", {}).update(copy.deepcopy(value))
        else:
            merged[key] = copy.deepcopy(value)

    return merged


def flatten_legacy(identifier, index, used_files, errors, chain=()):
    """
    Resolve a legacy geometry's parent chain into one flat definition.

    - Properties (texturewidth, visible_bounds_*, ...) are inherited and
      overridden by the child.
    - Bones are inherited; a child bone with the same name is merged into
      the parent's bone (its cubes are added to the parent's cubes, locators
      are combined, other fields override). New bones are appended.
    """
    entry = index[identifier]
    used_files.add(entry["path"])
    data = entry["data"]

    merged = {}
    parent_id = entry.get("parent")

    if parent_id:
        if parent_id == identifier or parent_id in chain:
            errors.append(
                f"Circular parent reference: '{identifier}' -> '{parent_id}'"
            )
        elif parent_id not in index or index[parent_id]["kind"] != "legacy":
            errors.append(
                f"Parent '{parent_id}' of '{identifier}' not found; "
                f"exporting without inherited bones"
            )
        else:
            merged = flatten_legacy(
                parent_id, index, used_files, errors, chain + (identifier,)
            )

    result = {k: v for k, v in merged.items() if k != "bones"}
    bones = list(merged.get("bones", []))

    for key, value in data.items():
        if key != "bones":
            result[key] = copy.deepcopy(value)

    positions = {bone.get("name"): i for i, bone in enumerate(bones)}

    for bone in data.get("bones", []):
        bone = copy.deepcopy(bone)
        name = bone.get("name")

        if name in positions:
            bones[positions[name]] = merge_bone(bones[positions[name]], bone)
        else:
            positions[name] = len(bones)
            bones.append(bone)

    result["bones"] = bones
    return result


def legacy_to_modern(identifier, flat):
    """Convert a flattened 1.8.0 geometry to a 1.12.0 geometry entry."""
    description = {
        "identifier": identifier,
        "texture_width": flat.get("texturewidth", LEGACY_DEFAULT_TEXTURE_WIDTH),
        "texture_height": flat.get(
            "textureheight", LEGACY_DEFAULT_TEXTURE_HEIGHT
        ),
    }

    for key in (
        "visible_bounds_width",
        "visible_bounds_height",
        "visible_bounds_offset",
    ):
        if key in flat:
            description[key] = flat[key]

    bones = []
    for bone in flat.get("bones", []):
        bone = dict(bone)

        # 1.8.0 "bind_pose_rotation" is "rotation" in newer formats.
        if "bind_pose_rotation" in bone:
            rotation = bone.pop("bind_pose_rotation")
            bone.setdefault("rotation", rotation)

        bones.append(bone)

    return {"description": description, "bones": bones}


def main():
    script_dir = Path(__file__).resolve().parent
    output_file = script_dir / "output.geo.json"

    # Select one or more .entity.json files using File Explorer.
    root = tk.Tk()
    root.withdraw()

    entity_files = filedialog.askopenfilenames(
        title="Select Bedrock entity JSON files",
        filetypes=[
            ("Entity JSON files", "*.entity.json"),
            ("JSON files", "*.json"),
            ("All files", "*.*"),
        ],
    )

    if not entity_files:
        root.destroy()
        return

    geometries = []
    seen_identifiers = set()
    seen_files = set()
    errors = []
    converted_legacy = 0
    model_indexes = {}  # models_dir -> index (each dir is scanned once)

    for entity_path in map(Path, entity_files):
        # Models are located relative to the selected entity file's directory.
        models_dir = entity_path.parent.parent / "models" / "entity"

        try:
            entity_data = load_json(entity_path)
        except (OSError, json.JSONDecodeError) as exc:
            errors.append(f"{entity_path.name}: {exc}")
            continue

        description = (
            entity_data.get("minecraft:client_entity", {})
            .get("description", {})
        )

        geometry_refs = description.get("geometry", {})
        if isinstance(geometry_refs, str):
            geometry_refs = {"default": geometry_refs}

        if not isinstance(geometry_refs, dict):
            errors.append(
                f"{entity_path.name}: invalid geometry definition"
            )
            continue

        if models_dir not in model_indexes:
            model_indexes[models_dir] = index_models(models_dir, errors)
        index = model_indexes[models_dir]

        # Resolve geometry identifiers to actual model definitions.
        for identifier in set(geometry_refs.values()):
            if not isinstance(identifier, str):
                continue

            if identifier in seen_identifiers:
                continue

            entry = index.get(identifier)

            if entry is None:
                errors.append(
                    f"Model not found for '{identifier}' "
                    f"(referenced by {entity_path.name})"
                )
                continue

            if entry["kind"] == "modern":
                geometries.append(entry["data"])
                seen_files.add(entry["path"])
            else:
                flat = flatten_legacy(identifier, index, seen_files, errors)
                geometries.append(legacy_to_modern(identifier, flat))
                converted_legacy += 1

            seen_identifiers.add(identifier)

    # Write a valid Bedrock geometry JSON file.
    output_data = {
        "format_version": "1.12.0",
        "minecraft:geometry": geometries,
    }

    try:
        output_file.write_text(
            json.dumps(output_data, indent=2, ensure_ascii=False) + "\n",
            encoding="utf-8",
        )
    except OSError as exc:
        messagebox.showerror("Error", f"Could not write output file:\n{exc}")
        root.destroy()
        return

    summary = (
        f"Export complete!\n\n"
        f"Geometries copied: {len(geometries)}\n"
        f"Converted from 1.8.0: {converted_legacy}\n"
        f"Model files used: {len(seen_files)}\n"
        f"Output: {output_file}"
    )

    if errors:
        summary += "\n\nWarnings:\n" + "\n".join(errors[:20])
        if len(errors) > 20:
            summary += f"\n...and {len(errors) - 20} more warnings."

    if errors:
        messagebox.showwarning("Export finished with warnings", summary)
    else:
        messagebox.showinfo("Export complete", summary)

    root.destroy()


if __name__ == "__main__":
    main()
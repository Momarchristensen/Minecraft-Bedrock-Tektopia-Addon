import json
from pathlib import Path
import tkinter as tk
from tkinter import filedialog, messagebox


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


def index_render_controllers(controllers_dir, errors):
    """
    Read every *.json under render_controllers/ once and build:
        controller id -> (controller definition, source file)
    """
    index = {}
    files = (
        sorted(controllers_dir.rglob("*.json"))
        if controllers_dir.is_dir()
        else []
    )

    for path in files:
        try:
            data = load_json(path)
        except (OSError, json.JSONDecodeError) as exc:
            errors.append(f"{path}: {exc}")
            continue

        if not isinstance(data, dict):
            continue

        controllers = data.get("render_controllers")
        if not isinstance(controllers, dict):
            continue

        for identifier, definition in controllers.items():
            if identifier not in index:
                index[identifier] = (definition, path)

    return index


def get_controller_ids(description):
    """
    The entity's "render_controllers" list may contain plain strings or
    objects such as {"controller.render.x": "query.is_baby"}; the key is
    the controller identifier in the object form.
    """
    refs = description.get("render_controllers", [])
    if isinstance(refs, (str, dict)):
        refs = [refs]

    ids = []
    if not isinstance(refs, list):
        return ids

    for ref in refs:
        if isinstance(ref, str):
            ids.append(ref)
        elif isinstance(ref, dict):
            ids.extend(key for key in ref if isinstance(key, str))

    return ids


def main():
    script_dir = Path(__file__).resolve().parent
    output_file = script_dir / "output.render_controllers.json"

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

    controllers = {}
    seen_files = set()
    errors = []
    indexes = {}  # render_controllers dir -> index (each dir scanned once)

    for entity_path in map(Path, entity_files):
        # Render controllers live in <pack>/render_controllers, a sibling
        # of the folder holding the entity file.
        controllers_dir = entity_path.parent.parent / "render_controllers"

        try:
            entity_data = load_json(entity_path)
        except (OSError, json.JSONDecodeError) as exc:
            errors.append(f"{entity_path.name}: {exc}")
            continue

        description = (
            entity_data.get("minecraft:client_entity", {})
            .get("description", {})
        )

        if not isinstance(description, dict):
            errors.append(f"{entity_path.name}: invalid description")
            continue

        if controllers_dir not in indexes:
            indexes[controllers_dir] = index_render_controllers(
                controllers_dir, errors
            )
        index = indexes[controllers_dir]

        for identifier in get_controller_ids(description):
            if identifier in controllers:
                continue

            entry = index.get(identifier)

            if entry is None:
                errors.append(
                    f"Render controller not found for '{identifier}' "
                    f"(referenced by {entity_path.name})"
                )
                continue

            definition, source_path = entry
            controllers[identifier] = definition
            seen_files.add(source_path)

    # Write a valid Bedrock render controller JSON file.
    output_data = {
        "format_version": "1.10.0",
        "render_controllers": controllers,
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
        f"Render controllers copied: {len(controllers)}\n"
        f"Source files used: {len(seen_files)}\n"
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
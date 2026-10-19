"""
Find every Bedrock recipe that uses a given item as an input, then copy those
recipes to <script folder>/output with every matching input id swapped for a new id.

Usage:
    python find_recipes.py minecraft:acacia_planks minecraft:oak_planks
    python find_recipes.py acacia_planks oak_planks     (namespace is optional)
    python find_recipes.py                              (prompts for both ids)
    python find_recipes.py stick bamboo --dir "D:\\other\\recipes"   (skips the folder picker)

A file explorer window opens to select the recipes folder unless --dir is given.
Recipe identifiers are left unchanged in the copies.
"""

import argparse
import json
import os
import re
import tkinter as tk
from tkinter import filedialog

# The folder picker opens here if it exists.
DEFAULT_RECIPES_DIR = r"C:\Users\Momar\Desktop\Minecraft Resources\Minecraft Bedrock\behavior_pack\recipes"
OUTPUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "output")


def normalize_id(value):
    """'acacia_planks' -> 'minecraft:acacia_planks'; drops a trailing ':<data>' number."""
    value = value.strip().lower()
    if ":" not in value:
        return "minecraft:" + value
    head, tail = value.rsplit(":", 1)
    if tail.isdigit() and ":" in head:  # e.g. minecraft:quartz_block:0
        return head
    return value


def load_json(path):
    with open(path, "r", encoding="utf-8-sig") as f:
        text = f.read()
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        # Bedrock files sometimes contain // comments
        stripped = re.sub(r"^\s*//.*$", "", text, flags=re.MULTILINE)
        return json.loads(stripped)


def ingredient_id(ing):
    """Return ('item', id) / ('tag', id) for a string or {item/tag, data} dict, else None."""
    if isinstance(ing, str):
        return ("item", normalize_id(ing))
    if isinstance(ing, dict):
        if "item" in ing:
            return ("item", normalize_id(ing["item"]))
        if "tag" in ing:
            return ("tag", ing["tag"].strip().lower())
    return None


def result_text(res):
    if isinstance(res, str):
        return normalize_id(res)
    if isinstance(res, dict):
        name = res.get("item")
        if name:
            count = res.get("count", 1)
            return f"{normalize_id(name)} x{count}" if count != 1 else normalize_id(name)
    if isinstance(res, list):
        return ", ".join(filter(None, (result_text(r) for r in res)))
    return "?"


def recipe_input_slots(rtype, body):
    """Yield (role, container, key) for every input of a recipe, so inputs can be read or replaced."""
    if rtype == "minecraft:recipe_shaped":
        pattern = "".join(body.get("pattern", []))
        key = body.get("key", {})
        for symbol in list(key):
            if symbol in pattern:
                yield f"key '{symbol}'", key, symbol
    elif rtype == "minecraft:recipe_shapeless":
        ingredients = body.get("ingredients", [])
        for i in range(len(ingredients)):
            yield "ingredient", ingredients, i
    elif rtype == "minecraft:recipe_furnace":
        yield "input", body, "input"
    elif rtype in ("minecraft:recipe_brewing_mix", "minecraft:recipe_brewing_container"):
        yield "input", body, "input"
        yield "reagent", body, "reagent"
    elif rtype in ("minecraft:recipe_smithing_transform", "minecraft:recipe_smithing_trim"):
        for role in ("template", "base", "addition"):
            yield role, body, role


def replace_ingredient(container, key, new_id):
    """Swap the item id of container[key] for new_id (string or {item: ...} form)."""
    ing = container[key]
    if isinstance(ing, str):
        container[key] = new_id
    elif isinstance(ing, dict):
        ing["item"] = new_id


def recipe_output(rtype, body):
    if rtype in ("minecraft:recipe_furnace", "minecraft:recipe_brewing_mix",
                 "minecraft:recipe_brewing_container"):
        return result_text(body.get("output"))
    if rtype == "minecraft:recipe_smithing_trim":
        return "(trimmed armor)"
    return result_text(body.get("result"))


def find_recipes(folder, target, new_id):
    """Return (matches, errors, modified) where modified maps relative path -> edited recipe data."""
    matches = []
    errors = []
    modified = {}
    for root, _dirs, files in os.walk(folder):
        for name in sorted(files):
            if not name.lower().endswith(".json"):
                continue
            path = os.path.join(root, name)
            rel = os.path.relpath(path, folder)
            try:
                data = load_json(path)
            except (OSError, ValueError) as e:
                errors.append((path, str(e)))
                continue
            if not isinstance(data, dict):
                continue

            file_changed = False
            for rtype, body in data.items():
                if not rtype.startswith("minecraft:recipe_") or not isinstance(body, dict):
                    continue
                roles = []
                for role, container, key in recipe_input_slots(rtype, body):
                    parsed = ingredient_id(container[key])
                    if parsed and parsed[0] == "item" and parsed[1] == target:
                        roles.append(role)
                        replace_ingredient(container, key, new_id)
                if roles:
                    file_changed = True
                    ident = body.get("description", {}).get("identifier", os.path.splitext(name)[0])
                    matches.append({
                        "file": rel,
                        "id": ident,
                        "type": rtype.replace("minecraft:recipe_", ""),
                        "roles": sorted(set(roles)),
                        "output": recipe_output(rtype, body),
                    })
            if file_changed:
                modified[rel] = data
    return matches, errors, modified


def write_output(modified, out_dir):
    """Write the edited recipes to out_dir, keeping their relative folder structure."""
    for rel, data in modified.items():
        dest = os.path.join(out_dir, rel)
        os.makedirs(os.path.dirname(dest), exist_ok=True)
        with open(dest, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)
            f.write("\n")


def pick_folder(initial_dir):
    """Open a file explorer dialog and return the chosen folder ('' if cancelled)."""
    root = tk.Tk()
    root.withdraw()
    root.attributes("-topmost", True)  # keep the dialog from hiding behind other windows
    folder = filedialog.askdirectory(
        title="Select the recipes folder",
        initialdir=initial_dir if os.path.isdir(initial_dir) else os.path.expanduser("~"),
        mustexist=True,
    )
    root.destroy()
    return folder


def main():
    parser = argparse.ArgumentParser(
        description="Find recipes that use an item as an input and copy them with that input replaced.")
    parser.add_argument("item", nargs="?", help="item id to look for, e.g. minecraft:stick")
    parser.add_argument("replacement", nargs="?", help="item id to put in its place, e.g. minecraft:bamboo")
    parser.add_argument("--dir", help="recipes folder to scan (skips the folder picker)")
    args = parser.parse_args()

    item = args.item or input("Item id to find: ")
    replacement = args.replacement or input("Replace it with: ")
    target = normalize_id(item)
    new_id = normalize_id(replacement)

    folder = args.dir or pick_folder(DEFAULT_RECIPES_DIR)
    if not folder:
        print("No folder selected.")
        return
    folder = os.path.normpath(folder)

    if not os.path.isdir(folder):
        print(f"Folder not found: {folder}")
        return

    matches, errors, modified = find_recipes(folder, target, new_id)

    print(f"Searching: {folder}")
    print(f"Recipes using {target} as an input: {len(matches)}\n")
    for m in sorted(matches, key=lambda m: (m["type"], m["file"])):
        print(f"[{m['type']}] {m['file']}")
        print(f"    id:     {m['id']}")
        print(f"    as:     {', '.join(m['roles'])}")
        print(f"    output: {m['output']}")

    if modified:
        write_output(modified, OUTPUT_DIR)
        print(f"\nCopied {len(modified)} file(s) to {OUTPUT_DIR} with {target} -> {new_id}")

    if errors:
        print(f"\n{len(errors)} file(s) could not be parsed:")
        for path, err in errors:
            print(f"  {path}: {err}")


if __name__ == "__main__":
    main()
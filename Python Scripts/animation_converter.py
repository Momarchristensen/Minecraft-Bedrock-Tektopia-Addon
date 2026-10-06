#!/usr/bin/env python3

import json
import os
from tkinter import Tk
from tkinter.filedialog import askdirectory

# This script converts all JSON animation files in a selected folder from the nodeAnimations format
# to Minecraft Bedrock animation schema (format_version 1.8.0). It writes a single output file
# output.animation.json containing all animations.

def main():
    # Hide the root window for file dialog
    root = Tk()
    root.withdraw()

    # Prompt user to select input directory
    input_dir = askdirectory(
        title="Select folder containing animation JSON files"
    )
    if not input_dir:
        print("No folder selected. Exiting.")
        return

    # Determine script directory and output path
    script_dir = os.path.dirname(os.path.abspath(__file__))
    output_path = os.path.join(script_dir, "output.animation.json")

    # Prepare output structure
    output = {
        "format_version": "1.8.0",
        "animations": {}
    }

    # Iterate through files in input directory
    for filename in os.listdir(input_dir):
        if not filename.lower().endswith(".csjsmodelanim"):
            continue
        file_path = os.path.join(input_dir, filename)
        try:
            with open(file_path, 'r') as f:
                data = json.load(f)
        except Exception as e:
            print(f"Failed to load {filename}: {e}")
            continue

        title = data.get("title", os.path.splitext(filename)[0])
        duration = data.get("duration", 0) / 60

        # Convert nodeAnimations to bones
        bones = {}
        for node_name, props in data.get("nodeAnimations", {}).items():
            bone = {}
            for prop_name, frames in props.items():
                # map property names and skip unwanted
                if prop_name == "stretch":
                    prop_name = "scale"
                elif prop_name == "size":
                    continue

                if not frames:
                    continue

                bone[prop_name] = {}
                for frame_str, values in frames.items():
                    try:
                        frame = float(frame_str)
                    except ValueError:
                        continue

                    # Normalize frame time between 0 and 1
                    time = frame / 60

                    # adjust scale values
                    if prop_name == "scale":
                        values = [v + 1 for v in values]

                    # format values for JSON compatibility
                    formatted = []
                    for v in values:
                        raw = str(v)
                        if 'e' in raw.lower():
                            # expand scientific notation and trim
                            s = f"{v:.50f}".rstrip('0').rstrip('.')
                        else:
                            # leave integers and regular floats intact
                            s = raw
                        formatted.append(s)

                    bone[prop_name][f"{time:.6f}"] = formatted

            if bone:
                bones[node_name] = bone

        # Add to output animations
        key = f"animation.{title}"
        output['animations'][key] = {
            "loop": True,
            "animation_length": duration,
            "bones": bones
        }
        print(f"Converted: {filename} -> {key}")

    # Write combined output JSON
    with open(output_path, 'w') as f:
        json.dump(output, f, indent=4)

    print(f"All animations saved to {output_path}")

if __name__ == "__main__":
    main()

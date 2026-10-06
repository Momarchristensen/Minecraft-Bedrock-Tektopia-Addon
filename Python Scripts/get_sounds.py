import json
from pathlib import Path
import pyperclip

# Example: script_dir is the directory of the current script
script_dir = Path(__file__).parent

# Get the first directory inside behavior_packs
behavior_packs_dir = script_dir.parent / "behavior_packs"
first_dir = next(behavior_packs_dir.iterdir()).name

# Paths to JSON files
desktop_path = Path.home() / "Desktop"
blocks_path = desktop_path / "Minecraft Resources" / "Minecraft Bedrock" / "resource_pack" / "blocks.json"
sounds_path = desktop_path / "Minecraft Resources" / "Minecraft Bedrock" / "resource_pack" / "sounds.json"

# Load blocks.json
with open(blocks_path, "r", encoding="utf-8") as f:
    blocks_data = json.load(f)

# Load sounds.json
with open(sounds_path, "r", encoding="utf-8") as f:
    sounds_data = json.load(f)

# Generate mapping: block key -> break & place sound events
block_to_sounds = {}

for key, value in blocks_data.items():
    if key == "format_version":
        continue

    sound_name = value.get("sound")

    if sound_name:
        block_to_sounds[key] = {}

        for event_type in ["break", "place", "fence_gate.close", "fence_gate.open"]:
            try:
                event_sound = sounds_data["block_sounds"][sound_name]["events"][event_type]
                block_to_sounds[key][event_type] = event_sound
            except KeyError:
                block_to_sounds[key][event_type] = None

# Convert to JSON
output = json.dumps(block_to_sounds, indent=2)

# Copy to Windows clipboard
pyperclip.copy(output)

print("Copied to clipboard!")
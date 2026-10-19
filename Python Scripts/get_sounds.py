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

# Paths to extra JSON files (override/extend the base files)
extra_blocks_path = script_dir / "extra_blocks.json"
extra_sounds_path = script_dir / "extra_sounds.json"

# Output event name -> event name used in sounds.json
# (Bedrock calls the chest close event "chest.closed")
SOURCE_EVENT_NAMES = {
    "chest.close": "chest.closed",
}


def load_json(path):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def deep_merge(base, extra):
    """Recursively merge `extra` into `base` and return a new dict.

    - Values from `extra` take precedence over values from `base`.
    - Nested dicts are merged key by key instead of being replaced.
    - Keys that exist in only one of the two are preserved.
    """
    if not isinstance(base, dict) or not isinstance(extra, dict):
        return extra

    merged = dict(base)
    for key, extra_value in extra.items():
        if key in merged and isinstance(merged[key], dict) and isinstance(extra_value, dict):
            merged[key] = deep_merge(merged[key], extra_value)
        else:
            merged[key] = extra_value
    return merged


# Load blocks.json and extra_blocks.json, then merge
blocks_data = deep_merge(load_json(blocks_path), load_json(extra_blocks_path))

# Load sounds.json and extra_sounds.json, then merge
sounds_data = deep_merge(load_json(sounds_path), load_json(extra_sounds_path))

# Generate mapping: block key -> break & place sound events
block_to_sounds = {}

for key, value in blocks_data.items():
    if key == "format_version":
        continue

    sound_name = value.get("sound")

    if sound_name:
        block_to_sounds[key] = {}

        for event_type in ["break", "place", "fence_gate.close", "fence_gate.open", "door.open", "door.close", "chest.open", "chest.close"]:
            source_event = SOURCE_EVENT_NAMES.get(event_type, event_type)
            try:
                event_sound = sounds_data["block_sounds"][sound_name]["events"][source_event]
                block_to_sounds[key][event_type] = event_sound
            except KeyError:
                block_to_sounds[key][event_type] = None

# Convert to JSON
output = json.dumps(block_to_sounds, indent=2)

# Copy to Windows clipboard
pyperclip.copy(output)

print("Copied to clipboard!")
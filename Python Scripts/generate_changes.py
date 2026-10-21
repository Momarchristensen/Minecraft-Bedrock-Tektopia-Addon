
import subprocess
from pathlib import Path

script_dir = Path(__file__).parent

commands = [
    ["git", "diff", "HEAD", "--name-only"],
    ["git", "diff", "HEAD"],
]

output_path = script_dir / "output.txt"

with output_path.open("w", encoding="utf-8") as output_file:
    for command in commands:
        result = subprocess.run(
            command,
            cwd=script_dir,
            capture_output=True,
            text=True,
            check=True,
        )

        output_file.write(f"$ {' '.join(command)}\n")
        output_file.write(result.stdout)
        output_file.write("\n")

print(f"Output saved to {output_path}")

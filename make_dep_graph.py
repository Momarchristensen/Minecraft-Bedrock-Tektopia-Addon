import shutil
import subprocess
import sys
from pathlib import Path

script_dir = Path(__file__).resolve().parent


def find_tool(name: str) -> str:
    """Locate an executable (handles npx.cmd on Windows)."""
    path = shutil.which(name)
    if not path:
        sys.exit(f"Error: '{name}' was not found on PATH.")
    return path


def main() -> None:
    if not (script_dir / "src").is_dir():
        sys.exit(f"Error: 'src' folder not found in {script_dir}")

    npx = find_tool("npx")
    dot = find_tool("dot")
    out_path = script_dir / "dependencies.svg"

    # Step 1: depcruise -> DOT (kept in memory)
    print(f"Running dependency-cruiser on 'src'...")
    result = subprocess.run(
        [
            npx,
            "depcruise",
            "src",
            "--include-only",
            f"^src",
            "--output-type",
            "dot",
        ],
        cwd=script_dir,
        capture_output=True,
        text=True,
        encoding="utf-8",
    )
    # depcruise exits non-zero if rule violations exist; the graph is still valid
    if result.returncode != 0 and not result.stdout.strip():
        sys.exit(f"depcruise failed:\n{result.stderr}")

    # Step 2: pipe DOT straight into Graphviz -> SVG
    print("Rendering SVG with Graphviz...")
    result = subprocess.run(
        [dot, "-Tsvg", "-o", str(out_path)],
        input=result.stdout,
        cwd=script_dir,
        capture_output=True,
        text=True,
        encoding="utf-8",
    )
    if result.returncode != 0:
        sys.exit(f"dot failed:\n{result.stderr}")
    print(f"Wrote {out_path}")


if __name__ == "__main__":
    main()

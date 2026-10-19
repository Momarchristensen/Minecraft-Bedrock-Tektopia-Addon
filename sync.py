#!/usr/bin/env python3
"""
sync_json_properties.py
=======================

Synchronizes selected JSON properties across all JSON files inside each
configured directory.  Every entry in DIRECTORIES is an independent
synchronization group.

HOW TO USE
----------
1. Edit DIRECTORIES (and the settings below it).
2. Run (watches by default):   python sync_json_properties.py
   Single pass and exit:       python sync_json_properties.py --once
   Preview a single pass:      python sync_json_properties.py --dry-run
   (--dry-run implies --once.)  Stop watching with Ctrl+C.
3. Exit codes (single pass): 0 = clean run, 1 = conflicts/errors occurred,
   2 = invalid config.  Watch mode exits 0 on Ctrl+C.

HOW IT WORKS (short version)
----------------------------
* A state file stores, per group and per property path, the value that was
  last synchronized, plus the list of files that were known at that time.
* On each run, a file counts as "changed" for a property when its current value
  differs from the saved value.  Timestamps are never used.
* Exactly one distinct changed value  -> it becomes the new value for the group.
* Several files changed to *different* values -> conflict; nothing is written
  for that property and the saved value is kept.
* Files that are not in the saved file list are NEW.  They never act as a
  source; they inherit the saved value.
* A file missing a configured property gets it restored from the saved value.
  (A missing property is never treated as an intentional deletion.)
* Watch mode polls the directories (stdlib only, no extra packages).  File
  size/mtime changes only *wake up* the sync; what actually changed is still
  decided from the property values and the saved state.  A short debounce lets
  editors/tools finish writing before the sync runs.
* First run (no state): the first file, in sorted relative-path order, that
  contains the property is the source.  This is logged.

Requires Python 3.9+ and only the standard library.
Note: files must be strict JSON (no comments / trailing commas).  Files that
fail to parse are reported and skipped, never modified.
"""

from __future__ import annotations

import argparse
import copy
import json
import os
import shutil
import sys
import tempfile
import time
from dataclasses import dataclass, field
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple, Union

script_dir = Path(__file__).resolve()
pack_dir = script_dir.parent

# ============================================================================
# CONFIGURATION
# ============================================================================


# 'path' may be a string or a pathlib.Path (or any os.PathLike).
DIRECTORIES: List[Dict[str, Any]] = [
    {
        "path": pack_dir / "resource_packs" / "TekTopia" / "entity",
        "properties": [
            ["minecraft:client_entity", "description", "sound_effects"],
            ["minecraft:client_entity", "description", "particle_effects"],
            ["minecraft:client_entity", "description", "animations"],
            ["minecraft:client_entity", "description", "scripts"]
        ],
    },
    {
        "path": pack_dir / "behavior_packs" / "TekTopia" / "entities" / "tektopia",
        "properties": [
            ["minecraft:entity", "components"],
            ["minecraft:entity", "description", "properties"]
        ]
    }
]

_SCRIPT_DIR = Path(__file__).resolve().parent

# Persistent state file.  Keep it OUTSIDE the synchronized directories
# (it is also excluded from discovery if it ends up inside one).
STATE_FILE: Path = _SCRIPT_DIR / "json_sync_state.json"

RECURSIVE: bool = True              # scan subdirectories too
BACKUPS_ENABLED: bool = True        # copy files here before modifying them
BACKUP_DIR: Path = _SCRIPT_DIR / "json_sync_backups"
JSON_INDENT: int = 4               # indentation for files that get rewritten
STOP_GROUP_ON_CONFLICT: bool = False  # True: a conflict halts the whole group
                                      # (no files in that group are modified)

WATCH: bool = True                  # keep running and re-sync when files change
POLL_INTERVAL: float = 1.0          # seconds between directory checks
DEBOUNCE: float = 0.5               # seconds files must stay quiet before syncing

# ============================================================================
# TYPES / SENTINELS
# ============================================================================

PathPart = Union[str, int]
PropertyPath = List[PathPart]
STATE_VERSION = 1


class _Missing:
    """Sentinel distinguishing 'property absent' from JSON null."""

    def __repr__(self) -> str:
        return "<MISSING>"


MISSING = _Missing()


class JsonFileError(Exception):
    """A JSON file could not be read or parsed."""


class PropertyPathError(Exception):
    """A property path could not be created/navigated in a document."""


class StateError(Exception):
    """The state file is unreadable or malformed."""


@dataclass
class Settings:
    recursive: bool
    backups_enabled: bool
    backup_dir: Path
    indent: int
    stop_on_conflict: bool
    state_file: Path
    dry_run: bool = False


@dataclass
class JsonFile:
    path: Path
    rel: str                      # path relative to the group directory (posix style)
    data: Any
    original: bytes
    is_new: bool = False
    new_data: Any = None
    changes: List[str] = field(default_factory=list)
    error: Optional[str] = None


@dataclass
class Summary:
    updated: List[Path] = field(default_factory=list)
    unchanged: List[Path] = field(default_factory=list)
    skipped: List[Tuple[Path, str]] = field(default_factory=list)
    conflicts: List[str] = field(default_factory=list)
    errors: int = 0


# ============================================================================
# LOGGING
# ============================================================================

def info(msg: str) -> None:
    print(f"  [INFO] {msg}")


def warn(msg: str) -> None:
    print(f"  [WARN] {msg}")


def error(msg: str) -> None:
    print(f"  [ERROR] {msg}")


def conflict_log(msg: str) -> None:
    print(f"  [CONFLICT] {msg}")


def label_of(prop: PropertyPath) -> str:
    return " > ".join(str(p) for p in prop)


# ============================================================================
# CONFIGURATION VALIDATION
# ============================================================================

def validate_configuration(directories: List[Dict[str, Any]], indent: int) -> List[str]:
    """Return a list of human-readable configuration errors (empty if valid)."""
    problems: List[str] = []

    if not isinstance(directories, list) or not directories:
        return ["DIRECTORIES must be a non-empty list."]
    if not isinstance(indent, int) or isinstance(indent, bool) or indent < 0:
        problems.append("JSON_INDENT must be a non-negative integer.")

    seen_paths: Dict[str, int] = {}
    resolved_dirs: List[Tuple[int, Path]] = []

    for i, group in enumerate(directories):
        where = f"DIRECTORIES[{i}]"
        if not isinstance(group, dict):
            problems.append(f"{where} must be a dict.")
            continue
        path = group.get("path")
        props = group.get("properties")

        if not isinstance(path, (str, os.PathLike)) or not str(path).strip():
            problems.append(f"{where}: 'path' must be a non-empty string or path object.")
        else:
            resolved = Path(path).resolve()
            if str(resolved) in seen_paths:
                problems.append(
                    f"{where}: path duplicates DIRECTORIES[{seen_paths[str(resolved)]}]."
                )
            seen_paths[str(resolved)] = i
            resolved_dirs.append((i, resolved))

        if not isinstance(props, list) or not props:
            problems.append(f"{where}: 'properties' must be a non-empty list.")
            continue

        cleaned: List[PropertyPath] = []
        for j, prop in enumerate(props):
            pwhere = f"{where}.properties[{j}]"
            if not isinstance(prop, list) or not prop:
                problems.append(f"{pwhere} must be a non-empty list of keys.")
                continue
            if not all(isinstance(p, (str, int)) and not isinstance(p, bool) for p in prop):
                problems.append(f"{pwhere} may only contain strings or integers.")
                continue
            if prop in cleaned:
                problems.append(f"{pwhere} duplicates another property path in this group.")
                continue
            cleaned.append(prop)

        # A path that is a prefix of another would make two properties overlap.
        for a in cleaned:
            for b in cleaned:
                if a is not b and len(a) < len(b) and b[: len(a)] == a:
                    problems.append(
                        f"{where}: '{label_of(a)}' contains '{label_of(b)}'; "
                        "overlapping property paths are not allowed."
                    )

    # Nested directories with recursion would blur group independence.
    if RECURSIVE:
        for i, a in resolved_dirs:
            for j, b in resolved_dirs:
                if i != j and a in b.parents:
                    print(
                        f"[WARN] DIRECTORIES[{j}] lies inside DIRECTORIES[{i}] and RECURSIVE is "
                        f"on: files of group {j} are also members of group {i}."
                    )
    return problems


# ============================================================================
# FILE DISCOVERY AND SAFE I/O
# ============================================================================

def discover_json_files(directory: Path, recursive: bool, excluded: List[Path]) -> List[Path]:
    """Find all .json files, sorted by relative path (deterministic order)."""
    iterator = directory.rglob("*") if recursive else directory.glob("*")
    excluded_files = {p.resolve() for p in excluded if p.suffix}
    excluded_dirs = [p.resolve() for p in excluded if not p.suffix]
    found: List[Path] = []
    for p in iterator:
        if not p.is_file() or p.suffix.lower() != ".json":
            continue
        rp = p.resolve()
        if rp in excluded_files or any(d in rp.parents for d in excluded_dirs):
            continue
        found.append(p)
    return sorted(found, key=lambda p: p.relative_to(directory).as_posix())


def read_json_file(path: Path) -> Tuple[Any, bytes]:
    """Read and parse a JSON file; return (data, raw_bytes)."""
    try:
        raw = path.read_bytes()
        data = json.loads(raw.decode("utf-8-sig"))
    except OSError as exc:
        raise JsonFileError(f"unreadable: {exc}") from exc
    except (UnicodeDecodeError, json.JSONDecodeError) as exc:
        raise JsonFileError(f"invalid JSON: {exc}") from exc
    return data, raw


def _atomic_write_bytes(path: Path, payload: bytes) -> None:
    """Write via a temp file in the same directory, then atomically replace."""
    path.parent.mkdir(parents=True, exist_ok=True)
    fd, tmp_name = tempfile.mkstemp(dir=path.parent, prefix=path.name + ".", suffix=".tmp")
    try:
        with os.fdopen(fd, "wb") as handle:
            handle.write(payload)
            handle.flush()
            os.fsync(handle.fileno())
        os.replace(tmp_name, path)
    except BaseException:
        try:
            os.unlink(tmp_name)
        except OSError:
            pass
        raise


def write_json_file(path: Path, data: Any, indent: int) -> None:
    text = json.dumps(data, indent=indent, ensure_ascii=False) + "\n"
    _atomic_write_bytes(path, text.encode("utf-8"))


def create_backup(file: Path, directory: Path, backup_root: Path, run_stamp: str, group_index: int) -> Path:
    dest = backup_root / run_stamp / f"group{group_index}" / file.relative_to(directory)
    dest.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(file, dest)
    return dest


# ============================================================================
# NESTED PROPERTY ACCESS
# ============================================================================

def get_property(data: Any, path: PropertyPath) -> Any:
    """Return the value at `path`, or MISSING if any step is absent."""
    node = data
    for part in path:
        if isinstance(node, dict) and isinstance(part, str) and part in node:
            node = node[part]
        elif isinstance(node, list) and isinstance(part, int) and -len(node) <= part < len(node):
            node = node[part]
        else:
            return MISSING
    return node


def set_property(data: Any, path: PropertyPath, value: Any) -> None:
    """
    Set the value at `path`, creating missing intermediate dictionaries.
    Raises PropertyPathError if an intermediate node exists but is not a
    container (so unrelated data is never overwritten).
    """
    if not isinstance(data, dict):
        raise PropertyPathError("document root is not a JSON object")
    node: Any = data
    for part in path[:-1]:
        if isinstance(node, dict):
            if not isinstance(part, str):
                raise PropertyPathError(f"integer key {part!r} used on an object")
            if part not in node:
                node[part] = {}
            node = node[part]
        elif isinstance(node, list):
            if not isinstance(part, int) or not -len(node) <= part < len(node):
                raise PropertyPathError(f"index {part!r} invalid for array")
            node = node[part]
        else:
            raise PropertyPathError(f"'{part}' cannot be created inside a non-container value")

    last = path[-1]
    if isinstance(node, dict) and isinstance(last, str):
        node[last] = copy.deepcopy(value)
    elif isinstance(node, list) and isinstance(last, int) and -len(node) <= last < len(node):
        node[last] = copy.deepcopy(value)
    else:
        raise PropertyPathError(f"cannot set key {last!r} on {type(node).__name__}")


# ============================================================================
# COMPARISON
# ============================================================================

def canonical(value: Any) -> str:
    """Order-independent, formatting-independent representation of a JSON value."""
    return json.dumps(value, sort_keys=True, separators=(",", ":"), ensure_ascii=False)


def values_equal(a: Any, b: Any) -> bool:
    if a is MISSING or b is MISSING:
        return a is b
    return canonical(a) == canonical(b)


# ============================================================================
# STATE
# ============================================================================

def load_state(state_file: Path) -> Tuple[Dict[str, Any], bool]:
    """Load state; returns (state, freshly_created)."""
    if not state_file.exists():
        return {"version": STATE_VERSION, "groups": {}}, True
    try:
        state = json.loads(state_file.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise StateError(f"cannot read state file {state_file}: {exc}") from exc
    if not isinstance(state, dict) or not isinstance(state.get("groups"), dict):
        raise StateError(f"state file {state_file} has an unexpected structure")
    return state, False


def save_state(state_file: Path, state: Dict[str, Any], indent: int) -> None:
    text = json.dumps(state, indent=indent, ensure_ascii=False, sort_keys=True) + "\n"
    _atomic_write_bytes(state_file, text.encode("utf-8"))


# ============================================================================
# CHANGE DETECTION AND CONFLICT RESOLUTION
# ============================================================================

def detect_changes(values: Dict[str, Any], baseline: Any) -> Dict[str, Tuple[Any, List[str]]]:
    """
    Compare current values with the saved baseline.
    Returns {canonical_value: (value, [files that hold it])} for files whose
    value differs from the baseline.  Files missing the property are not
    changes (they are restored later).
    """
    changed: Dict[str, Tuple[Any, List[str]]] = {}
    for rel, value in values.items():
        if value is MISSING or values_equal(value, baseline):
            continue
        entry = changed.setdefault(canonical(value), (value, []))
        entry[1].append(rel)
    return changed


def resolve_conflict(
    changed: Dict[str, Tuple[Any, List[str]]], label: str
) -> Optional[Tuple[Any, List[str]]]:
    """
    One distinct changed value -> (value, source files).
    Several distinct values -> report and return None (no arbitrary choice).
    """
    if len(changed) == 1:
        value, sources = next(iter(changed.values()))
        return value, sources
    conflict_log(f"'{label}' was changed to {len(changed)} different values:")
    for _, (value, files) in changed.items():
        preview = canonical(value)
        if len(preview) > 80:
            preview = preview[:77] + "..."
        print(f"      {', '.join(files)}  ->  {preview}")
    return None


def choose_initial_source(
    all_files: List[JsonFile], eligible: List[JsonFile], prop: PropertyPath
) -> Optional[Tuple[JsonFile, Any]]:
    """First file in sorted order that has the property (known files preferred)."""
    for pool in (eligible, all_files):
        for f in pool:
            value = get_property(f.data, prop)
            if value is not MISSING:
                return f, value
    return None


# ============================================================================
# GROUP SYNCHRONIZATION
# ============================================================================

def load_group_files(paths: List[Path], directory: Path, summary: Summary) -> List[JsonFile]:
    files: List[JsonFile] = []
    for p in paths:
        try:
            data, raw = read_json_file(p)
        except JsonFileError as exc:
            error(f"{p}: {exc} (skipped)")
            summary.skipped.append((p, str(exc)))
            summary.errors += 1
            continue
        files.append(JsonFile(path=p, rel=p.relative_to(directory).as_posix(), data=data, original=raw))
    return files


def synchronize_group(
    group_index: int,
    group: Dict[str, Any],
    state: Dict[str, Any],
    settings: Settings,
    summary: Summary,
    run_stamp: str,
) -> None:
    directory = Path(group["path"])
    properties: List[PropertyPath] = group["properties"]
    print(f"\n=== Group {group_index}: {directory} ===")

    if not directory.is_dir():
        error(f"directory does not exist: {directory} (group skipped)")
        summary.errors += 1
        return
    directory = directory.resolve()
    group_key = str(directory)

    excluded = [settings.state_file, settings.backup_dir]
    paths = discover_json_files(directory, settings.recursive, excluded)
    info(f"{len(paths)} JSON file(s) discovered"
         f"{' (recursive)' if settings.recursive else ''}")
    files = load_group_files(paths, directory, summary)
    if not files:
        warn("no valid JSON files; nothing to do")
        return

    # --- state for this group -------------------------------------------
    group_state = state["groups"].get(group_key)
    first_run = group_state is None
    if first_run:
        info("no saved state for this group: initializing from current files")
        group_state = {"files": [], "properties": {}}
    known = set(group_state.get("files", []))
    saved_props: Dict[str, Any] = group_state.setdefault("properties", {})

    for f in files:
        f.is_new = (not first_run) and f.rel not in known
        if f.is_new:
            info(f"new file discovered: {f.rel} (will inherit synchronized values)")
        f.new_data = copy.deepcopy(f.data)

    eligible = [f for f in files if not f.is_new]  # allowed to act as a source
    info("synchronizing: " + "; ".join(label_of(p) for p in properties))

    # --- decide the target value for each property -----------------------
    targets: Dict[str, Tuple[PropertyPath, Any]] = {}
    group_conflicts = 0

    for prop in properties:
        label = label_of(prop)
        pkey = json.dumps(prop)

        if pkey in saved_props:
            baseline = saved_props[pkey]
            values = {f.rel: get_property(f.data, prop) for f in eligible}
            changed = detect_changes(values, baseline)
            if not changed:
                targets[pkey] = (prop, baseline)
                continue
            resolved = resolve_conflict(changed, label)
            if resolved is None:
                group_conflicts += 1
                summary.conflicts.append(f"{directory}: {label}")
                continue
            target, sources = resolved
            info(f"'{label}' changed in {', '.join(sources)} -> propagating")
            targets[pkey] = (prop, target)
        else:
            choice = choose_initial_source(files, eligible, prop)
            if choice is None:
                warn(f"'{label}' not present in any file; nothing to synchronize")
                continue
            source, value = choice
            info(f"initialized '{label}' from {source.rel}")
            targets[pkey] = (prop, value)

    if group_conflicts and settings.stop_on_conflict:
        error("conflict(s) detected and STOP_GROUP_ON_CONFLICT is on: group left untouched")
        for f in files:
            summary.skipped.append((f.path, "group halted by conflict"))
        return

    # --- compute new documents in memory ---------------------------------
    for pkey, (prop, target) in targets.items():
        label = label_of(prop)
        for f in files:
            if f.error:
                continue
            current = get_property(f.new_data, prop)
            if current is not MISSING and values_equal(current, target):
                continue
            action = "added" if current is MISSING else "updated"
            try:
                set_property(f.new_data, prop, target)
                f.changes.append(f"{action} '{label}'")
            except PropertyPathError as exc:
                f.error = f"'{label}': {exc}"
                warn(f"{f.rel}: cannot apply {f.error} (file left untouched)")

    to_write = [f for f in files if f.changes and not f.error]
    for f in files:
        if f.error:
            summary.skipped.append((f.path, f.error))
            summary.errors += 1
        elif not f.changes:
            summary.unchanged.append(f.path)
            info(f"no changes needed: {f.rel}")

    # --- write files (with backups and rollback) -------------------------
    written: List[JsonFile] = []
    write_failed = False
    for f in to_write:
        tag = " (new file)" if f.is_new else ""
        if settings.dry_run:
            info(f"[dry-run] would modify {f.rel}{tag}: {'; '.join(f.changes)}")
            continue
        try:
            if settings.backups_enabled:
                create_backup(f.path, directory, settings.backup_dir, run_stamp, group_index)
            write_json_file(f.path, f.new_data, settings.indent)
            written.append(f)
            info(f"modified {f.rel}{tag}: {'; '.join(f.changes)}")
        except OSError as exc:
            error(f"failed to write {f.rel}: {exc}")
            summary.errors += 1
            write_failed = True
            break

    if write_failed:
        warn("rolling back files written in this group")
        for f in written:
            try:
                _atomic_write_bytes(f.path, f.original)
            except OSError as exc:
                error(f"rollback of {f.rel} failed: {exc}")
        summary.skipped.extend((f.path, "group write failed") for f in to_write)
        return  # state is NOT updated

    if settings.dry_run:
        return
    summary.updated.extend(f.path for f in to_write)

    # --- update state (only after files were written successfully) -------
    new_props = dict(saved_props)
    for pkey, (_prop, target) in targets.items():
        new_props[pkey] = target
    discovered = {f.rel for f in files}
    new_known = sorted((known & {p.relative_to(directory).as_posix() for p in paths}) | discovered)
    new_group_state = {"files": new_known, "properties": new_props}

    if first_run or canonical(new_group_state) != canonical(group_state):
        state["groups"][group_key] = new_group_state
        try:
            save_state(settings.state_file, state, settings.indent)
            info("state saved")
        except OSError as exc:
            error(f"could not save state ({exc}); files are updated, the next run will "
                  "converge without data loss")
            summary.errors += 1


# ============================================================================
# MAIN
# ============================================================================

def print_summary(summary: Summary, dry_run: bool) -> None:
    print("\n=== Summary" + (" (dry run)" if dry_run else "") + " ===")
    print(f"  Updated files:   {len(summary.updated)}")
    for p in summary.updated:
        print(f"      {p}")
    print(f"  Unchanged files: {len(summary.unchanged)}")
    print(f"  Skipped files:   {len(summary.skipped)}")
    for p, reason in summary.skipped:
        print(f"      {p}: {reason}")
    print(f"  Conflicts:       {len(summary.conflicts)}")
    for c in summary.conflicts:
        print(f"      {c}")
    print(f"  Errors:          {summary.errors}")


Snapshot = Dict[str, Tuple[int, int]]


def take_snapshot(group: Dict[str, Any], settings: Settings) -> Snapshot:
    """Cheap fingerprint {file: (mtime_ns, size)} used only to wake the sync."""
    directory = Path(group["path"])
    try:
        if not directory.is_dir():
            return {}
        paths = discover_json_files(
            directory, settings.recursive, [settings.state_file, settings.backup_dir]
        )
    except OSError:
        return {}
    snap: Snapshot = {}
    for p in paths:
        try:
            st = p.stat()
        except OSError:
            continue
        snap[str(p)] = (st.st_mtime_ns, st.st_size)
    return snap


def wait_until_stable(group: Dict[str, Any], settings: Settings, snap: Snapshot) -> Snapshot:
    """Debounce: wait until the group's files stop changing (bounded)."""
    for _ in range(40):
        time.sleep(DEBOUNCE)
        current = take_snapshot(group, settings)
        if current == snap:
            return current
        snap = current
    return snap


def run_pass(group_indexes: List[int], state: Dict[str, Any], settings: Settings) -> Summary:
    """Synchronize the given groups once and return the combined summary."""
    summary = Summary()
    run_stamp = datetime.now().strftime("%Y%m%d-%H%M%S-%f")
    for index in group_indexes:
        try:
            synchronize_group(index, DIRECTORIES[index], state, settings, summary, run_stamp)
        except Exception as exc:  # one broken group must not stop the others
            error(f"unexpected failure in group {index}: {exc!r}")
            summary.errors += 1
    return summary


def watch(state: Dict[str, Any], settings: Settings) -> None:
    """Initial sync of every group, then re-sync a group whenever its files change."""
    all_groups = list(range(len(DIRECTORIES)))
    print_summary(run_pass(all_groups, state, settings), False)

    snapshots = {i: take_snapshot(g, settings) for i, g in enumerate(DIRECTORIES)}
    print(f"\n[WATCH] Watching {len(DIRECTORIES)} group(s) every {POLL_INTERVAL}s. "
          "Press Ctrl+C to stop.")

    while True:
        time.sleep(POLL_INTERVAL)
        dirty: List[int] = []
        for i, group in enumerate(DIRECTORIES):
            current = take_snapshot(group, settings)
            if current != snapshots[i]:
                snapshots[i] = wait_until_stable(group, settings, current)
                dirty.append(i)
        if not dirty:
            continue

        print(f"\n[WATCH] {datetime.now():%H:%M:%S} change detected in group(s): "
              + ", ".join(str(i) for i in dirty))
        print_summary(run_pass(dirty, state, settings), False)
        # Refresh fingerprints so our own writes don't trigger another pass.
        for i in dirty:
            snapshots[i] = take_snapshot(DIRECTORIES[i], settings)
        print("[WATCH] waiting for changes...")


def main() -> int:
    parser = argparse.ArgumentParser(description="Synchronize JSON properties across files.")
    parser.add_argument("--dry-run", action="store_true",
                        help="report changes without writing anything (single pass)")
    parser.add_argument("--once", action="store_true",
                        help="run a single synchronization pass instead of watching")
    args = parser.parse_args()
    watch_mode = WATCH and not args.once and not args.dry_run

    problems = validate_configuration(DIRECTORIES, JSON_INDENT)
    if problems:
        print("Configuration errors (nothing was modified):")
        for p in problems:
            print(f"  - {p}")
        return 2

    settings = Settings(
        recursive=RECURSIVE,
        backups_enabled=BACKUPS_ENABLED,
        backup_dir=BACKUP_DIR,
        indent=JSON_INDENT,
        stop_on_conflict=STOP_GROUP_ON_CONFLICT,
        state_file=STATE_FILE,
        dry_run=args.dry_run,
    )

    try:
        state, fresh = load_state(settings.state_file)
    except StateError as exc:
        print(f"[ERROR] {exc}\nRefusing to continue so the state is not overwritten.")
        return 2
    if fresh:
        print(f"[INFO] No state file found; it will be created at {settings.state_file}")

    if watch_mode:
        try:
            watch(state, settings)
        except KeyboardInterrupt:
            print("\n[WATCH] stopped.")
        return 0

    summary = run_pass(list(range(len(DIRECTORIES))), state, settings)
    print_summary(summary, settings.dry_run)
    return 1 if (summary.conflicts or summary.errors) else 0


if __name__ == "__main__":
    sys.exit(main())
#!/usr/bin/env python3

import json
import math
import os
import sys

# Converts all .csjsmodelanim files in a selected folder (nodeAnimations format) to the
# Minecraft Bedrock animation schema (format_version 1.8.0). Writes a single
# output.animation.json next to this script containing every animation.
#
# Rotation handling
# -----------------
# The source files store Euler angles that are composed in a different order than Bedrock
# uses (source: Z, then X, then Y  ->  R = Ry * Rx * Rz;  Bedrock: X, then Y, then Z
# ->  R = Rz * Ry * Rx). Copying the three numbers across only gives the same pose when a
# single axis is rotated, which is why simple animations looked right but ones that turn an
# arm on several axes at once (cast_forward, summon, ...) did not.
#
# So every rotation keyframe is converted as an *orientation*: source Euler -> quaternion ->
# Bedrock Euler. Because Bedrock then interpolates each Euler component linearly, extra
# keyframes are inserted wherever that would drift away from the shortest-path (slerp)
# motion between the original keyframes.

# Max allowed angular error (degrees) between Bedrock's per-component interpolation and the
# ideal slerp path before another keyframe is inserted.
TOLERANCE_DEG = 1.0
MAX_SUBDIVISION_DEPTH = 8
# Values with an absolute value below this are written as 0.
ZERO_EPS = 1e-6


# ---------------------------------------------------------------- quaternion helpers
# Quaternions are (w, x, y, z).

def q_mul(a, b):
    aw, ax, ay, az = a
    bw, bx, by, bz = b
    return (
        aw * bw - ax * bx - ay * by - az * bz,
        aw * bx + ax * bw + ay * bz - az * by,
        aw * by - ax * bz + ay * bw + az * bx,
        aw * bz + ax * by - ay * bx + az * bw,
    )


def q_axis(axis, deg):
    h = math.radians(deg) / 2
    s, c = math.sin(h), math.cos(h)
    return (c, s if axis == 0 else 0.0, s if axis == 1 else 0.0, s if axis == 2 else 0.0)


def q_norm(q):
    n = math.sqrt(sum(c * c for c in q)) or 1.0
    return tuple(c / n for c in q)


def q_dot(a, b):
    return sum(x * y for x, y in zip(a, b))


def q_slerp(a, b, t):
    d = q_dot(a, b)
    if d < 0:  # take the short way round
        b = tuple(-c for c in b)
        d = -d
    if d > 0.9995:
        return q_norm(tuple(x + t * (y - x) for x, y in zip(a, b)))
    theta = math.acos(d)
    s = math.sin(theta)
    wa = math.sin((1 - t) * theta) / s
    wb = math.sin(t * theta) / s
    return q_norm(tuple(wa * x + wb * y for x, y in zip(a, b)))


def q_angle_between(a, b):
    d = min(1.0, abs(q_dot(a, b)))
    return math.degrees(2 * math.acos(d))


def source_euler_to_quat(rot):
    """Source order: rotate about Z, then X, then Y  =>  q = qy * qx * qz."""
    x, y, z = rot
    return q_norm(q_mul(q_mul(q_axis(1, y), q_axis(0, x)), q_axis(2, z)))


def quat_to_bedrock_euler(q):
    """Bedrock order: rotate about X, then Y, then Z  =>  R = Rz * Ry * Rx."""
    w, x, y, z = q
    r20 = 2 * (x * z - w * y)
    r21 = 2 * (y * z + w * x)
    r22 = 1 - 2 * (x * x + y * y)
    r10 = 2 * (x * y + w * z)
    r00 = 1 - 2 * (y * y + z * z)
    if abs(r20) < 0.999999:
        ey = math.asin(-r20)
        ex = math.atan2(r21, r22)
        ez = math.atan2(r10, r00)
    else:  # gimbal lock: Y is +-90 degrees, fold everything into Z
        r01 = 2 * (x * y - w * z)
        r11 = 1 - 2 * (x * x + z * z)
        ey = math.copysign(math.pi / 2, -r20)
        ex = 0.0
        ez = math.atan2(-r01, r11)
    return (math.degrees(ex), math.degrees(ey), math.degrees(ez))


def nearest_equivalent(euler, prev):
    """Of all Euler triples describing the same orientation, return the one closest to prev
    so Bedrock never takes the long way round (e.g. 170 -> -170 going through 0)."""
    x, y, z = euler
    best, best_d = None, None
    for cx, cy, cz in ((x, y, z), (x + 180, 180 - y, z + 180)):
        triple = []
        for c, p in zip((cx, cy, cz), prev):
            triple.append(c + 360 * round((p - c) / 360))
        d = sum((a - b) ** 2 for a, b in zip(triple, prev))
        if best_d is None or d < best_d:
            best, best_d = tuple(triple), d
    return best


def bedrock_lerp_error(q0, e0, q1, e1, t, q_ideal):
    """Angle (deg) between Bedrock's component-wise interpolation and the ideal pose at t."""
    mid = tuple(a + t * (b - a) for a, b in zip(e0, e1))
    qm = euler_bedrock_to_quat(mid)
    return q_angle_between(qm, q_ideal)


def euler_bedrock_to_quat(e):
    x, y, z = e
    return q_norm(q_mul(q_mul(q_axis(2, z), q_axis(1, y)), q_axis(0, x)))


def convert_rotation_track(frames):
    """frames: {frame_str: [x, y, z]} in source format.
    Returns a sorted list of (frame, [x, y, z]) in Bedrock format, with extra keyframes
    where needed."""
    keys = []
    for frame_str, values in frames.items():
        try:
            keys.append((float(frame_str), source_euler_to_quat(values)))
        except (ValueError, TypeError):
            continue
    keys.sort(key=lambda k: k[0])
    if not keys:
        return []

    out = []
    prev_euler = nearest_equivalent(quat_to_bedrock_euler(keys[0][1]), (0.0, 0.0, 0.0))
    out.append((keys[0][0], prev_euler))

    for (t0, q0), (t1, q1) in zip(keys, keys[1:]):
        if q_dot(q0, q1) < 0:
            q1 = tuple(-c for c in q1)
        e0 = out[-1][1]
        e1 = nearest_equivalent(quat_to_bedrock_euler(q1), e0)

        def subdivide(ta, qa, ea, tb, qb, eb, depth):
            """Appends extra keys strictly between a and b, plus b itself."""
            if depth < MAX_SUBDIVISION_DEPTH and (tb - ta) > 1.0:  # don't go below 1 frame
                qm = q_slerp(qa, qb, 0.5)
                if bedrock_lerp_error(qa, ea, qb, eb, 0.5, qm) > TOLERANCE_DEG:
                    tm = (ta + tb) / 2
                    em = nearest_equivalent(quat_to_bedrock_euler(qm), ea)
                    subdivide(ta, qa, ea, tm, qm, em, depth + 1)
                    subdivide(tm, qm, em, tb, qb, eb, depth + 1)
                    return
            out.append((tb, eb))

        subdivide(t0, q0, e0, t1, q1, e1, 0)

    return out


# ---------------------------------------------------------------- formatting
def fmt(v):
    if abs(v) < ZERO_EPS:
        return "0"
    s = f"{v:.5f}".rstrip('0').rstrip('.')
    return "0" if s in ("-0", "") else s


def fmt_raw(v):
    """Original formatting rule: expand scientific notation, leave everything else intact."""
    raw = str(v)
    if 'e' in raw.lower():
        return f"{v:.50f}".rstrip('0').rstrip('.')
    return raw


def animation_key(title):
    """villager_cast_forward -> animation.tektopia_villager.cast_forward
    necro_idle              -> animation.necromancer_idle (same style as your existing file)
    anything else           -> animation.<title>"""
    if title.startswith("villager_"):
        return f"animation.tektopia_villager.{title[len('villager_'):]}"
    if title.startswith("necro_"):
        return f"animation.necromancer_{title[len('necro_'):]}"
    return f"animation.{title}"


def convert_file(data, filename):
    title = data.get("title", os.path.splitext(filename)[0])
    duration = data.get("duration", 0) / 60

    bones = {}
    for node_name, props in data.get("nodeAnimations", {}).items():
        bone = {}
        for prop_name, frames in props.items():
            if prop_name == "stretch":
                prop_name = "scale"
            elif prop_name == "size":
                continue

            if not frames:
                continue

            if prop_name == "rotation":
                track = {}
                for frame, euler in convert_rotation_track(frames):
                    track[f"{frame / 60:.6f}"] = [fmt(v) for v in euler]
                if track:
                    bone["rotation"] = track
                continue

            bone[prop_name] = {}
            for frame_str, values in frames.items():
                try:
                    frame = float(frame_str)
                except ValueError:
                    continue
                time = frame / 60
                if prop_name == "scale":
                    values = [v + 1 for v in values]
                bone[prop_name][f"{time:.6f}"] = [fmt_raw(v) for v in values]

        if bone:
            bones[node_name] = bone

    return animation_key(title), {
        "loop": True,
        "animation_length": duration,
        "bones": bones,
    }


def pick_input_dir():
    if len(sys.argv) > 1:
        return sys.argv[1]
    from tkinter import Tk
    from tkinter.filedialog import askdirectory
    root = Tk()
    root.withdraw()
    return askdirectory(title="Select folder containing animation JSON files")


def main():
    input_dir = pick_input_dir()
    if not input_dir:
        print("No folder selected. Exiting.")
        return

    script_dir = os.path.dirname(os.path.abspath(__file__))
    output_path = os.path.join(script_dir, "output.animation.json")

    output = {"format_version": "1.8.0", "animations": {}}

    # Load everything first so we can spot files that share a "title" (e.g. child_walk and
    # villager_walk are both titled villager_walk). Previously the last one read silently
    # overwrote the others.
    loaded = []
    for filename in sorted(os.listdir(input_dir)):
        if not filename.lower().endswith(".csjsmodelanim"):
            continue
        file_path = os.path.join(input_dir, filename)
        try:
            with open(file_path, 'r') as f:
                loaded.append((filename, json.load(f)))
        except Exception as e:
            print(f"Failed to load {filename}: {e}")

    title_counts = {}
    for filename, data in loaded:
        title = data.get("title", os.path.splitext(filename)[0])
        title_counts[title] = title_counts.get(title, 0) + 1

    for filename, data in loaded:
        stem = os.path.splitext(filename)[0]
        title = data.get("title", stem)
        if title_counts[title] > 1 and stem != title:
            data = dict(data, title=stem)  # duplicate title: file name wins for this one
            print(f"Note: {filename} shares title '{title}' with another file; using '{stem}'")
        key, anim = convert_file(data, filename)
        output['animations'][key] = anim
        print(f"Converted: {filename} -> {key}")

    with open(output_path, 'w') as f:
        json.dump(output, f, indent=4)

    print(f"All animations saved to {output_path}")


if __name__ == "__main__":
    main()
"""
Pick one or more vanilla *.entity.json files (File Explorer dialog) and generate
everything the wireframe needs for them, laid out like a resource pack in
<script_dir>/output/ :

    output/entity/<name>.entity.json                      vanilla entity + wireframe additions
    output/render_controllers/wireframe.render_controller.json
    output/models/entity/wireframe.mask.geo.json
    output/models/entity/wireframe.shell.geo.json
    output/animations/wireframe.animation.json
    output/scaler_bones.json
    output/textures/wireframe/<texture path minus "textures/">.png   green textures
    output/wireframe_report.json

What is generated
  * Green textures: every non-blank pixel becomes (0,255,0,255), the rest stays transparent.
  * Mask / shell geometries (same UVs as the vanilla model, so they line up with the
    green textures).
  * For every vanilla render controller of the entity, a "<id>.wireframe_mask" and a
    "<id>.wireframe_outline" controller. They are copies of the vanilla controller with
    Geometry.X -> Geometry.X_mask / _shell and Texture.X -> Texture.wireframe_X, so
    variants (warm/cold/baby/sheared...) keep working exactly like vanilla.
  * A scale animation for the shell's scaler bones (output/animations/wireframe.animation.json).
    Each scaler bone is scaled per axis by 1 + v.wireframe_t / half_size, where
    v.wireframe_t = min(query.distance_from_camera * THICKNESS_PER_BLOCK, MAX_THICKNESS), so the
    outline keeps roughly the same on-screen thickness at any distance. Bones that exist in
    several geometries with different sizes (adult/baby...) get a ternary that follows the
    vanilla render controller's geometry expression.
  * The entity file gets: the two wireframe materials, the green textures
    (wireframe_<key>), the mask/shell geometries (<key>_mask / <key>_shell), the two
    wireframe render controllers, and the scale animation ("wireframe_scale", played from
    scripts.animate plus a v.wireframe_t line in scripts.pre_animation). Controllers and the
    animation are gated by WIREFRAME_CONDITION.

Running it on an entity file that already has wireframe additions is fine: the old
additions are removed first, then regenerated.

Needs Pillow (pip install pillow) and get_entity_models.py + get_entity_render_controllers.py
in the same folder.

Assumed pack layout:  <pack>/entity/x.entity.json   <pack>/render_controllers/*.json
                      <pack>/models/entity/*.geo.json   <pack>/textures/...
"""

import copy
import json
import re
import sys
from pathlib import Path

from PIL import Image

from get_entity_models import (
    flatten_legacy,
    index_models,
    legacy_to_modern,
    load_json,
)
from get_entity_render_controllers import (
    get_controller_ids,
    index_render_controllers,
)

# ---- settings -------------------------------------------------------------- #
SHELL = 0.1  # shell grows each cube by this much
DEFLATE = 0.05  # mask shrinks each cube by this much
MIN_DEFLATE_SIZE = 0.5  # cubes thinner than this on any axis are not deflated
ALPHA_MIN = 1  # pixels with alpha >= this count as "non-blank"
GREEN = (0, 255, 0, 255)
TEXTURE_EXTS = (".png", ".tga", ".jpg", ".jpeg")
WIREFRAME_TEXTURE_DIR = "textures/wireframe"

SCALER_BONES = (
    True  # shell only: one "<bone>_scaler_<i>" bone per cube (pivot = cube center)
)
THICKNESS_PER_BLOCK = 0.03  # extra outline thickness (model units, 1/16 block) per block of camera distance
MAX_THICKNESS = 1.5  # cap on the extra thickness (model units)
MIN_HALF_SIZE = 0.05  # avoids dividing by ~0 for paper-thin cubes
ANIMATION_KEY = "wireframe_scale"
WIREFRAME_CONDITION = "query.property('tektopia:show_wireframe')"
MASK_MATERIAL = ("wireframe_mask", "entity_wireframe_mask")
OUTLINE_MATERIAL = ("wireframe_outline", "entity_wireframe_outline")
# Vanilla controllers that are overlays, not the entity body (no wireframe wanted).
SKIP_CONTROLLERS = {"controller.render.saddle"}
# ---------------------------------------------------------------------------- #


# --------------------------------------------------------------------------- #
# Models
# --------------------------------------------------------------------------- #
def bake_bone_rotation(bone):
    """Move a bone-level rotation into its cubes, bone rotation -> 0."""
    rot = bone.pop("rotation", None)
    if rot and any(rot):
        for c in bone.get("cubes", []):
            c.setdefault("pivot", list(bone["pivot"]))
            c["rotation"] = list(rot)


def apply_overrides(geo):
    """Per-geometry exceptions carried over from generate_wireframe.py."""
    ident = geo["description"]["identifier"]
    if ident.startswith("geometry.sheep.") and ident.endswith("v1.8"):
        for b in geo["bones"]:
            if b["name"] == "body":
                bake_bone_rotation(b)


def resize(bone, delta, min_size=0.0):
    """Adjust cube sizes, offset origin if a size axis is zero, and update inflate."""
    for c in bone.get("cubes", []):
        for i, size in enumerate(c["size"]):
            if size == 0:
                c["size"][i] = 0.1
                c["origin"][i] -= 0.05

        if min(c["size"]) >= min_size:
            base = c.get("inflate", bone.get("inflate", 0))
            c["inflate"] = round(base + delta, 4)


def is_rotated(cube):
    return any(cube.get("rotation", [0, 0, 0]))


def add_scaler_bones(geo, notes):
    """
    Move every cube into its own child bone "<bone>_scaler_<i>" whose pivot is the
    cube's center, so an animation can scale each cube around its own center.
    A cube with its own rotation gets an extra parent bone "<bone>_rot_<i>" that
    carries the rotation, so the scaler's axes line up with the cube's axes.
    Returns {scaler bone name: {"center": [...], "half_size": [...]}}.
    """
    info = {}
    bones = []
    for bone in geo["bones"]:
        cubes = bone.pop("cubes", None)
        bones.append(bone)
        for i, cube in enumerate(cubes or []):
            cube = copy.deepcopy(cube)
            # Cubes inherit mirror from their bone; keep that explicit after the move.
            if "mirror" not in cube and "mirror" in bone:
                cube["mirror"] = bone["mirror"]
            ox, oy, oz = cube["origin"]
            sx, sy, sz = cube["size"]
            center = [ox + sx / 2, oy + sy / 2, oz + sz / 2]
            parent = bone["name"]

            if is_rotated(cube):
                pivot = cube.pop("pivot", None)
                if pivot is not None:
                    notes.append(
                        f"{geo['description']['identifier']}: cube {i} of '{bone['name']}' "
                        f"has its own rotation + pivot; check it in game (format 1.12 cube "
                        f"pivots are treated differently from bone pivots)"
                    )
                rot_name = f"{bone['name']}_rot_{i}"
                bones.append(
                    {
                        "name": rot_name,
                        "parent": parent,
                        "pivot": list(pivot) if pivot is not None else list(center),
                        "rotation": cube.pop("rotation"),
                    }
                )
                parent = rot_name
            else:
                cube.pop("rotation", None)
                cube.pop("pivot", None)

            name = f"{bone['name']}_scaler_{i}"
            bones.append(
                {"name": name, "parent": parent, "pivot": center, "cubes": [cube]}
            )
            infl = cube.get("inflate", 0)
            info[name] = {
                "center": [round(v, 4) for v in center],
                "half_size": [round(v / 2 + infl, 4) for v in (sx, sy, sz)],
            }
    geo["bones"] = bones
    return info


def box_uv_to_faces(cube, mirror=False):
    """
    Convert a box-UV cube ("uv": [u, v]) to per-face UVs, in place.
    Cubes that already have per-face UVs are left alone.
    If mirror is True, the mirroring is baked into the faces (east/west swapped and
    every face flipped horizontally), so the cube's "mirror" flag is no longer needed.
    """
    uv = cube.get("uv")
    if not (isinstance(uv, list) and len(uv) == 2):
        return
    u, v = uv
    w, h, d = cube["size"]  # x, y, z

    faces = {
        "north": ([u + d, v + d], [w, h]),
        "east": ([u, v + d], [d, h]),
        "south": ([u + d + w + d, v + d], [w, h]),
        "west": ([u + d + w, v + d], [d, h]),
        "up": ([u + d, v], [w, d]),
        "down": ([u + d + w, v + d], [w, -d]),
    }

    if mirror:
        faces["east"], faces["west"] = faces["west"], faces["east"]
        for name, ((fu, fv), (sw, sh)) in list(faces.items()):
            faces[name] = ([fu + sw, fv], [-sw, sh])

    def num(x):
        x = round(x, 4)
        return int(x) if x == int(x) else x

    cube["uv"] = {
        name: {"uv": [num(p[0]), num(p[1])], "uv_size": [num(s[0]), num(s[1])]}
        for name, (p, s) in faces.items()
    }
    cube.pop("mirror", None)


def convert_uvs_to_faces(geo):
    """Convert every box-UV cube in a geometry to per-face UVs."""
    for bone in geo["bones"]:
        bone_mirror = bool(bone.get("mirror", False))
        for cube in bone.get("cubes", []):
            mirror = bool(cube.get("mirror", bone_mirror))
            if isinstance(cube.get("uv"), dict):
                # already per-face: just make the inherited mirror explicit
                if bone_mirror and "mirror" not in cube:
                    cube["mirror"] = True
                continue
            box_uv_to_faces(cube, mirror)
        # every cube now carries its own mirror state, so the bone flag is redundant
        bone.pop("mirror", None)


def make_variant(geo, suffix, scalers=None, notes=None):
    g = copy.deepcopy(geo)
    apply_overrides(g)
    convert_uvs_to_faces(g)
    ident = g["description"]["identifier"]
    g["description"]["identifier"] = ident + "." + suffix
    if suffix == "shell":
        d = g["description"]
        d["visible_bounds_width"] = d.get("visible_bounds_width", 1) + 0.25
        d["visible_bounds_height"] = d.get("visible_bounds_height", 1) + 0.25
    for bone in g["bones"]:
        if "cubes" in bone:
            if suffix == "shell":
                resize(bone, SHELL)
            else:
                resize(bone, -DEFLATE, MIN_DEFLATE_SIZE)
    if suffix == "shell" and SCALER_BONES:
        info = add_scaler_bones(g, notes if notes is not None else [])
        if scalers is not None:
            scalers[ident + ".shell"] = info
    return g


# --------------------------------------------------------------------------- #
# Textures
# --------------------------------------------------------------------------- #
def find_texture(pack_root, ref):
    """'textures/entity/cow/cow_v2' -> existing file path, or None."""
    base = pack_root / ref.replace("\\", "/")
    if base.suffix.lower() in TEXTURE_EXTS and base.is_file():
        return base
    for ext in TEXTURE_EXTS:
        candidate = base.with_name(base.name + ext)
        if candidate.is_file():
            return candidate
    return None


def make_green(src_path, dst_path):
    """Green copy of src: non-blank pixels -> green, blank stays transparent."""
    with Image.open(src_path) as im:
        im = im.convert("RGBA")
    mask = im.getchannel("A").point(lambda a: 255 if a >= ALPHA_MIN else 0)
    out = Image.new("RGBA", im.size, (0, 0, 0, 0))
    out.paste(Image.new("RGBA", im.size, GREEN), (0, 0), mask)
    dst_path.parent.mkdir(parents=True, exist_ok=True)
    out.save(dst_path)
    return mask.getbbox() is not None  # False if completely blank


def wireframe_ref(ref):
    ref = ref.replace("\\", "/")
    if ref.startswith("textures/"):
        ref = ref[len("textures/") :]
    return f"{WIREFRAME_TEXTURE_DIR}/{ref}"


# --------------------------------------------------------------------------- #
# Render controllers
# --------------------------------------------------------------------------- #
GEO_RE = re.compile(r"\bGeometry\.(\w+)", re.I)
TEX_RE = re.compile(r"\bTexture\.(\w+)", re.I)


def map_strings(obj, fn):
    """Apply fn to every string in a nested list/dict structure."""
    if isinstance(obj, str):
        return fn(obj)
    if isinstance(obj, list):
        return [map_strings(v, fn) for v in obj]
    if isinstance(obj, dict):
        return {k: map_strings(v, fn) for k, v in obj.items()}
    return obj


def make_wireframe_controller(vanilla, geo_suffix, material):
    """Copy of a vanilla controller pointing at the mask/shell geometry + green textures."""

    def swap(s):
        s = GEO_RE.sub(lambda m: f"Geometry.{m.group(1)}_{geo_suffix}", s)
        return TEX_RE.sub(lambda m: f"Texture.wireframe_{m.group(1)}", s)

    ctrl = {}
    if "arrays" in vanilla:
        ctrl["arrays"] = map_strings(copy.deepcopy(vanilla["arrays"]), swap)
    ctrl["geometry"] = swap(vanilla.get("geometry", "Geometry.default"))
    ctrl["materials"] = [{"*": f"Material.{material}"}]
    ctrl["textures"] = map_strings(copy.deepcopy(vanilla.get("textures", [])), swap)
    return ctrl


def used_keys(controllers):
    """Geometry and texture keys referenced by the given vanilla controllers."""
    geo, tex = set(), set()

    def scan(s):
        geo.update(m.group(1) for m in GEO_RE.finditer(s))
        tex.update(m.group(1) for m in TEX_RE.finditer(s))
        return s

    for c in controllers:
        map_strings(c.get("arrays", {}), scan)
        map_strings(c.get("geometry", ""), scan)
        map_strings(c.get("textures", []), scan)
    return geo, tex


# --------------------------------------------------------------------------- #
# Scale animation
# --------------------------------------------------------------------------- #
def _split_ternary(expr):
    """Split 'c ? a : b' at the top level -> (c, a, b), or None."""
    depth, q = 0, None
    for i, ch in enumerate(expr):
        if ch in "([":
            depth += 1
        elif ch in ")]":
            depth -= 1
        elif ch == "?" and depth == 0 and q is None:
            q, nested = i, 0
        elif q is not None and depth == 0:
            if ch == "?":
                nested += 1
            elif ch == ":":
                if nested == 0:
                    return expr[:q], expr[q + 1 : i], expr[i + 1 :]
                nested -= 1
    return None


def _strip_parens(expr):
    expr = expr.strip()
    while expr.startswith("(") and expr.endswith(")"):
        depth = 0
        for i, ch in enumerate(expr):
            depth += (ch == "(") - (ch == ")")
            if depth == 0 and i < len(expr) - 1:
                return expr
        expr = expr[1:-1].strip()
    return expr


def translate_geometry_expr(expr, arrays, terminal):
    """
    Rebuild a render controller geometry expression (ternaries, Geometry.x,
    Array.x[index]) with every Geometry.<key> replaced by terminal(key).
    """
    expr = _strip_parens(expr)
    parts = _split_ternary(expr)
    if parts:
        c, t, e = parts
        return (
            f"({c.strip()}) ? ({translate_geometry_expr(t, arrays, terminal)}) "
            f": ({translate_geometry_expr(e, arrays, terminal)})"
        )
    m = re.fullmatch(r"Geometry\.(\w+)", expr, re.I)
    if m:
        return terminal(m.group(1))
    m = re.fullmatch(r"(Array\.\w+)\[(.+)\]", expr, re.I | re.S)
    if m and m.group(1).lower() in arrays:
        items = [
            translate_geometry_expr(x, arrays, terminal)
            for x in arrays[m.group(1).lower()]
        ]
        idx = m.group(2).strip()
        out = items[-1]
        for i in range(len(items) - 2, -1, -1):
            out = f"(({idx}) == {i}) ? ({items[i]}) : ({out})"
        return out
    raise ValueError(f"unsupported geometry expression: {expr}")


def scale_expr(half):
    return f"1 + v.wireframe_t / {max(half, MIN_HALF_SIZE):g}"


def build_scale_bones(vanilla_ctrls, geo_refs, scalers, errors, entity_name):
    """{scaler bone name: {"scale": [x, y, z]}} for one entity."""
    bones = {}
    for cid, ctrl in vanilla_ctrls.items():
        arrays = {}
        for group in ctrl.get("arrays", {}).values():
            for name, items in group.items():
                arrays[name.lower()] = items
        geo_expr = ctrl.get("geometry", "Geometry.default")
        keys = set(GEO_RE.findall(geo_expr))
        for name, items in arrays.items():
            for item in items:
                keys.update(GEO_RE.findall(item))
        keys = sorted(k for k in keys if k in geo_refs)

        infos = {k: scalers.get(f"{geo_refs[k]}.shell", {}) for k in keys}
        names = []
        for k in keys:
            names += [n for n in infos[k] if n not in names]

        for n in names:
            if n in bones:
                continue
            axes = []
            for ax in range(3):
                vals = {
                    k: (
                        scale_expr(infos[k][n]["half_size"][ax])
                        if n in infos[k]
                        else "1"
                    )
                    for k in keys
                }
                if len(set(vals.values())) == 1:
                    axes.append(next(iter(vals.values())))
                    continue
                try:
                    axes.append(
                        translate_geometry_expr(
                            geo_expr, arrays, lambda k, v=vals: v.get(k, "1")
                        )
                    )
                except ValueError as exc:
                    errors.append(
                        f"{entity_name} ({cid}): {exc}; using the default geometry's size"
                    )
                    axes.append(vals.get("default", next(iter(vals.values()))))
            bones[n] = {"scale": axes}
    return bones


# --------------------------------------------------------------------------- #
# Entity file
# --------------------------------------------------------------------------- #
def strip_wireframe(desc):
    """Remove wireframe additions from a previous run / hand edit."""
    for section in ("materials", "textures"):
        if isinstance(desc.get(section), dict):
            desc[section] = {
                k: v for k, v in desc[section].items() if not k.startswith("wireframe")
            }
    if isinstance(desc.get("geometry"), dict):
        desc["geometry"] = {
            k: v
            for k, v in desc["geometry"].items()
            if not k.endswith(("_mask", "_shell"))
        }
    if isinstance(desc.get("animations"), dict):
        desc["animations"].pop(ANIMATION_KEY, None)
    scripts = desc.get("scripts")
    if isinstance(scripts, dict):
        if isinstance(scripts.get("animate"), list):
            scripts["animate"] = [
                a
                for a in scripts["animate"]
                if a != ANIMATION_KEY
                and not (isinstance(a, dict) and ANIMATION_KEY in a)
            ]
        if isinstance(scripts.get("pre_animation"), list):
            scripts["pre_animation"] = [
                a for a in scripts["pre_animation"] if "wireframe_t" not in str(a)
            ]
    refs = desc.get("render_controllers")
    if isinstance(refs, list):
        desc["render_controllers"] = [
            r
            for r in refs
            if not any(
                ".wireframe_" in cid
                for cid in get_controller_ids({"render_controllers": [r]})
            )
        ]


# --------------------------------------------------------------------------- #
# Main
# --------------------------------------------------------------------------- #
def pick_files():
    import tkinter as tk
    from tkinter import filedialog

    root = tk.Tk()
    root.withdraw()
    files = filedialog.askopenfilenames(
        title="Select Bedrock entity JSON files",
        filetypes=[
            ("Entity JSON files", "*.entity.json"),
            ("JSON files", "*.json"),
            ("All files", "*.*"),
        ],
    )
    root.destroy()
    return files


def dump(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(
        json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8"
    )


def main():
    script_dir = Path(__file__).resolve().parent
    out_dir = script_dir / "output"

    entity_files = sys.argv[1:] or pick_files()  # CLI paths skip the dialog
    if not entity_files:
        return

    errors = []
    model_indexes, ctrl_indexes = {}, {}
    geometries = {}  # identifier -> modern geometry
    textures_done = {}  # (pack_root, ref) -> green ref or None
    wire_controllers = {}  # wireframe controller id -> definition
    report = {}
    animations = {}  # animation id -> definition
    scalers, scaler_notes = {}, []  # shell geometry id -> scaler bone info; warnings
    shell_variants = {}  # base geometry id -> generated shell geometry
    blank_textures = []
    converted_legacy = 0

    for entity_path in map(Path, entity_files):
        pack_root = entity_path.parent.parent
        try:
            data = load_json(entity_path)
        except (OSError, json.JSONDecodeError) as exc:
            errors.append(f"{entity_path.name}: {exc}")
            continue

        desc = data.get("minecraft:client_entity", {}).get("description")
        if not isinstance(desc, dict):
            errors.append(f"{entity_path.name}: no client_entity description")
            continue

        strip_wireframe(desc)
        entity_id = desc.get("identifier", entity_path.name)
        entry_report = {"controllers": [], "textures": {}, "geometries": []}
        report[entity_id] = entry_report

        # ---- which controllers / keys are used -----------------------------
        ctrl_dir = pack_root / "render_controllers"
        if ctrl_dir not in ctrl_indexes:
            ctrl_indexes[ctrl_dir] = index_render_controllers(ctrl_dir, errors)
        cindex = ctrl_indexes[ctrl_dir]

        vanilla_ctrls = {}  # id -> definition (controllers to mirror)
        for cid in get_controller_ids(desc):
            if cid in SKIP_CONTROLLERS:
                continue
            found = cindex.get(cid)
            if found is None:
                errors.append(
                    f"Render controller '{cid}' not found ({entity_path.name})"
                )
                continue
            if "part_visibility" in found[0]:  # overlay-style controller
                continue
            vanilla_ctrls[cid] = found[0]

        if vanilla_ctrls:
            used_geo, used_tex = used_keys(vanilla_ctrls.values())
        else:
            used_geo = used_tex = None  # unknown -> use every key

        # ---- geometries ----------------------------------------------------
        geo_refs = desc.get("geometry", {})
        if isinstance(geo_refs, str):
            geo_refs = {"default": geo_refs}
            desc["geometry"] = geo_refs
        if not isinstance(geo_refs, dict):
            geo_refs = {}

        models_dir = pack_root / "models" / "entity"
        if models_dir not in model_indexes:
            model_indexes[models_dir] = index_models(models_dir, errors)
        mindex = model_indexes[models_dir]

        new_geo = {}
        for key, identifier in list(geo_refs.items()):
            if not isinstance(identifier, str):
                continue
            if used_geo is not None and key not in used_geo:
                continue
            if identifier not in geometries:
                model = mindex.get(identifier)
                if model is None:
                    errors.append(
                        f"Model '{identifier}' not found ({entity_path.name})"
                    )
                    continue
                if model["kind"] == "modern":
                    geometries[identifier] = copy.deepcopy(model["data"])
                else:
                    flat = flatten_legacy(identifier, mindex, set(), errors)
                    geometries[identifier] = legacy_to_modern(identifier, flat)
                    converted_legacy += 1
            if identifier not in shell_variants:
                shell_variants[identifier] = make_variant(
                    geometries[identifier], "shell", scalers, scaler_notes
                )
            new_geo[f"{key}_mask"] = f"{identifier}.mask"
            new_geo[f"{key}_shell"] = f"{identifier}.shell"
            entry_report["geometries"].append(identifier)

        # ---- textures ------------------------------------------------------
        tex_refs = desc.get("textures", {})
        if not isinstance(tex_refs, dict):
            tex_refs = {}

        new_tex = {}
        for key, ref in tex_refs.items():
            if not isinstance(ref, str):
                continue
            if used_tex is not None and key not in used_tex:
                continue
            cache_key = (pack_root, ref)
            if cache_key not in textures_done:
                src = find_texture(pack_root, ref)
                if src is None:
                    errors.append(f"Texture '{ref}' not found ({entity_path.name})")
                    textures_done[cache_key] = None
                else:
                    green_ref = wireframe_ref(ref)
                    try:
                        if not make_green(src, out_dir / (green_ref + ".png")):
                            blank_textures.append(ref)
                        textures_done[cache_key] = green_ref
                    except OSError as exc:
                        errors.append(f"Texture '{ref}': {exc}")
                        textures_done[cache_key] = None
            if textures_done[cache_key]:
                new_tex[f"wireframe_{key}"] = textures_done[cache_key]
                entry_report["textures"][key] = textures_done[cache_key]

        # ---- apply to the entity description -------------------------------
        desc.setdefault("materials", {})
        desc["materials"][MASK_MATERIAL[0]] = MASK_MATERIAL[1]
        desc["materials"][OUTLINE_MATERIAL[0]] = OUTLINE_MATERIAL[1]
        if isinstance(desc.get("textures"), dict):
            desc["textures"].update(new_tex)
        elif new_tex:
            desc["textures"] = new_tex
        if isinstance(desc.get("geometry"), dict):
            desc["geometry"].update(new_geo)

        refs = desc.get("render_controllers", [])
        if isinstance(refs, (str, dict)):
            refs = [refs]
        refs = list(refs)
        for cid, vanilla in vanilla_ctrls.items():
            mask_id = f"{cid}.wireframe_mask"
            outline_id = f"{cid}.wireframe_outline"
            wire_controllers[mask_id] = make_wireframe_controller(
                vanilla, "mask", MASK_MATERIAL[0]
            )
            wire_controllers[outline_id] = make_wireframe_controller(
                vanilla, "shell", OUTLINE_MATERIAL[0]
            )
            refs.append({mask_id: WIREFRAME_CONDITION})
            refs.append({outline_id: WIREFRAME_CONDITION})
            entry_report["controllers"].append(cid)
        desc["render_controllers"] = refs

        # ---- scale animation ---------------------------------------------------
        if SCALER_BONES and vanilla_ctrls:
            scale_bones = build_scale_bones(
                vanilla_ctrls, geo_refs, scalers, errors, entity_path.name
            )
            if scale_bones:
                short = entity_id.split(":")[-1]
                anim_id = f"animation.{short}.wireframe_scale"
                animations[anim_id] = {"loop": True, "bones": scale_bones}
                desc.setdefault("animations", {})[ANIMATION_KEY] = anim_id
                scripts = desc.setdefault("scripts", {})
                animate = scripts.get("animate", [])
                scripts["animate"] = list(animate) + [
                    {ANIMATION_KEY: WIREFRAME_CONDITION}
                ]
                scripts["pre_animation"] = list(scripts.get("pre_animation", [])) + [
                    f"v.wireframe_t = math.min(query.distance_from_camera * "
                    f"{THICKNESS_PER_BLOCK:g}, {MAX_THICKNESS:g});"
                ]
                entry_report["animation"] = anim_id

        dump(out_dir / "entity" / entity_path.name, data)

    # ---- shared files --------------------------------------------------------
    dump(
        out_dir / "models" / "entity" / "wireframe.mask.geo.json",
        {
            "format_version": "1.12.0",
            "minecraft:geometry": [
                make_variant(g, "mask") for g in geometries.values()
            ],
        },
    )
    dump(
        out_dir / "models" / "entity" / "wireframe.shell.geo.json",
        {
            "format_version": "1.12.0",
            "minecraft:geometry": list(shell_variants.values()),
        },
    )
    if SCALER_BONES:
        dump(out_dir / "scaler_bones.json", scalers)
        dump(
            out_dir / "animations" / "wireframe.animation.json",
            {
                "format_version": "1.8.0",
                "animations": animations,
            },
        )
    errors.extend(scaler_notes)
    dump(
        out_dir / "render_controllers" / "wireframe.render_controller.json",
        {
            "format_version": "1.10.0",
            "render_controllers": wire_controllers,
        },
    )
    dump(out_dir / "wireframe_report.json", report)

    # ---- summary -------------------------------------------------------------
    lines = [
        f"Entities written:     {len(report)}",
        f"Geometries:           {len(geometries)} (x2: mask + shell, {converted_legacy} from 1.8.0)",
        f"Green textures:       {sum(1 for v in textures_done.values() if v)}",
        f"Wireframe controllers:{len(wire_controllers):>3}",
        f"Output:               {out_dir}",
    ]
    if blank_textures:
        lines.append("Fully blank textures: " + ", ".join(blank_textures))
    if errors:
        lines.append("\nWarnings:")
        lines += [f"  - {e}" for e in errors[:30]]
        if len(errors) > 30:
            lines.append(f"  ...and {len(errors) - 30} more")
    summary = "\n".join(lines)
    print(summary)

    try:
        import tkinter as tk
        from tkinter import messagebox

        root = tk.Tk()
        root.withdraw()
        (messagebox.showwarning if errors else messagebox.showinfo)(
            "Wireframe assets generated", summary
        )
        root.destroy()
    except Exception:
        pass


if __name__ == "__main__":
    main()

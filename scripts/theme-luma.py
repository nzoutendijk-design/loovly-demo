"""Writes ground colour + WCAG luminance for every theme into src/themes.json and public/themes/themes.json.
Same rule as the client's theme tool: ink flips to dark when luminance > 0.1836 (white text below AA 4.5:1).
A manual `ink: "light" | "dark"` field on a theme overrides the computed choice."""
import json
from PIL import Image

THRESHOLD = 0.1836
src = json.load(open("src/themes.json"))

def lum(rgb):
    def ch(c):
        c = c / 255
        return c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4
    r, g, b = map(ch, rgb)
    return 0.2126 * r + 0.7152 * g + 0.0722 * b

for t in src["themes"]:
    im = Image.open(f"public/themes/mobile/{t['category']}/{t['slug']}/bg@1x.webp").convert("RGB")
    w, h = im.size
    region = im.crop((0, h // 3, w, h)).resize((40, 60), Image.BILINEAR)   # the band where chips, copy and hostbar sit
    px = list(region.getdata())
    avg = tuple(sum(p[i] for p in px) // len(px) for i in range(3))
    t["ground"] = "#%02x%02x%02x" % avg
    t["luma"] = round(lum(avg), 3)
    t["inkDark"] = (t.get("ink") == "dark") if "ink" in t else t["luma"] > THRESHOLD

src["inkThreshold"] = THRESHOLD
for p in ("src/themes.json", "public/themes/themes.json"):
    json.dump(src, open(p, "w"), indent=1)
dark = [t for t in src["themes"] if t["inkDark"]]
print(f"{len(dark)}/{len(src['themes'])} themes take dark ink")
for c in ("basic-gradient", "complex-gradient", "photo", "illustration"):
    ts = [t for t in src["themes"] if t["category"] == c]
    print(f"  {c}: {sum(t['inkDark'] for t in ts)}/{len(ts)} dark ·", ", ".join(f"{t['slug']} {t['luma']}" for t in ts[:6]))

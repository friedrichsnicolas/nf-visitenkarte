"""Erzeugt Icons, QR-Codes und vCard der App.

Aufruf:  python tools/build_assets.py [APP_URL]
Benötigt: pip install segno cairosvg
"""
import pathlib, re, sys
import cairosvg, segno

ROOT = pathlib.Path(__file__).resolve().parent.parent
APP_URL = sys.argv[1] if len(sys.argv) > 1 else "https://friedrichsnicolas.github.io/nf-visitenkarte/"
GREEN, CREAM, CHAMP = "#0E3A32", "#F7F4EE", "#C6A86A"

# --- vCard -------------------------------------------------------------
VCARD = "\r\n".join([
    "BEGIN:VCARD", "VERSION:3.0",
    "N:Friedrichs;Nicolas;;;", "FN:Nicolas Friedrichs",
    "TEL;TYPE=CELL:+491799218590",
    "EMAIL;TYPE=INTERNET:nicolas.friedrichs@hotmail.de",
    "ADR;TYPE=HOME:;;Beckershöfe 6;Willich;;47877;DE",
    "URL:https://www.linkedin.com/in/nicolas-friedrichs",
    f"URL:{APP_URL}",
    "END:VCARD", ""])
(ROOT / "downloads/Nicolas_Friedrichs.vcf").write_text(VCARD, encoding="utf-8")

# --- QR-Codes (SVG, Tannengrün auf transparent) ------------------------
def qr(data, name):
    segno.make(data, error="m").save(ROOT / f"assets/img/{name}.svg", kind="svg",
                                     scale=10, border=2, dark=GREEN, light=None, xmldecl=False,
                                     svgclass="qr", omitsize=True)
qr(APP_URL, "qr-app")
# kompakte vCard ohne App-URL, damit der Code gut scannbar bleibt
qr(VCARD.replace(f"URL:{APP_URL}\r\n", ""), "qr-vcard")

# --- App-Icons aus dem Favicon (Monogramm auf Tannengrün) --------------
src = (ROOT / "assets/img/favicon.svg").read_text(encoding="utf-8")
icon = re.sub(r'(<g fill=")#F7F4EE', r"\1" + CHAMP, src)
(ROOT / "assets/icons/icon.svg").write_text(icon, encoding="utf-8")
for size, name in [(192, "icon-192"), (512, "icon-512"), (512, "icon-maskable-512"),
                   (180, "apple-touch-icon"), (32, "favicon-32")]:
    cairosvg.svg2png(bytestring=icon.encode(), write_to=str(ROOT / f"assets/icons/{name}.png"),
                     output_width=size, output_height=size)
print("fertig:", APP_URL)

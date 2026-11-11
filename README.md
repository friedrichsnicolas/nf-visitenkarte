# Nicolas Friedrichs · Digitale Visitenkarte

Installierbare Web-App (PWA) als private digitale Visitenkarte im Markendesign.
Live: **https://friedrichsnicolas.github.io/nf-visitenkarte/**

## Funktionen
- Aufs Handy installierbar (Startbildschirm-Icon, Vollbild), funktioniert offline
- Kontakt speichern (vCard), Anrufen, WhatsApp, E-Mail, LinkedIn, Route, PayPal mit Betragsauswahl
- Teilen: QR-Code zur App oder direkt als Kontakt, Teilen-Menü des Handys, Link kopieren
- Deutsch/Englisch umschaltbar, Hell/Dunkel automatisch
- Keine Cookies, kein Tracking, keine externen Dienste

## Installieren (Handy)
- **iPhone (Safari):** Seite öffnen → Teilen → „Zum Home-Bildschirm“
- **Android (Chrome):** Seite öffnen → Button „Zum Startbildschirm hinzufügen“ oder Menü → „App installieren“

## Aufbau
| Datei | Inhalt |
|---|---|
| `index.html` | Inhalte (DE und EN über `data-lang`) |
| `app.css` | Gestaltung, Markenfarben als CSS-Variablen |
| `app.js` | Teilen, QR-Umschaltung, Sprache, Installation |
| `sw.js` | Offline-Cache |
| `manifest.webmanifest` | App-Name, Icons, Farben |
| `downloads/` | vCard |
| `tools/build_assets.py` | erzeugt Icons, QR-Codes und vCard neu |

## Ändern
- **Texte:** in `index.html` anpassen.
- **PayPal:** in `app.js` bei `PAYPAL_ME` den Namen hinter paypal.me/ eintragen (leer = Kachel ausgeblendet).
- **Kontaktdaten oder eigene Domain:** in `tools/build_assets.py` ändern und `python tools/build_assets.py https://neue-adresse/` ausführen (`pip install segno cairosvg`).
- Nach jeder Änderung in `sw.js` die `VERSION` erhöhen, damit installierte Apps das Update laden.

## Veröffentlichung
Jeder Push auf `main` veröffentlicht automatisch über GitHub Actions auf GitHub Pages.
Einmalig nötig: *Settings → Pages → Build and deployment → Source: GitHub Actions*.

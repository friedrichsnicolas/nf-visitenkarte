/* Nicolas Friedrichs · Digitale Visitenkarte */
(() => {
  const $ = s => document.querySelector(s), $$ = s => document.querySelectorAll(s);
  const root = document.documentElement;
  const APP_URL = new URL("./", location.href).href;

  /* Sprache: gespeicherte Wahl > Gerätesprache */
  const T = {
    de: { copied: "Link kopiert", shareText: "Digitale Visitenkarte von Nicolas Friedrichs" },
    en: { copied: "Link copied", shareText: "Digital business card of Nicolas Friedrichs" }
  };
  const setLang = l => { root.lang = l; localStorage.setItem("nf-lang", l); };
  setLang(localStorage.getItem("nf-lang") || ((navigator.language || "de").toLowerCase().startsWith("de") ? "de" : "en"));
  $("#lang").addEventListener("click", () => setLang(root.lang === "de" ? "en" : "de"));
  const t = k => T[root.lang][k];

  /* Hinweis-Toast */
  let timer;
  const toast = msg => { const el = $("#toast"); el.textContent = msg; el.classList.add("show"); clearTimeout(timer); timer = setTimeout(() => el.classList.remove("show"), 2200); };

  /* Teilen-Dialog */
  const sheet = $("#share");
  const openShare = () => sheet.showModal ? sheet.showModal() : sheet.setAttribute("open", "");
  $("#open-share").addEventListener("click", openShare);
  sheet.addEventListener("click", e => { if (e.target === sheet) sheet.close(); });
  sheet.addEventListener("close", () => { if (location.hash === "#teilen") history.replaceState(null, "", location.pathname); });
  if (location.hash === "#teilen") openShare();

  $$(".seg button").forEach(b => b.addEventListener("click", () => {
    $$(".seg button").forEach(x => x.setAttribute("aria-selected", x === b));
    $("#qr-img").src = `assets/img/qr-${b.dataset.qr}.svg`;
    $$(".qr-note").forEach(n => n.hidden = n.dataset.for !== b.dataset.qr);
  }));

  const copy = async () => {
    try { await navigator.clipboard.writeText(APP_URL); }
    catch { const i = document.createElement("input"); i.value = APP_URL; document.body.append(i); i.select(); document.execCommand("copy"); i.remove(); }
    toast(t("copied"));
  };
  $("#copy-link").addEventListener("click", copy);
  $("#native-share").addEventListener("click", async () => {
    if (navigator.share) {
      try { await navigator.share({ title: "Nicolas Friedrichs", text: t("shareText"), url: APP_URL }); } catch {}
    } else copy();
  });

  /* Installieren */
  const standalone = matchMedia("(display-mode: standalone)").matches || navigator.standalone;
  const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  if (!standalone && ios) { $("#install").hidden = false; $(".ios-hint").hidden = false; }
  let deferred;
  addEventListener("beforeinstallprompt", e => {
    e.preventDefault(); deferred = e;
    $("#install").hidden = false; $("#install-btn").hidden = false;
  });
  $("#install-btn").addEventListener("click", async () => {
    if (!deferred) return;
    deferred.prompt(); await deferred.userChoice; deferred = null; $("#install").hidden = true;
  });
  addEventListener("appinstalled", () => { $("#install").hidden = true; });

  /* Offline-Cache */
  if ("serviceWorker" in navigator) addEventListener("load", () => navigator.serviceWorker.register("sw.js"));
})();

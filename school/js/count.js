// count.js — anonymous visit counting with GoatCounter (https://www.goatcounter.com).
// No cookies, no names, no personal information. It records that a page was opened, and two events:
// "started playing" and "finished the game".
// To turn it on, put your GoatCounter site code between the quotes below. Empty = counting is off.
(function () {
  const CODE = "";
  const EDITION = "Classroom";
  window.countEvent = function () {};
  if (!CODE || location.protocol === "file:" || /^(localhost|127\.0\.0\.1)$/.test(location.hostname)) return;
  const s = document.createElement("script");
  s.async = true;
  s.src = "https://gc.zgo.at/count.js";
  s.dataset.goatcounter = "https://" + CODE + ".goatcounter.com/count";
  document.head.appendChild(s);
  window.countEvent = function (name) {
    try { if (window.goatcounter && window.goatcounter.count) window.goatcounter.count({ path: EDITION + ": " + name, title: EDITION + ": " + name, event: true }); } catch (e) { /* counting must never break the game */ }
  };
})();

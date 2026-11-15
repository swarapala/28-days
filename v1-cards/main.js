// main.js — the game engine. Plain script, no modules: runs from a double-clicked index.html.
// Flow: title → route select → for each day: packing → packing report → scene → tracker → fact
//       → ending → report card → learn screen.

(function () {
  const STAT_KEYS = ["energy", "grades", "money", "health"];
  const STAT_META = {
    energy: { label: "⚡ Energy", color: "#f0a35e" },
    grades: { label: "📚 Grades", color: "#7b5cd6" },
    money:  { label: "💵 Money",  color: "#2f9e6a" },
    health: { label: "❤️ Health", color: "#e05666" }
  };
  const PHASES = {
    menstrual:  { label: "Menstrual",  color: "#e05666" },
    follicular: { label: "Follicular", color: "#f0a35e" },
    ovulation:  { label: "Ovulation",  color: "#4fae84" },
    luteal:     { label: "Luteal",     color: "#7b7fd4" }
  };
  const FLOW_FACTOR = { none: 0, light: 1.5, medium: 1, heavy: 0.5, soaked: 0.25 };

  const stage = document.getElementById("stage");
  const hud = document.getElementById("hud");

  function freshGame() {
    return {
      route: null, dayIndex: 0,
      stats: { energy: 70, grades: 70, money: 40, health: 70 },
      backpack: [], log: [], bodyLiteracy: 0, redFlagsLogged: 0, finaleGood: false
    };
  }
  window.Game = freshGame();

  // ---------- helpers ----------
  const itemById = (id) => ITEMS.find((i) => i.id === id);
  const clamp = (n) => Math.max(0, Math.min(100, n));
  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  // One active keyboard handler at a time, replaced on every screen.
  let keyHandler = null;
  document.addEventListener("keydown", (e) => { if (keyHandler) keyHandler(e); });
  function setKeys(fn) { keyHandler = fn; }

  function applyEffects(effects) {
    const applied = {};
    if (!effects) return applied;
    for (const k of STAT_KEYS) {
      if (typeof effects[k] !== "number" || effects[k] === 0) continue;
      Game.stats[k] = clamp(Game.stats[k] + effects[k]);
      applied[k] = (applied[k] || 0) + effects[k];
    }
    drawHud();
    return applied;
  }

  function mergeEffects(into, add) {
    for (const k in add) into[k] = (into[k] || 0) + add[k];
    return into;
  }

  function chips(effects) {
    const parts = STAT_KEYS.filter((k) => effects && effects[k]).map((k) => {
      const v = effects[k];
      return `<span class="chip ${v > 0 ? "up" : "down"}">${STAT_META[k].label} ${v > 0 ? "+" : ""}${v}</span>`;
    });
    return parts.length ? `<div class="effects">${parts.join("")}</div>` : "";
  }

  // Render a screen with a single "continue" button (Enter/Space also continues).
  function continueButton(id, label, onClick) {
    const btn = document.getElementById(id);
    btn.addEventListener("click", () => { setKeys(null); onClick(); });
    setKeys((e) => {
      if (e.key === "Enter") { e.preventDefault(); btn.click(); }
    });
    btn.focus({ preventScroll: true });
  }

  // ---------- HUD ----------
  function wheelSvg(currentDay) {
    const size = 64, r = 28, inner = 17, cx = size / 2, cy = size / 2;
    const phaseOf = (d) => d <= 5 ? "menstrual" : d <= 13 ? "follicular" : d === 14 ? "ovulation" : "luteal";
    let segs = "";
    for (let d = 1; d <= 28; d++) {
      const a0 = ((d - 1) / 28) * Math.PI * 2 - Math.PI / 2;
      const a1 = (d / 28) * Math.PI * 2 - Math.PI / 2;
      const isCur = d === currentDay;
      const ro = isCur ? r + 3 : r;
      const pt = (rad, a) => `${(cx + rad * Math.cos(a)).toFixed(2)},${(cy + rad * Math.sin(a)).toFixed(2)}`;
      const path = `M${pt(inner, a0)} L${pt(ro, a0)} A${ro},${ro} 0 0 1 ${pt(ro, a1)} L${pt(inner, a1)} A${inner},${inner} 0 0 0 ${pt(inner, a0)} Z`;
      segs += `<path d="${path}" fill="${PHASES[phaseOf(d)].color}" opacity="${isCur ? 1 : 0.35}" stroke="${isCur ? "#2d2433" : "#fff"}" stroke-width="${isCur ? 1.5 : 0.8}"><title>Day ${d}</title></path>`;
    }
    return `<svg width="${size + 8}" height="${size + 8}" viewBox="-4 -4 ${size + 8} ${size + 8}" role="img" aria-label="Cycle wheel, day ${currentDay} of 28">
      ${segs}
      <text x="${cx}" y="${cy + 4}" text-anchor="middle" font-size="11" font-weight="700" fill="#2d2433">${currentDay}</text>
    </svg>`;
  }

  function drawHud() {
    const day = DAYS[Game.dayIndex];
    if (!day || !Game.route) return;
    const ph = PHASES[day.phase];
    document.getElementById("hud-day").innerHTML =
      `Day ${day.day}${day.finale ? " <span class='muted small'>(new cycle)</span>" : ""}<br>` +
      `<span class="phase-pill" style="background:${ph.color}">${ph.label}</span>`;
    document.getElementById("hud-wheel").innerHTML = wheelSvg(day.day);
    document.getElementById("hud-stats").innerHTML = STAT_KEYS.map((k) => `
      <div class="stat">
        <label><span>${STAT_META[k].label}</span><span>${Game.stats[k]}</span></label>
        <div class="bar"><span style="width:${Game.stats[k]}%;background:${STAT_META[k].color}"></span></div>
      </div>`).join("");
  }

  function showHud(on) { hud.classList.toggle("hidden", !on); }

  // ---------- Title ----------
  function title() {
    showHud(false);
    stage.innerHTML = `
      <div class="card">
        <h1>28 Days</h1>
        <p class="muted">One cycle. Four phases. One very busy junior.</p>
        <h3>The cast</h3>
        <div class="cast">
          ${CAST.map((c) => `
            <div class="cast-member">
              <div class="avatar">${c.avatar}</div>
              <b>${c.name}</b>
              <span class="small muted">${c.role}</span>
            </div>`).join("")}
        </div>
        <div class="report-line small">${TEEN_NOTE}</div>
        <div class="row"><button id="start">Start →</button></div>
      </div>`;
    continueButton("start", "Start", routeSelect);
  }

  // ---------- Route select ----------
  function routeSelect() {
    showHud(false);
    stage.innerHTML = `
      <div class="card">
        <h2>Pick a story</h2>
        <p class="muted">Both stories follow Ruby through the same month. What her body does is different.</p>
        <div class="routes">
          <button class="route" data-route="typical">
            <div class="tag">Story A</div>
            <h3>A typical cycle</h3>
            <p class="small">Learn the four phases, pack smart, and get to know your own pattern.</p>
          </button>
          <button class="route" data-route="warning">
            <div class="tag">Story B</div>
            <h3>"That's just how periods are"</h3>
            <p class="small">Some things Ruby's been told are normal... might not be. Can you spot the red flags?</p>
          </button>
        </div>
      </div>`;
    stage.querySelectorAll("[data-route]").forEach((b) =>
      b.addEventListener("click", () => startRoute(b.dataset.route)));
    setKeys((e) => {
      if (e.key === "1") startRoute("typical");
      if (e.key === "2") startRoute("warning");
    });
  }

  function startRoute(route) {
    setKeys(null);
    window.Game = freshGame();
    Game.route = route;
    showHud(true);
    runDay();
  }

  // ---------- Day loop ----------
  function runDay() {
    const day = DAYS[Game.dayIndex];
    drawHud();
    scrollTop();
    setKeys(null);
    Packing.start(day, Game.route, (ids) => {
      Game.backpack = ids;
      packingReport(day);
    });
  }

  function packingReport(day) {
    const v = day[Game.route];
    const pack = Game.backpack;
    const has = (id) => pack.includes(id);
    const lines = [];
    const total = {};

    // Protection from period products
    const factor = FLOW_FACTOR[v.flow] ?? 1;
    let protection = 0;
    pack.forEach((id) => {
      const it = itemById(id);
      if (!it || !it.hours) return;
      protection += Math.min(it.hours * factor, it.maxHours || Infinity);
    });

    if (v.flow === "none") {
      lines.push(`<div class="report-line good">🗓️ No period today, so no products needed.</div>`);
    } else if (protection >= day.hoursAway) {
      lines.push(`<div class="report-line good">✓ Protection: about <b>${Math.round(protection * 10) / 10} hrs</b> for <b>${day.hoursAway} hrs</b> away. You're covered.</div>`);
    } else {
      let eff;
      if (has("pants")) {
        eff = { energy: -5 };
        lines.push(`<div class="report-line bad">💧 You leaked. Only about <b>${Math.round(protection * 10) / 10} hrs</b> of protection for <b>${day.hoursAway} hrs</b> away. Good thing you packed spare pants.${chips(eff)}</div>`);
      } else {
        eff = { grades: -10, health: -5 };
        lines.push(`<div class="report-line bad">💧 You leaked. Only about <b>${Math.round(protection * 10) / 10} hrs</b> of protection for <b>${day.hoursAway} hrs</b> away, and no spare pants. You spend a class period dealing with it.${chips(eff)}</div>`);
      }
      mergeEffects(total, applyEffects(eff));
    }

    if (v.flow === "soaked") {
      lines.push(`<div class="report-line flag">🚩 Needing to change every 1–2 hours is a warning sign.</div>`);
    }

    // Pain management
    if (v.truth && v.truth.pain >= 5) {
      if (has("pain") || has("heat")) {
        const eff = { energy: 5 };
        lines.push(`<div class="report-line good">💊 Bad cramps today, but you packed something for pain.${chips(eff)}</div>`);
        mergeEffects(total, applyEffects(eff));
      } else {
        const eff = { energy: -10 };
        lines.push(`<div class="report-line bad">😣 Bad cramps today and nothing packed for pain.${chips(eff)}</div>`);
        mergeEffects(total, applyEffects(eff));
      }
    }

    // Day-specific needs
    (day.needs || []).forEach((n) => {
      if (has(n.id)) {
        lines.push(`<div class="report-line good">✓ ${itemById(n.id).icon} ${itemById(n.id).name}: packed.</div>`);
      } else {
        lines.push(`<div class="report-line bad">${itemById(n.id).icon} ${n.msg}${chips(n.miss)}</div>`);
        mergeEffects(total, applyEffects(n.miss));
      }
    });

    stage.innerHTML = `
      <div class="card">
        <p class="muted small">PACKING REPORT</p>
        <h2>How'd your bag do?</h2>
        ${lines.join("")}
        <div class="row"><button id="report-next">Head out →</button></div>
      </div>`;
    scrollTop();
    continueButton("report-next", "Head out", () => scene(day));
  }

  function reqTag(choice) {
    if (choice.requiresLogs) {
      const ok = Game.redFlagsLogged >= choice.requiresLogs;
      return { ok, html: `<span class="req ${ok ? "ok" : "no"}">Needs: ${choice.requiresLogs} 🚩 logs (you have ${Game.redFlagsLogged}) ${ok ? "✓" : "✗"}</span>` };
    }
    if (choice.requires && choice.requires.length) {
      const ok = choice.requires.some((id) => Game.backpack.includes(id));
      const names = choice.requires.map((id) => itemById(id).name).join(" or ");
      return { ok, html: `<span class="req ${ok ? "ok" : "no"}">Needs: ${names} ${ok ? "✓" : "✗"}</span>` };
    }
    return { ok: true, html: "" };
  }

  function scene(day) {
    const v = day[Game.route];
    const tags = v.choices.map(reqTag);
    stage.innerHTML = `
      <div class="card">
        <p class="muted small">${day.finale ? "ONE MONTH LATER" : "DAY " + day.day} · ${day.title.toUpperCase()}</p>
        <h2>${day.title}</h2>
        <p>${v.text}</p>
        <div class="choices">
          ${v.choices.map((c, i) => `
            <button class="choice" data-i="${i}">
              <span><span class="key">${i + 1}</span>${c.label}</span>
              ${tags[i].html}
            </button>`).join("")}
        </div>
      </div>`;
    scrollTop();

    const pick = (i) => {
      const c = v.choices[i];
      if (!c) return;
      setKeys(null);
      const ok = tags[i].ok;
      const applied = applyEffects(ok ? c.effects : c.failEffects);
      if (ok && c.good) Game.finaleGood = true;
      const text = ok ? c.result : (c.failResult || c.result);

      stage.innerHTML = `
        <div class="card">
          <p class="muted small">${day.finale ? "ONE MONTH LATER" : "DAY " + day.day} · ${day.title.toUpperCase()}</p>
          <h2>${c.label}</h2>
          <div class="report-line ${ok ? "good" : "bad"}">${text}</div>
          ${chips(applied)}
          <div class="row"><button id="scene-next">Continue →</button></div>
        </div>`;
      scrollTop();
      continueButton("scene-next", "Continue", () => {
        if (day.finale) fact(day);
        else Tracker.open(day, Game.route, () => { setKeys(null); fact(day); });
      });
    };

    stage.querySelectorAll(".choice").forEach((b) => b.addEventListener("click", () => pick(+b.dataset.i)));
    setKeys((e) => {
      const n = parseInt(e.key, 10);
      if (n >= 1 && n <= Math.min(3, v.choices.length)) pick(n - 1);
    });
  }

  function fact(day) {
    const s = SPEAKERS[day.fact.speaker];
    stage.innerHTML = `
      <div class="card">
        <p class="muted small">BODY BREAKDOWN</p>
        <div class="fact">
          <div class="speaker">${s.icon}</div>
          <div class="bubble">
            <b>${s.name}</b> <span class="small muted">· ${s.tag}</span>
            <p>${day.fact.text}</p>
          </div>
        </div>
        <div class="row"><button id="fact-next">${day.finale ? "See how it ends →" : "Next day →"}</button></div>
      </div>`;
    scrollTop();
    continueButton("fact-next", "Next", () => {
      if (day.finale) return ending();
      Game.dayIndex++;
      runDay();
    });
  }

  // ---------- Ending / report / learn ----------
  function ending() {
    const key = Game.route === "typical" ? "typical" : (Game.finaleGood ? "warningGood" : "warningBad");
    const e = ENDINGS[key];
    showHud(false);
    stage.innerHTML = `
      <div class="card">
        <p class="muted small">THE END</p>
        <div style="font-size:3.5rem">${e.icon}</div>
        <h2>${e.title}</h2>
        <p>${e.text}</p>
        <div class="row"><button id="end-next">See your report card →</button></div>
      </div>`;
    scrollTop();
    continueButton("end-next", "Report", reportCard);
  }

  function reportCard() {
    const s = Game.stats;
    const avg = STAT_KEYS.reduce((t, k) => t + s[k], 0) / STAT_KEYS.length;
    const score = avg * 0.7 + Math.min(Game.bodyLiteracy, 100) * 0.3;
    const stars = score >= 75 ? 3 : score >= 55 ? 2 : 1;
    const totalFlags = DAYS.filter((d) => !d.finale && d[Game.route].redFlag).length;
    const accurate = Game.log.filter((l) => l.correct).length;

    stage.innerHTML = `
      <div class="card">
        <p class="muted small">REPORT CARD · ${Game.route === "typical" ? "STORY A" : "STORY B"}</p>
        <h2>How your month went</h2>
        <div class="stars" aria-label="${stars} of 3 stars">${"⭐".repeat(stars)}${"☆".repeat(3 - stars)}</div>
        <p class="muted small">Score: ${Math.round(score)} / 100</p>
        <div class="grid2">
          ${STAT_KEYS.map((k) => `
            <div class="stat">
              <label><span>${STAT_META[k].label}</span><span>${s[k]}</span></label>
              <div class="bar"><span style="width:${s[k]}%;background:${STAT_META[k].color}"></span></div>
            </div>`).join("")}
        </div>
        <div class="report-line good">🧠 Body Literacy: <b>${Game.bodyLiteracy}</b> · ${accurate} of ${Game.log.length} logs accurate</div>
        ${totalFlags ? `<div class="report-line flag">🚩 Red flags caught: <b>${Game.redFlagsLogged}</b> of ${totalFlags}</div>` : ""}
        <div class="row"><button id="report-learn">What you learned →</button></div>
      </div>`;
    scrollTop();
    continueButton("report-learn", "Learn", learn);
  }

  function learn() {
    const other = Game.route === "typical" ? "warning" : "typical";
    const products = ITEMS.filter((i) => i.hours);
    stage.innerHTML = `
      <div class="card">
        <p class="muted small">LEARN MORE</p>
        <h2>Period products</h2>
        <table class="products">
          <thead><tr><th>Product</th><th>Hours (medium flow)</th><th>Swim?</th><th>Notes</th></tr></thead>
          <tbody>
            ${products.map((p) => `
              <tr>
                <td>${p.icon} ${p.name}</td>
                <td>~${p.hours}${p.maxHours ? ` (max ${p.maxHours})` : ""}</td>
                <td>${p.swimOK ? "✓" : "✗"}</td>
                <td class="small">${p.info}</td>
              </tr>`).join("")}
          </tbody>
        </table>
        <h2 style="margin-top:24px">Warning signs to tell a doctor about</h2>
        <ul class="signs">${WARNING_SIGNS.map((w) => `<li>🚩 ${w}</li>`).join("")}</ul>
        <p class="small muted">Source: CDC guidance on heavy menstrual bleeding. If any of these sound like you, talk to a parent, school nurse, or doctor.</p>
        <div class="row">
          <button id="play-other">Play the other story →</button>
          <button id="to-title" class="secondary">Back to title</button>
        </div>
      </div>`;
    scrollTop();
    document.getElementById("to-title").addEventListener("click", () => { window.Game = freshGame(); title(); });
    continueButton("play-other", "Other", () => startRoute(other));
  }

  title();
})();

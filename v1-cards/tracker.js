// tracker.js — evening symptom log + Body Literacy scoring.
// Accurate log = flow matches exactly AND pain within 2 of the truth.

window.Tracker = {
  open(dayData, route, onDone) {
    const stage = document.getElementById("stage");
    const v = dayData[route];
    const entry = { day: dayData.day, flow: null, pain: 0, mood: null, correct: false, redFlag: !!v.redFlag };

    const flows = [
      ["none", "None"], ["light", "Light"], ["medium", "Medium"],
      ["heavy", "Heavy"], ["soaked", "Soaked through in 1–2 hrs"]
    ];
    const moods = ["😄", "🙂", "😐", "😣", "😢", "😠"];

    stage.innerHTML = `
      <div class="card">
        <p class="muted small">EVENING · LOG YOUR DAY</p>
        <h2>📱 Cycle Tracker: Day ${dayData.day}</h2>
        <p class="muted">Think back to what happened today. An honest log is what a doctor would want to see.</p>

        <h3>Flow</h3>
        <div class="flow-btns">${flows.map(([k, l]) => `<button data-flow="${k}">${l}</button>`).join("")}</div>

        <h3>Pain: <span class="pain-val" id="pain-val">0</span>/10</h3>
        <input type="range" id="pain" min="0" max="10" value="0" />

        <h3>Mood</h3>
        <div class="mood-btns">${moods.map((m) => `<button data-mood="${m}">${m}</button>`).join("")}</div>

        <div class="row"><button id="save" disabled>Save log</button></div>
        <div id="feedback"></div>
      </div>`;

    const saveBtn = document.getElementById("save");
    const check = () => { saveBtn.disabled = !entry.flow; };

    stage.querySelectorAll("[data-flow]").forEach((b) => b.addEventListener("click", () => {
      stage.querySelectorAll("[data-flow]").forEach((x) => x.classList.remove("sel"));
      b.classList.add("sel"); entry.flow = b.dataset.flow; check();
    }));
    stage.querySelectorAll("[data-mood]").forEach((b) => b.addEventListener("click", () => {
      stage.querySelectorAll("[data-mood]").forEach((x) => x.classList.remove("sel"));
      b.classList.add("sel"); entry.mood = b.dataset.mood;
    }));
    const pain = document.getElementById("pain");
    pain.addEventListener("input", () => { entry.pain = +pain.value; document.getElementById("pain-val").textContent = pain.value; });

    saveBtn.addEventListener("click", () => {
      const t = v.truth;
      entry.correct = entry.flow === t.flow && Math.abs(entry.pain - t.pain) <= 2;
      const fb = document.getElementById("feedback");
      let html = "";

      if (entry.correct) {
        Game.bodyLiteracy += 10;
        html += `<div class="report-line good">✓ Logged accurately. +10 Body Literacy</div>`;
        if (entry.redFlag) {
          Game.redFlagsLogged += 1;
          Game.bodyLiteracy += 5;
          html += `<div class="report-line flag">🚩 You caught a red flag. A doctor would want to know about today. +5 Body Literacy</div>`;
        }
      } else {
        const flowName = { none: "none", light: "light", medium: "medium", heavy: "heavy", soaked: "soaked through in 1–2 hrs" };
        html += `<div class="report-line bad">Hmm, that doesn't quite match your day. It was closer to <b>${flowName[t.flow]}</b> flow and pain around <b>${t.pain}/10</b>.</div>`;
        if (entry.redFlag) html += `<div class="report-line flag">🚩 Today was a red-flag day. Missing it in your log makes it harder to show someone later.</div>`;
      }

      Game.log.push(entry);
      saveBtn.remove();
      stage.querySelectorAll(".flow-btns button, .mood-btns button, #pain").forEach((x) => (x.disabled = true));
      fb.innerHTML = html + `<div class="row"><button id="tracker-next">Continue →</button></div>`;
      document.getElementById("tracker-next").addEventListener("click", () => onDone(entry));
    });
  }
};

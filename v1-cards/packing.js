// packing.js — morning backpack mini-game.
// hours = hours of protection on a MEDIUM flow day. maxHours = safety cap (tampons: max 8 hrs).
// stack = can pack more than one. worn = goes on your body, takes 0 bag slots.

window.ITEMS = [
  { id: "pad",       name: "Pad",              slots: 1, hours: 5,  swimOK: false, stack: true, icon: "🩹", info: "Easy to use. Change every 4–8 hrs. Not for swimming." },
  { id: "tampon",    name: "Tampon",           slots: 1, hours: 6,  maxHours: 8, swimOK: true, stack: true, icon: "🧷", info: "Works for swimming. Never leave one in longer than 8 hrs (TSS risk)." },
  { id: "cup",       name: "Menstrual cup",    slots: 1, hours: 12, maxHours: 12, swimOK: true, icon: "🥤", info: "Reusable. Up to 12 hrs. Needs a sink to rinse." },
  { id: "underwear", name: "Period underwear", slots: 0, hours: 8,  maxHours: 12, swimOK: false, worn: true, icon: "🩳", info: "Worn, takes no bag space. Best for light days." },
  { id: "pants",     name: "Spare pants",      slots: 2, icon: "👖", info: "Backup if you leak." },
  { id: "pain",      name: "Pain reliever",    slots: 1, icon: "💊", info: "Helps with cramps." },
  { id: "heat",      name: "Heat patch",       slots: 1, icon: "🔥", info: "Warmth eases cramps." },
  { id: "water",     name: "Water bottle",     slots: 1, icon: "💧", info: "Stay hydrated." },
  { id: "snack",     name: "Snack",            slots: 1, icon: "🍎", info: "Energy for long days." },
  { id: "gym",       name: "Gym / swim gear",  slots: 2, icon: "👕", info: "For gym or practice." },
  { id: "book",      name: "Textbook",         slots: 2, icon: "📚", info: "For studying." },
  { id: "charger",   name: "Phone charger",    slots: 1, icon: "🔌", info: "Keep your phone alive." }
];

window.BAG_SLOTS = 6;

window.Packing = {
  start(dayData, route, onDone) {
    const stage = document.getElementById("stage");
    const v = dayData[route];
    let bag = [];        // item ids in the bag (can repeat for stackables)
    let worn = false;    // period underwear on?

    const getItem = (id) => ITEMS.find((i) => i.id === id);
    const used = () => bag.reduce((s, id) => s + getItem(id).slots, 0);

    const flowLabel = { none: "No period expected", light: "Light", medium: "Medium", heavy: "Heavy", soaked: "Very heavy" };
    const forecast = v.flow === "none"
      ? "🗓️ Tracker forecast: no period today."
      : `🗓️ Tracker forecast: <b>${flowLabel[v.flow]}</b> flow. You'll be away about <b>${dayData.hoursAway} hours</b>.`;

    function draw() {
      const slotsHtml = [];
      bag.forEach((id, idx) => {
        const it = getItem(id);
        slotsHtml.push(`<div class="slot filled ${it.slots === 2 ? "wide" : ""}" data-idx="${idx}" title="Click to remove">${it.icon}<span class="lbl">${it.name}</span></div>`);
      });
      for (let i = used(); i < BAG_SLOTS; i++) slotsHtml.push(`<div class="slot"></div>`);

      stage.innerHTML = `
        <div class="card">
          <p class="muted small">MORNING · PACK YOUR BAG</p>
          <h2>Day ${dayData.day}: ${dayData.title}</h2>
          <p>${dayData.preview}</p>
          <div class="forecast">${forecast}</div>
          <div class="pack-layout">
            <div>
              <h3>Items <span class="muted small">(click to pack)</span></h3>
              <div class="items">
                ${ITEMS.map((it) => `
                  <button class="item ${it.worn && worn ? "worn-on" : ""}" data-id="${it.id}" title="${it.info}">
                    <span class="icon">${it.icon}</span>${it.name}
                    <span class="meta">${it.worn ? (worn ? "Wearing ✓" : "Wear it (0 slots)") : it.slots + " slot" + (it.slots > 1 ? "s" : "")}${it.hours ? " · ~" + it.hours + "h" : ""}${it.swimOK ? " · 🏊" : ""}</span>
                  </button>`).join("")}
              </div>
              <p class="small muted">Hover an item for info. 🏊 = works for swimming.</p>
            </div>
            <div class="bag" id="bag">
              <b>🎒 Backpack</b> <span class="small" style="opacity:.7">${used()}/${BAG_SLOTS} slots</span>
              <div class="slots">${slotsHtml.join("")}</div>
              <div class="small" style="opacity:.75">${worn ? "🩳 Wearing period underwear" : "Click an item in the bag to remove it."}</div>
              <div class="row"><button id="pack-done">Done packing →</button></div>
            </div>
          </div>
        </div>`;

      stage.querySelectorAll(".item").forEach((b) => b.addEventListener("click", () => add(b.dataset.id)));
      stage.querySelectorAll(".slot.filled").forEach((s) => s.addEventListener("click", () => { bag.splice(+s.dataset.idx, 1); draw(); }));
      document.getElementById("pack-done").addEventListener("click", () => {
        const result = [...bag];
        if (worn) result.push("underwear");
        onDone(result);
      });
    }

    function add(id) {
      const it = getItem(id);
      if (it.worn) { worn = !worn; draw(); return; }
      if (!it.stack && bag.includes(id)) return nudge();
      if (used() + it.slots > BAG_SLOTS) return nudge();
      bag.push(id);
      draw();
    }

    function nudge() {
      const b = document.getElementById("bag");
      b.classList.remove("shake"); void b.offsetWidth; b.classList.add("shake");
    }

    draw();
  }
};

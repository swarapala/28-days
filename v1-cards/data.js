// data.js — all story content. Edit text here; the engine reads it.
// Each day has two versions: "typical" (a typical cycle) and "warning" (warning signs told are "normal").
// flow: none | light | medium | heavy | soaked   (used by packing + tracker)
// truth: what the player SHOULD log that night (tracker compares against it)
// requires: item ids — choice succeeds if ANY of them is in the backpack
// requiresLogs: number of correct red-flag logs needed (finale only)

window.CAST = [
  { name: "Ruby", avatar: "🎒", role: "You. Junior, swimmer, Science Olympiad, debate." },
  { name: "Riyansh", avatar: "🧢", role: "Best friend since 6th grade. Learning fast." },
  { name: "Zach", avatar: "🏊", role: "Swim team captain + coworker at the smoothie shop." },
  { name: "Keshav", avatar: "🎤", role: "Debate partner. Asks a LOT of questions." }
];

window.SPEAKERS = {
  estrogen:     { name: "Estrogen",     icon: "🌸", tag: "the hype friend" },
  progesterone: { name: "Progesterone", icon: "🌙", tag: "the calm, sleepy one" },
  lh:           { name: "LH",           icon: "⚡", tag: "the dramatic one" },
  fsh:          { name: "FSH",          icon: "🌱", tag: "the coach" },
  nurse:        { name: "Nurse Alvarez",icon: "🩺", tag: "school nurse" }
};

window.DAYS = [
  // ---------------- DAY 1 ----------------
  {
    day: 1, phase: "menstrual", title: "Surprise, It's Day 1",
    preview: "AP Chem 1st period, lunch with Riyansh, gym 6th period. You're at school about 8 hours.",
    hoursAway: 8,
    needs: [{ id: "gym", msg: "Gym 6th period and no gym clothes.", miss: { grades: -5 } }],
    fact: { speaker: "progesterone", text: "Day 1 is the first day of bleeding. Me and Estrogen are at our lowest right now, so the uterus sheds its lining from last cycle. That's your period." },
    typical: {
      flow: "medium",
      text: "Halfway through AP Chem notes, you feel it. Day 1. Riyansh notices you shifting in your seat and slides a sticky note over: 'u ok??'",
      truth: { flow: "medium", pain: 3 },
      choices: [
        { label: "Slip out and use a product you packed", requires: ["pad", "tampon", "cup", "underwear"],
          effects: { health: 5 }, result: "Two minutes in the bathroom and you're back before the titration example. Easy.",
          failResult: "You dig through your bag. Nothing. You spend the rest of class stressing instead of listening.", failEffects: { grades: -5, energy: -5 } },
        { label: "Text Riyansh to grab a pad from the nurse",
          effects: { energy: -2 }, result: "Riyansh speed-walks to Nurse Alvarez and comes back with a pad hidden in his hoodie pocket. 'I didn't even know the nurse had these,' he whispers. Ally points: earned." },
        { label: "Go to the nurse yourself",
          effects: { grades: -5, health: 5 }, result: "Nurse Alvarez hands you a pad and a heat pack. You miss 15 minutes of notes, but you feel way better." }
      ]
    },
    warning: {
      flow: "soaked", redFlag: true,
      text: "It's only 9 AM and you've already soaked through your pad. Again. Mom always says, 'That's just how periods are in our family.'",
      truth: { flow: "soaked", pain: 6 },
      choices: [
        { label: "Change into your spare pants", requires: ["pants"],
          effects: { energy: -5 }, result: "You change in the bathroom stall. Crisis handled. But you had to change after barely an hour. Is that... normal?",
          failResult: "No spare pants. You tie your jacket around your waist and call Mom to come get you.", failEffects: { grades: -15, energy: -10 } },
        { label: "Ask Riyansh to cover for you while you go to the nurse",
          effects: { grades: -5, health: 5 }, result: "Riyansh tells Mr. Patel you're 'handling something important.' Nurse Alvarez asks how often you're changing. 'Every hour,' you say. She frowns. 'Keep track of that for me, okay?'" },
        { label: "Ignore it and stay in class",
          effects: { health: -10, energy: -10 }, result: "You sit perfectly still for 50 minutes. You can't focus on a single word." }
      ]
    }
  },

  // ---------------- DAY 3 ----------------
  {
    day: 3, phase: "menstrual", title: "Chem Test + Swim Practice",
    preview: "Chem test 2nd period, then swim practice after school with Zach's relay team. About 10 hours away from home.",
    hoursAway: 10, swimDay: true,
    needs: [{ id: "gym", msg: "Swim practice and no swim gear.", miss: { energy: -5 } }],
    fact: { speaker: "nurse", text: "Cramps come from chemicals called prostaglandins that make the uterus squeeze. Cramps are common. Pain bad enough that you miss school or activities is worth telling a doctor about." },
    typical: {
      flow: "medium",
      text: "Chem test this morning, swim after school. Zach texts the team group chat: 'RELAY PRACTICE TODAY everyone in the water 🏊‍♂️'",
      truth: { flow: "medium", pain: 4 },
      choices: [
        { label: "Swim with a tampon or menstrual cup", requires: ["tampon", "cup"],
          effects: { health: 5, energy: 5 }, result: "You swim the whole practice. Nobody can tell, and moving actually eases your cramps a little.",
          failResult: "Pads don't work in a pool. You sit on the bench in your swimsuit feeling left out.", failEffects: { energy: -5 } },
        { label: "Tell Coach Reed you'll do dryland today",
          effects: { health: 2 }, result: "Coach Reed just nods: 'No problem, core circuit with me.' Zach gives you a thumbs up. Way less awkward than you thought." },
        { label: "Skip practice and go home to rest",
          effects: { energy: 10, grades: -2 }, result: "Couch, heating pad, chem review. Zach texts: 'we missed u at relays.'" }
      ]
    },
    warning: {
      flow: "heavy", redFlag: true,
      text: "Pain is an 8 out of 10. You get dizzy standing up after the chem test. At the pool, Zach looks at you: 'Hey... you okay? You look really pale.'",
      truth: { flow: "heavy", pain: 8 },
      choices: [
        { label: "Swim anyway with a tampon or cup", requires: ["tampon", "cup"],
          effects: { health: -10, energy: -15 }, result: "You make it two laps before you grab the wall. Coach Reed pulls you out. 'Dizzy isn't normal. Tell someone at home.'",
          failResult: "No tampon or cup, so you can't get in the water. You sit out, cramping and dizzy.", failEffects: { energy: -5 } },
        { label: "Tell Coach Reed the truth and sit out",
          effects: { health: 5 }, result: "Coach Reed says, 'Pain bad enough to miss practice is worth seeing a doctor about.' You type that into your notes app." },
        { label: "Go home early",
          effects: { grades: -10, energy: 5 }, result: "You miss the test-retake sign-up. Mom says, 'Same thing happened to me at your age. You'll be fine.'" }
      ]
    }
  },

  // ---------------- DAY 8 ----------------
  {
    day: 8, phase: "follicular", title: "Science Olympiad Tryouts",
    preview: "Science Olympiad tryouts after school with Riyansh and Keshav. About 9 hours.",
    hoursAway: 9,
    needs: [{ id: "book", msg: "No textbook to study from before tryouts.", miss: { grades: -5 } }],
    fact: { speaker: "fsh", text: "I'm FSH! I tell follicles in the ovaries to start getting an egg ready. As they grow, they make Estrogen, so a lot of people feel more energy this week." },
    typical: {
      flow: "none",
      text: "Your period ended a few days ago and you feel GOOD. Riyansh is trying out for Anatomy, Keshav for Disease Detectives. You could do both.",
      truth: { flow: "none", pain: 0 },
      choices: [
        { label: "Go all-in and try out for two events",
          effects: { grades: 10, energy: -10 }, result: "You make both events. Riyansh: 'Of course you picked the two health ones.'" },
        { label: "Try out for one event and keep it chill",
          effects: { grades: 5, energy: 5 }, result: "You make Anatomy & Physiology with Riyansh. Balanced day." },
        { label: "Skip tryouts and sleep",
          effects: { energy: 10, grades: -5 }, result: "Fully rested. Keshav texts: 'we needed u 😭'" }
      ]
    },
    warning: {
      flow: "medium", redFlag: true,
      text: "Day 8 and your period still hasn't stopped. Your friends are always done within a week. You're exhausted before tryouts even start.",
      truth: { flow: "medium", pain: 4 },
      choices: [
        { label: "Go all-in anyway",
          effects: { grades: 5, energy: -15, health: -5 }, result: "You make the team, but you almost fall asleep on the bus home." },
        { label: "Try out for one event",
          effects: { grades: 5, energy: -5 }, result: "You make one event. Keshav squints at you: 'Have you eaten today? You look wiped.'" },
        { label: "Look up 'period lasting 8 days' on your phone",
          effects: { health: 5 }, result: "The CDC says a period lasting longer than 7 days is a reason to talk to a doctor. Huh. You screenshot it." }
      ]
    }
  },

  // ---------------- DAY 11 ----------------
  {
    day: 11, phase: "follicular", title: "Easton Trip with $20",
    preview: "After school: Easton Town Center with Riyansh and Keshav. You have $20 and you're almost out of supplies.",
    hoursAway: 6,
    needs: [],
    fact: { speaker: "estrogen", text: "Hiii it's me, Estrogen! I'm rising this week and building up the uterus lining again. Fun fact: most periods last 2 to 7 days." },
    typical: {
      flow: "none",
      text: "Riyansh wants to look at sneakers. Keshav wants Auntie Anne's. You have $20 and only two pads left at home.",
      truth: { flow: "none", pain: 0 },
      choices: [
        { label: "Buy next month's supplies first",
          effects: { money: -12, health: 5 }, result: "Pads plus a box of tampons. Keshav: 'Wait, that much? Every MONTH?' He's quiet for a second. 'That's kind of messed up, honestly.'" },
        { label: "Buy the concert merch",
          effects: { money: -20, energy: 10 }, result: "The hoodie is amazing. Future you will have to figure out supplies." },
        { label: "Split it: small box of pads + a pretzel",
          effects: { money: -15, health: 2, energy: 5 }, result: "Not bad. Keshav steals one bite of your pretzel." }
      ]
    },
    warning: {
      flow: "none",
      text: "Same mall, same $20. But you go through about twice as many products as your friends. The math is not mathing.",
      truth: { flow: "none", pain: 1 },
      choices: [
        { label: "Spend it all on supplies",
          effects: { money: -20, health: 5 }, result: "Two big boxes, nothing left for food. Riyansh buys you a pretzel without even asking." },
        { label: "Buy a menstrual cup instead",
          effects: { money: -20, health: 5, energy: 5 }, result: "It costs more up front, but it's reusable. Keshav: 'So it's like a reusable water bottle instead of buying plastic ones?' Basically, yeah." },
        { label: "Buy the merch and hope it works out",
          effects: { money: -20, energy: 5, health: -5 }, result: "Next week you're stuck asking friends for pads between classes." }
      ]
    }
  },

  // ---------------- DAY 14 ----------------
  {
    day: 14, phase: "ovulation", title: "Debate Tournament",
    preview: "Saturday debate tournament with your partner Keshav. All day, about 10 hours.",
    hoursAway: 10,
    needs: [{ id: "charger", msg: "Phone died. Your debate notes were on it.", miss: { grades: -5 } }],
    fact: { speaker: "lh", text: "IT'S ME, LH! When Estrogen gets high enough, I SURGE and an egg gets released from the ovary. That's ovulation. It often happens around the middle of the cycle, but the exact day is different for different people." },
    typical: {
      flow: "none",
      text: "You and Keshav made it to semifinals. You feel sharp, confident, and extra talkative today.",
      truth: { flow: "none", pain: 1 },
      choices: [
        { label: "Take the lead in rebuttals",
          effects: { grades: 10, energy: -5 }, result: "You win the round. Keshav: 'Remind me to never argue with you.'" },
        { label: "Let Keshav lead this round",
          effects: { grades: 5, energy: 5 }, result: "Solid teamwork. You make it to finals." },
        { label: "Notice a small twinge on one side",
          effects: { health: 5 }, result: "Some people feel a mild one-sided twinge around ovulation. You make a note in your tracker. Body literacy!" }
      ]
    },
    warning: {
      flow: "none",
      text: "A calmer day. For once, you're not thinking about your period at all. Keshav is pumped for semifinals.",
      truth: { flow: "none", pain: 0 },
      choices: [
        { label: "Take the lead in rebuttals",
          effects: { grades: 10, energy: -5 }, result: "You win the round. Keshav: 'You're scary good at this.'" },
        { label: "Let Keshav lead this round",
          effects: { grades: 5, energy: 5 }, result: "Solid teamwork. You make it to finals." },
        { label: "Eat a real lunch between rounds",
          effects: { energy: 10 }, result: "Turkey sandwich + fruit. You feel steady all afternoon." }
      ]
    }
  },

  // ---------------- DAY 19 ----------------
  {
    day: 19, phase: "luteal", title: "Late Shift",
    preview: "School, then a shift at the smoothie shop with Zach until 9. History essay due tomorrow. About 13 hours.",
    hoursAway: 13,
    needs: [{ id: "snack", msg: "13-hour day with no snack.", miss: { energy: -5 } }],
    fact: { speaker: "progesterone", text: "After ovulation, I take over. I help keep the uterus lining ready, and I can make you feel sleepier or warmer. That's why this week can feel slower." },
    typical: {
      flow: "none",
      text: "You're SO sleepy today. Zach asks if you can stay an extra hour because the closer called out.",
      truth: { flow: "none", pain: 1 },
      choices: [
        { label: "Stay late for the extra money",
          effects: { money: 15, energy: -15, grades: -5 }, result: "Extra $15. Your essay is... a first draft. At 1 AM." },
        { label: "Say no, go home, write the essay",
          effects: { grades: 10, energy: -5 }, result: "Zach says, 'All good, I got it.' Essay done by 11." },
        { label: "Ask your manager for lighter shifts next week",
          effects: { energy: 10, money: 5 }, result: "Your manager is surprisingly chill about it. Planning ahead = less stress." }
      ]
    },
    warning: {
      flow: "none",
      text: "Same long day. You're tired in a way that sleep doesn't seem to fix. Zach asks if you can stay an extra hour.",
      truth: { flow: "none", pain: 2 },
      choices: [
        { label: "Stay late for the extra money",
          effects: { money: 15, energy: -20, grades: -5 }, result: "Extra $15, but you almost drop a blender. Zach: 'Go sit down for a sec.'" },
        { label: "Say no, go home, write the essay",
          effects: { grades: 10, energy: -5 }, result: "Essay done. You fall asleep at your desk." },
        { label: "Ask your manager for lighter shifts next week",
          effects: { energy: 10, money: 5 }, result: "Your manager says yes. One less thing." }
      ]
    }
  },

  // ---------------- DAY 26 ----------------
  {
    day: 26, phase: "luteal", title: "PMS Day",
    preview: "Lunch with Riyansh, then a Spanish quiz. About 8 hours.",
    hoursAway: 8,
    needs: [{ id: "water", msg: "No water bottle. Bloating feels worse.", miss: { health: -3 } }],
    fact: { speaker: "progesterone", text: "No pregnancy this cycle, so Estrogen and I drop off. That drop can cause PMS: bloating, cravings, mood swings. And when we hit bottom, the lining sheds and a new cycle begins." },
    typical: {
      flow: "none",
      text: "Bloated, cranky, and craving Hot Cheetos. Riyansh forgot to save you a seat at lunch, and you feel WAY more upset than makes sense.",
      truth: { flow: "none", pain: 2 },
      choices: [
        { label: "Snap at him",
          effects: { energy: -5, health: -5 }, result: "He looks hurt. Later you both apologize. He says, 'Day 26, right? I'm learning.'" },
        { label: "Take a breath and tell him later",
          effects: { health: 5 }, result: "After school you tell him it bugged you. 'My bad,' he says, and saves your seat for the rest of the week." },
        { label: "Eat the snack you packed first", requires: ["snack"],
          effects: { energy: 10 }, result: "Turns out you were also just hungry. Crisis averted.",
          failResult: "No snack. Vending machine Hot Cheetos it is. $2 gone.", failEffects: { money: -2, energy: -5 } }
      ]
    },
    warning: {
      flow: "none", redFlag: true,
      text: "Your period isn't even here yet, but the cramps already are. Pain 6 out of 10, days early. You can barely focus on the Spanish quiz.",
      truth: { flow: "none", pain: 6 },
      choices: [
        { label: "Use the heat patch or pain reliever you packed", requires: ["heat", "pain"],
          effects: { grades: 5, energy: 5 }, result: "It takes the edge off enough to finish the quiz.",
          failResult: "Nothing packed for pain. You curl up at your desk and guess on half the quiz.", failEffects: { grades: -10 } },
        { label: "Tell Riyansh what's going on",
          effects: { health: 5 }, result: "Riyansh says, 'My cousin had really bad cramps too and her doctor actually helped. You should tell your mom.'" },
        { label: "Push through and say nothing",
          effects: { health: -5, energy: -10 }, result: "You make it through. Barely. Again." }
      ]
    }
  },

  // ---------------- FINALE ----------------
  {
    day: 1, phase: "menstrual", title: "Day 1, Again", finale: true,
    preview: "Your period is due back about now. Normal school day, about 8 hours.",
    hoursAway: 8,
    needs: [],
    fact: { speaker: "nurse", text: "Doctors call the menstrual cycle a vital sign, like heart rate or blood pressure. Tracking it is how you notice when something changes." },
    typical: {
      flow: "medium",
      text: "Your tracker said Day 1 would be about now, and it's right on time. Riyansh, Zach, and Keshav are arguing about lunch plans.",
      truth: { flow: "medium", pain: 3 },
      choices: [
        { label: "You packed for this. Handle it like a pro.", requires: ["pad", "tampon", "cup", "underwear"],
          effects: { health: 10, energy: 5 }, result: "Zero panic. You saw it coming because you tracked it.",
          failResult: "Your tracker predicted it but you didn't pack anything. Lesson learned for next month.", failEffects: { grades: -5 } },
        { label: "Teach the guys how cycle tracking works",
          effects: { health: 5 }, result: "Keshav: 'Wait, so you can basically predict it?' Zach: 'I'm telling my sister about this.' Riyansh: 'I already knew.' (He did not.)" }
      ]
    },
    warning: {
      flow: "soaked",
      text: "It's back. Soaking through again before 2nd period. But this time you have a whole month of notes on your phone.",
      truth: { flow: "soaked", pain: 7 },
      choices: [
        { label: "Show your tracker log to Mom", requiresLogs: 3,
          effects: { health: 20 }, result: "Mom reads it slowly. 'Every hour? Eight days? Dizzy at swim? I had no idea it was this much. Let's call Dr. Okafor.'", good: true,
          failResult: "Mom: 'Periods are just like that.' Without enough notes, it's hard to show her that yours are different.", failEffects: { health: -10 } },
        { label: "Tough it out like always",
          effects: { health: -15, energy: -10 }, result: "Another month of this. Maybe it really is normal? (It isn't.)" }
      ]
    }
  }
];

window.ENDINGS = {
  typical: {
    title: "You Know Your Cycle",
    icon: "🌸",
    text: "One month, four phases, zero surprises. By tracking how you felt each day, you learned your own pattern, packed smarter, and even taught Riyansh, Zach, and Keshav something. That's body literacy."
  },
  warningGood: {
    title: "Not Just 'Normal'",
    icon: "🩺",
    text: "Dr. Okafor reads Ruby's log: changing every hour, an 8-day period, dizziness, pain that made her miss things. She asks a few questions and orders some tests, like checking for low iron. She doesn't have all the answers yet, but now someone is looking. Heavy bleeding isn't something you have to just tough out."
  },
  warningBad: {
    title: "Toughing It Out",
    icon: "🔁",
    text: "Ruby's symptoms keep going, month after month. Without notes, it's hard to explain to anyone that something is off. Try again, and this time log each day carefully. The 🚩 days are the ones a doctor would want to know about."
  }
};

// CDC warning signs of heavy menstrual bleeding (verify wording at cdc.gov before presenting)
window.WARNING_SIGNS = [
  "Soaking through a pad or tampon every 1 to 2 hours (or less) on your heaviest days",
  "A period that lasts longer than 7 days",
  "Needing to double up on protection, or change products during the night",
  "Blood clots bigger than a grape",
  "Bleeding so heavy it gets in the way of school, sports, or daily life",
  "Periods coming more often than every 21 days, or less often than every 45 days",
  "Going more than 3 months without a period",
  "Pain that makes you miss school or activities, or feeling dizzy or very tired during your period"
];

window.TEEN_NOTE = "Most first periods last 2–7 days, and irregular cycles are common in the first few years. Cycles in teens often range from about 21 to 45 days. This game uses a 28-day cycle to keep things simple.";

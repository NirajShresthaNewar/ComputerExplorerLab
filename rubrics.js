// =====================================================================
// AUTO-FILL "REGULAR DATE" — DIFFERENT DATE PER ACHIEVEMENT, ALL STUDENTS
// =====================================================================
// HOW TO USE:
// 1. Edit ACHIEVEMENT_DATES below for the unit you're currently on.
//    The key (ach-1, ach-2, ach-3, ...) matches the achievement's order
//    on the page (1st card = ach-1, 2nd card = ach-2, etc).
// 2. Open the Learning Achievement page with the FIRST student loaded.
// 3. Open DevTools (F12) > Console tab, paste this whole script, Enter.
// 4. Watch the first 2-3 students closely before trusting the rest.
// =====================================================================

// ---- EDIT THIS PER UNIT -------------------------------------------
// month: "01"=Baishakh "02"=Jestha "03"=Asar "04"=Shrawan "05"=Bhadra
//        "06"=Ashwin "07"=Kartik "08"=Mangsir "09"=Poush "10"=Magh
//        "11"=Falgun "12"=Chaitra
const ACHIEVEMENT_DATES = {
  "ach-1": { month: "01", day: "23" }, // Baishakh 23
  "ach-2": { month: "01", day: "25" }, // Baishakh 25
  "ach-3": { month: "01", day: "28" }, // Baishakh 28
};
// ---------------------------------------------------------------------

const CONFIG = {
  MAX_STUDENTS: 100,     // safety cap; script stops on its own at the last student
  DELAY: 600,              // ms to wait after small clicks (month nav, day click)
  SAVE_WAIT: 2500,         // ms to wait after clicking Save, to let it sync to the server
  NEXT_WAIT: 1500,         // ms to wait after clicking Next Student, for the new student to load
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function waitFor(checkFn, timeout = 6000, interval = 150) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    const result = checkFn();
    if (result) return result;
    await sleep(interval);
  }
  return null;
}

// Reads the currently-displayed month as "01".."12" from a visible day
// button's aria-label (e.g. "2083/03/04" -> "03"). Robust regardless of
// how the month name is spelled in the UI.
function getCurrentMonthNum() {
  const anyDay = document.querySelector("button.bs-day[aria-label]");
  if (!anyDay) return null;
  const parts = anyDay.getAttribute("aria-label").split("/");
  return parts[1] || null;
}

async function setOneDate(trigger, targetMonthNum, targetDay) {
  trigger.click();

  const opened = await waitFor(() => document.querySelector(".bs-calendar-slide-label strong"));
  if (!opened) {
    console.warn("[auto-fill] Calendar never opened for this field — skipping it");
    return false;
  }

  let safety = 0;
  while (safety++ < 15) {
    const curNum = getCurrentMonthNum();
    if (!curNum) {
      console.warn("[auto-fill] Could not read current month from day buttons");
      return false;
    }
    if (curNum === targetMonthNum) break;

    const curIdx = parseInt(curNum, 10) - 1;
    const tgtIdx = parseInt(targetMonthNum, 10) - 1;
    const goForward = ((tgtIdx - curIdx + 12) % 12) <= 6;

    const btn = document.querySelector(
      `.bs-calendar-nav-button[data-calendar-action="${goForward ? "next-month" : "previous-month"}"]`
    );
    if (!btn || btn.disabled) {
      console.warn("[auto-fill] Month nav button missing/disabled");
      return false;
    }
    btn.click();
    await sleep(CONFIG.DELAY);
  }

  const dayBtn = document.querySelector(
    `button.bs-day[data-calendar-day="${targetDay}"]:not([disabled])`
  );
  if (!dayBtn) {
    console.warn(`[auto-fill] Day ${targetDay} not found or disabled in month ${targetMonthNum}`);
    return false;
  }
  dayBtn.click();
  await waitFor(() => !document.querySelector(".bs-calendar-slide-label strong"), 3000);
  await sleep(CONFIG.DELAY);
  return true;
}

async function processCurrentStudent() {
  const triggers = [...document.querySelectorAll('.bs-date-box[data-field="regularDate"]')];

  if (triggers.length === 0) {
    console.warn("[auto-fill] No regularDate triggers found on this student");
  }

  let allOk = true;
  for (const trigger of triggers) {
    const achKey = trigger.getAttribute("data-la"); // e.g. "ach-1"
    const target = ACHIEVEMENT_DATES[achKey];
    if (!target) {
      console.warn(`[auto-fill] No date configured for ${achKey} — skipping it. Add it to ACHIEVEMENT_DATES.`);
      allOk = false;
      continue;
    }
    const ok = await setOneDate(trigger, target.month, target.day);
    if (!ok) allOk = false;
  }
  if (!allOk) {
    console.warn("[auto-fill] One or more dates failed to set — check this student manually before trusting the Save");
  }

  const saveBtn = document.querySelector("#saveStudentMarks");
  if (!saveBtn) {
    console.warn("[auto-fill] Save button not found");
    return;
  }
  saveBtn.click();
  await sleep(CONFIG.SAVE_WAIT);
}

async function runAll() {
  for (let i = 0; i < CONFIG.MAX_STUDENTS; i++) {
    console.log(`[auto-fill] Processing student ${i + 1}...`);
    await processCurrentStudent();

    const nextBtn = document.querySelector('button[data-la-nav="next"]');
    if (!nextBtn || nextBtn.disabled) {
      console.log("[auto-fill] No more students. Done.");
      break;
    }
    nextBtn.click();
    await sleep(CONFIG.NEXT_WAIT);
  }
}

runAll();
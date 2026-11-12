const cities = [
  { label: "Akre", file: "Akre.json" },
  { label: "Amedi", file: "Amedi.json" },
  { label: "Arbat", file: "Arbat.json" },
  { label: "Barznja", file: "Barznja.json" },
  { label: "Bazyan", file: "Bazyan.json" },
  { label: "Chamchamal", file: "Chamchamal.json" },
  { label: "Chwarta", file: "Chwarta.json" },
  { label: "Darbandixan", file: "Darbandixan.json" },
  { label: "Duhok", file: "Duhok.json" },
  { label: "Dukan", file: "Dukan.json" },
  { label: "Haji Awa", file: "HajiAwa.json" },
  { label: "Halabja", file: "Halabja.json" },
  { label: "Halabja N", file: "HalabjaN.json" },
  { label: "Hawler", file: "Hawler.json" },
  { label: "Kalar", file: "Kalar.json" },
  { label: "Kfri", file: "Kfri.json" },
  { label: "Kirkuk", file: "Kirkuk.json" },
  { label: "Koya", file: "Koya.json" },
  { label: "Mosul", file: "mosul.json" },
  { label: "Penjuin", file: "Penjuin.json" },
  { label: "Piramagrun", file: "Piramagrun.json" },
  { label: "Qadir Karam", file: "QadirKaram.json" },
  { label: "Qaladze", file: "Qaladze.json" },
  { label: "Qaradax", file: "Qaradax.json" },
  { label: "Qasre", file: "qasre.json" },
  { label: "Ranya", file: "Ranya.json" },
  { label: "Said Sadiq", file: "SaidSadiq.json" },
  { label: "Slemany", file: "Slemany.json" },
  { label: "Soran", file: "Soran.json" },
  { label: "Takya", file: "Takya.json" },
  { label: "Taq Taq", file: "TaqTaq.json" },
  { label: "Tasluja", file: "Tasluja.json" },
  { label: "Tuz Khurmatu", file: "tuzxurmatu.json" },
  { label: "Xalakan", file: "Xalakan.json" },
  { label: "Xanaqin", file: "Xanaqin.json" },
  { label: "Zaxo", file: "Zaxo.json" }
];

const prayerFields = [
  ["Fajr", "Fajr"],
  ["Sunrise", "Sunrise"],
  ["Dhuhr", "Dhuhr"],
  ["Asr", "Asr"],
  ["Maghrib", "Maghrib"],
  ["Isha", "Isha"]
];

const citySelect = document.querySelector("#city-select");
const dateSelect = document.querySelector("#date-select");
const selectedDate = document.querySelector("#selected-date");
const scheduleStatus = document.querySelector("#schedule-status");
const prayerGrid = document.querySelector("#prayer-grid");
const scheduleCache = new Map();
let requestNumber = 0;

function localDateValue(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatSelectedDate(value) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day, 12).toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric"
  });
}

function setStatus(message) {
  scheduleStatus.textContent = message;
}

function showPrayerTimes(row) {
  prayerGrid.replaceChildren();

  for (const [label, field] of prayerFields) {
    const card = document.createElement("article");
    card.className = "prayer-card";
    const name = document.createElement("p");
    name.className = "prayer-name";
    name.textContent = label;
    const time = document.createElement("p");
    time.className = "prayer-time";
    time.textContent = row[field];
    card.append(name, time);
    prayerGrid.append(card);
  }
}

async function getCitySchedule(city) {
  if (!scheduleCache.has(city.file)) {
    const response = await fetch(`data/${encodeURIComponent(city.file)}`);
    if (!response.ok) {
      throw new Error(`The schedule file could not be loaded (HTTP ${response.status}).`);
    }

    const rows = await response.json();
    if (!Array.isArray(rows)) {
      throw new Error("The city schedule has an unexpected format.");
    }

    scheduleCache.set(city.file, rows);
  }

  return scheduleCache.get(city.file);
}

async function updateSchedule() {
  const currentRequest = ++requestNumber;
  const city = cities.find((item) => item.file === citySelect.value);
  const dateValue = dateSelect.value;

  prayerGrid.replaceChildren();
  if (!city || !dateValue) {
    selectedDate.textContent = "Choose a city and date";
    setStatus("Select a city and date to view the schedule.");
    return;
  }

  selectedDate.textContent = formatSelectedDate(dateValue);
  setStatus(`Loading ${city.label} schedule...`);

  try {
    const rows = await getCitySchedule(city);
    if (currentRequest !== requestNumber) {
      return;
    }

    const monthAndDay = dateValue.slice(5);
    const matches = rows.filter((item) => item && item.Date === monthAndDay);
    if (matches.length === 0) {
      setStatus(`No schedule is available for ${city.label} on this date.`);
      return;
    }

    const row = matches[0];
    const hasConflictingDuplicates = matches.some((item) =>
      prayerFields.some(([, field]) => item[field] !== row[field])
    );
    if (hasConflictingDuplicates) {
      setStatus(`The schedule data for ${city.label} on this date has conflicting entries. Please ask the project maintainers to review it.`);
      return;
    }

    const hasAllTimes = prayerFields.every(
      ([, field]) => typeof row[field] === "string" && row[field].length > 0
    );
    if (!hasAllTimes) {
      setStatus(`The schedule for ${city.label} on this date is incomplete.`);
      return;
    }

    showPrayerTimes(row);
    setStatus(`${city.label} · ${formatSelectedDate(dateValue)}`);
  } catch (error) {
    if (currentRequest !== requestNumber) {
      return;
    }
    setStatus(`Unable to show this schedule: ${error.message}`);
  }
}

for (const city of cities) {
  const option = document.createElement("option");
  option.value = city.file;
  option.textContent = city.label;
  citySelect.append(option);
}

citySelect.value = "Hawler.json";
dateSelect.value = localDateValue();
citySelect.addEventListener("change", updateSchedule);
dateSelect.addEventListener("change", updateSchedule);
updateSchedule();

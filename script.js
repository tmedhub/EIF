// 🔴 Published Google Sheet CSV (NO API KEY)
const CSV_URL =
  "https://docs.google.com/spreadsheets/d/1AxLX4CudcgxYQl4BNPRzMy6TcSY4BIG7mAx2g5ta5j8/gviz/tq?tqx=out:csv";

const remaining = {
  1: [],
  5: [],
  10: []
};

async function loadSheet() {
  try {
    const res = await fetch(CSV_URL);
    const text = await res.text();

    const rows = parseCSV(text).slice(1); // skip header

    rows.forEach(row => {
      if (row[0]) remaining[1].push(row[0]);
      if (row[1]) remaining[5].push(row[1]);
      if (row[2]) remaining[10].push(row[2]);
    });

    document.getElementById("result").innerText =
      "Choose how far you dare to move.";
  } catch (err) {
    document.getElementById("result").innerText =
      "Failed to load clues. Check if the sheet is published.";
  }
}

/* ✅ Proper CSV parser (handles commas, long text, quotes) */
function parseCSV(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let insideQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (char === '"' && text[i + 1] === '"') {
      cell += '"';
      i++;
    } else if (char === '"') {
      insideQuotes = !insideQuotes;
    } else if (char === "," && !insideQuotes) {
      row.push(cell);
      cell = "";
    } else if (char === "\n" && !insideQuotes) {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += char;
    }
  }

  if (cell || row.length) {
    row.push(cell);
    rows.push(row);
  }

  return rows;
}

function drawStep(step) {
  const box = document.getElementById("result");
  const list = remaining[step];

  if (!list || list.length === 0) {
    box.innerText = `No ${step}-step moves remain.`;
    return;
  }

  const index = Math.floor(Math.random() * list.length);
  const clue = list.splice(index, 1)[0];

  box.innerText = clue; // 🔥 FULL CELL TEXT
}

window.onload = loadSheet;

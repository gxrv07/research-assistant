let notes = [];
let confirmResolver = null;

const toast = document.getElementById("toast");
const overlay = document.getElementById("confirmOverlay");
const confirmText = document.getElementById("confirmText");
const summarizeBtn = document.getElementById("summarizeBtn");
const notesInput = document.getElementById("notes");
const saveNotesBtn = document.getElementById("saveNotesBtn");
const clearNotesBtn = document.getElementById("clearNotesBtn");
const exportNotesBtn = document.getElementById("exportNotesBtn");
const saveSummaryBtn = document.getElementById("saveSummaryBtn");
const inputElement = document.getElementById("notes");

document.addEventListener("DOMContentLoaded", function () {
  applyTheme();
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", applyTheme);
  // Enable the save button when text is entered
  notesInput.addEventListener("input", function () {
    saveNotesBtn.disabled = notesInput.value.trim() === "";
  });

  chrome.storage.local.get(["researchNotes"], (result) => {
    notes = result.researchNotes ? JSON.parse(result.researchNotes) : [];
    renderNotes();
  });

  summarizeBtn.addEventListener("click", summarizeText);

  saveNotesBtn.addEventListener("click", () => {
    saveNotes(inputElement.value.trim());
  });

  clearNotesBtn.addEventListener("click", clearNotes);

  exportNotesBtn.addEventListener("click", exportNotes);

  saveSummaryBtn.addEventListener("click", () => {
    saveNotes(document.querySelector(".result-content").textContent.trim());
  });

  document.getElementById("okBtn").addEventListener("click", () => {
    overlay.classList.add("hidden");
    confirmResolver(true);
  });

  document.getElementById("cancelBtn").addEventListener("click", () => {
    overlay.classList.add("hidden");
    confirmResolver(false);
  });
});

/* Render the notes in the side panel */
function renderNotes() {
  const notesContainer = document.getElementById("notesContainer");
  notesContainer.innerHTML = "";
  if (notes.length > 0) {
    clearNotesBtn.disabled = false;
    const notesList = document.createElement("ul");
    notesList.className = "notes-list";
    notes.forEach((note) => {
      const listItem = document.createElement("li");
      listItem.className = "note-card";
      const noteText = document.createElement("p");
      noteText.textContent = note;
      noteText.className = "note-text";
      noteText.addEventListener("click", () => {
        noteText.classList.toggle("expanded");
      });
      listItem.appendChild(noteText);
      notesList.appendChild(listItem);
    });
    notesContainer.appendChild(notesList);
  } else {
    notesContainer.textContent = "Ready to start your research!!";
    clearNotesBtn.disabled = true;
    return;
  }
}

/* Summarize the selected text on the active tab */
async function summarizeText() {
  const loadingSpinner = document.getElementById("loadingSpinner");
  const resultContainer = document.getElementById("result");
  const dummyText = document.getElementById("summaryText");

  try {
    loadingSpinner.style.display = "block";
    resultContainer.style.display = "none";

    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    const [{ result }] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => window.getSelection().toString(),
    });

    if (!result) {
      showResult("No text selected.");
      return;
    }

    const response = await fetch("http://localhost:8080/api/research/process", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: result, operation: "summarize" }),
    });

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.status}`);
    }

    const text = await response.text();
    if (text) {
      showResult(text.replace(/\n/g, "<br>"));
    }
  } catch (error) {
    showResult(`Error: ${error.message}`);
  } finally {
    loadingSpinner.style.display = "none";
    resultContainer.style.display = "block";
  }
}

/* Save a note to storage */
function saveNotes(note) {
  if (!note) {
    showToast("Note cannot be empty!");
    return;
  }

  notes.push(note);

  chrome.storage.local.set(
    { researchNotes: JSON.stringify(notes) },
    function () {
      showToast("Note added successfully!");
      inputElement.value = "";
      renderNotes();
    }
  );
}

/* Clear all notes from storage */
async function clearNotes() {
  const confirmed = await showConfirm(
    "Are you sure you want to clear all notes?"
  );

  if (!confirmed) return;
  chrome.storage.local.remove("researchNotes", function () {
    showToast("All notes have been cleared.");
    notes = [];
    renderNotes();
  });
}

/* Display the summarization result */
function showResult(content) {
  const resultContainer = document.getElementById("result");
  const dummyText = document.getElementById("summaryText");
  const saveSummaryBtn = document.getElementById("saveSummaryBtn");

  if (content) {
    resultContainer.innerHTML = `<div class="result-item"><div class="result-content">${content}</div></div>`;
    dummyText.style.display = "none";
    saveSummaryBtn.style.display = "inline-block"; // Ensure the button is visible
  } else {
    resultContainer.innerHTML = "";
    dummyText.style.display = "block";
    saveSummaryBtn.style.display = "none"; // Hide the button when no content
  }
}

/* Export notes as a CSV file */
function exportNotes() {
  chrome.storage.local.get(["researchNotes"], function (result) {
    const notes = result.researchNotes ? JSON.parse(result.researchNotes) : [];

    if (notes.length === 0) {
      showToast("No notes to export.");
      return;
    }

    const header = ["ID", "Note"];
    const rows = notes.map((note, index) => [index + 1, note]);
    const csvArray = [header, ...rows];
    const csvContent =
      "data:text/csv;charset=utf-8," +
      csvArray
        .map((row) => row.map((cell) => `"${cell}"`).join(","))
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "research_notes.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Notes exported as CSV!");
  });
}

/* Show a toast notification */
function showToast(text) {
  toast.textContent = text;
  toast.classList.remove("hidden");
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
    toast.classList.add("hidden");
  }, 30000);
}

/* Apply theme based on system preference */
function applyTheme() {
  const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  if (isDark) {
    document.body.classList.add("dark-theme");
    document.body.classList.remove("light-theme");
  } else {
    document.body.classList.add("light-theme");
    document.body.classList.remove("dark-theme");
  }
}

function showConfirm(message) {
  confirmText.textContent = message;
  overlay.classList.remove("hidden");

  return new Promise((resolve) => {
    confirmResolver = resolve;
  });
}

function closeConfirm(result) {
  overlay.classList.add("hidden");

  if (typeof confirmResolver === "function") {
    confirmResolver(result);
  }

  confirmResolver = null;
}

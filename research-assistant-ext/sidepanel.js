document.addEventListener("DOMContentLoaded", function () {
  const notesInput = document.getElementById("notes");
  const saveNotesBtn = document.getElementById("saveNotesBtn");

  // Enable the save button when text is entered
  notesInput.addEventListener("input", function () {
    saveNotesBtn.disabled = notesInput.value.trim() === "";
  });

  chrome.storage.local.get(["researchNotes"], function (result) {
    const notesContainer = document.getElementById("notesContainer");
    const notes = result.researchNotes ? JSON.parse(result.researchNotes) : [];

    if (notes.length > 0) {
      const notesList = document.createElement("ul");
      notes.forEach((note) => {
        const listItem = document.createElement("li");
        listItem.textContent = note;
        notesList.appendChild(listItem);
      });
      notesContainer.appendChild(notesList);
    } else {
      notesContainer.textContent = "Ready to start your research!!";
    }
  });

  document
    .getElementById("summarizeBtn")
    .addEventListener("click", summarizeText);
  saveNotesBtn.addEventListener("click", saveNotes);
});

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

async function saveNotes() {
  const newNote = document.getElementById("notes").value.trim();
  if (!newNote) {
    alert("Note cannot be empty!");
    return;
  }

  chrome.storage.local.get(["researchNotes"], function (result) {
    const notes = result.researchNotes ? JSON.parse(result.researchNotes) : [];
    notes.push(newNote);

    chrome.storage.local.set(
      { researchNotes: JSON.stringify(notes) },
      function () {
        alert("Note added successfully!");
        location.reload();
      }
    );
  });
}

function showResult(content) {
  document.getElementById(
    "result"
  ).innerHTML = `<div class="result-item"><div class="result-content">${content}</div></div>`;
}

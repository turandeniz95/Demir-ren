//// NoteManager sınıfı, SOLID ilkelerine bağlı kalarak notların yönetimini gerçekleştirir.
class NoteManager {
  // constructor sınıf özelliklerini başlatır ve olay dinleyicilerini ayarlar.
  constructor() {
    // ES6: Atamayı yeniden yapılandırma
    this.addNoteForm = document.getElementById("add-note-form");
    this.notesContainer = document.getElementById("notes-container");
    this.editNoteModal = document.getElementById("edit-note-modal");
    this.updatedNoteInput = document.getElementById("updated-note");
    this.warningModal = document.getElementById("warning-modal");

    // ES6: Varsayılan parametre değeri
    // localStorage.getItem("notes") null ise, boş bir dizi kullanılır.
    this.notesArray = JSON.parse(localStorage.getItem("notes")) || [];
    this.addEventListeners();
    this.displayNotes();
  }

  addEventListeners() {
    // ES6: Arrow Function
    this.addNoteForm.addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleNoteFormSubmit();
    });

    const usernameInput = this.addNoteForm.querySelector("#username");

    // Add an input event listener to the username input
    usernameInput.addEventListener("input", (e) => {
        // Remove numeric characters from the input value
        e.target.value = e.target.value.replace(/\d/g, "");
    });
  }

  handleNoteFormSubmit() {
    const formData = new FormData(this.addNoteForm);
    const usernameInput = this.addNoteForm.querySelector("#username");

    if (!usernameInput.checkValidity()) {
      alert("Geçersiz kullanıcı adı. Belirtilen deseni takip edin.");
      return;
    }

    const noteData = this.createNoteData(formData);

    if (this.isUsernameUnique(noteData.username)) {
      this.addNoteToStorage(noteData);
      this.displayNotes();
      this.addNoteForm.reset();
    } else {
      this.openWarningModal();
    }
  }

  createNoteData(formData) {
    // ES6: Spread Operator
    const noteData = {};
    formData.forEach((value, key) => {
      noteData[key] = value;
    });

    const currentDate = new Date();
    // ES7: Exponentiation Operator
    noteData["date"] = this.formatDate(currentDate);
    noteData["time"] = this.formatTime(currentDate);
    noteData["id"] = Date.now();
    noteData["squareOfId"] = noteData["id"] ** 2; // ES7 feature
  
    return noteData;
  }

  formatDate(date) {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  }

  formatTime(date) {
    return `${date.getHours()}:${date.getMinutes()}`;
  }

  isUsernameUnique(username) {
    return !this.notesArray.some((note) => note.username === username);
  }

  addNoteToStorage(noteData) {
    this.notesArray.push(noteData);
    this.saveNotesToLocalstorage();
  }

  saveNotesToLocalstorage() {
    localStorage.setItem("notes", JSON.stringify(this.notesArray));
  }

  displayNotes() {
    if (this.notesArray.length === 0) {
      this.notesContainer.style.display = "none";
    } else {
      this.notesContainer.style.display = "inline-flex";
      this.notesContainer.innerHTML = "";
      this.notesArray.forEach((note) => {
        const noteDiv = this.createNoteElement(note);
        this.notesContainer.appendChild(noteDiv);
      });
    }
  }

  createNoteElement(note) {
    const noteDiv = document.createElement("div");
    noteDiv.classList.add("note");
    noteDiv.innerHTML = `
      <p><strong>Kullanıcı Adı:</strong> ${note.username}</p>
      <p><strong>Not:</strong> <span class="note-text" data-note-id="${note.id}">${note.note}</span></p>
      <p><strong>Tarih:</strong> ${note.date}</p>
      <p><strong>Saat:</strong> ${note.time}</p>
      <div class="note-actions">
        <button class="edit-note-btn" onclick="noteManager.editNote(${note.id})">Düzenle</button>
        <button class="delete-note-btn" onclick="noteManager.openDeleteWarning(${note.id})">Sil</button>
      </div>
    `;
    return noteDiv;
  }

  editNote(noteId) {
    const noteText = document.querySelector(`[data-note-id="${noteId}"]`);
    this.updatedNoteInput.value = noteText.textContent;
    this.updatedNoteInput.dataset.noteId = noteId;
    this.editNoteModal.style.display = "block";
  }

  closeEditNoteModal() {
    this.editNoteModal.style.display = "none";
  }

  saveUpdatedNote() {
    const updatedNoteText = this.updatedNoteInput.value;
    const noteId = parseInt(this.updatedNoteInput.dataset.noteId);

    this.updateNoteInArray(noteId, "note", updatedNoteText);
    this.updateNoteInArray(noteId, "date", this.formatDate(new Date()));
    this.updateNoteInArray(noteId, "time", this.formatTime(new Date()));

    this.saveNotesToLocalstorage();
    this.closeEditNoteModal();
    this.displayNotes();
  }

  openDeleteWarning(noteId) {
    const warningModalContent = document.querySelector("#warning-modal .modal-content");
    warningModalContent.innerHTML = `
      <span class="close" onclick="noteManager.closeWarningModal()">&times;</span>
      <p>Bu notu silmek istediğinizden emin misiniz?</p>
      <button id="deleteYes" onclick="noteManager.deleteNoteConfirmed(${noteId})">Evet</button>
      <button id="deleteNo" onclick="noteManager.closeWarningModal()">Hayır</button>
    `;
    this.openWarningModal();
  }

  deleteNoteConfirmed(noteId) {
    this.deleteNote(noteId);
    this.closeWarningModal();
  }

  deleteNote(noteId) {
    this.notesArray = this.notesArray.filter((note) => note.id !== noteId);
    this.saveNotesToLocalstorage();
    this.displayNotes();
  }

  updateNoteInArray(noteId, field, value) {
    const noteIndex = this.notesArray.findIndex((note) => note.id === noteId);
    if (noteIndex !== -1) {
      this.notesArray[noteIndex][field] = value;
    }
  }

  openWarningModal() {
    this.warningModal.style.display = "block";
  }

  closeWarningModal() {
    this.warningModal.style.display = "none";
  }
}

// ES6: Class Instantiation
const noteManager = new NoteManager();

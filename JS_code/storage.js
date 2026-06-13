// =========================================================================
// БЛОК: РАБОТА С ДАННЫМИ (LOCALSTORAGE)
// =========================================================================
const NotesStorage = {
    // Получить все заметки из памяти
    getAll: function() {
        try {
            return JSON.parse(localStorage.getItem('awesome_notes')) || [];
        } catch (e) {
            return [];
        }
    },

    // Сохранить новую заметку
    save: function(note) {
        const notes = this.getAll();
        note.isArchived = false; // Новая заметка всегда активна
        notes.push(note);
        try {
            localStorage.setItem('awesome_notes', JSON.stringify(notes));
            return true;
        } catch (e) {
            return false;
        }
    },

    // Обновить поля существующей заметки
    update: function(id, updatedData) {
        let notes = this.getAll();
        notes = notes.map(note => note.id == id ? { ...note, ...updatedData } : note);
        localStorage.setItem('awesome_notes', JSON.stringify(notes));
    },

    // Переключить статус архива (туда/обратно)
    toggleArchive: function(id) {
        let status = false;
        let notes = this.getAll();
        notes = notes.map(note => {
            if (note.id == id) {
                note.isArchived = !note.isArchived;
                status = note.isArchived;
            }
            return note;
        });
        localStorage.setItem('awesome_notes', JSON.stringify(notes));
        return status; // возвращает true (в архиве) или false (активна)
    },

    // Удалить заметку насовсем
    delete: function(id) {
        let notes = this.getAll();
        notes = notes.filter(note => note.id != id);
        localStorage.setItem('awesome_notes', JSON.stringify(notes));
    },

    // Очистить абсолютно всё
    clearAll: function() {
        localStorage.removeItem('awesome_notes');
    }
};
const NotesStorage = {
    getAll: function() {
        try {
            return JSON.parse(localStorage.getItem('awesome_notes')) || [];
        } catch (e) {
            return [];
        }
    },

    save: function(note) {
        const notes = this.getAll();
        note.isArchived = false; 
        notes.push(note);
        try {
            localStorage.setItem('awesome_notes', JSON.stringify(notes));
            return true;
        } catch (e) {
            return false;
        }
    },

    update: function(id, updatedData) {
        let notes = this.getAll();
        notes = notes.map(note => note.id == id ? { ...note, ...updatedData } : note);
        localStorage.setItem('awesome_notes', JSON.stringify(notes));
    },

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
        return status; 
    },

    delete: function(id) {
        let notes = this.getAll();
        notes = notes.filter(note => note.id != id);
        localStorage.setItem('awesome_notes', JSON.stringify(notes));
    },

    clearAll: function() {
        localStorage.removeItem('awesome_notes');
    }
};
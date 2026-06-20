const NotesTemplates = {
    defaultImg: 'https://images.unsplash.com/photo-1517842645767-c639042777db?q=80&w=500',

    getNoteCard: function(note) {
        const archiveBtnHtml = note.isArchived 
            ? `<button class="btn-archive-note btn-unarchive w-100" data-id="${note.id}"><i class="fas fa-box-open"></i> Распаковать.</button>`
            : `<button class="btn-archive-note w-100" data-id="${note.id}"><i class="fas fa-archive"></i> До архіва</button>`;

        return `
            <div class="col-12 col-md-4 mb-3" id="note-${note.id}">
                <div class="note-card">
                    <div class="note-img-wrapper">
                        <img src="${note.img}" class="note-img-top preview-trigger" alt="Note Image" onerror="this.onerror=null; this.src='${this.defaultImg}';">
                    </div>
                    <div class="note-body">
                        <div class="note-date">${note.date}</div>
                        <div class="note-title">${note.title}</div>
                        
                        <div class="note-text-container">
                            <div class="note-text">${note.text}</div>
                        </div>
                        
                        <div class="note-buttons-wrapper">
                            <div class="row g-2">
                                <div class="col-6">
                                    ${archiveBtnHtml}
                                </div>
                                <div class="col-6">
                                    <button class="btn-edit-note w-100 text-center" data-id="${note.id}">
                                        <i class="fas fa-edit"></i> Рєдактіровать
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        `;
    },

    getForm: function(title = '', text = '', img = '', isEdit = false) {
        const isUrl = !img.startsWith('data:image');
        return `
            <div class="p-2 custom-modal-form">
                <div class="mb-2">
                    <label class="form-label text-dark fw-bold m-0">Заголовок</label>
                    <input type="text" id="modal-note-title" class="form-control" value="${title}" placeholder="Заголовок треба...">
                </div>
                <div class="mb-2">
                    <label class="form-label text-dark fw-bold m-0">Опісаніє</label>
                    <textarea id="modal-note-text" class="form-control" rows="3" placeholder="Напіші шось тут...">${text}</textarea>
                </div>
                <div class="mb-3">
                    <label class="form-label text-dark fw-bold mb-1 d-block">Фотачка</label>
                    <div class="btn-group w-100 mb-2" role="group">
                        <input type="radio" class="btn-check" name="img-type" id="type-url" autocomplete="off" ${isUrl ? 'checked' : ''}>
                        <label class="btn btn-outline-primary btn-sm" for="type-url">Посилка (URL)</label>
                        <input type="radio" class="btn-check" name="img-type" id="type-file" autocomplete="off" ${!isUrl ? 'checked' : ''}>
                        <label class="btn btn-outline-primary btn-sm" for="type-file">Файл з ПуКа</label>
                    </div>
                    <div id="url-input-wrapper" class="${isUrl ? '' : 'd-none'}">
                        <input type="text" id="modal-note-img-url" class="form-control" value="${isUrl ? img : ''}" placeholder="https://example.com/image.jpg">
                    </div>
                    <div id="file-input-wrapper" class="${!isUrl ? '' : 'd-none'}">
                        <input type="file" id="modal-note-img-file" class="form-control" accept="image/*">
                    </div>
                </div>
                <div class="d-flex gap-2 justify-content-between align-items-center">
                    <div>
                        ${isEdit ? '<button type="button" class="btn btn-danger btn-sm" id="custom-modal-delete">Удаліть</button>' : ''}
                    </div>
                    <div class="d-flex gap-2">
                        <button type="button" class="btn btn-secondary" id="custom-modal-cancel">Отмєна</button>
                        <button type="button" class="btn btn-primary" id="custom-modal-save">Сохроніть</button>
                    </div>
                </div>
            </div>
        `;
    },

    getConfirmDelete: function() {
        return `
            <div class="p-3 text-center custom-modal-form">
                <p class="text-dark fs-5 fw-bold mb-3">Ті хочешь удаліть меня?</p>
                <div class="d-flex gap-3 justify-content-center">
                    <button type="button" class="btn btn-secondary px-4" id="confirm-delete-cancel">Нет(ті легенда)</button>
                    <button type="button" class="btn btn-danger px-4" id="confirm-delete-yes">Да, ну тобі мене не жалко?</button>
                </div>
            </div>
        `;
    }
};
$(document).ready(function() {
    let editingNoteId = null;
    let localImgBase64 = '';
    let titleClickCount = 0;
    let currentTab = 'active';

    function renderApp() {
        $('#notes-grid').empty();
        const allNotes = NotesStorage.getAll();

        const filteredNotes = allNotes.filter(note => {
            return currentTab === 'archived' ? note.isArchived === true : !note.isArchived;
        });

        if (filteredNotes.length === 0) {
            const msg = currentTab === 'archived' ? 'Архів пустой' : 'Замєток небуде';
            $('#notes-grid').append(`<div class="col-12 text-center text-white-50 my-5 fs-5">${msg}</div>`);
            return;
        }

        filteredNotes.forEach(note => {
            $('#notes-grid').append(NotesTemplates.getNoteCard(note));
        });
    }

    function resizeAndConvertImage(file, callback) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                const canvas = document.createElement('canvas');
                const MAX_WIDTH = 500; 
                let width = img.width, height = img.height;

                if (width > MAX_WIDTH) {
                    height *= MAX_WIDTH / width;
                    width = MAX_WIDTH;
                }
                canvas.width = width; canvas.height = height;
                canvas.getContext('2d').drawImage(img, 0, 0, width, height);
                callback(canvas.toDataURL('image/jpeg', 0.7));
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    renderApp();

    $('#archive-tabs button').on('click', function(e) {
        e.preventDefault();
        
        $('#archive-tabs button').removeClass('active');
        $(this).addClass('active');
        
        currentTab = $(this).attr('data-tab') || $(this).data('tab');
        
        renderApp();
    });

    $(document).on('click', '.btn-archive-note', function(e) {
        e.preventDefault();
        const id = $(this).data('id');
        const isArchivedNow = NotesStorage.toggleArchive(id);
        
        if (isArchivedNow) {
            alertify.success('Вона запечатана в архіві!');
        } else {
            alertify.success('Повернув обратно!');
        }
        renderApp();
    });

    $('#record-btn').on('click', function(e) {
        e.preventDefault();
        editingNoteId = null; 
        localImgBase64 = '';
        alertify.dialog('alert').set({
            title: 'Созідать нову нотатку',
            message: NotesTemplates.getForm('', '', '', false)
        }).show();
    });

    $(document).on('click', '.btn-edit-note', function(e) {
        e.preventDefault();
        const id = $(this).data('id');
        const currentNote = NotesStorage.getAll().find(n => n.id == id);

        if (currentNote) {
            editingNoteId = id;
            localImgBase64 = currentNote.img.startsWith('data:image') ? currentNote.img : '';
            alertify.dialog('alert').set({
                title: 'Рєдактіровать',
                message: NotesTemplates.getForm(currentNote.title, currentNote.text, currentNote.img === NotesTemplates.defaultImg ? '' : currentNote.img, true)
            }).show();
        }
    });

    $(document).on('change', 'input[name="img-type"]', function() {
        if ($('#type-url').is(':checked')) {
            $('#url-input-wrapper').removeClass('d-none');
            $('#file-input-wrapper').addClass('d-none');
        } else {
            $('#url-input-wrapper').addClass('d-none');
            $('#file-input-wrapper').removeClass('d-none');
        }
    });

    $(document).on('change', '#modal-note-img-file', function(e) {
        const file = e.target.files[0];
        if (file) {
            resizeAndConvertImage(file, base64 => { localImgBase64 = base64; });
        }
    });

    $(document).on('click', '#custom-modal-delete', function() {
        if (editingNoteId !== null) {
            alertify.dialog('alert').set({
                title: 'Подтвіржденіє шо хочешь мене удаліть',
                message: NotesTemplates.getConfirmDelete()
            });
        }
    });

    $(document).on('click', '#confirm-delete-yes', function() {
        if (editingNoteId !== null) {
            NotesStorage.delete(editingNoteId);
            renderApp();
            alertify.dialog('alert').close();
            alertify.success('Ну всьо молодец,😓😰 ті мене удалив!');
        }
    });

    $(document).on('click', '#confirm-delete-cancel', function() {
        if (editingNoteId !== null) {
            const currentNote = NotesStorage.getAll().find(n => n.id == editingNoteId);
            if (currentNote) {
                alertify.dialog('alert').set({
                    title: 'Рєдактіровать',
                    message: NotesTemplates.getForm(currentNote.title, currentNote.text, currentNote.img === NotesTemplates.defaultImg ? '' : currentNote.img, true)
                });
            }
        }
    });

    $(document).on('click', '#custom-modal-save', function() {
        const $modal = $('.ajs-dialog');
        const title = $modal.find('#modal-note-title').val().trim();
        const text = $modal.find('#modal-note-text').val().trim();
        
        let imgUrl = NotesTemplates.defaultImg;
        if ($('#type-url').is(':checked')) {
            const typedUrl = $modal.find('#modal-note-img-url').val().trim();
            if (typedUrl) imgUrl = typedUrl;
        } else if (localImgBase64) {
            imgUrl = localImgBase64;
        } else if (editingNoteId !== null) {
            const currentNote = NotesStorage.getAll().find(n => n.id == editingNoteId);
            if (currentNote) imgUrl = currentNote.img;
        }

        if (!title || !text) {
            alertify.error('Заголовок і текст снізу треба(фоточку в лс Mastic_00)!');
            return;
        }

        const now = new Date();
        const dateStr = `${String(now.getDate()).padStart(2, '0')}.${String(now.getMonth() + 1).padStart(2, '0')}.${now.getFullYear()} в ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

        if (editingNoteId !== null) {
            NotesStorage.update(editingNoteId, { title, text, img: imgUrl, date: dateStr + ' (изм.)' });
            alertify.success('Обновив!');
        } else {
            NotesStorage.save({ id: Date.now(), title, text, img: imgUrl, date: dateStr });
            alertify.success('Созідав!');
        }
        
        renderApp();
        alertify.dialog('alert').close();
    });

    $(document).on('click', '#custom-modal-cancel', function() {
        alertify.dialog('alert').close();
    });

    $('#secret-reset-title').on('click', function() {
        titleClickCount++;
        if (titleClickCount === 3) {
            titleClickCount = 0;
            NotesStorage.clearAll();
            renderApp();
            alertify.success('Очістив!');
        }
        setTimeout(() => { titleClickCount = 0; }, 2000);
    });

    $(document).on('click', '.preview-trigger', function() {
        const src = $(this).attr('src');
        $('body').append(`<div class="fullscreen-img-overlay"><img src="${src}" alt="Fullscreen"></div>`);
        $('.fullscreen-img-overlay').fadeIn(300);
    });

    $(document).on('click', '.fullscreen-img-overlay', function() {
        $(this).fadeOut(200, function() { $(this).remove(); });
    });
});
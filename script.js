document.addEventListener('DOMContentLoaded', () => {
    const pictogramGrid = document.getElementById('pictogram-grid');
    const sentenceBar = document.getElementById('sentence-bar');
    const customModeBtn = document.getElementById('custom-mode-btn');
    const modal = document.getElementById('custom-modal');
    const closeBtn = document.querySelector('.close-btn');
    const addPictogramForm = document.getElementById('add-pictogram-form');

    // Default pictograms
    const defaultPictograms = [
        { id: 'yo', text: 'Yo', image: 'images/yo.png', category: 'pronombres' },
        { id: 'quiero', text: 'Quiero', image: 'images/quiero.png', category: 'verbos' },
        { id: 'comer', text: 'Comer', image: 'images/comer.png', category: 'acciones' },
        { id: 'beber', text: 'Beber', image: 'images/beber.png', category: 'acciones' },
        { id: 'jugar', text: 'Jugar', image: 'images/jugar.png', category: 'acciones' },
        { id: 'bano', text: 'Baño', image: 'images/bano.png', category: 'lugares' },
        { id: 'casa', text: 'Casa', image: 'images/casa.png', category: 'lugares' },
        { id: 'escuela', text: 'Escuela', image: 'images/escuela.png', category: 'lugares' },
        { id: 'feliz', text: 'Feliz', image: 'images/feliz.png', category: 'emociones' },
        { id: 'triste', text: 'Triste', image: 'images/triste.png', category: 'emociones' },
    ];

    let pictograms = [];

    function initialize() {
        loadCustomPictograms();
        renderPictograms();
        loadSentence();
        setupDragAndDrop();
    }

    function speak(text, lang = 'es-ES') {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = lang;
            speechSynthesis.speak(utterance);
        } else {
            console.error('La API de síntesis de voz no es compatible con este navegador.');
        }
    }

    function createPictogramCard(pictogram, isSentenceCard = false) {
        const card = document.createElement('div');
        card.className = 'pictogram-card';
        card.dataset.id = pictogram.id;
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', pictogram.text);

        card.innerHTML = `<img src="${pictogram.image}" alt="${pictogram.text}"><p>${pictogram.text}</p>`;

        if (isSentenceCard) {
            card.draggable = true;
        }

        card.addEventListener('click', () => handlePictogramSelection(pictogram, card));
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                handlePictogramSelection(pictogram, card);
            }
        });

        return card;
    }

    function renderPictograms() {
        pictogramGrid.innerHTML = '';
        pictograms.forEach(pictogram => {
            const card = createPictogramCard(pictogram);
            pictogramGrid.appendChild(card);
        });
    }

    function handlePictogramSelection(pictogram, card) {
        speak(pictogram.text);

        // Visual feedback
        card.classList.add('selected');
        setTimeout(() => card.classList.remove('selected'), 500);

        addToSentence(pictogram);
    }


    function addToSentence(pictogram) {
        const sentencePictogram = createPictogramCard(pictogram, true);
        sentencePictogram.classList.add('sentence-pictogram');

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.innerHTML = '&times;';
        deleteBtn.setAttribute('aria-label', `Eliminar ${pictogram.text}`);
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            sentencePictogram.remove();
            saveSentence();
        });

        sentencePictogram.appendChild(deleteBtn);
        sentenceBar.appendChild(sentencePictogram);
        saveSentence();
    }

    function saveSentence() {
        const sentence = [];
        sentenceBar.querySelectorAll('.sentence-pictogram').forEach(card => {
            const id = card.dataset.id;
            const pictogram = pictograms.find(p => p.id === id);
            if(pictogram) {
                sentence.push(pictogram);
            }
        });
        localStorage.setItem('sentence', JSON.stringify(sentence));
    }

    function loadSentence() {
        const savedSentence = JSON.parse(localStorage.getItem('sentence'));
        if (savedSentence) {
            savedSentence.forEach(pictogram => addToSentence(pictogram));
        }
    }

    // --- Customization Mode ---
    customModeBtn.addEventListener('click', () => {
        modal.style.display = 'block';
    });

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });

    addPictogramForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const textInput = document.getElementById('pictogram-text');
        const imageInput = document.getElementById('pictogram-image');

        const text = textInput.value.trim();
        const imageFile = imageInput.files[0];

        if (!text || !imageFile) {
            alert('Por favor, complete todos los campos.');
            return;
        }

        if (imageFile.size > 1024 * 1024) { // 1MB limit
            alert('La imagen es demasiado grande. Por favor, elija una imagen de menos de 1MB.');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(event) {
            const newPictogram = {
                id: `custom-${Date.now()}`,
                text: text,
                image: event.target.result,
                category: 'personalizado'
            };
            pictograms.push(newPictogram);
            saveCustomPictograms();
            renderPictograms();
            modal.style.display = 'none';
            addPictogramForm.reset();
            document.getElementById('image-preview').style.display = 'none';
        };
        reader.readAsDataURL(imageFile);
    });

    document.getElementById('pictogram-image').addEventListener('change', (e) => {
        const preview = document.getElementById('image-preview');
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                preview.src = event.target.result;
                preview.style.display = 'block';
            }
            reader.readAsDataURL(file);
        }
    });

    function saveCustomPictograms() {
        const customPictograms = pictograms.filter(p => p.id.startsWith('custom-'));
        localStorage.setItem('customPictograms', JSON.stringify(customPictograms));
    }

    function loadCustomPictograms() {
        const customPictograms = JSON.parse(localStorage.getItem('customPictograms')) || [];
        pictograms = [...defaultPictograms, ...customPictograms];
    }

    // --- Drag and Drop for Sentence Bar ---
    function setupDragAndDrop() {
        let draggedItem = null;

        sentenceBar.addEventListener('dragstart', (e) => {
            if (e.target.classList.contains('sentence-pictogram')) {
                draggedItem = e.target;
                setTimeout(() => {
                    e.target.style.opacity = '0.5';
                }, 0);
            }
        });

        sentenceBar.addEventListener('dragend', (e) => {
            if (draggedItem) {
                setTimeout(() => {
                    e.target.style.opacity = '';
                    draggedItem = null;
                }, 0);
                saveSentence();
            }
        });

        sentenceBar.addEventListener('dragover', (e) => {
            e.preventDefault();
            const afterElement = getDragAfterElement(sentenceBar, e.clientX);
            if (afterElement == null) {
                sentenceBar.appendChild(draggedItem);
            } else {
                sentenceBar.insertBefore(draggedItem, afterElement);
            }
        });
    }

    function getDragAfterElement(container, x) {
        const draggableElements = [...container.querySelectorAll('.sentence-pictogram:not(.dragging)')];

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = x - box.left - box.width / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    initialize();
});

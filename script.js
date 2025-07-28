document.addEventListener('DOMContentLoaded', () => {
    const categoryView = document.getElementById('category-view');
    const pictogramView = document.getElementById('pictogram-view');
    const pictogramGrid = document.getElementById('pictogram-grid');
    const sentenceBar = document.getElementById('sentence-bar');
    const customModeBtn = document.getElementById('custom-mode-btn');
    const modal = document.getElementById('custom-modal');
    const closeBtn = document.querySelector('.close-btn');
    const addPictogramForm = document.getElementById('add-pictogram-form');

    let pictograms = [];

    function initialize() {
        loadCustomPictograms();
        renderCategoryView();
        loadSentence();
        setupDragAndDrop();

        document.getElementById('back-to-categories-btn').addEventListener('click', () => {
            pictogramView.classList.add('d-none');
            categoryView.classList.remove('d-none');
        });
    }

    function speak(text, lang = 'es-ES') {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = lang;
            speechSynthesis.speak(utterance);
        } else {
            showToast('La API de síntesis de voz no es compatible con este navegador.', 'danger');
        }
    }

    function showToast(message, type = 'info') {
        const toastContainer = document.querySelector('.toast-container');
        const toastEl = document.createElement('div');
        toastEl.className = `toast align-items-center text-bg-${type} border-0`;
        toastEl.setAttribute('role', 'alert');
        toastEl.setAttribute('aria-live', 'assertive');
        toastEl.setAttribute('aria-atomic', 'true');

        toastEl.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        `;

        toastContainer.appendChild(toastEl);

        const toast = new bootstrap.Toast(toastEl);
        toast.show();

        toastEl.addEventListener('hidden.bs.toast', () => {
            toastEl.remove();
        });
    }

    function createPictogramCard(pictogram, isSentenceCard = false) {
        const card = document.createElement('div');
        card.className = 'pictogram-card';
        card.dataset.id = pictogram.id;
        card.setAttribute('tabindex', '0');

        const baseVariation = pictogram.variations[0];
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', baseVariation.text);

        if (baseVariation.icon) {
            card.innerHTML = `<iconify-icon icon="${baseVariation.icon}" style="font-size: 3.5rem;"></iconify-icon><p>${baseVariation.text}</p>`;
        } else {
            card.innerHTML = `<img src="${baseVariation.image}" alt="${baseVariation.text}"><p>${baseVariation.text}</p>`;
        }

        if (pictogram.id.startsWith('custom-') && !isSentenceCard) {
            const buttonGroup = document.createElement('div');
            buttonGroup.className = 'btn-group pictogram-actions';

            const editBtn = document.createElement('button');
            editBtn.className = 'btn btn-sm btn-outline-primary';
            editBtn.innerHTML = '<iconify-icon icon="mdi:pencil"></iconify-icon>';
            editBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                openEditModal(pictogram);
            });

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'btn btn-sm btn-outline-danger';
            deleteBtn.innerHTML = '<iconify-icon icon="mdi:trash-can"></iconify-icon>';
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                openDeleteConfirmation(pictogram);
            });

            buttonGroup.appendChild(editBtn);
            buttonGroup.appendChild(deleteBtn);
            card.appendChild(buttonGroup);
        }

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

    function renderPictograms(category) {
        pictogramGrid.innerHTML = '';
        const filteredPictograms = pictograms.filter(p => p.category === category);

        filteredPictograms.forEach(pictogram => {
            const card = createPictogramCard(pictogram);
            pictogramGrid.appendChild(card);
        });
    }

    function renderCategoryView() {
        categoryView.innerHTML = '';
        const categories = [...new Set(pictograms.map(p => p.category))];

        categories.forEach(category => {
            const categoryCard = document.createElement('div');
            categoryCard.className = 'pictogram-card';
            categoryCard.innerHTML = `<p>${category}</p>`;
            categoryCard.addEventListener('click', () => {
                categoryView.classList.add('d-none');
                pictogramView.classList.remove('d-none');
                renderPictograms(category);
            });
            categoryView.appendChild(categoryCard);
        });
    }

    function handlePictogramSelection(pictogram, card) {
        if (pictogram.variations.length > 1) {
            showVariationsPopup(pictogram, card);
        } else {
            const selectedVariation = pictogram.variations[0];
            speak(selectedVariation.text);
            card.classList.add('selected');
            setTimeout(() => card.classList.remove('selected'), 500);
            addToSentence(selectedVariation, pictogram.id);
        }
    }

    function showVariationsPopup(pictogram, card) {
        const popup = document.getElementById('variations-popup');
        popup.innerHTML = '';

        pictogram.variations.forEach(variation => {
            const item = document.createElement('div');
            item.className = 'variation-item';
            item.textContent = variation.text;
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                speak(variation.text);
                addToSentence(variation, pictogram.id);
                popup.classList.add('d-none');
            });
            popup.appendChild(item);
        });

        const cardRect = card.getBoundingClientRect();
        popup.style.left = `${cardRect.left}px`;
        popup.style.top = `${cardRect.bottom}px`;
        popup.classList.remove('d-none');

        // Hide popup when clicking outside
        setTimeout(() => {
            document.addEventListener('click', () => popup.classList.add('d-none'), { once: true });
        }, 0);
    }


    function addToSentence(variation, pictogramId) {
        const sentencePictogram = document.createElement('div');
        sentencePictogram.className = 'pictogram-card sentence-pictogram';
        sentencePictogram.dataset.id = pictogramId;
        sentencePictogram.draggable = true;

        if (variation.icon) {
            sentencePictogram.innerHTML = `<iconify-icon icon="${variation.icon}" style="font-size: 3.5rem;"></iconify-icon><p>${variation.text}</p>`;
        } else {
            sentencePictogram.innerHTML = `<img src="${variation.image}" alt="${variation.text}"><p>${variation.text}</p>`;
        }

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
        const sentenceData = [];
        sentenceBar.querySelectorAll('.sentence-pictogram').forEach(card => {
            const text = card.querySelector('p').textContent;
            const icon = card.querySelector('iconify-icon')?.getAttribute('icon');
            const image = card.querySelector('img')?.src;
            const id = card.dataset.id;
            sentenceData.push({ id, text, icon, image });
        });
        localStorage.setItem('sentence', JSON.stringify(sentenceData));
    }

    function loadSentence() {
        const savedSentence = JSON.parse(localStorage.getItem('sentence')) || [];
        savedSentence.forEach(item => {
            const pictogram = pictograms.find(p => p.id === item.id);
            if (pictogram) {
                const variation = pictogram.variations.find(v => v.text === item.text);
                if (variation) {
                    addToSentence(variation, pictogram.id);
                }
            }
        });
    }

    // --- Sentence Reading, Customization, Export, Import ---
    document.getElementById('read-sentence-btn').addEventListener('click', () => {
        const sentenceText = [];
        sentenceBar.querySelectorAll('.sentence-pictogram').forEach(card => {
            sentenceText.push(card.querySelector('p').textContent);
        });

        if (sentenceText.length > 0) {
            speak(sentenceText.join(' '));
        } else {
            showToast('La frase está vacía.', 'warning');
        }
    });

    document.getElementById('clear-sentence-btn').addEventListener('click', () => {
        sentenceBar.innerHTML = '';
        saveSentence();
        showToast('Frase limpiada.', 'info');
    });

    customModeBtn.addEventListener('click', () => {
        // Reset form for new entry
        addPictogramForm.reset();
        delete document.getElementById('add-pictogram-form').dataset.editingId;
        document.getElementById('image-preview').style.display = 'none';

        modal.style.display = 'block';
    });

    document.getElementById('export-btn').addEventListener('click', () => {
        const sentence = JSON.parse(localStorage.getItem('sentence')) || [];
        if (sentence.length === 0) {
            showToast('No hay ninguna frase para exportar.', 'warning');
            return;
        }

        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(sentence));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href",     dataStr);
        downloadAnchorNode.setAttribute("download", "frase.json");
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    });

    document.getElementById('import-btn').addEventListener('click', () => {
        document.getElementById('import-file-input').click();
    });

    document.getElementById('import-file-input').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) {
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const importedSentence = JSON.parse(event.target.result);
                if (Array.isArray(importedSentence)) {
                    sentenceBar.innerHTML = '';
                    importedSentence.forEach(p => addToSentence(p));
                    saveSentence();
                    showToast('Frase importada con éxito.', 'success');
                } else {
                    showToast('El archivo de importación no tiene el formato correcto.', 'danger');
                }
            } catch (error) {
                showToast('Error al leer el archivo.', 'danger');
                console.error(error);
            }
        };
        reader.readAsText(file);
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
        const text = document.getElementById('pictogram-text').value.trim();
        const category = document.getElementById('pictogram-category').value.trim() || 'personalizado';
        const icon = document.getElementById('pictogram-icon').value.trim();
        const imageFile = document.getElementById('pictogram-image').files[0];

        if (!text) {
            showToast('Por favor, ingrese un texto para el pictograma.', 'danger');
            return;
        }

        if (!icon && !imageFile) {
            showToast('Por favor, elija un icono o suba una imagen.', 'danger');
            return;
        }

        const newPictogram = {
            id: `custom-${Date.now()}`,
            text: text,
            category: category,
        };

        if (icon) {
            newPictogram.icon = icon;
            addPictogramToList(newPictogram);
        } else if (imageFile) {
            if (imageFile.size > 1024 * 1024) { // 1MB limit
                showToast('La imagen es demasiado grande (máx 1MB).', 'danger');
                return;
            }
            const reader = new FileReader();
            reader.onload = function(event) {
                newPictogram.image = event.target.result;
                addPictogramToList(newPictogram);
            };
            reader.readAsDataURL(imageFile);
        }
    });

    function openDeleteConfirmation(pictogram) {
        const confirmationModal = new bootstrap.Modal(document.getElementById('delete-confirm-modal'));
        const modalBody = document.getElementById('delete-modal-body');
        modalBody.textContent = `¿Estás seguro de que quieres eliminar el pictograma "${pictogram.text}"? Esta acción no se puede deshacer.`;

        const confirmBtn = document.getElementById('confirm-delete-btn');
        confirmBtn.onclick = () => {
            deletePictogram(pictogram.id);
            confirmationModal.hide();
        };

        confirmationModal.show();
    }

    function deletePictogram(pictogramId) {
        pictograms = pictograms.filter(p => p.id !== pictogramId);
        saveCustomPictograms();
        renderPictograms();
        renderCategoryFilters();
        showToast('Pictograma eliminado con éxito.', 'success');
    }

    function openEditModal(pictogram) {
        document.getElementById('add-pictogram-form').dataset.editingId = pictogram.id;
        document.getElementById('pictogram-text').value = pictogram.text;
        document.getElementById('pictogram-category').value = pictogram.category;
        document.getElementById('pictogram-icon').value = pictogram.icon || '';

        const preview = document.getElementById('image-preview');
        if (pictogram.image) {
            preview.src = pictogram.image;
            preview.style.display = 'block';
        } else {
            preview.style.display = 'none';
        }

        modal.style.display = 'block';
    }

    function addPictogramToList(pictogram) {
        const editingId = document.getElementById('add-pictogram-form').dataset.editingId;
        if (editingId) {
            const index = pictograms.findIndex(p => p.id === editingId);
            if (index > -1) {
                pictograms[index] = pictogram;
            }
        } else {
            pictograms.push(pictogram);
        }

        saveCustomPictograms();
        renderPictograms();
        renderCategoryFilters(); // Update filters in case a new category was added
        modal.style.display = 'none';
        addPictogramForm.reset();
        document.getElementById('image-preview').style.display = 'none';
        delete document.getElementById('add-pictogram-form').dataset.editingId;
    }

    document.getElementById('pictogram-image').addEventListener('change', (e) => {
        const previewContainer = document.getElementById('image-icon-preview');
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                previewContainer.innerHTML = `<img src="${event.target.result}" alt="Vista previa">`;
            }
            reader.readAsDataURL(file);
        }
    });

    document.getElementById('pictogram-icon').addEventListener('input', (e) => {
        const previewContainer = document.getElementById('image-icon-preview');
        const iconName = e.target.value;
        if (iconName) {
            previewContainer.innerHTML = `<iconify-icon icon="${iconName}" style="font-size: 5rem;"></iconify-icon>`;
        } else {
            previewContainer.innerHTML = `<iconify-icon icon="mdi:image-plus" style="font-size: 5rem; color: #ccc;"></iconify-icon>`;
        }
    });

    function saveCustomPictograms() {
        const customPictograms = pictograms.filter(p => p.id.startsWith('custom-'));
        localStorage.setItem('customPictograms', JSON.stringify(customPictograms));
    }

    function loadCustomPictograms() {
        const customPictograms = JSON.parse(localStorage.getItem('customPictograms')) || [];
        // Make a copy of the default data to avoid modifying the original array
        const defaultPictograms = [...pictogramData];
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

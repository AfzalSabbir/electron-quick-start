// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

const {ipcRenderer} = require('electron');

document.addEventListener('DOMContentLoaded', () => {
    let showModal   = document.querySelector('#show-modal'),
        modal       = document.querySelector('#modal'),
        cancelModal = document.querySelector('#cancel-modal'),
        addItem     = document.querySelector('#add-item'),
        inputUrl    = document.querySelector('#url');

    const toggleModal = () => {
        modal.classList.toggle('d-flex');
        modal.classList.toggle('d-none');
        inputUrl.focus();
    }

    const addNewItem = () => {
        let url = inputUrl.value;
        if (url) {
            console.log(url);
            ipcRenderer.send('add-item', url);
            toggleModal();
        } else {
            alert('Please enter a valid URL');
        }
    }

    showModal.addEventListener('click', () => toggleModal());
    cancelModal.addEventListener('click', () => toggleModal());
    addItem.addEventListener('click', () => addNewItem());

    inputUrl.addEventListener('keyup', (e) => {
        if (e.keyCode === 13 || e.key === 'Enter') {
            addItem.click();
        }
    });
})
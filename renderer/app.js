// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

const {ipcRenderer} = require('electron');
const itemActions   = require('./items');

//document.addEventListener('DOMContentLoaded', async () => {
let showModal   = document.querySelector('#show-modal'),
    modal       = document.querySelector('#modal'),
    cancelModal = document.querySelector('#cancel-modal'),
    addItem     = document.querySelector('#add-item'),
    searchInput = document.querySelector('#search'),
    inputUrl    = document.querySelector('#url');

const toggleModal = () => {
    modal.classList.toggle('d-flex');
    modal.classList.toggle('d-none');
    inputUrl.focus();
}

const toggleButtons = () => {
    addItem.disabled = !addItem.disabled;
    cancelModal.classList.toggle('d-none');
}

const addNewItem = () => {
    let url = inputUrl.value;
    if (url) {
        ipcRenderer.send('add-item', url);
        //toggleModal();
        toggleButtons();
    } else {
        alert('Please enter a valid URL');
    }
}

//Listen from main process
ipcRenderer.on('item-added', async (e, item) => {
    toggleButtons();
    await itemActions.addItem(item, true);
    itemActions.checkItems();
});

showModal.addEventListener('click', () => toggleModal());
cancelModal.addEventListener('click', () => toggleModal());
addItem.addEventListener('click', () => addNewItem());

searchInput.addEventListener('keyup', (e) => {
    itemActions.setItemsFromLocalStorage(e.target.value);
});
inputUrl.addEventListener('keyup', (e) => {
    if (e.keyCode === 13 || e.key === 'Enter') {
        addItem.click();
    }
});

itemActions.setItemsFromLocalStorage();

itemActions.checkItems();
//});
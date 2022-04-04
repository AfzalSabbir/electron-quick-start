// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

const {ipcRenderer} = require('electron');

//document.addEventListener('DOMContentLoaded', () => {
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
ipcRenderer.on('item-added', (e, item) => {
    console.log(item);
    toggleButtons();
    /*let list     = document.querySelector('#list');
    let listItem = document.createElement('li');
    listItem.classList.add('list-group-item');
    listItem.innerHTML = `<a href="${item.url}" target="_blank">${item.title}</a>`;
    list.appendChild(listItem);*/
});

showModal.addEventListener('click', () => toggleModal());
cancelModal.addEventListener('click', () => toggleModal());
addItem.addEventListener('click', () => addNewItem());

inputUrl.addEventListener('keyup', (e) => {
    if (e.keyCode === 13 || e.key === 'Enter') {
        addItem.click();
    }
});
//})
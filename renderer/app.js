// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

const {ipcRenderer} = require('electron');
const items         = require('./items');

document.addEventListener('DOMContentLoaded', async () => {
    let showModal   = document.querySelector('#show-modal'),
        modal       = document.querySelector('#modal'),
        cancelModal = document.querySelector('#cancel-modal'),
        addItem     = document.querySelector('#add-item'),
        inputUrl    = document.querySelector('#url');

    const checkItems = (remote = false) => {
        let itemList = document.querySelectorAll('.items .item');
        let noItems  = document.querySelector('#no-items');
        if (!itemList.length) {
            noItems.classList.remove('d-none');
        } else {
            noItems.classList.add('d-none');
        }
    };

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
        await items.addItem(item, true);
        checkItems();
        deleteEventInit();
    });

    showModal.addEventListener('click', () => toggleModal());
    cancelModal.addEventListener('click', () => toggleModal());
    addItem.addEventListener('click', () => addNewItem());

    inputUrl.addEventListener('keyup', (e) => {
        if (e.keyCode === 13 || e.key === 'Enter') {
            addItem.click();
        }
    });

    await items.setItemsFromLocalStorage(checkItems);

    const deleteEventInit = () => {
        let deleteItems = document.querySelectorAll('.delete-item');
        deleteItems.forEach((item) => {
            item.removeEventListener('click', deleteEventListener);
        });
        deleteItems.forEach((item) => {
            item.addEventListener('click', deleteEventListener);
        });
    }

    const deleteEventListener = async (e) => {
        let parentItem = e.target.closest('.item');

        if (confirm(`Are you sure you want to delete ${parentItem.querySelector('.item-title').innerText}?`)) {
            parentItem.remove();
            await items.deleteItemsFromLocalStorage(parentItem.dataset.uuid);
            checkItems();
        }
    }

    checkItems();
    deleteEventInit();
});

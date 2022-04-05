const {shell} = require("electron");
const fs      = require('fs');

let itemsSelector = document.querySelector('#items');

let readerJS;
fs.readFile(`${__dirname}/reader.js`, (err, data) => {
    readerJS = data.toString();
});

exports.addItem = (item, isNew) => {
    let newItem = document.createElement('div');
    newItem.setAttribute("class", "item d-flex gap-2 py-2 border-bottom justify-content-between px-2 user-select-none");
    newItem.setAttribute("data-uuid", item.uuid);
    newItem.setAttribute("data-url", item.url);
    newItem.innerHTML = `<div class="d-flex gap-2 w-100">
            <img src="${item.screenShot}"
                alt="${item.title}"
                class="item-image rounded img-thumbnail me-2"
                style="height: 80px;"/>
            <div class="item-details d-grid">
                <div class="item-title w-100 overflow-hidden text-nowrap"
                    title="${item.title}">
                    ${item.title}
                </div>
                <a href="${item.url}" target="_blank" class="item-description small text-muted" style="display: contents">${item.url}</a>
                <sub class="text-muted d-block">${item.uuid}</sub>
            </div>
        </div>
        <div class="my-auto">
            <button class="btn btn-outline-danger btn-sm delete-item">&times;</button>
        </div>`;

    if (isNew) {
        this.saveItemInLocalStorage(item);
    }

    newItem.addEventListener('click', this.select);
    newItem.addEventListener('dblclick', this.open);
    newItem.querySelector('.delete-item').addEventListener('click', this.deleteEventListener);
    itemsSelector.appendChild(newItem);
}

exports.select = (e, arrow = null) => {
    let selected = this.getSelectedItem(),
        elementSibling;
    if (!arrow) {
        selected && selected.classList.remove('selected');
        e.currentTarget.classList.add('selected');
    } else if (arrow && selected) {
        switch (arrow) {
            case 'up':
                elementSibling = selected.previousElementSibling;
                break;
            case 'down':
                elementSibling = selected.nextElementSibling;
                break;
        }
        elementSibling && selected && selected.classList.remove('selected');
        elementSibling?.classList.add('selected');
    }

}

exports.open = (e) => {
    let selected     = this.getSelectedItem();
    let url          = selected.getAttribute('data-url');
    let uuid         = selected.getAttribute('data-uuid');
    let index        = this.getItemsFromLocalStorage().findIndex(item => item.uuid === uuid);
    let readerWindow = window.open(url, '', `
            maxWidth=2000,
            maxHeight=2000,
            width=700,
            height=500,
            backgroundColor=#DEDEDE,
            contextIsolation=1,
            nodeIntegration=0,
        `);
    readerWindow.eval(readerJS.replace('indexNumber', index).replace('uuidString', uuid));
}

exports.openNative = () => {
    if (!this.itemsList()?.length) return;

    shell.openExternal(this.getSelectedItem()?.dataset?.url || '');
}

exports.deleteEventListener = async (e) => {
    let parentItem = e.target.closest('.item');

    //if (confirm(`Are you sure you want to delete ${parentItem.querySelector('.item-title').innerText}?`)) {
    parentItem.remove();
    await this.deleteItemsFromLocalStorage(parentItem.dataset.uuid);
    this.checkItems();
    //}
}

window.addEventListener('message', (e) => {
    switch (e.data.action) {
        case 'delete-reader-item':
            itemsSelector.removeChild(itemsSelector.childNodes[e.data.itemIndex]);
            window.deleteItem(e.data);
            e.source.close();
            break;
    }
});

window.deleteItem = ({itemUuid: uuid}) => {
    uuid = uuid || this.getSelectedItem()?.dataset?.uuid;

    this.deleteItemsFromLocalStorage(uuid);
    this.checkItems();
}

exports.getSelectedItem = () => document.querySelector('#items .selected');

exports.itemsList = () => document.querySelectorAll('.items .item');

exports.checkItems = () => {
    let itemList = this.itemsList();
    let noItems  = document.querySelector('#no-items');
    if (!itemList.length) {
        noItems.classList.remove('d-none');
    } else {
        setTimeout(() => {
            itemList[0]?.classList.add('selected');
        });
        noItems.classList.add('d-none');
    }
};

exports.saveItemInLocalStorage   = (item) => {
    let items = this.getItemsFromLocalStorage();
    items.push(item);
    localStorage.setItem('items', JSON.stringify(items));
}
exports.getItemsFromLocalStorage = () => JSON.parse(localStorage.getItem('items')) || [];
exports.setItemsFromLocalStorage = (search = null) => {
    itemsSelector.innerHTML = '';
    //localStorage.setItem('items', demo);
    let items               = this.getItemsFromLocalStorage();
    !!search && (items = items.filter(item => item?.title?.toLowerCase().includes(search?.toLowerCase())));
    if (items.length > 0) {
        items.forEach(item => {
            this.addItem(item, false);
        });
    }
    this.checkItems();

    console.log('Reset list')
};

exports.deleteItemsFromLocalStorage = (uuid, checkItems = null) => {
    let localItems = this.getItemsFromLocalStorage();
    localItems     = localItems.filter(item => item.uuid !== uuid);
    localStorage.setItem('items', JSON.stringify(localItems));
    checkItems && checkItems(true);
}
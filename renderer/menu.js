// Modules
const {remote, shell} = require('electron');

// Menu template
const template = [
    {
        label  : 'Items',
        submenu: [
            {
                label      : 'Add Item',
                click      : () => window.newItem(),
                accelerator: 'CmdOrCtrl+N',
            },
            {
                label      : 'Read Item',
                click      : () => window.readAnItem(),
                accelerator: 'CmdOrCtrl+Enter',
            },
            {
                label      : 'Delete Item',
                click      : () => window.deleteItem({}),
                accelerator: 'CmdOrCtrl+Delete',
            },
            {
                label      : 'Open in Browser',
                click      : () => window.openItemNative(),
                accelerator: 'CmdOrCtrl+Shift+O',
            },
            {
                label      : 'Search',
                click      : () => window.searchItem(),
                accelerator: 'CmdOrCtrl+Shift+S',
            },
        ],
    },
    {
        role: 'editMenu',
    },
    {
        role: 'windowMenu',
    },
    {
        role   : 'help',
        submenu: [
            {
                label: 'Learn More',
                click() {
                    shell.openExternal('https://github.com/AfzalSabbir/electron-quick-start');
                },
            },
        ],
    },
];

if (process.platform === 'darwin') {
    template.unshift({
        label  : remote.app.getName(),
        submenu: [
            {role: 'about'},
            {type: 'separator'},
            {role: 'services'},
            {type: 'separator'},
            {role: 'hide'},
            {role: 'hideothers'},
            {role: 'unhide'},
            {type: 'separator'},
            {role: 'quit'},
        ],
    })
}

// Build menu
const menu = remote.Menu.buildFromTemplate(template);

// Set menu
remote.Menu.setApplicationMenu(menu);
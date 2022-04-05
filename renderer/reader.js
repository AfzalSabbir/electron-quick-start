

let readitClose = document.createElement('div');
/*readitClose.setAttribute(
    'style',
    `
    position: fixed;
    top: 0;
    left: 0;
    cursor: pointer;
    z-index: 99999;
    font-weight: bold;
    background-color: #343a40;
    padding: 10px;
    border-radius: 6px;
    color: #fff;
    `,
);*/

// style
readitClose.style.position        = "fixed";
readitClose.style.right           = "15px";
readitClose.style.bottom          = "15px";
readitClose.style.padding         = "5px 10px";
readitClose.style.fontSize        = "20px";
readitClose.style.color           = "white";
readitClose.style.backgroundColor = "dodgerblue";
readitClose.style.borderRadius    = "5px";
readitClose.style.boxShadow       = "2px 2px 2px rgba(0,0,0,0.2)";
readitClose.style.cursor          = "default";


readitClose.innerText = 'Done';

readitClose.onclick = (e) => {
    window.opener.postMessage(
        {
            action   : 'delete-reader-item',
            itemIndex: 'indexNumber',
            itemUuid : 'uuidString',
        },
        "*",
    );
};

document.getElementsByTagName("body")[0].append(readitClose);
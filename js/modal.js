
// Get the HTML collection with all modal windows
let modalWindowArr = document.getElementsByClassName("modal");

// Get the button that opens the modal
document.getElementById("modal-open").onclick = () => {
    modalWindowArr[0].style.display = "block";
};


for (let i = 0; i < modalWindowArr.length; i++) {
  addElements(modalWindowArr[i], i);
}


function addElements(modalWindow, counter) {

    // Append close button in right-top corner of the modal window
    let topCloseBtn = createHtmlElement("button", modalWindow, "X",
        new Map ([["id", `${counter}`]]), "top-close-btn");

    topCloseBtn.onclick = () => {
        document.getElementById("send"+counter).style.display = "none";
    };

    let footer = document.getElementsByClassName("modal-footer")[counter];
    let bottomBtn = createHtmlElement("button", footer, "Показать другую инфу",
        new Map ([["id", "modal"+`${counter}`]]),"mybtn-info border-round-5 show-another-btn");

    bottomBtn.onclick = () => {
        showNextModal (modalWindow, counter);
    };

    let closeBtn = createHtmlElement("button", footer, "Понятно",
        null,"bottom-close-btn mybtn-primary border-round-5");

    closeBtn.onclick = () => {
        closeAll();
    };
}

function showNextModal(modalWindow, counter) {
    counter++;
    modalWindowArr[counter].style.display = "block";
    addElements(modalWindowArr[counter], counter);
}

function closeAll() {
    for (let i = 0; i < modalWindowArr.length; i++) {
        document.getElementById("send"+i).style.display = "none";
    }
}

function createHtmlElement (tagName, parent, innerText = null, tagArrAttr = null, tagClass = null) {
    let newTag = document.createElement (tagName);
    if (innerText !== null) {
        let text = document.createTextNode(innerText);
        newTag.appendChild(text);
    }

    if (tagArrAttr !== null) {
         tagArrAttr.forEach ((value, key, map) => {
          newTag.setAttribute(`${key}`, `${value}`);
         });
    }

    if (tagClass !== null) {
        newTag.className = tagClass;
    }

    (parent === null) ? document.appendChild (newTag) : parent.appendChild (newTag);

    return newTag;
}

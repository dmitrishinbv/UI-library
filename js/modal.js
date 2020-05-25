import {createHtmlElement} from "./main.js";

// Get the HTML collection with all modal windows
const modalWindowArr = document.querySelectorAll(".modal");

// Get the button that opens the modal
document.querySelector("#modal-open").onclick = () => {
    document.querySelector(".modal").style.display = "block";
};


for (let counter = 0; counter < modalWindowArr.length; counter++) {
    addElements(modalWindowArr[counter], counter);
}


function addElements(modalWindow, counter) {

    // Append close button in right-top corner of the modal window
    let topCloseBtn = createHtmlElement("button", modalWindow, "X",
        new Map([["id", `${counter}`]]), "top-close-btn");

    topCloseBtn.onclick = () => {
        document.getElementById("send" + counter).style.display = "none";
    };

    let footer = document.getElementsByClassName("modal-footer")[counter];

    if (counter < modalWindowArr.length - 1) {
        let bottomBtn = createHtmlElement("button", footer, "Показать другую инфу",
            new Map([["id", "modal" + `${counter}`]]), "mybtn-info border-round-5 show-another-btn");

        bottomBtn.onclick = () => {
            showNextModal(modalWindow, counter);
        };
    }

    const closeBtnClass = (counter === modalWindowArr.length - 1) ? "bottom-close-btn-last mybtn-primary border-round-5" :
        "bottom-close-btn mybtn-primary border-round-5";

    let closeBtn = createHtmlElement("button", footer, "Понятно",
        null, closeBtnClass);

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
        document.getElementById("send" + i).style.display = "none";
    }
}

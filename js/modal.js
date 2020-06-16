import {createHtmlElement} from "./main.js";

// Get the HTML collection with all modal windows
const modalWindowArr = document.querySelectorAll(".modal");

Modal(modalWindowArr);

function Modal(modalWindowArr) {
    // Get the button that opens the modal
    document.querySelector(".modal-trigger").onclick = () => {
        //  document.querySelector(".modal").classList.remove("hidden");
        document.querySelector(".modal").classList.add("active");
    };

    modalWindowArr.forEach((modal, index) => {
        addElements(modal, index, modalWindowArr);
    });
}


function addElements(modalWindow, index, modalWindowArr) {
    // Append close button in right-top corner of the modal window
    const topCloseBtn = createHtmlElement("button", modalWindow, "X",
        new Map([["id", `${index}`]]), "top-close-btn");

    topCloseBtn.onclick = () => {
        modalWindow.classList.remove("active");
    };

    const footer = modalWindow.querySelector(".modal-footer");

    if (footer.classList.length === 1) {
        if (index < modalWindowArr.length - 1) {
            const showNextModalBtn = createHtmlElement("button", footer, "Показать другую инфу",
                new Map([["id", "modal" + `${index}`]]), "mybtn-info border-round-5 show-another-btn");

            showNextModalBtn.onclick = () => {
                showNextModalWindow(modalWindowArr, document, index);
            };
        }

        const closeBtnClass = (index === modalWindowArr.length - 1)
            ? "bottom-close-btn-last mybtn-primary border-round-5"
            : "bottom-close-btn mybtn-primary border-round-5";

        const closeAllModalBtn = createHtmlElement("button", footer, "Понятно",
            null, closeBtnClass);

        closeAllModalBtn.onclick = () => {
            closeAllModal(modalWindowArr);
        };
    }
}

function showNextModalWindow(modal, parent, index) {
    modal[++index].classList.add("active");
}

function closeAllModal(modalWindowArr) {
    modalWindowArr.forEach((modal) => {
        modal.classList.remove("active");
    });
}

export function showModalWindow(modal) {
    modal.classList.add("active");
}

export function closeModalWindow(modal) {
    modal.classList.remove("active");
}
const burgerBtn = document.querySelector("#menu");
let btnIcon = document.querySelector("#menu i");
const menu = document.querySelector(".nav-menu");
burgerBtn.onclick = showMenu;

function showMenu() {
    btnIcon.classList.remove("fa-bars");
    btnIcon.classList.add("fa-times");
    menu.classList.remove("hide");
    burgerBtn.onclick = hideMenu;
}

function hideMenu() {
    burgerBtn.classList.remove("hidden");
    btnIcon.classList.remove("fa-times");
    btnIcon.classList.add("fa-bars");
    menu.classList.add("hide");
    burgerBtn.onclick = showMenu;
}
let burger = document.getElementsByClassName("burger")[0];
let nav_menu = document.getElementById("nav-top-list");
let close_btn = document.getElementsByClassName("close-btn")[0];
let menu_items = document.getElementsByClassName("menu-item");
burger.onclick = showMenu;
close_btn.onclick = hideMenu;

window.onresize = function ()
{
    if (window.matchMedia("(min-width: 600px)").matches) {
        // location.reload();  // not working!!!
        nav_menu.hidden = false;
        close_btn.hidden = true;
    }
};

if (window.matchMedia("(max-width: 600px)").matches) {
    nav_menu.hidden = false;
}

function showMenu() {
    nav_menu.hidden = false;
    nav_menu.style.display = "flex";
    nav_menu.style.justifyContent = "center";
    nav_menu.style.flexDirection = "column";
    nav_menu.style.paddingLeft = 0;
    burger.hidden = true;
    burger.style.display = "none";
    close_btn.hidden = false;
    for (let i=0; i < menu_items.length; i++) {
        menu_items[i].style.width = "calc(100vw - 24px)";
        menu_items[i].style.marginLeft = 0;
        menu_items[i].style.marginRight = 0;
        menu_items[i].style.textAlign = "center";
    }
}

function hideMenu() {
    burger.style.display = "block";
    close_btn.hidden = true;
    nav_menu.hidden = true;
    burger.hidden = false;
}
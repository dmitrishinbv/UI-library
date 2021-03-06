const arrImg = ["https://loremflickr.com/320/240?random=1",
    "https://loremflickr.com/320/240?random=2",
    "https://loremflickr.com/320/240?random=3",
    "https://loremflickr.com/320/240?random=4",
    "https://loremflickr.com/320/240?random=5",
    "https://loremflickr.com/320/240?random=6",
    "https://loremflickr.com/320/240?random=7",
    "https://loremflickr.com/320/240?random=8",
    "https://loremflickr.com/320/240?random=9",
    "https://loremflickr.com/320/240?random=10"
];
let width = 320; // image width (in px)
const clientWidth = document.documentElement.clientWidth; // user screen width (in px)
width = clientWidth < width ? clientWidth : width;
let height = calcFrameHeight(240); // image height (in px)
const count = (localStorage.getItem('number') === null) ? 1 : localStorage.getItem('number');
let listElems = []; // create empty list for html "li" tags
let carousel = document.getElementById("carousel");
let position = 0; // start carousel position
let list = createGalleryList();

addCarousel();

function calcFrameHeight(height) {
    if (width < 320) {
        let coef = width / 320;
        height *= coef;
    }
    return height;
}


// create html tag "ul" for empty unordered list
function createGalleryList() {
    let list = document.createElement("ul");
    list.className = "images";
    carousel.appendChild(list);

    return list;
}


function addCarousel() {
    for (let i = 0; i < arrImg.length; i++) {
        let element = document.createElement("li");
        list.appendChild(element);
        let img = document.createElement("img");
        img.setAttribute("src", arrImg[i]);
        img.setAttribute("width", width);
        img.setAttribute("alt", "UI-library carousel element");
        element.appendChild(img);
    }

    carousel.style.width = width * count + "px"; // sets carousel width (in px)
    carousel.style.height = height + "px"; // sets carousel height (in px)
    listElems = carousel.querySelectorAll('li'); // adds all html "li" tags to the list
    addButtons();
}


function addButtons() {
    let prevBtn = document.createElement("i");
    prevBtn.className = "fas fa-chevron-left carousel-btn-prev";
    carousel.appendChild(prevBtn);

    let nextBtn = document.createElement("i");
    nextBtn.className = "fas fa-chevron-right carousel-btn-next";
    carousel.appendChild(nextBtn);

    prevBtn.addEventListener("click", prevImg);
    nextBtn.addEventListener("click", nextImg);
    checkButtons();
}


function prevImg() {
    position += width * count;
    position = Math.min(position, 0); // last shift may be 1 or 2 or 3 or...
    list.style.marginLeft = position + 'px'; // shift for prev image
    checkButtons();
}


function nextImg() {
    position -= width * count;
    position = Math.max(position, -width * (listElems.length - count)); // last shift may be 1 or 2 or 3 or..
    list.style.marginLeft = position + 'px'; // shift for next image
    checkButtons();
}


function checkButtons() {
    let btnPrev = document.getElementsByClassName("carousel-btn-prev")[0];
    let btnNext = document.getElementsByClassName("carousel-btn-next")[0];

    if (arrImg.length < 2) {
        btnPrev.style.display = btnNext.style.display = "none";
    }

    btnPrev.style.display = (position === 0) ? "none" : "block";
    btnNext.style.display = (position === (-1) * width * (arrImg.length - count)) ? "none" : "block";
}
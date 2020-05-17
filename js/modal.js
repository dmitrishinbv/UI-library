// Get the modal window
let modal = document.getElementById("send");

// Get the button that opens the modal
let btn = document.getElementById("modal-open");

// Append close button in right-top corner of the modal window
let closeBtn = document.createElement("button");
let textnode = document.createTextNode("X");
closeBtn.className = "modal-close";
closeBtn.setAttribute("id", "top-close-btn");
closeBtn.appendChild(textnode);
document.getElementById("send").appendChild(closeBtn);
document.getElementById("top-close-btn").style.left = "88%";
document.getElementById("top-close-btn").style.top = "10%";
document.getElementById("top-close-btn").style.color = "black";
document.getElementById("top-close-btn").style.border = "none";
document.getElementById("top-close-btn").style.background = "transparent";

// Get the HTML collection with buttons that closes the modal
let close = document.getElementsByClassName("modal-close");

// Add close the modal function for all buttons
for (let i=0; i < close.length; i++) {
    close[i].onclick = () => {
        modal.style.display = "none";
    }
}

//  Open the modal
btn.onclick = () => {
    modal.style.display = "block";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
};

document.getElementById("modal2").onclick = () => {
    alert("Opps... Another modal window currently not appended to this site");
};


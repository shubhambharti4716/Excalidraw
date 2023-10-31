// Initialize the drawing canvas and various tools
const canvas = document.getElementById('canvas');
const body = document.getElementById('main');
const toolBtns = document.querySelectorAll(".tool");
const fillColor = document.querySelector("#fill-color");
const colorBtns = document.querySelectorAll(".stroke .option");
const bgColorBtns = document.querySelectorAll(".bg-color .option");
const colorPicker = document.querySelector("#color-picker");
const bgColorPicker = document.querySelector("#bgColor-picker");
const widthBtns = document.querySelectorAll(".width-btn");


// Define the canvas context
ctx = canvas.getContext("2d");
// Function to resize the canvas

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

// Initialize drawing variables and state
let isDrawing = false;
let selectedTool = "hand";
let strokeWidth = 3;
let prevMouseX;
let prevMouseY;
let snapshot;
let selectedBgColor = "none";
let selectedColor = "#1e1e1e";

function toggleMenu() {
    var menu = document.querySelector('.dropdown-menu');
    if (menu.style.display === "none" || menu.style.display === "") {
        menu.style.display = "flex";
    } else {
        menu.style.display = "none";
    }
}

// Function to handle the click event on width buttons
widthBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {

        widthBtns.forEach(btn => btn.classList.remove("active"));

        if (e.target.id === "small") {
            strokeWidth = 3;
        }
        if (e.target.id === "mid") {
            strokeWidth = 8;
        }
        if (e.target.id === "thick") {
            strokeWidth = 12;
        }

        e.target.classList.add("active");
    });
});

const drawRect = (e) => {
    if (!fillColor.checked) {
        ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
    } else {
        ctx.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
        ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
    }
};

const drawDiamond = (e) => {
    ctx.beginPath();

    const centerX = (e.offsetX + prevMouseX) / 2;
    const centerY = (e.offsetY + prevMouseY) / 2;

    ctx.moveTo(centerX, e.offsetY); // Top point
    ctx.lineTo(e.offsetX, centerY);  // Right point
    ctx.lineTo(centerX, prevMouseY); // Bottom point
    ctx.lineTo(prevMouseX, centerY);  // Left point

    ctx.closePath();
    ctx.stroke();

    if (fillColor.checked) {
        ctx.fillStyle = selectedBgColor;
        ctx.fill();
    };
}

const drawCircle = (e) => {
    ctx.beginPath();
    const centerX = (prevMouseX + e.offsetX) / 2;
    const centerY = (prevMouseY + e.offsetY) / 2;
    // Calculate the radii (half-width and half-height) of the ellipse
    const radiusX = Math.abs(e.offsetX - prevMouseX) / 2;
    const radiusY = Math.abs(e.offsetY - prevMouseY) / 2;

    // Set the rotation angle of the ellipse (0 for a normal ellipse)
    const rotation = 0;

    // Draw the ellipse
    ctx.ellipse(centerX, centerY, radiusX, radiusY, rotation, 0, 2 * Math.PI);
    fillColor.checked ? ctx.fill() : ctx.stroke(); // if fillColor is checked fill circle else draw border circle
    ctx.stroke(); // Draw the outline of the ellipse
};

const drawArrow = (e) => {
    ctx.beginPath();

    ctx.moveTo(prevMouseX, prevMouseY);

    ctx.lineTo(e.offsetX, e.offsetY);

    const angle = Math.atan2(e.offsetY - prevMouseY, e.offsetX - prevMouseX); // Calculate the angle of the arrow

    const arrowHeadLength = 20; // Arrowhead length

    ctx.stroke();

    // Draw the arrowhead tip as lines
    ctx.save();
    ctx.translate(e.offsetX, e.offsetY);
    ctx.rotate(angle);

    // Draw the arrowhead lines
    ctx.moveTo(-arrowHeadLength, arrowHeadLength);
    ctx.lineTo(0, 0);
    ctx.lineTo(-arrowHeadLength, -arrowHeadLength);

    ctx.restore();
    ctx.stroke();
}

const drawLine = (e) => {
    ctx.beginPath();

    ctx.moveTo(prevMouseX, prevMouseY);

    ctx.lineTo(e.offsetX, e.offsetY);

    const angle = Math.atan2(e.offsetY - prevMouseY, e.offsetX - prevMouseX); // Calculate the angle of the arrow

    const arrowHeadLength = 20; // Arrowhead length

    ctx.stroke();

    // Draw the arrowhead lines
    ctx.moveTo(-arrowHeadLength, arrowHeadLength);
    ctx.lineTo(0, 0);
    ctx.lineTo(-arrowHeadLength, -arrowHeadLength);

    ctx.restore();
    ctx.stroke();
}

// Function to handle the start of drawing
const startDraw = (e) => {
    isDrawing = true;
    prevMouseX = e.offsetX; // current mouse x position
    prevMouseY = e.offsetY; // current mouse y position
    ctx.beginPath(); // creating new path when drawing
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = strokeWidth;
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height); // passing canvas data will avoid the dragging image issue
    ctx.strokeStyle = selectedColor;
    ctx.fillStyle = selectedBgColor;
}

// Function to handle ongoing drawing
const drawing = (e) => {
    if (!isDrawing) return;
    ctx.putImageData(snapshot, 0, 0); //adding copied canvas data on to this canvas

    if (selectedTool === "pencil") {
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
    }
    else if (selectedTool === "square") {
        drawRect(e);
    }
    else if (selectedTool === "diamond") {
        drawDiamond(e);
    }
    else if (selectedTool === "circle") {
        drawCircle(e);
    }
    else if (selectedTool === "arrow") {
        drawArrow(e);
    }
    else if (selectedTool === "line") {
        drawLine(e);
    }
    else if (selectedTool === "eraser") {
        const eraserSize = strokeWidth * 4; // Adjust the multiplier as needed
        ctx.lineWidth = eraserSize; // Increase the eraser size
        ctx.globalCompositeOperation = "destination-out"; // Use "destination-out" to erase
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
        ctx.globalCompositeOperation = "source-over"; // Reset composite operation
        ctx.lineWidth = strokeWidth; // Reset the line width to its original value
    }
};

toolBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".tool.active").forEach(element => {
            element.classList.remove("active");
        });
        btn.classList.add("active");
        selectedTool = btn.id;

        if (selectedTool === "square" || selectedTool === "circle" || selectedTool === "pencil"
            || selectedTool === "diamond" || selectedTool === "arrow" || selectedTool === "line") {
            canvas.style.cursor = "crosshair";
            document.querySelector(".color-palette").style.left = "30px";
        }
        else if (selectedTool === "hand") {
            canvas.style.cursor = "grab";
            document.querySelector(".color-palette").style.left = "-250px";
        }
        else {
            canvas.style.cursor = "default";
            document.querySelector(".color-palette").style.left = "-250px";
        }
    });
});

colorBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        selectedColor = window.getComputedStyle(btn).getPropertyValue("background-color");
    });
});

bgColorBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        selectedBgColor = window.getComputedStyle(btn).getPropertyValue("background-color");
    });
});

colorPicker.addEventListener("change", () => {
    colorPicker.parentElement.style.background = colorPicker.value;
    colorPicker.parentElement.click();
});

bgColorPicker.addEventListener("change", () => {
    bgColorPicker.parentElement.style.background = bgColorPicker.value;
    bgColorPicker.parentElement.click();
});

canvas.addEventListener("mouseup", () => isDrawing = false);
canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", drawing);





document.addEventListener('DOMContentLoaded', function () {
    const menuButton = document.querySelector('.b1');
    const colorPalette = document.querySelector('.color-palette');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    const toolButtons = document.querySelectorAll('.tool');


    function hideDropdownMenu() {
        dropdownMenu.style.display = 'none';
    }

    function showColorPalette() {
        colorPalette.style.display = 'block';
        colorPalette.style.zIndex = '30';
    }

    //menu button working
    let isMenuVisible = false; // Initialize the menu visibility state

    function toggleMenu() {
        const menu = document.querySelector('.dropdown-menu');
        isMenuVisible = !isMenuVisible; // Toggle the menu visibility state
        if (isMenuVisible) {
            menu.style.display = 'block';
            menu.style.zIndex = '400'; // Increase the z-index when showing
            showColorPalette();
        } else {
            menu.style.display = 'none';
            menu.style.zIndex = '1'; // Lower the z-index when hiding
            hideColorPalette();
        }
    }

    menuButton.addEventListener('click', function () {
        toggleMenu();
        hideColorPalette();
    });

    toolButtons.forEach(tool => {
        tool.addEventListener('click', function () {
            hideDropdownMenu();
            showColorPalette();
        });
    });

    document.addEventListener('click', function (event) {
        const target = event.target;
        if (!target.closest('.dropdown-menu') && !target.closest('.b1')) {
            hideDropdownMenu();
        }
        if (!target.closest('.color-palette') && !target.closest('.b1')) {
            hideColorPalette();
        }
    });

});

function hideColorPalette() {
    // const colorPalette = document.querySelector('.color-palette');
    // colorPalette.style.display = 'none';
}


//touch device
canvas.addEventListener('touchmove', (event) => {
    event.preventDefault();
    if (!drawing) return;
    const touch = event.touches[0];

    if (selectedTool === "pencil") {
        drawFreehand(touch);
    }else if (selectedTool === "diamond") {
        drawD(touch);
    }else if (selectedTool === "arrow") {
        drawA(touch);
    }else if (selectedTool === "line") {
        drawL(touch);
    }else if (selectedTool === "square") {
        drawSquare(touch);
    } else if (selectedTool === "circle") {
        drawC(touch);
    } else if (selectedTool === "eraser") {
        eraser(touch);
    }
});

// function drawFreehand(touch) {
//     const x = touch.clientX - canvas.getBoundingClientRect().left;
//     const y = touch.clientY - canvas.getBoundingClientRect().top;

//     ctx.lineTo(x, y);
//     ctx.stroke();
// }


function drawFreehand(touch) {
    const x = touch.clientX - canvas.getBoundingClientRect().left;
    const y = touch.clientY - canvas.getBoundingClientRect().top;

    if (!isDrawing) {
        isDrawing = true;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineWidth = 5; // Set the line width to 5 (adjust as needed)
    }

    ctx.lineTo(x, y);
    ctx.stroke();
}

canvas.addEventListener('touchend', () => {
    isDrawing = false;
    ctx.closePath();
});


let startX, startY;
let drawingSnapshot;  // Variable to store a snapshot of the canvas for preserving previous drawings

function drawSquare(touch) {
    const x = touch.clientX - canvas.getBoundingClientRect().left;
    const y = touch.clientY - canvas.getBoundingClientRect().top;

    if (!startX || !startY) {
        startX = x;
        startY = y;
        drawingSnapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);  // Take a snapshot before drawing
    }

    // Calculate the square's size based on the difference between the starting point and the current touch position
    const size = Math.max(Math.abs(x - startX), Math.abs(y - startY));

    ctx.putImageData(drawingSnapshot, 0, 0);  // Restore the previous drawings

    // Draw the square
    ctx.beginPath();
    ctx.rect(startX, startY, size, size);

    if (fillColor.checked) {
        ctx.fill();  // Fill the square if the fill color is checked
    } else {
        ctx.stroke();  // Draw the outline of the square
    }
}

canvas.addEventListener('touchend', (event) => {
    startX = null;  // Reset startX and startY when the touch ends
    startY = null;
});



function drawD(touch) {
    const x = touch.clientX - canvas.getBoundingClientRect().left;
    const y = touch.clientY - canvas.getBoundingClientRect().top;

    if (!prevMouseX || !prevMouseY) {
        prevMouseX = x;
        prevMouseY = y;
        drawingSnapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
    }

    ctx.putImageData(drawingSnapshot, 0, 0);

    ctx.beginPath();
    const centerX = (prevMouseX + x) / 2;
    const centerY = (prevMouseY + y) / 2;

    ctx.moveTo(centerX, y); // Top point
    ctx.lineTo(x, centerY);  // Right point
    ctx.lineTo(centerX, prevMouseY); // Bottom point
    ctx.lineTo(prevMouseX, centerY);  // Left point

    ctx.closePath();
    ctx.stroke();

    if (fillColor.checked) {
        ctx.fillStyle = selectedBgColor;
        ctx.fill();
    }
}

canvas.addEventListener('touchend', (event) => {
    prevMouseX = null;
    prevMouseY = null;
});


const drawA = (touch) => {
    const x = touch.clientX - canvas.getBoundingClientRect().left;
    const y = touch.clientY - canvas.getBoundingClientRect().top;

    if (!prevMouseX || !prevMouseY) {
        prevMouseX = x;
        prevMouseY = y;
        drawingSnapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
    }

    ctx.putImageData(drawingSnapshot, 0, 0);

    ctx.beginPath();
    ctx.moveTo(prevMouseX, prevMouseY);
    ctx.lineTo(x, y);

    const angle = Math.atan2(y - prevMouseY, x - prevMouseX);

    const arrowHeadLength = 20;

    ctx.stroke();

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);

    ctx.moveTo(-arrowHeadLength, arrowHeadLength);
    ctx.lineTo(0, 0);
    ctx.lineTo(-arrowHeadLength, -arrowHeadLength);

    ctx.restore();
    ctx.stroke();
};

canvas.addEventListener('touchend', () => {
    prevMouseX = null;
    prevMouseY = null;
});


const drawL = (touch) => {
    const x = touch.clientX - canvas.getBoundingClientRect().left;
    const y = touch.clientY - canvas.getBoundingClientRect().top;

    if (!prevMouseX || !prevMouseY) {
        prevMouseX = x;
        prevMouseY = y;
        drawingSnapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
    }

    ctx.putImageData(drawingSnapshot, 0, 0);

    ctx.beginPath();
    ctx.moveTo(prevMouseX, prevMouseY);
    ctx.lineTo(x, y);

    const angle = Math.atan2(y - prevMouseY, x - prevMouseX);

    const arrowHeadLength = 20;

    ctx.stroke();

    // Draw the arrowhead lines
    ctx.moveTo(-arrowHeadLength, arrowHeadLength);
    ctx.lineTo(0, 0);
    ctx.lineTo(-arrowHeadLength, -arrowHeadLength);
};

canvas.addEventListener('touchend', () => {
    prevMouseX = null;
    prevMouseY = null;
});


function drawC(touch) {
    const x = touch.clientX - canvas.getBoundingClientRect().left;
    const y = touch.clientY - canvas.getBoundingClientRect().top;

    if (!startX || !startY) {
        startX = x;
        startY = y;
        drawingSnapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);  // Take a snapshot before drawing
    }

    // Calculate the radius of the circle based on the distance between the starting point and the current touch position
    const radius = Math.sqrt(Math.pow(x - startX, 2) + Math.pow(y - startY, 2));

    ctx.putImageData(drawingSnapshot, 0, 0);  // Restore the previous drawings

    // Draw the circle
    ctx.beginPath();
    ctx.arc(startX, startY, radius, 0, 2 * Math.PI);

    if (fillColor.checked) {
        ctx.fill();  // Fill the circle if the fill color is checked
    } else {
        ctx.stroke();  // Draw the outline of the circle
    }
}

canvas.addEventListener('touchend', (event) => {
    startX = null;  // Reset startX and startY when the touch ends
    startY = null;
});


canvas.addEventListener('touchend', (event) => {
    // startX = null;  // Reset startX and startY when the touch ends
    // startY = null;
});



function eraser(touch) {
    const x = touch.clientX - canvas.getBoundingClientRect().left;
    const y = touch.clientY - canvas.getBoundingClientRect().top;

    const eraserSize = strokeWidth * 4; // Adjust the eraser size as needed

    ctx.globalCompositeOperation = "destination-out"; // Use "destination-out" to erase
    ctx.beginPath();
    ctx.arc(x, y, eraserSize, 0, 2 * Math.PI);
    ctx.fill();
    ctx.globalCompositeOperation = "source-over"; // Reset composite operation
}


// Update the selected tool based on user interaction, e.g., button clicks
toolBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        selectedTool = btn.id;
    });
});

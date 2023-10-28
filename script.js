const canvas = document.getElementById('canvas');
const body = document.getElementById('main');
const toolBtns = document.querySelectorAll(".tool");
const fillColor = document.querySelector("#fill-color");
const colorBtns = document.querySelectorAll(".stroke .option");
const bgColorBtns = document.querySelectorAll(".bg-color .option");
const colorPicker = document.querySelector("#color-picker");
const bgColorPicker = document.querySelector("#bgColor-picker");
const widthBtns = document.querySelectorAll(".width-btn");
ctx = canvas.getContext("2d");

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

let isDrawing = false;
let selectedTool = "hand";
let strokeWidth = 3;
let prevMouseX;
let prevMouseY;
let snapshot;
let selectedBgColor = "none";
let selectedColor = "#1e1e1e";

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
    let radius = Math.sqrt(Math.pow((prevMouseX - e.offsetX), 2) + Math.pow((prevMouseY - e.offsetY), 2)); // getting radius for circle according to mouse pointer

    ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI);
    ctx.stroke();
    if (fillColor.checked) {
        ctx.fillStyle = selectedBgColor;
        ctx.fill();
    };
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
        //ctx.clearRect(0, 0, canvas.width, canvas.height);
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
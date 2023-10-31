
const undoStack = [];
const redoStack = [];

// Function to save the current canvas state to the undo stack
function saveCanvasState() {
    undoStack.push(canvas.toDataURL());
    redoStack.length = 0; // Clear the redo stack
}

// Implement undo functionality
const undoButton = document.getElementById('undo');
undoButton.addEventListener('click', handleUndo);

// Implement redo functionality
const redoButton = document.getElementById('redo');
redoButton.addEventListener('click', handleRedo);

// Handle undo action
function handleUndo() {
    if (undoStack.length > 1) {
        redoStack.push(undoStack.pop()); // Move the current state to the redo stack
        restoreCanvasState(undoStack[undoStack.length - 1]);
    }
}

// Handle redo action
function handleRedo() {
    if (redoStack.length > 0) {
        const snapshot = redoStack.pop();
        restoreCanvasState(snapshot);
        undoStack.push(snapshot); // Move the current state back to the undo stack
    }
}

// Function to restore the canvas state from a data URL
function restoreCanvasState(dataURL) {
    const img = new Image();
    img.onload = function () {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
    };
    img.src = dataURL;
}

// Call saveCanvasState initially and when drawing is done
saveCanvasState(); // Save the initial state

// Add a function to clear the undo and redo stacks
function clearUndoRedoStacks() {
    undoStack.length = 0;
    redoStack.length = 0;
}

// Call saveCanvasState when drawing is done
canvas.addEventListener('mouseup', () => {
    isDrawing = false;
    saveCanvasState();
});

canvas.addEventListener('touchend', () => {
    isDrawing = false;
    saveCanvasState();
});

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const width = ctx.canvas.width;
const height = ctx.canvas.height;
const gridLineWidth = Math.floor(width/60);
const xPad = Math.floor(width/30);
const yPad = Math.floor(height/30);

var gameState = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
var turn = true;
var mX = 0;
var mY = 0;
var shouldUpdate = false;
var winner = false;

canvas.addEventListener('mousedown', (e) => {
    if (!winner) {
        let rect = canvas.getBoundingClientRect();
        mX = Math.floor((e.x-rect.left)/(width/3));
        mY = Math.floor((e.y-rect.top)/(height/3));
        shouldUpdate = true;
    }
});

function drawGrid() {
    ctx.fillStyle = "#aaaaaa";
    for (let i = 0; i < 4; i++) {
        ctx.fillRect(i*(width/3)-(gridLineWidth/2), 0, gridLineWidth, height);
        ctx.fillRect(0, i*(height/3)-(gridLineWidth/2), width, gridLineWidth);
    }
}

function drawCross(x, y) {
    let x0 = x+xPad;
    let y0 = y+yPad;
    let w0 = (width/3)-xPad*2;
    let h0 = (height/3)-yPad*2;
    ctx.fillStyle = "#0000aa";
    ctx.fillRect(x0, y0, w0, h0);
    
    ctx.fillStyle="#ffffff";
    // Corners
    ctx.beginPath();
    ctx.moveTo(x0-1, y0-1);
    ctx.lineTo(x0-1, y0+yPad);
    ctx.lineTo(x0+xPad, y0-1);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x0+w0+1, y0-1);
    ctx.lineTo(x0+w0+1, y0+yPad);
    ctx.lineTo(x0+w0-xPad, y0-1);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x0-1, y0+h0+1);
    ctx.lineTo(x0-1, y0+h0-yPad);
    ctx.lineTo(x0+xPad, y0+h0+1);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x0+w0+1, y0+h0+1);
    ctx.lineTo(x0+w0+1, y0+h0-yPad);
    ctx.lineTo(x0+w0-xPad, y0+h0+1);
    ctx.fill();

    // Sides
    ctx.beginPath();
    ctx.moveTo(x0-1, y0+yPad);
    ctx.lineTo(x0-1, y0+h0-yPad);
    ctx.lineTo(x0+(w0/2)-xPad/2, y0+(h0/2));
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x0+xPad, y0-1);
    ctx.lineTo(x0+w0-xPad, y0-1);
    ctx.lineTo(x0+(w0/2), y0+(h0/2)-yPad/2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x0+w0+1, y0+yPad);
    ctx.lineTo(x0+w0+1, y0+h0-yPad);
    ctx.lineTo(x0+(w0/2)+xPad/2, y0+(h0/2));
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x0+xPad, y0+h0+1);
    ctx.lineTo(x0+w0-xPad, y0+h0+1);
    ctx.lineTo(x0+(w0/2), y0+(h0/2)+yPad/2);
    ctx.fill();
}

function drawNought(x, y) {
    let x0 = x+xPad;
    let y0 = y+yPad;
    let w0 = (width/3)-xPad*2;
    let h0 = (height/3)-yPad*2;
    let x1 = x0+w0/2;
    let y1 = y0+h0/2;
    let r0 = Math.abs(x0-x1);
    let r1 = r0-xPad;
    ctx.fillStyle = "#aa0000";
    ctx.beginPath();
    ctx.arc(x1, y1, r0, 0, Math.PI*2, false);
    ctx.arc(x1, y1, r1, 0, Math.PI*2, true);
    ctx.fill();
}

function drawState() {
    for (let y = 0; y < 3; y++) {
        for (let x = 0; x < 3; x++) {
            if (gameState[y][x] === 1) {
                drawCross(x*(width/3), y*(height/3));
            } else if (gameState[y][x] === 2) {
                drawNought(x*(width/3), y*(height/3));
            }
        }
    }
}

function resetState() {
    gameState = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
}

function displayWin(result) {
    resetState();
    ctx.font = "24px Serif";
    if (result === 0) {
        ctx.fillStyle = "#aa0000";
        ctx.fillText("Noughts win!", width/2, height/2, 200);
    } else if (result === 1) {
        ctx.fillStyle = "0000aa";
        ctx.fillText("Crosses win!", width/2, height/2, 200);
    } else if (result === -1) {
        ctx.fillStyle = "ffffff";
        ctx.fillText("Draw!", width/2, height/2, 200);
    }
    setTimeout(() => {winner = false;}, 3000);
}

function checkWin() {
    if (gameState[0][0] === 1 && gameState[1][1] === 1 && gameState[2][2] === 1 ||
        gameState[2][0] === 1 && gameState[1][1] === 1 && gameState[0][2] === 1 ||
        gameState[0][0] === 1 && gameState[0][1] === 1 && gameState[0][2] === 1 ||
        gameState[1][0] === 1 && gameState[1][1] === 1 && gameState[1][2] === 1 ||
        gameState[2][0] === 1 && gameState[2][1] === 1 && gameState[2][2] === 1 ||
        gameState[0][0] === 1 && gameState[1][0] === 1 && gameState[2][0] === 1 ||
        gameState[0][1] === 1 && gameState[1][1] === 1 && gameState[2][1] === 1 ||
        gameState[0][2] === 1 && gameState[1][2] === 1 && gameState[2][2] === 1) {
        displayWin(0);
        winner = true;
    } else if (gameState[0][0] === 2 && gameState[1][1] === 2 && gameState[2][2] === 2 ||
        gameState[2][0] === 2 && gameState[1][1] === 2 && gameState[0][2] === 2 ||
        gameState[0][0] === 2 && gameState[0][1] === 2 && gameState[0][2] === 2 ||
        gameState[1][0] === 2 && gameState[1][1] === 2 && gameState[1][2] === 2 ||
        gameState[2][0] === 2 && gameState[2][1] === 2 && gameState[2][2] === 2 ||
        gameState[0][0] === 2 && gameState[1][0] === 2 && gameState[2][0] === 2 ||
        gameState[0][1] === 2 && gameState[1][1] === 2 && gameState[2][1] === 2 ||
        gameState[0][2] === 2 && gameState[1][2] === 2 && gameState[2][2] === 2) {
        displayWin(1);
        winner = true;
    } else if (gameState[0][0] !== 0 && gameState[0][1] !== 0 && gameState[0][2] !== 0 &&
        gameState[1][0] !== 0 && gameState[1][1] !== 0 && gameState[1][2] !== 0 &&
        gameState[2][0] !== 0 && gameState[2][1] !== 0 && gameState[2][2] !== 0) {
        displayWin(-1);
        winner = true;
    }
}
function updateState() {
    if (shouldUpdate) {
        if (gameState[mY][mX] === 0) {
            if (turn) {
                gameState[mY][mX] = 1;
                turn = false;
            } else {
                gameState[mY][mX] = 2;
                turn = true;
            }
            mX = 0;
            mY = 0;
        }
        shouldUpdate = false;
    }
}

function renderFrame() {
    drawState();
    drawGrid();
    checkWin();
    updateState();
    window.requestAnimationFrame(renderFrame);
}

drawGrid();
window.requestAnimationFrame(renderFrame);

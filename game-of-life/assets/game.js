const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const CELL_SIZE = 10;
let width, height;
let grid, nextGrid;

function initializeCanvas() {
    // Set canvas size to match device pixels for sharp rendering
    const dpr = window.devicePixelRatio || 1;
    width = Math.floor(window.innerWidth / CELL_SIZE);
    height = Math.floor(window.innerHeight / CELL_SIZE);
    
    canvas.width = width * CELL_SIZE * dpr;
    canvas.height = height * CELL_SIZE * dpr;
    ctx.scale(dpr, dpr);
    
    // Initialize grids
    grid = Array(height).fill().map(() => Array(width).fill(0));
    nextGrid = Array(height).fill().map(() => Array(width).fill(0));
    
    // Randomly populate initial grid
    for(let y = 0; y < height; y++) {
        for(let x = 0; x < width; x++) {
            grid[y][x] = Math.random() > 0.85 ? 1 : 0;
        }
    }
}

function getColor(neighbors) {
    // GitHub-style colors based on neighbor count
    const colors = {
        0: '#9be9a8',  // lightest
        1: '#40c463',  // light
        2: '#30a14e',  // medium
        3: '#216e39'   // darkest
    };
    return colors[Math.min(3, neighbors)] || colors[3];
}

function drawCell(x, y) {
    if (grid[y][x]) {
        const neighbors = countNeighbors(x, y);
        ctx.fillStyle = getColor(neighbors);
        ctx.beginPath();
        ctx.roundRect(
            x * CELL_SIZE, 
            y * CELL_SIZE, 
            CELL_SIZE, 
            CELL_SIZE,
            2
        );
        ctx.fill();
    }
}

function countNeighbors(x, y) {
    let count = 0;
    for(let dy = -1; dy <= 1; dy++) {
        for(let dx = -1; dx <= 1; dx++) {
            if (dx === 0 && dy === 0) continue;
            
            let nx = (x + dx + width) % width;
            let ny = (y + dy + height) % height;
            count += grid[ny][nx];
        }
    }
    return count;
}

function update() {
    for(let y = 0; y < height; y++) {
        for(let x = 0; x < width; x++) {
            const neighbors = countNeighbors(x, y);
            if (grid[y][x]) {
                nextGrid[y][x] = (neighbors === 2 || neighbors === 3) ? 1 : 0;
            } else {
                nextGrid[y][x] = neighbors === 3 ? 1 : 0;
            }
        }
    }
    
    // Swap grids
    [grid, nextGrid] = [nextGrid, grid];
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for(let y = 0; y < height; y++) {
        for(let x = 0; x < width; x++) {
            drawCell(x, y);
        }
    }
}

let lastUpdate = 0;
const UPDATE_INTERVAL = 500; // 0.5 seconds

function gameLoop(timestamp) {
    if (timestamp - lastUpdate >= UPDATE_INTERVAL) {
        update();
        draw();
        lastUpdate = timestamp;
    }
    requestAnimationFrame(gameLoop);
}

// Handle window resizing
window.addEventListener('resize', initializeCanvas);

// Start the game
initializeCanvas();
gameLoop();
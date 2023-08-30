// #region ----- CUSTOM VARIABLES -----

function makeStruct(names) {
    names = names.split(' ');
    let count = names.length;
    function constructor() {
        for (let i = 0; i < count; i++) {
            this[names[i]] = arguments[i];
        }
    }
    return constructor;
}

// #endregion 
// #region ----- ALL VARIABLES -----

let my_canvas = document.getElementById('canvas')
let context = my_canvas.getContext("2d");

let liveCellColor = getComputedStyle(document.documentElement).getPropertyValue('--bg-accent');
let deadCellColor = getComputedStyle(document.documentElement).getPropertyValue('--bg-color');

let generationTime = 100; // in ms

let viewportWidth = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
let viewportHeight = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);

let gridRes = 50;
let gridWidth = Math.floor(gridRes * viewportWidth / viewportHeight);
let gridHeight = Math.floor(gridRes);
let cellSize = my_canvas.width / gridWidth;
let cellBorder = 0.05;
let minimumCells = 150; // if the amount of cells goes below this value, just spawn some in

let grid = new Array(gridWidth);
let nextGrid = new Array(gridWidth);

// #endregion 
// #region ----- EVENT LISTENERS -----

// resize the canvas to fill browser window dynamically
window.addEventListener('resize', ResizeCanvas, false);

// #endregion 
// #region ----- RETURN FUNCTIONS -----

function WorldToGridPos(worldPos){
    return worldPos / cellSize;
}

function GridToWorldPos(gridPos){
    return gridPos * cellSize;
}

function WrapNumber(num, min, max){
    if (num < min) num = max + num;
    
    num = num % max;
    
    return num;
}

function GetCell(x, y){
    x = WrapNumber(x, 0, gridWidth);
    y = WrapNumber(y, 0, gridHeight);

    return grid[x][y];
}

// #endregion 
// #region ----- FUNCTIONS -----

function ResizeCanvas() {
    viewportWidth = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    viewportHeight = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);

    canvas.width = viewportWidth;
    canvas.height = viewportHeight;

    cellSize = my_canvas.width / gridWidth;
}

function InitializeGrid(){
    for (let i = 0; i < gridWidth; i++){
        grid[i] = new Array(gridHeight);
        nextGrid[i] = new Array(gridHeight);
    }

    for (let x = 0; x < gridWidth; x++){
        for (let y = 0; y < gridHeight; y++){
            SetCell(x, y, 0);
            nextGrid[x][y] = 0;
        }
    }
    
}

function SetCell(x, y, value){
    x = WrapNumber(x, 0, gridWidth);
    y = WrapNumber(y, 0, gridHeight);

    grid[x][y] = value;
}

function RandomizeGrid(){
    for (let x = 0; x < gridWidth; x++){
        for (let y = 0; y < gridHeight; y++){
            if (Math.round(Math.random()) == 0) SetCell(x, y, 0);
            else SetCell(x, y, 1);

            /*
            if (y == gridHeight - 1) grid[x][y] = 2;
            if (x == gridWidth - 1) grid[x][y] = 2;

            if (y == 0) grid[x][y] = 2;
            if (x == 0) grid[x][y] = 2;
            */
        }
    }
}

function CellularAutomata(){

    let liveCellsNextGen = 0;

    for (let x = 0; x < gridWidth; x++){
        for (let y = 0; y < gridHeight; y++){
            // Get amt of nearby cells (loop canvas)
            let nearbyAliveCount = 0;
            for (let rx = -1; rx <= 1; rx++){
                for (let ry = -1; ry <= 1; ry++){
                    if (!(rx == 0 && ry == 0)) { // dont count yourself
                        let num = GetCell(x + rx, y + ry)
                        nearbyAliveCount += num;
                        if (!(num == 0 || num == 1)) console.log(num);
                    }
                }
            }

            // Apply Rules

            if (GetCell(x, y) == 1){

                // A live cell dies if it has fewer than two live neighbors.
                if (nearbyAliveCount < 2){
                    nextGrid[x][y] = 0;
                    //console.log("Live cell with", nearbyAliveCount, "neighbors has passed.");
                }

                // A live cell with more than three live neighbors dies.
                if (nearbyAliveCount > 3){
                    nextGrid[x][y] = 0;
                    //console.log("Live cell with", nearbyAliveCount, "neighbors has passed.");
                }

                // A live cell with two or three live neighbors lives on to the next generation.
                if (nearbyAliveCount == 2 || nearbyAliveCount == 3){
                    nextGrid[x][y] = 1;
                    liveCellsNextGen++;
                    //console.log("Live cell with", nearbyAliveCount, "neighbors stayed live.");
                }

            }
            else if (GetCell(x, y) == 0){

                // A dead cell will be brought back to live if it has exactly three live neighbors.
                if (nearbyAliveCount == 3){
                    nextGrid[x][y] = 1;
                    liveCellsNextGen++;
                    //console.log("Dead cell with", nearbyAliveCount, "neighbors has been revived.");
                }

            }
        }
    }

    // randomly kill or revive cells
    for (let i = liveCellsNextGen; i < minimumCells; i++){
        let randomX = Math.floor(Math.random() * gridWidth);
        let randomY = Math.floor(Math.random() * gridHeight);
        nextGrid[randomX][randomY] = 1;
    }

    // copy and reset
    for (let x = 0; x < gridWidth; x++){
        for (let y = 0; y < gridHeight; y++){
            SetCell(x, y, nextGrid[x][y]);
            nextGrid[x][y] = 0;
        }
    }
}

function DrawCell(gridX, gridY){
    if (grid[gridX][gridY] == 2){
        context.fillStyle = "#FF0000";
    }
    else if (grid[gridX][gridY] == 1){
        context.fillStyle = liveCellColor;
    }
    else{
        context.fillStyle = deadCellColor;
    }

    context.fillRect(GridToWorldPos(gridX), GridToWorldPos(gridY), cellSize, cellSize);
    context.strokeRect(GridToWorldPos(gridX), GridToWorldPos(gridY), cellSize, cellSize);
}

// #endregion 
// #region ----- STARTUP CODE -----

ResizeCanvas();
InitializeGrid();
RandomizeGrid();

context.lineWidth = cellBorder;
context.strokeStyle = deadCellColor;

// #endregion 
// #region ----- RUNTIME -----

function Update(){
    console.clear();
    CellularAutomata();
    // Revive some dead cells here?
    DrawFrame();
}

function DrawFrame(){
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    for (let x = 0; x < gridWidth; x++){
        for (let y = 0; y < gridHeight; y++){
            DrawCell(x, y);
        }
    }
}

setInterval(Update, generationTime);
//Update();

// #endregion 

/* ----- BOILERPLATE -----



    context.moveTo(20, 20);
    context.lineTo(100, 20);

    context.fillStyle = "#999";
    context.beginPath();
    context.arc(100,100,75,0,2*Math.PI);
    context.fill();
    
    context.fillStyle = 'hsl('+ 360*Math.random() +',100%,50%)';

    context.fillStyle = "orange";
    //context.strokeRect(20,20,30,50);
    context.fillRect(20,20,50,50);

    context.font = "24px Helvetica";
    context.fillStyle = "#000";
    context.fillText("Canvas", 50, 130);

*/
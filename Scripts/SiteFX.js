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

let generationTime = 1000; // in ms

let gridWidth = 10;
let gridHeight = 6;
let cellSize = my_canvas.width / gridWidth;

let grid = new Array(gridWidth);
let nextGrid = new Array(gridWidth);

// #endregion 
// #region ----- EVENT LISTENERS -----

// resize the canvas to fill browser window dynamically
window.addEventListener('resize', ResizeCanvas, false);

function ResizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight; //window.innerHeight / 1.1;

    cellSize = my_canvas.width / gridWidth;
}

// #endregion 
// #region ----- RETURN FUNCTIONS -----

function WorldToGridPos(worldPos){
    return worldPos / cellSize;
}

function GridToWorldPos(gridPos){
    return gridPos * cellSize;
}

// #endregion 
// #region ----- FUNCTIONS -----

function InitializeGrid(){

    for (let i = 0; i < gridWidth; i++){
        grid[i] = new Array(gridHeight);
        nextGrid[i] = new Array(gridHeight);
    }

    for (let x = 0; x < gridWidth; x++){
        for (let y = 0; y < gridHeight; y++){
            if (Math.round(Math.random()) == 0) grid[x][y] = 0;
            else grid[x][y] = 1;
        }
    }
}

function DrawCell(gridX, gridY){
    if (grid[gridX][gridY] == 0) context.fillStyle = 'hsl('+ 360*Math.random() +', 100%, 0%)';
    else context.fillStyle = 'hsl('+ 360*Math.random() +', 100%, 100%)';
    
    context.fillRect(GridToWorldPos(gridX), GridToWorldPos(gridY), cellSize, cellSize);
}

// #endregion 
// #region ----- STARTUP CODE -----

ResizeCanvas();
InitializeGrid();
DrawFrame();

// #endregion 
// #region ----- RUNTIME -----

function DrawFrame(){
    for (let x = 0; x < gridWidth; x++){
        for (let y = 0; y < gridHeight; y++){
            DrawCell(x, y);
        }
    }
}

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
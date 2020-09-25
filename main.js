'use strict';

//https://www.javascripttutorial.net/javascript-queue/
//Queue class
function Queue() {
    this.elements = [];
}

//add an element at the end of the queue using push() method
Queue.prototype.enqueue = function (e) {
    this.elements.push(e);
}

//remove an element from the front of the queue using shift() method
Queue.prototype.dequeue = function () {
    return this.elements.shift();
}

//check if the queue is empty
Queue.prototype.isEmpty = function () {
    return this.elements.length == 0;
}

//get the element at the front of the queue
Queue.prototype.peek = function () {
    return !this.isEmpty() ? this.elements[0] : undefined;
}

//query the length of a queue
Queue.prototype.length = function () {
    return this.elements.length;
}

//https://www.javascripttutorial.net/javascript-stack/
//Stack class
function Stack() {
    this.elements = [];
}

//add an element of the top of the stack
Stack.prototype.push = function (e) {
    this.elements.push(e);
}

//remove an element from the top of the stack
Stack.prototype.pop = function () {
    return this.elements.pop();
}

//check if the stack is empty
Stack.prototype.isEmpty = function () {
    return this.elements.length == 0;
}

//get the element at the top of the stack
Stack.prototype.top = function () {
    return !this.isEmpty() ? this.elements[this.elements.length - 1] : undefined;
}

//query the length of a stack
Stack.prototype.length = function () {
    return this.elements.length;
}

// list array to the console
function print(arr) {
    for (let i = 0; i < arr.length; i++) {
        let line = '';
        for (let j = 0; j < arr[0].length; j++) {
            line += arr[i][j];
        }
        console.log(line);
    }
}

//increment for N V S E directions
const addLine = [-1, 0, 1, 0];
const addCol = [0, -1, 0, 1];

//GENERATE THE MAZE
//max 10 rows
let mazeWidth = Math.floor(Math.random() * 5) + 6; 
//max 10 columns
let mazeHeight = Math.floor(Math.random() * 5) + 6;
//max 20 walls
let walls = mazeWidth + mazeHeight;
let xStart = 0;
let yStart = 0;
let xEnd = mazeWidth - 1;
let yEnd = mazeHeight - 1;
let maze = [];
//copy of the main maze
let secondMaze = [];

function generateMaze() {
    //max 10 rows
    mazeWidth = Math.floor(Math.random() * 5) + 6;
    //max 10 columns
    mazeHeight = Math.floor(Math.random() * 5) + 6;
    //max 20 walls
    walls = mazeWidth + mazeHeight;
    xEnd = mazeWidth - 1;
    yEnd = mazeHeight - 1;
    xStart = Math.floor(Math.random() * mazeWidth);
    yStart = Math.floor(Math.random() * mazeHeight);
    while (xStart == xEnd && yStart == yEnd) { // if 'S' it randomly generated into the same place with 'E'
        xStart = Math.floor(Math.random() * mazeWidth);
        yStart = Math.floor(Math.random() * mazeHeight);
    }
    let line = [];
    let i, j;
    maze.length = 0;
    for (i = 0; i < mazeHeight; i++) {
        for (j = 0; j < mazeWidth; j++) {
            line.push('-'); //all the lines are populated with "-"
        }
        maze.push(line);
        line = []; // reset line
    }
    maze[yStart][xStart] = 'S';
    maze[yEnd][xEnd] = 'E';
    let xPos, yPos;
    // generate randomly walls
    for (i = 0; i < walls;) {
        xPos = Math.floor(Math.random() * mazeWidth);
        yPos = Math.floor(Math.random() * mazeHeight);
        if (maze[yPos][xPos] == '-') { //search for all fields populated with '-'
            maze[yPos][xPos] = '0'; //and replace one by one, randomly, with walls as '0'
            i++;
        }
    }

    secondMaze.length = 0;
    for (i = 0; i < mazeHeight; i++) {
        let line = [];
        for (j = 0; j < mazeWidth; j++) {
            line.push(maze[i][j]);
        }
        secondMaze.push(line);
    }

    let table = document.createElement("table");
    let tbody = document.createElement("tbody");
    for (let rowIndex = 1; rowIndex <= mazeHeight; rowIndex++) {
        let row = document.createElement("tr");

        for (let colIndex = 1; colIndex <= mazeWidth; colIndex++) {
            let col = document.createElement("td");
            if (rowIndex == yStart + 1 && colIndex == xStart + 1) {
                col.style.backgroundColor = "#2ecc71";
                col.setAttribute("type", "start");
                col.innerHTML = "START";
            } else if (rowIndex == mazeHeight && colIndex == mazeWidth) {
                col.style.backgroundColor = "#f1c40f";
                col.setAttribute("type", "finish");
                col.innerHTML = "FINISH";
            } else if (maze[rowIndex-1][colIndex-1] == '0') {
                col.style.backgroundColor = "#000";
            } else {
                col.style.backgroundColor = "#bdc3c7";
            }
            col.setAttribute("id", "cell_" + rowIndex + "_" + colIndex);
            row.appendChild(col);
        }

        tbody.appendChild(row);
    }
    table.appendChild(tbody);
    document.getElementById("firstmaze").appendChild(table);
    document.getElementById("generateBtn").disabled = true;
}

//https://www.freecodecamp.org/news/lees-algorithm-explained-with-examples/
//Lee's algorithm
function lee() {
    let pos = { y: yStart, x: xStart };
    let q = new Queue();
    q.enqueue(pos); // start from 'S' position
    maze[yStart][xStart] = 1; //set the value of 'S' = 1
    while (!q.isEmpty() && (maze[yEnd][xEnd] == 'E')) {
        pos = q.peek(); //read the first element
        q.dequeue(); //remove the first element from the queue
        // test neighbours
        for (let k = 0; k < 4; k++) {
            let ngh = { y: pos.y, x: pos.x };
            ngh.y += addLine[k];
            ngh.x += addCol[k];
            if (ngh.x >= 0 && ngh.x < mazeWidth && ngh.y >= 0 && ngh.y < mazeHeight && (maze[ngh.y][ngh.x] == '-' || maze[ngh.y][ngh.x] == 'E')) {
                maze[ngh.y][ngh.x] = maze[pos.y][pos.x] + 1; //increase value with 1 of all the valid neighbors
                q.enqueue(ngh); //the neighbors are added in the end of the queue
            }
        }
    }
}

function path() {
    if (maze[yEnd][xEnd] == 'E') {
        return null; // if we still have 'E', no path was found
    }
    // the path acumulates into the stack starting with the end to the start
    let st = new Stack();
    st.push({ y: yEnd, x: xEnd });
    let pos = { y: yEnd, x: xEnd };
    while (maze[pos.y][pos.x] > 1) {
        for (let k = 0; k < 4; k++) {
            let ngh = { y: pos.y, x: pos.x };
            ngh.y += addLine[k];
            ngh.x += addCol[k];
            if (ngh.x >= 0 && ngh.x < mazeWidth && ngh.y >= 0 && ngh.y < mazeHeight && Number.isInteger(maze[ngh.y][ngh.x])) {
                if (maze[ngh.y][ngh.x] == maze[pos.y][pos.x] - 1) {
                    pos.y = ngh.y;
                    pos.x = ngh.x;
                    st.push(ngh);
                    break;
                }
            }
        }
    }
    return st;
}

function solveMaze() {
    print(maze);
    //Lee's Algorithm
    lee();
    console.log('==========');
    print(maze);
    //Path
    let st = path();
    if (st == null) {
        let err = document.getElementById('error');
        err.innerHTML = "No chances to escape the maze";
        console.log("No chances to escape the maze");
    } else {
        let err = document.getElementById('error');
        err.innerHTML = "";
        console.log('==========');
        while (!st.isEmpty()) {
            let pos = st.top();
            st.pop();
            secondMaze[pos.y][pos.x] = 'X';
        }
        //print matrix solution with path
        console.log('==========');
        print(secondMaze);
        let table = document.createElement("table");
        let tbody = document.createElement("tbody");
        for (let rowIndex = 1; rowIndex <= mazeHeight; rowIndex++) {
            let row = document.createElement("tr");
            for (let colIndex = 1; colIndex <= mazeWidth; colIndex++) {
                let col = document.createElement("td");
                if (rowIndex == yStart + 1 && colIndex == xStart + 1) {
                    col.style.backgroundColor = "#2ecc71";
                    col.setAttribute("type", "start");
                    col.innerHTML = "START";
                }
                if (rowIndex == mazeHeight && colIndex == mazeWidth) {
                    col.style.backgroundColor = "#f1c40f";
                    col.setAttribute("type", "finish");
                    col.innerHTML = "FINISH";
                } else if (secondMaze[rowIndex-1][colIndex-1] == '0') {
                    col.style.backgroundColor = "#000";
                } else if (secondMaze[rowIndex-1][colIndex-1] == 'X')  {
                    col.style.backgroundColor = "#f1c40f";
                } else {
                    col.style.backgroundColor = "#bdc3c7";
                }
                col.setAttribute("id", "cell_" + rowIndex + "_" + colIndex);
                row.appendChild(col);
            }
            tbody.appendChild(row);
        }
        table.appendChild(tbody);
        document.getElementById("secondmaze").appendChild(table);
    }
    document.getElementById("solveBtn").disabled = true;
}
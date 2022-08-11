//GLOBAL VARIABLES
let possibleGuessCheck = false;
let gameBoard = undefined;
let lastPressedKey = undefined;
let currentActiveCell = undefined;


//GET BOARD
async function getBoard(){
    const url = 'https://sugoku.herokuapp.com/board?difficulty=hard';
    const response = await fetch(url);
    const board = response.json();

    return board;
}

document.addEventListener('keydown', function(e){
    if(Number.isInteger(parseInt(e.key))){
        if(e.key != '0'){
            lastPressedKey = parseInt(e.key);
            writeToCell(currentActiveCell, lastPressedKey);
        }
    }
});

function writeToCell(cell, key){
    let workingCell = document.querySelector(`#${cell}`);
    if(!workingCell.classList.contains('initial_solved_cell')){
        if(possibleGuessCheck){
            let miniCell = document.querySelector(`.${cell}_guess_box${key - 1}`);
            if(miniCell.innerHTML == ''){
                miniCell.innerHTML=key;
            }else{
                miniCell.innerHTML = '';
            }
        }else{
            if(workingCell.innerHTML == ''){
                workingCell.innerHTML = key;
                workingCell.classList.add('solved_cell');
                workingCell.classList.remove('unsolved_cell');
            }else{
                if(workingCell.innerHTML != key){
                    workingCell.innerHTML = key;
                }else{
                    workingCell.innerHTML = '';
                }
                workingCell.classList.remove('solved_cell');
                workingCell.classList.add('unsolved_cell');
            }
        }
    }
}

//BUTTON LOGIC

document.querySelector('#solve').addEventListener('click', ()=>{
    solve(gameBoard);
    updateBoard();
});
/*
document.querySelector('#possibleGuess').addEventListener('click', ()=>{
    let thisBtn = document.querySelector('#possibleGuess');
    if(possibleGuessCheck == false){
        possibleGuessCheck = true;
        thisBtn.classList.add('on');
        thisBtn.classList.remove('off');
    }else{
        thisBtn.classList.add('off');
        thisBtn.classList.remove('on');
        possibleGuessCheck = false;
    }
    console.log(possibleGuessCheck);
});

*/

function updateBoard(){
    for(let i=0; i<9; i++){
        for(let j=0; j<9; j++){
            let currentCell = document.getElementById(`cell${i}${j}`);
            currentCell.classList.add('solved_cell');
            currentCell.classList.remove('unsolved_cell');
            currentCell.innerHTML = gameBoard[i][j]
        }
    }
}

//SOLVE FUNCTIONALITY

function solve(bo){
    const find = getZero(bo);
    if(!find){
        return true
    }else{
        const row = find[0];
        const col = find[1];
        for(let num=1; num<=9; num++){
            if(checkValid(bo, num, [row, col])){
                bo[row][col] = num;

                if(solve(bo)){
                    return true
                }

                bo[row][col] = 0;
            }
        }
    }
}

function checkValid(bo, entry, position){
    //Check Row
    for(let j=0; j<9; j++){
        if(bo[position[0]][j] == entry){
            return false
        }
    }
    //Check Column
    for(let i=0; i<9; i++){
        if(bo[i][position[1]] == entry){
            return false
        }
    }
    //Check Square
    const x = Math.floor(position[0] / 3)
    const y = Math.floor(position[1] / 3)
    for(let i=(x*3); i < (x*3) + 3; i++){
        for(let j=(y*3); j < (y * 3) + 3; j++){
            if(bo[i][j] == entry){
                return false
            }
        }
    }
    return true
}

function getZero(bo){
    for(let i = 0; i < 9; i++){
        for(let j = 0; j<9; j++){
            if(bo[i][j] == 0){
                return [i, j]
            }
        }
    }
    return false
}

//SETTING UP THE BOARD

const puzzleGrid = document.querySelector('#sudoku_grid');
for(let i = 0; i < 9; i++){
    const box = document.createElement('div');
    box.id = `box${i}`
    box.classList.add('box');
    for(let j = 0; j < 9; j++){
        const cell = document.createElement('div');
        let row = Math.floor(j / 3) + Math.floor(i / 3) * 3
        let col = (j % 3) + (i % 3) * 3;
        cell.id = `cell${row}${col}`;
        cell.classList.add('cell');
        box.appendChild(cell);
        cell.addEventListener('click', function(){
            let listOfActiveCells = document.querySelectorAll('.active');
                listOfActiveCells.forEach(element =>{
                    element.classList.remove('active');
                });
            if(currentActiveCell == this.id){
                currentActiveCell = undefined;
            }else{
                currentActiveCell = this.id;
                this.classList.add('active');
                console.log(currentActiveCell);
            }
        });
    }
    puzzleGrid.append(box);
}


getBoard().then(jsonBoard => {
    jsonBoard;
    const board = [...jsonBoard['board']];
    gameBoard = [...jsonBoard['board']];
    for(let i=0; i < 9; i++){
        for(let j=0; j < 9; j++){
            let currentCell = document.querySelector(`#cell${i}${j}`);
            if(board[i][j] == 0){
                currentCell.classList.add('unsolved_cell');
                for(let h =0; h< 9; h++){
                    let guessBox = document.createElement('div');
                    guessBox.classList.add('guess_box', `cell${i}${j}_guess_box${h}`);
                    currentCell.append(guessBox);
                }
            }else{
                currentCell.innerHTML = board[i][j];
                currentCell.classList.add('solved_cell', 'initial_given_cell');
            }
        }
    }
});

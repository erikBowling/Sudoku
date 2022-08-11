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
        cell.addEventListener('click', ()=>{
            
        });
    }
    puzzleGrid.append(box);
}

async function getBoard(){
    const url = 'https://sugoku.herokuapp.com/board?difficulty=medium';
    const response = await fetch(url);
    const board = response.json();

    return board;
}

let gameBoard = undefined;

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
                currentCell.classList.add('solved_cell');
            }
        }
    }
});
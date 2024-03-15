let message = document.getElementById('message')
let playerText = document.getElementById('playerText')
let restartBtn = document.getElementById('restartBtn')
let boxes = Array.from(document.getElementsByClassName('box'))

let winnerIndicator = getComputedStyle(document.body).getPropertyValue('--winning-blocks')

const O_TEXT = "circle"
const X_TEXT = "close"
let currentPlayer = X_TEXT
let spaces = Array(9).fill(null)

const startGame = () => {
    boxes.forEach(box => box.addEventListener("click", boxClicked))
}

function boxClicked(e){
    const id = e.target.id
    if(!spaces[id]){
        spaces[id] = currentPlayer
        
        e.target.innerHTML = currentPlayer == X_TEXT ? `<i class="material-symbols-outlined">${X_TEXT}</i>` : `<i class="material-symbols-outlined">${O_TEXT}</i>`;

        if (currentPlayer == X_TEXT) {
            e.target.classList.add('x');
        } else {
            e.target.classList.add('o');
        }

        if(playerHasWon() !== false){
            message.style.display = "block"
            playerText.innerText = `${currentPlayer == X_TEXT ? 'X' : 'O'} has Won!`; // Specify 'X' or 'O' here
            let winning_blocks = playerHasWon()
            winning_blocks.map( box => boxes[box].style.backgroundColor=winnerIndicator)
            return
        } else if (isGameDraw()) { // Check for a draw
            message.style.display = "block"
            playerText.innerText = "It's a Draw!";
        } else {
            currentPlayer = currentPlayer == X_TEXT ? O_TEXT : X_TEXT
        }    
    }
}

const winningCombos = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6],
]

function playerHasWon(){
    for (const condition of winningCombos){
        let [a, b, c] = condition

        if (spaces[a] && (spaces[a] == spaces[b] && spaces[a] == spaces[c])) {
            return [a,b,c]
        }
    }
    return false
}

function isGameDraw() {
    return spaces.every(space => space !== null);
}


restartBtn.addEventListener('click', restart)
function restart() {
    // spaces.fill(null)
    // boxes.forEach( box => {
    //     box.innerText = ''
    // })

    // currentPlayer = X_TEXT
    location.reload()
}

startGame()
//board
let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

//char
let charWidth = 30;
let charHeight = 42;
let charX = boardWidth/8;
let charY = boardHeight/2;
let charImg;

let char = {
    x : charX,
    y : charY,
    width : charWidth,
    height : charHeight
}

//pipes
let pipeArray = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

//physics
let velocityX = -2; // pipes moving left speed
let velocityY = 0; //char jump speed
let gravity = 0.4;

let gameOver = false;
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
document.getElementById("high-score").innerHTML = "Best <br> " + highScore;

let gameStarted = false;

// Modify the event listener function to start the game
function startGame() {
    if (!gameStarted) {
        gameStarted = true;
        requestAnimationFrame(update);
        setInterval(placePipes, 1500);
    }
}

window.onload = function(){
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d"); //Use for Drawing

    //load image
    charImg = new Image();
    charImg.src = "./char.png";
    charImg.onload = function(){
        context.drawImage(charImg, char.x, char.y, char.width, char.height);
    }

    topPipeImg = new Image();
    topPipeImg.src = "./toppipe.png";

    bottomPipeImg = new Image();
    bottomPipeImg.src = "./bottompipe.png";

    document.addEventListener("keydown", moveChar); // keyboard
    document.addEventListener("touchstart", moveChar); // touch
}

function update(){
    requestAnimationFrame(update);
    if(gameOver){
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    //char
    velocityY += gravity;
    // char.y += velocityY;
    char.y = Math.max(char.y + velocityY, 0); //apply gravity to current char.y / limit the char.y to top of the canvas
    context.drawImage(charImg, char.x, char.y, char.width, char.height);

    if(char.y > board.height){
        gameOver = true;
    }

    //pipes
    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);
        
        if(!pipe.passed &&char.x > pipe.x + pipe.width) {
            score += 0.5; //bcz there are 2 pipes. 0.5x2=1, 1 for each set of pipe
            pipe.passed = true;
            updateScore();
        }

        if (detectCollision(char, pipe)){
            gameOver = true;
        }
    }

    //clear pipes
    while(pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
        pipeArray.shift(); // removes first pipe element
    }

    //score
    // context.fillStyle = "white";
    // context.font="45px sans-serif";
    // context.fillText(score, 5, 45);

    if(gameOver){
        // context.fillText("GAME OVER", 5, 90)
        showGameOverMessage();
    }
}

function placePipes(){

    if(gameOver){
        return;
    }

    let randomPipeY = pipeY - pipeHeight/4 - Math.random()*(pipeHeight/2);
    let openingSpace = board.height/4;

    let topPipe = {
        img : topPipeImg,
        x : pipeX,
        y : randomPipeY,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }
    pipeArray.push(topPipe);

    let bottomPipe = {
        img : bottomPipeImg,
        x : pipeX,
        y : randomPipeY + pipeHeight + openingSpace,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }
    pipeArray.push(bottomPipe);
}

function updateScore() {
    document.getElementById("score").innerHTML = "Score <br>" + score;
    if (score > highScore) {
        highScore = score;
        localStorage.setItem("highScore", highScore);
        document.getElementById("high-score").innerHTML = "Best <br> " + highScore;
    }
}


function showGameOverMessage() {
    document.getElementById("game-over").style.display = "block";
}

function hideGameOverMessage() {
    document.getElementById("game-over").style.display = "none";
}


function moveChar (e) {
    if ((e.type === "keydown" && (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX")) ||
        (e.type === "touchstart")) {

            startGame();
            // Jump
            velocityY = -6;

        // Reset if game over
        if (gameOver) {
            char.y = charY;
            pipeArray = [];
            score = 0;
            gameOver = false;
            updateScore();
            hideGameOverMessage();
        }
    }
}

function detectCollision(a, b){
    return a.x < b.x + b.width &&   //a's top left corner doesn't reach b's top right corner
           a.x + a.width > b.x &&   //a's top right corner passes b's top left corner
           a.y < b.y + b.height &&  //a's top left corner doesn't reach b's bottom left corner
           a.y + a.height > b.y;    //a's bottom left corner passes b's top left corner
}
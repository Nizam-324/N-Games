import { setupGround, updateGround } from "./ground.js"
import { setupchar, updatechar, getcharRect, setcharLose } from "./char.js"
import { setupCactus, updateCactus, getCactusRects } from "./cactus.js"

const WORLD_WIDTH = 2399
const WORLD_HEIGHT = 625
const SPEED_SCALE_INCREASE = 0.00001

const worldElem = document.querySelector("[data-world]")
const scoreElem = document.querySelector("[data-score]")
const highScoreElem = document.querySelector("[data-highScore]")
const startScreenElem = document.querySelector("[data-start-screen]")

let highestScore = localStorage.getItem("highestScore") || 0;
highScoreElem.textContent = `Best: ${Math.floor(highestScore)}`;

setPixelToWorldScale()
window.addEventListener("resize", setPixelToWorldScale)
document.addEventListener("keydown", (event) => {
    console.log(event.code);
    if (event.code === "Space") {
        handleStart();
    }
}, { once: true });
document.addEventListener("touchstart", handleStart, { once: true });

startScreenElem.classList.add("hide")

let lastTime
let speedScale
let score
function update(time) {
    if (lastTime == null) {
        lastTime = time
        window.requestAnimationFrame(update)
        return
    }
    const delta = time - lastTime
    
    updateGround(delta, speedScale)
    updatechar(delta, speedScale)
    updateCactus(delta, speedScale)
    updateSpeedScale(delta)
    updateScore(delta)
    if (checkLose()) return handleLose()

    lastTime = time
    window.requestAnimationFrame(update)
}

function checkLose() { 
    const charRect = getcharRect()
    return getCactusRects().some(rect => isCollision(rect, charRect))
}

function isCollision(rect1, rect2) {
    return (
        rect1.left < rect2.right &&
        rect1.top < rect2.bottom &&
        rect1.right > rect2.left &&
        rect1.bottom > rect2.top
    )
}

function updateSpeedScale(delta){
    speedScale += delta * SPEED_SCALE_INCREASE
}

function updateScore(delta){
    score += delta * .01
    scoreElem.textContent = `Score :${Math.floor(score)}`;

    if (score > highestScore) {
        highestScore = score;
        localStorage.setItem("highestScore", highestScore);
        highScoreElem.textContent = `Best: ${Math.floor(highestScore)}`;
    }

    if (score >= 500) {
        document.body.style.backgroundColor = '#FFD700';
    } else if (score >= 450) {
        document.body.style.backgroundColor = '#9966CC';
    } else if (score >= 350) {
        document.body.style.backgroundColor = '#FF3333';
    } else if (score >= 250) {
        document.body.style.backgroundColor = '#FF9933';
    } else if (score >= 150) {
        document.body.style.backgroundColor = '#3399FF';
    } else {
        // Handle the case when score is less than 150
        document.body.style.backgroundColor = 'white'; // or any default color
    }
 }

function handleStart(){
    lastTime = null
    speedScale = 1
    score = 0
    setupGround()
    setupchar()
    setupCactus()
    startScreenElem.classList.add("hide")
    window.requestAnimationFrame(update)
}

function handleLose() {
    setcharLose()
    setTimeout(() => {
        document.addEventListener("keydown", (event) => {
            console.log(event.code);
            if (event.code === "Space") {
                handleStart();
            }
        }, { once: true });
        document.addEventListener("touchstart", handleStart, { once: true });        
        startScreenElem.classList.remove("hide")
        document.body.style.backgroundColor = 'white';
    }, 100);
}
 
function setPixelToWorldScale() {
    let worldToPixelScale
    if (window.innerWidth / window.innerHeight < WORLD_WIDTH / WORLD_HEIGHT){
        worldToPixelScale = window.innerWidth / WORLD_WIDTH
    } else {
        worldToPixelScale = window.innerHeight / WORLD_HEIGHT
    }

    worldElem.style.width = `${WORLD_WIDTH * worldToPixelScale}px`
    worldElem.style.height = `${WORLD_HEIGHT * worldToPixelScale}px` 
} 



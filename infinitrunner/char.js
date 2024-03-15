import { getCustomProperty, incrementCustomProperty, setCustomProperty } from "./updateCustomProperty.js"

const charElem = document.querySelector("[data-char]")
const JUMP_SPEED = .45
const GRAVITY = 0.0015
const char_FRAME_COUNT = 2
const FRAME_TIME = 100

let isJumping
let charFrame
let currentFrameTime
let yVelocity
export function setupchar(){
    isJumping = false
    charFrame = 0
    currentFrameTime = 0
    yVelocity  = 0
    setCustomProperty(charElem, "--bottom", 0)
    document.removeEventListener("keydown", onJump)
    document.addEventListener("keydown", onJump)
    document.addEventListener("touchstart", onTouchStart);
}
 
export function updatechar(delta, speedScale){
    handleRun(delta, speedScale)
    handleJump(delta)
}

export function getcharRect() {
    return charElem.getBoundingClientRect()
}

export function setcharLose(){
    charElem.src = "imgs/char-lose.png"
}

function handleRun(delta, speedScale){
    if (isJumping) {
        charElem.src = `imgs/char-stationary.png`
        return
    }

    if (currentFrameTime >= FRAME_TIME){
        charFrame = (charFrame + 1) % char_FRAME_COUNT
        charElem.src = `imgs/char-run-${charFrame}.png`
        currentFrameTime -= FRAME_TIME 
    }
    currentFrameTime += delta * speedScale
}

function handleJump(delta){
    if (!isJumping) return

    incrementCustomProperty(charElem, "--bottom", yVelocity * delta)

    if (getCustomProperty(charElem, "--bottom") <= 0){
        setCustomProperty(charElem, "--bottom", 0)
        isJumping = false
    }

    yVelocity -= GRAVITY * delta
}

function onJump(e){
    if (e.code !== "Space" || isJumping) return

    yVelocity = JUMP_SPEED
    isJumping = true
}

// Touch event handling for jumping
function onTouchStart() {
        onJump({ code: "Space" });
}

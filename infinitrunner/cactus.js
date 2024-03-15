import { getCustomProperty, incrementCustomProperty, setCustomProperty } from "./updateCustomProperty.js"

const SPEED = .05
const CACTUS_INTERVAL_MIN = 500
const CACTUS_INTERVAL_MAX = 2500
const worldElem = document.querySelector("[data-world]")

let nextCactusTime
export function setupCactus(){
    nextCactusTime = CACTUS_INTERVAL_MIN
    document.querySelectorAll("[data-cactus]").forEach(cactus => {
        cactus.remove()
    })
}

export function updateCactus(delta, speedScale){
    document.querySelectorAll("[data-cactus]").forEach(cactus => {
        incrementCustomProperty(cactus, "--left", delta * speedScale * SPEED * -1)
        if (getCustomProperty(cactus, "--left") <= -100){
            cactus.remove()
        }
    }) 

    if (nextCactusTime <= 0) {
        createCactus()
        nextCactusTime = randomNumberBetween(CACTUS_INTERVAL_MIN, CACTUS_INTERVAL_MAX) / speedScale
    }
    nextCactusTime -=delta
}

export function getCactusRects(){
    return [...document.querySelectorAll("[data-cactus]")].map(cactus => {
        return cactus.getBoundingClientRect()
    })
}

const cactusImages = [
    "imgs/obst-1.svg",
    "imgs/obst-2.svg",
    "imgs/obst-3.svg",
    "imgs/obst-4.svg",
    "imgs/obst-5.svg",
    "imgs/obst-6.svg",
    
];

function createCactus(){
    const cactus = document.createElement("img")
    cactus.dataset.cactus = true

    // Randomly select a cactus image from the array
    const randomImage = cactusImages[Math.floor(Math.random() * cactusImages.length)];
    cactus.src = randomImage;

    cactus.classList.add("cactus")

    // Randomize the size of the cactus
    const cactusSize = randomNumberBetween(26, 30); // Adjust the range as needed
    // cactus.style.width = `${cactusSize}px`;
    cactus.style.height = `${cactusSize}%`;

    setCustomProperty(cactus, "--left", 100)
    worldElem.append(cactus)
}

function randomNumberBetween(min, max){
    return Math.floor(Math.random() * (max - min + 1) + min)
}


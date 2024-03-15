const tilesContainer = document.querySelector(".tiles")
const images = ["img1.svg", "img2.svg", "img3.svg", "img4.svg", "img5.svg", "img6.svg", "img7.svg", "img8.svg",];
const imagePickList = [...images, ...images];
const tileCount = imagePickList.length;

// Game State
let revealedCount = 0;
let activeTile = null;
let awaitingEndOfMove = false;
let timerRunning = false;
let timer;
let seconds = 30;
const timerDisplay = document.querySelector(".timer");
const message = document.querySelector(".message");

function biuldTile(image){
    const element = document.createElement("div");
    const img = document.createElement("img");
    img.style.visibility = "hidden";
    img.src = `images/${image}`;

    element.appendChild(img);

    element.classList.add("tile");
    
    element.setAttribute("data-image", image);
    element.setAttribute("data-revealed", "false");

    element.addEventListener("click", () =>{
        const revealed = element.getAttribute("data-revealed");

        if (awaitingEndOfMove 
            || revealed === "true" 
            || element == activeTile
        ) {
            return;
        }

        if (!timerRunning) {
            timer = setInterval(() => {
                if (seconds > 0) {
                    seconds--;
                    timerDisplay.textContent = `Time: ${seconds}s`;
                } else {
                    clearInterval(timer);
                    timerRunning = false;
                    message.style.display = "block";
                }
            }, 1000);
            timerRunning = true;
        }
        
        //Reveal this image
        img.style.visibility = "visible";

        if (!activeTile) {
            activeTile = element;
            return;
        }

        const imageMatch = activeTile.getAttribute("data-image");

        if (imageMatch === image) {
            activeTile.setAttribute("data-revealed", "true");
            element.setAttribute("data-revealed", "true");

            activeTile = null;
            awaitingEndOfMove = false;
            revealedCount += 2;

            if (revealedCount === tileCount) {
                alert(`You win! Time taken: ${seconds} seconds. Refresh to play again.`);
                clearInterval(timer);
                timerRunning = false;
            }
            
            return;
        }

        awaitingEndOfMove = true;

        setTimeout(() => {
            img.style.visibility = "hidden";
            activeTile.querySelector("img").style.visibility = "hidden";

            awaitingEndOfMove = false;
            activeTile = null;
        }, 1000);
    });

    return element;

}

// Build up tiles
for (let i = 0; i < tileCount; i++) {
    const randomIndex = Math.floor(Math.random() * imagePickList.length);
    const image = imagePickList[randomIndex];
    const tile = biuldTile(image)

    imagePickList.splice(randomIndex, 1);
    tilesContainer.appendChild(tile);
}

function restartGame(){
    location.reload();
}
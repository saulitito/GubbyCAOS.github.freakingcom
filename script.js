const button = document.getElementById("gubbyButton");
const container = document.getElementById("gubbyContainer");
const sound = document.getElementById("gubbySound");

let gubbys = [];

button.addEventListener("click", () => {

    // Create 15 Gubbys every time the button is clicked
    for (let i = 0; i < 15; i++) {
        createGubby();
    }

});


function createGubby() {

    const gubby = document.createElement("div");

    gubby.className = "gubby";
    gubby.textContent = "GUBBY";

    container.appendChild(gubby);

    const size = 70;

    // Start from the left side
    let x = -size;
    let y = Math.random() * (window.innerHeight - size);

    // Random speed
    let velocityX = 3 + Math.random() * 5;
    let velocityY = -5 + Math.random() * 10;

    gubby.style.left = x + "px";
    gubby.style.top = y + "px";

    const gubbyData = {
        element: gubby,
        x: x,
        y: y,
        vx: velocityX,
        vy: velocityY,
        size: size
    };

    gubbys.push(gubbyData);
}


// Game loop
function update() {

    for (const gubby of gubbys) {

        gubby.x += gubby.vx;
        gubby.y += gubby.vy;

        // Gravity
        gubby.vy += 0.25;


        // Left wall
        if (gubby.x <= 0) {

            gubby.x = 0;
            gubby.vx *= -1;

            playSound();
        }


        // Right wall
        if (gubby.x + gubby.size >= window.innerWidth) {

            gubby.x = window.innerWidth - gubby.size;
            gubby.vx *= -1;

            playSound();
        }


        // Top wall
        if (gubby.y <= 0) {

            gubby.y = 0;
            gubby.vy *= -0.9;

            playSound();
        }


        // Bottom wall
        if (gubby.y + gubby.size >= window.innerHeight) {

            gubby.y = window.innerHeight - gubby.size;
            gubby.vy *= -0.9;

            playSound();
        }


        gubby.element.style.left = gubby.x + "px";
        gubby.element.style.top = gubby.y + "px";
    }

    requestAnimationFrame(update);
}


// Play the uploaded Gubby sound
function playSound() {

    const newSound = sound.cloneNode();

    newSound.volume = 0.7;

    newSound.play().catch(() => {});

    newSound.addEventListener("ended", () => {
        newSound.remove();
    });
}


update();

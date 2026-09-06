// ========================================
// GUBBY FULL CAOS
// Main Script
// ========================================

const gubbyContainer = document.getElementById("gubbyContainer");

const settingsButton = document.getElementById("settingsButton");
const settingsMenu = document.getElementById("settingsMenu");
const closeSettings = document.getElementById("closeSettings");

const clearButton = document.getElementById("clearButton");
const gubhubButton = document.getElementById("gubhubButton");
const stillLifeButton = document.getElementById("stillLifeButton");

const amountInput = document.getElementById("gubbyAmount");

const goldenToggle = document.getElementById("goldenToggle");
const rainbowToggle = document.getElementById("rainbowToggle");


// ========================================
// SETTINGS
// ========================================

let settings = {
    golden: true,
    rainbow: true,
    amount: 25
};


// ========================================
// GUBBY CREATION
// ========================================

function createGubby() {

    const gubby = document.createElement("img");

    gubby.src = "gubby.png";
    gubby.className = "gubby";
    gubby.alt = "Gubby";

    // Random vertical position
    const screenHeight = window.innerHeight;

    const y =
        Math.random() *
        Math.max(100, screenHeight - 100);

    gubby.style.top = `${y}px`;

    // Start outside the left side
    gubby.style.left = "-100px";

    // Random size
    const size =
        Math.floor(
            Math.random() * 35
        ) + 60;

    gubby.style.width = `${size}px`;
    gubby.style.height = `${size}px`;

    // ========================================
    // VARIANTS
    // ========================================

    const roll = Math.random() * 100;

    if (
        settings.golden &&
        roll < 5
    ) {
        gubby.classList.add("golden");
    }
    else if (
        settings.rainbow &&
        roll < 6
    ) {
        gubby.classList.add("rainbow");
    }

    gubbyContainer.appendChild(gubby);

    // ========================================
    // MOVEMENT
    // ========================================

    let x = -100;

    const speed =
        Math.random() * 4 + 2;

    let rotation =
        Math.random() * 20 - 10;

    function move() {

        if (!gubby.isConnected) {
            return;
        }

        x += speed;

        rotation +=
            Math.sin(x * 0.03) * 0.7;

        gubby.style.left = `${x}px`;

        // Slight floating motion
        const float =
            Math.sin(x * 0.025) * 8;

        gubby.style.transform =
            `translateY(${float}px) rotate(${rotation}deg)`;

        // Hit right wall
        if (
            x >=
            window.innerWidth - size
        ) {

            bounceOffWall();

            return;
        }

        requestAnimationFrame(move);
    }

    function bounceOffWall() {

        // Little squash effect
        gubby.style.transform =
            `translateY(0) scaleX(0.72) scaleY(1.18) rotate(0deg)`;

        playWallSound();

        setTimeout(() => {

            if (!gubby.isConnected) {
                return;
            }

            gubby.style.transform =
                `translateY(0) scaleX(1.12) scaleY(0.9)`;

        }, 100);

        setTimeout(() => {

            if (!gubby.isConnected) {
                return;
            }

            gubby.style.transform =
                `translateY(0) scale(1)`;

        }, 190);

        // Send it back
        setTimeout(() => {

            if (!gubby.isConnected) {
                return;
            }

            x = -size - 20;

            requestAnimationFrame(move);

        }, 210);
    }

    move();
}


// ========================================
// WALL SOUND
// ========================================

function playWallSound() {

    const sound =
        new Audio("wall-hit.mp3");

    sound.volume = 0.4;

    sound.play().catch(() => {});
}


// ========================================
// SPAWN SYSTEM
// ========================================

let spawnTimer;

function startSpawning() {

    clearInterval(spawnTimer);

    spawnTimer = setInterval(() => {

        createGubby();

    }, 650);
}


// ========================================
// CLEAR GUBBYS
// ========================================

function clearGubbys() {

    gubbyContainer.innerHTML = "";
}


// ========================================
// SETTINGS MENU
// ========================================

settingsButton?.addEventListener(
    "click",
    () => {

        settingsMenu.classList.toggle(
            "open"
        );

    }
);


closeSettings?.addEventListener(
    "click",
    () => {

        settingsMenu.classList.remove(
            "open"
        );

    }
);


// Close settings when clicking outside

document.addEventListener(
    "click",
    event => {

        if (
            !settingsMenu ||
            !settingsButton
        ) {
            return;
        }

        if (
            settingsMenu.contains(event.target) ||
            settingsButton.contains(event.target)
        ) {
            return;
        }

        settingsMenu.classList.remove(
            "open"
        );

    }
);


// ========================================
// GOLDEN TOGGLE
// ========================================

goldenToggle?.addEventListener(
    "click",
    () => {

        settings.golden =
            !settings.golden;

        goldenToggle.classList.toggle(
            "active",
            settings.golden
        );

        goldenToggle.textContent =
            settings.golden
                ? "ON"
                : "OFF";

    }
);


// ========================================
// RAINBOW TOGGLE
// ========================================

rainbowToggle?.addEventListener(
    "click",
    () => {

        settings.rainbow =
            !settings.rainbow;

        rainbowToggle.classList.toggle(
            "active",
            settings.rainbow
        );

        rainbowToggle.textContent =
            settings.rainbow
                ? "ON"
                : "OFF";

    }
);


// ========================================
// AMOUNT
// ========================================

amountInput?.addEventListener(
    "change",
    () => {

        let amount =
            parseInt(
                amountInput.value,
                10
            );

        if (
            Number.isNaN(amount)
        ) {
            amount = 25;
        }

        // Prevent absurd amounts
        amount =
            Math.max(
                1,
                Math.min(
                    amount,
                    100
                )
            );

        settings.amount = amount;

        amountInput.value = amount;

        clearGubbys();

        for (
            let i = 0;
            i < amount;
            i++
        ) {
            setTimeout(
                createGubby,
                i * 40
            );
        }

    }
);


// ========================================
// CLEAR BUTTON
// ========================================

clearButton?.addEventListener(
    "click",
    () => {

        clearGubbys();

    }
);


// ========================================
// GUBHUB
// ========================================

gubhubButton?.addEventListener(
    "click",
    () => {

        window.location.href =
            "gubhub.html";

    }
);


// ========================================
// STILL LIFE
// ========================================

stillLifeButton?.addEventListener(
    "click",
    () => {

        window.location.href =
            "still-life.html";

    }
);


// ========================================
// STARTUP
// ========================================

goldenToggle?.classList.toggle(
    "active",
    settings.golden
);

rainbowToggle?.classList.toggle(
    "active",
    settings.rainbow
);

if (amountInput) {
    amountInput.value =
        settings.amount;
}


// Initial Gubbys

for (
    let i = 0;
    i < settings.amount;
    i++
) {

    setTimeout(
        createGubby,
        i * 40
    );

}


// Continue spawning
startSpawning();


// ========================================
// PREVENT TOO MANY GUBBYS
// ========================================

setInterval(() => {

    const gubbys =
        gubbyContainer.querySelectorAll(
            ".gubby"
        );

    if (
        gubbys.length > 120
    ) {

        const removeAmount =
            gubbys.length - 100;

        for (
            let i = 0;
            i < removeAmount;
            i++
        ) {

            gubbys[i].remove();

        }

    }

}, 3000);

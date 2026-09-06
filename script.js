// =====================================================
// GUBBY FULL CAOS
// =====================================================


// =====================================================
// ELEMENTS
// =====================================================

const container =
    document.getElementById("gubbyContainer");

const menu =
    document.getElementById("sideMenu");

const menuButton =
    document.getElementById("menuButton");

const closeMenu =
    document.getElementById("closeMenu");

const menuButtons =
    document.getElementById("menuButtons");

const counter =
    document.getElementById("gubbyCounter");

const settingsMenu =
    document.getElementById("settingsMenu");

const closeSettings =
    document.getElementById("closeSettings");

const goldenToggle =
    document.getElementById("goldenToggle");

const rainbowToggle =
    document.getElementById("rainbowToggle");

const speedAmount =
    document.getElementById("speedAmount");

const amountInput =
    document.getElementById("gubbyAmount");


// =====================================================
// SETTINGS
// =====================================================

const settings = {

    golden: true,

    rainbow: true,

    speed: 5,

    amount: 25

};


// =====================================================
// EASY MENU BUTTON SYSTEM
// =====================================================
//
// ADDING A BUTTON:
//
// {
//     id: "myButton",
//     icon: "🔥",
//     text: "MY BUTTON",
//     action: () => {
//         alert("HELLO!");
//     }
// }
//
// =====================================================

const MENU_BUTTONS = [

    {
        id: "spawn",

        icon: "💨",

        text: "SPAWN GUBBYS",

        action: () => {

            spawnWave(10);

        }
    },


    {
        id: "megaSpawn",

        icon: "💀",

        text: "MEGA SPAWN",

        action: () => {

            spawnWave(30);

        }
    },


    {
        id: "clear",

        icon: "🧹",

        text: "CLEAR GUBBYS",

        action: () => {

            clearGubbys();

        }
    },


    {
        id: "settings",

        icon: "⚙️",

        text: "SETTINGS",

        action: () => {

            settingsMenu.classList.toggle(
                "open"
            );

        }
    },


    {
        id: "comments",

        icon: "💬",

        text: "COMMENTS",

        action: () => {

            window.location.href =
                "comments.html";

        }
    },


    {
        id: "stillLife",

        icon: "👁️",

        text: "STILL LIFE",

        action: () => {

            window.location.href =
                "still-life.html";

        }
    }

];


// =====================================================
// BUILD MENU
// =====================================================

function buildMenu() {

    menuButtons.innerHTML = "";

    MENU_BUTTONS.forEach(buttonData => {

        const button =
            document.createElement("button");

        button.className =
            "caos-button";

        button.id =
            buttonData.id;

        button.innerHTML = `
            <span class="button-icon">
                ${buttonData.icon}
            </span>

            <span>
                ${buttonData.text}
            </span>
        `;

        button.addEventListener(
            "click",
            buttonData.action
        );

        menuButtons.appendChild(button);

    });

}


// =====================================================
// MENU OPEN/CLOSE
// =====================================================

menuButton.addEventListener(
    "click",
    () => {

        menu.classList.toggle(
            "open"
        );

    }
);


closeMenu.addEventListener(
    "click",
    () => {

        menu.classList.remove(
            "open"
        );

    }
);


// =====================================================
// GUBBY COUNT
// =====================================================

function updateCounter() {

    const amount =
        container.querySelectorAll(
            ".gubby"
        ).length;

    counter.textContent =
        amount;

}


// =====================================================
// RANDOM
// =====================================================

function random(min, max) {

    return Math.random() *
        (max - min) +
        min;

}


// =====================================================
// CREATE GUBBY
// =====================================================

function createGubby() {

    const gubby =
        document.createElement("img");

    gubby.src =
        "gubby.png";

    gubby.className =
        "gubby";

    gubby.alt =
        "Gubby";


    // -------------------------------------------------
    // SIZE
    // -------------------------------------------------

    const size =
        random(55, 90);

    gubby.style.width =
        `${size}px`;

    gubby.style.height =
        `${size}px`;


    // -------------------------------------------------
    // RANDOM VARIANT
    // -------------------------------------------------

    const variant =
        Math.random() * 100;


    if (
        settings.golden &&
        variant < 5
    ) {

        gubby.classList.add(
            "golden"
        );

    }
    else if (
        settings.rainbow &&
        variant < 6
    ) {

        gubby.classList.add(
            "rainbow"
        );

    }


    // -------------------------------------------------
    // START POSITION
    // -------------------------------------------------

    const startSide =
        Math.floor(
            Math.random() * 4
        );


    let x;
    let y;


    if (startSide === 0) {

        // LEFT

        x = -size;

        y = random(
            0,
            window.innerHeight
        );

    }
    else if (startSide === 1) {

        // RIGHT

        x =
            window.innerWidth + size;

        y =
            random(
                0,
                window.innerHeight
            );

    }
    else if (startSide === 2) {

        // TOP

        x =
            random(
                0,
                window.innerWidth
            );

        y = -size;

    }
    else {

        // BOTTOM

        x =
            random(
                0,
                window.innerWidth
            );

        y =
            window.innerHeight + size;

    }


    // -------------------------------------------------
    // RANDOM DIRECTION
    // -------------------------------------------------

    const angle =
        random(
            0,
            Math.PI * 2
        );


    const speed =
        random(
            2.5,
            6
        ) *
        (settings.speed / 5);


    let velocityX =
        Math.cos(angle) * speed;

    let velocityY =
        Math.sin(angle) * speed;


    let rotation =
        random(
            -20,
            20
        );


    const rotationSpeed =
        random(
            -4,
            4
        );


    // -------------------------------------------------
    // APPEND
    // -------------------------------------------------

    container.appendChild(
        gubby
    );


    // -------------------------------------------------
    // ANIMATION
    // -------------------------------------------------

    function fly() {

        if (
            !gubby.isConnected
        ) {

            return;

        }


        x += velocityX;

        y += velocityY;

        rotation +=
            rotationSpeed;


        // ---------------------------------------------
        // WALL BOUNCE
        // ---------------------------------------------

        let bounced = false;


        if (
            x <= 0 ||
            x >=
            window.innerWidth - size
        ) {

            velocityX *= -1;

            x =
                Math.max(
                    0,
                    Math.min(
                        x,
                        window.innerWidth - size
                    )
                );

            bounced = true;

        }


        if (
            y <= 0 ||
            y >=
            window.innerHeight - size
        ) {

            velocityY *= -1;

            y =
                Math.max(
                    0,
                    Math.min(
                        y,
                        window.innerHeight - size
                    )
                );

            bounced = true;

        }


        // ---------------------------------------------
        // BOUNCE EFFECT
        // ---------------------------------------------

        if (bounced) {

            gubby.classList.remove(
                "squash"
            );

            void gubby.offsetWidth;

            gubby.classList.add(
                "squash"
            );

            playWallSound();

        }


        // ---------------------------------------------
        // APPLY POSITION
        // ---------------------------------------------

        gubby.style.left =
            `${x}px`;

        gubby.style.top =
            `${y}px`;

        gubby.style.transform =
            `rotate(${rotation}deg)`;


        requestAnimationFrame(
            fly
        );

    }


    fly();


    updateCounter();

}


// =====================================================
// WALL SOUND
// =====================================================

function playWallSound() {

    const sound =
        new Audio(
            "wall-hit.mp3"
        );

    sound.volume =
        0.35;

    sound.play().catch(
        () => {}
    );

}


// =====================================================
// SPAWN WAVE
// =====================================================

function spawnWave(amount) {

    for (
        let i = 0;
        i < amount;
        i++
    ) {

        setTimeout(
            () => {

                createGubby();

            },
            i * 70
        );

    }

}


// =====================================================
// CLEAR
// =====================================================

function clearGubbys() {

    container.innerHTML = "";

    updateCounter();

}


// =====================================================
// GOLDEN
// =====================================================

goldenToggle.addEventListener(
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


// =====================================================
// RAINBOW
// =====================================================

rainbowToggle.addEventListener(
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


// =====================================================
// SPEED
// =====================================================

speedAmount.addEventListener(
    "input",
    () => {

        settings.speed =
            Number(
                speedAmount.value
            );

    }
);


// =====================================================
// AMOUNT
// =====================================================

amountInput.addEventListener(
    "change",
    () => {

        let amount =
            Number(
                amountInput.value
            );


        if (
            Number.isNaN(amount)
        ) {

            amount = 25;

        }


        amount =
            Math.max(
                1,
                Math.min(
                    amount,
                    100
                )
            );


        settings.amount =
            amount;


        amountInput.value =
            amount;


        clearGubbys();

        spawnWave(
            amount
        );

    }
);


// =====================================================
// CLOSE SETTINGS
// =====================================================

closeSettings.addEventListener(
    "click",
    () => {

        settingsMenu.classList.remove(
            "open"
        );

    }
);


// =====================================================
// INITIALIZE
// =====================================================

buildMenu();

spawnWave(
    settings.amount
);


// =====================================================
// KEEP COUNTER UPDATED
// =====================================================

setInterval(
    updateCounter,
    500
);

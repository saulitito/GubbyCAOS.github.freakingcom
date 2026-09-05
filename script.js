/* =====================================
   ELEMENTS
===================================== */

const button =
    document.getElementById("gubbyButton");

const container =
    document.getElementById("gubbyContainer");

const sound =
    document.getElementById("gubbySound");

const settingsButton =
    document.getElementById("settingsButton");

const settingsMenu =
    document.getElementById("settingsMenu");

const closeSettings =
    document.getElementById("closeSettings");

const soundToggle =
    document.getElementById("soundToggle");

const gravityToggle =
    document.getElementById("gravityToggle");

const bounceToggle =
    document.getElementById("bounceToggle");

const chaosToggle =
    document.getElementById("chaosToggle");

const clearButton =
    document.getElementById("clearButton");

const gubbyAmount =
    document.getElementById("gubbyAmount");


/* =====================================
   SETTINGS
===================================== */

let gubbys = [];

let soundsEnabled = true;

let gravityEnabled = true;

let bounceEnabled = true;

let chaosEnabled = false;


/* =====================================
   SETTINGS MENU
===================================== */

settingsButton.addEventListener(
    "click",
    () => {

        settingsMenu.classList.toggle(
            "open"
        );

    }
);


closeSettings.addEventListener(
    "click",
    () => {

        settingsMenu.classList.remove(
            "open"
        );

    }
);


/* =====================================
   TOGGLE SYSTEM
===================================== */

function toggleSetting(
    toggleButton,
    callback
) {

    toggleButton.classList.toggle(
        "active"
    );

    const enabled =
        toggleButton.classList.contains(
            "active"
        );

    toggleButton.textContent =
        enabled
            ? "ON"
            : "OFF";

    callback(enabled);
}


/* =====================================
   SOUND TOGGLE
===================================== */

soundToggle.addEventListener(
    "click",
    () => {

        toggleSetting(
            soundToggle,
            (value) => {
                soundsEnabled = value;
            }
        );

    }
);


/* =====================================
   GRAVITY TOGGLE
===================================== */

gravityToggle.addEventListener(
    "click",
    () => {

        toggleSetting(
            gravityToggle,
            (value) => {
                gravityEnabled = value;
            }
        );

    }
);


/* =====================================
   BOUNCE TOGGLE
===================================== */

bounceToggle.addEventListener(
    "click",
    () => {

        toggleSetting(
            bounceToggle,
            (value) => {
                bounceEnabled = value;
            }
        );

    }
);


/* =====================================
   CHAOS MODE
===================================== */

chaosToggle.addEventListener(
    "click",
    () => {

        toggleSetting(
            chaosToggle,
            (value) => {
                chaosEnabled = value;
            }
        );

    }
);


/* =====================================
   CREATE GUBBY
===================================== */

function createGubby() {

    const gubby =
        document.createElement("img");

    gubby.className =
        "gubby";

    gubby.src =
        "gubby.png";

    container.appendChild(
        gubby
    );


    /* =================================
       RARITY
    ================================= */

    const roll =
        Math.random() * 100;

    let variant =
        "normal";


    // 🌈 Rainbow = 1%
    if (roll < 1) {

        variant =
            "rainbow";

    }

    // 🟡 Golden = 5%
    else if (roll < 6) {

        variant =
            "golden";

    }


    /* =================================
       APPLY VARIANT
    ================================= */

    if (
        variant !== "normal"
    ) {

        gubby.classList.add(
            variant
        );

    }


    /* =================================
       PHYSICS
    ================================= */

    const size = 75;


    let x =
        -size;


    let y =
        Math.random() *
        (
            window.innerHeight -
            size
        );


    let vx =
        3 +
        Math.random() * 5;


    let vy =
        -5 +
        Math.random() * 10;


    /* =================================
       CHAOS MODE
    ================================= */

    if (chaosEnabled) {

        vx *= 2;

        vy *= 2;

    }


    /* =================================
       RARE SPEED
    ================================= */

    if (
        variant === "golden"
    ) {

        vx *= 1.2;

    }


    if (
        variant === "rainbow"
    ) {

        vx *= 1.5;

        vy *= 1.3;

    }


    /* =================================
       DATA
    ================================= */

    const gubbyData = {

        element: gubby,

        x: x,

        y: y,

        vx: vx,

        vy: vy,

        size: size,

        variant: variant

    };


    gubbys.push(
        gubbyData
    );


    console.log(
        "Gubby spawned:",
        variant
    );
}


/* =====================================
   RELEASE GUBBYS
===================================== */

button.addEventListener(
    "click",
    () => {

        let amount =
            Number(
                gubbyAmount.value
            );


        if (
            isNaN(amount)
        ) {

            amount = 15;

        }


        amount =
            Math.max(
                1,
                Math.min(
                    amount,
                    100
                )
            );


        for (
            let i = 0;
            i < amount;
            i++
        ) {

            createGubby();

        }

    }
);


/* =====================================
   WALL SOUND
===================================== */

function playSound() {

    if (
        !soundsEnabled
    ) {

        return;
    }


    const newSound =
        sound.cloneNode();


    newSound.volume =
        0.7;


    newSound.play()
        .catch(
            () => {}
        );


    newSound.addEventListener(
        "ended",
        () => {

            newSound.remove();

        }
    );
}


/* =====================================
   PHYSICS LOOP
===================================== */

function update() {

    for (
        const gubby of gubbys
    ) {


        /* =============================
           GRAVITY
        ============================= */

        if (
            gravityEnabled
        ) {

            gubby.vy +=
                0.25;

        }


        /* =============================
           MOVEMENT
        ============================= */

        gubby.x +=
            gubby.vx;

        gubby.y +=
            gubby.vy;


        /* =============================
           LEFT WALL
        ============================= */

        if (
            gubby.x <= 0
        ) {

            gubby.x = 0;


            if (
                bounceEnabled
            ) {

                gubby.vx *= -1;

                playSound();

            }

        }


        /* =============================
           RIGHT WALL
        ============================= */

        if (
            gubby.x +
            gubby.size >=
            window.innerWidth
        ) {

            gubby.x =
                window.innerWidth -
                gubby.size;


            if (
                bounceEnabled
            ) {

                gubby.vx *= -1;

                playSound();

            }

        }


        /* =============================
           TOP WALL
        ============================= */

        if (
            gubby.y <= 0
        ) {

            gubby.y = 0;


            if (
                bounceEnabled
            ) {

                gubby.vy *=
                    -0.9;

                playSound();

            }

        }


        /* =============================
           BOTTOM WALL
        ============================= */

        if (
            gubby.y +
            gubby.size >=
            window.innerHeight
        ) {

            gubby.y =
                window.innerHeight -
                gubby.size;


            if (
                bounceEnabled
            ) {

                gubby.vy *=
                    -0.9;

                playSound();

            }

        }


        /* =============================
           POSITION
        ============================= */

        gubby.element.style.left =
            gubby.x + "px";

        gubby.element.style.top =
            gubby.y + "px";

    }


    requestAnimationFrame(
        update
    );
}


/* =====================================
   CLEAR GUBBYS
===================================== */

clearButton.addEventListener(
    "click",
    () => {

        for (
            const gubby of gubbys
        ) {

            gubby.element.remove();

        }


        gubbys = [];

    }
);


/* =====================================
   START PHYSICS
===================================== */

update();

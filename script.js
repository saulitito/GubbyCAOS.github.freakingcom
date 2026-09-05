const button = document.getElementById("gubbyButton");

const container = document.getElementById("gubbyContainer");

const sound = document.getElementById("gubbySound");

const settingsButton = document.getElementById("settingsButton");

const settingsMenu = document.getElementById("settingsMenu");

const closeSettings = document.getElementById("closeSettings");

const soundToggle = document.getElementById("soundToggle");

const gravityToggle = document.getElementById("gravityToggle");

const bounceToggle = document.getElementById("bounceToggle");

const chaosToggle = document.getElementById("chaosToggle");

const clearButton = document.getElementById("clearButton");

const gubbyAmount = document.getElementById("gubbyAmount");


let gubbys = [];

let soundsEnabled = true;

let gravityEnabled = true;

let bounceEnabled = true;

let chaosEnabled = false;


/* =========================
   SETTINGS MENU
========================= */

settingsButton.addEventListener("click", () => {

    settingsMenu.classList.toggle("open");

});


closeSettings.addEventListener("click", () => {

    settingsMenu.classList.remove("open");

});


/* =========================
   TOGGLE FUNCTION
========================= */

function toggleSetting(button, callback) {

    button.classList.toggle("active");

    const enabled = button.classList.contains("active");

    button.textContent = enabled ? "ON" : "OFF";

    callback(enabled);
}


/* SOUND */

soundToggle.addEventListener("click", () => {

    toggleSetting(soundToggle, (value) => {

        soundsEnabled = value;

    });

});


/* GRAVITY */

gravityToggle.addEventListener("click", () => {

    toggleSetting(gravityToggle, (value) => {

        gravityEnabled = value;

    });

});


/* BOUNCE */

bounceToggle.addEventListener("click", () => {

    toggleSetting(bounceToggle, (value) => {

        bounceEnabled = value;

    });

});


/* CHAOS */

chaosToggle.addEventListener("click", () => {

    toggleSetting(chaosToggle, (value) => {

        chaosEnabled = value;

    });

});


/* =========================
   CREATE GUBBY
========================= */

function createGubby() {

    const gubby = document.createElement("img");

    gubby.className = "gubby";

    gubby.src = "gubby.png";

    container.appendChild(gubby);


    const size = 75;


    let x = -size;

    let y = Math.random() * (window.innerHeight - size);


    let vx = 3 + Math.random() * 5;

    let vy = -5 + Math.random() * 10;


    if (chaosEnabled) {

        vx *= 2;

        vy *= 2;

    }


    const gubbyData = {

        element: gubby,

        x: x,

        y: y,

        vx: vx,

        vy: vy,

        size: size

    };


    gubbys.push(gubbyData);

}


/* =========================
   RELEASE GUBBYS
========================= */

button.addEventListener("click", () => {

    let amount = Number(gubbyAmount.value);

    amount = Math.max(1, Math.min(amount, 100));


    for (let i = 0; i < amount; i++) {

        createGubby();

    }

});


/* =========================
   PLAY SOUND
========================= */

function playSound() {

    if (!soundsEnabled) {
        return;
    }


    const newSound = sound.cloneNode();

    newSound.volume = 0.7;

    newSound.play().catch(() => {});


    newSound.addEventListener("ended", () => {

        newSound.remove();

    });

}


/* =========================
   PHYSICS
========================= */

function update() {

    for (const gubby of gubbys) {

        /* GRAVITY */

        if (gravityEnabled) {

            gubby.vy += 0.25;

        }


        /* MOVEMENT */

        gubby.x += gubby.vx;

        gubby.y += gubby.vy;


        /* LEFT WALL */

        if (gubby.x <= 0) {

            gubby.x = 0;

            if (bounceEnabled) {

                gubby.vx *= -1;

                playSound();

            }

        }


        /* RIGHT WALL */

        if (gubby.x + gubby.size >= window.innerWidth) {

            gubby.x = window.innerWidth - gubby.size;

            if (bounceEnabled) {

                gubby.vx *= -1;

                playSound();

            }

        }


        /* TOP */

        if (gubby.y <= 0) {

            gubby.y = 0;

            if (bounceEnabled) {

                gubby.vy *= -0.9;

                playSound();

            }

        }


        /* BOTTOM */

        if (gubby.y + gubby.size >= window.innerHeight) {

            gubby.y = window.innerHeight - gubby.size;

            if (bounceEnabled) {

                gubby.vy *= -0.9;

                playSound();

            }

        }


        /* UPDATE IMAGE */

        gubby.element.style.left = gubby.x + "px";

        gubby.element.style.top = gubby.y + "px";

    }


    requestAnimationFrame(update);

}


/* =========================
   CLEAR ALL
========================= */

clearButton.addEventListener("click", () => {

    for (const gubby of gubbys) {

        gubby.element.remove();

    }

    gubbys = [];

});


/* START */

update();

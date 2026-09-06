// ============================================
// MY SINGING GUBBY
// ============================================

const STARTING_COINS = 10;
const MAX_SLOTS = 6;

const COIN_INTERVAL = 10000;
const SING_INTERVAL = 3000;

const SAVE_KEY = "MY_SINGING_GUBBY_SAVE_V2";

const PRICES = {
    normal: 5,
    golden: 15
};


// ============================================
// CREATE SAVE
// ============================================

function createNewSave() {

    return {
        coins: STARTING_COINS,

        inventory: [],

        placed: [
            null,
            null,
            null,
            null,
            null,
            null
        ]
    };
}


// ============================================
// LOAD GAME
// ============================================

function loadGame() {

    const saved =
        localStorage.getItem(SAVE_KEY);

    if (!saved) {

        const newSave =
            createNewSave();

        localStorage.setItem(
            SAVE_KEY,
            JSON.stringify(newSave)
        );

        return newSave;
    }

    try {

        const data =
            JSON.parse(saved);

        let placed =
            Array.isArray(data.placed)
                ? data.placed
                : [];

        placed =
            placed.slice(0, MAX_SLOTS);

        while (
            placed.length < MAX_SLOTS
        ) {
            placed.push(null);
        }

        return {

            coins:
                typeof data.coins === "number"
                    ? Math.max(0, data.coins)
                    : STARTING_COINS,

            inventory:
                Array.isArray(data.inventory)
                    ? data.inventory
                    : [],

            placed: placed
        };

    } catch (error) {

        console.error(
            "Save was corrupted:",
            error
        );

        return createNewSave();
    }
}


let game = loadGame();

let selectedInventoryIndex = null;


// ============================================
// ELEMENTS
// ============================================

const coinAmount =
    document.getElementById("coinAmount");

const inventory =
    document.getElementById("inventory");

const inventoryMessage =
    document.getElementById("inventoryMessage");

const islandMessage =
    document.getElementById("islandMessage");

const shopPanel =
    document.getElementById("shopPanel");

const inventoryPanel =
    document.getElementById("inventoryPanel");

const normalSound =
    document.getElementById("normalSound");

const goldenSound =
    document.getElementById("goldenSound");


// ============================================
// AUDIO
// ============================================

let audioUnlocked = false;


// Unlock audio after user interaction
function unlockAudio() {

    if (audioUnlocked) {
        return;
    }

    audioUnlocked = true;

    console.log(
        "🔊 Gubby audio unlocked!"
    );


    // Try loading the audio
    if (normalSound) {
        normalSound.load();
    }

    if (goldenSound) {
        goldenSound.load();
    }
}


// Browsers allow audio after interaction
document.addEventListener(
    "click",
    unlockAudio,
    {
        once: true
    }
);

document.addEventListener(
    "keydown",
    unlockAudio,
    {
        once: true
    }
);


// ============================================
// SAVE GAME
// ============================================

function saveGame() {

    try {

        localStorage.setItem(
            SAVE_KEY,
            JSON.stringify(game)
        );

    } catch (error) {

        console.error(
            "Could not save game:",
            error
        );
    }
}


// ============================================
// UPDATE COINS
// ============================================

function updateCoins() {

    if (!coinAmount) {
        return;
    }

    coinAmount.textContent =
        Math.floor(game.coins);
}


// ============================================
// GUBBY NAME
// ============================================

function getGubbyName(type) {

    if (type === "golden") {
        return "Golden Gubby";
    }

    return "Normal Gubby";
}


// ============================================
// BUY GUBBY
// ============================================

function buyGubby(type) {

    const price =
        PRICES[type];

    if (price === undefined) {

        console.error(
            "Unknown Gubby:",
            type
        );

        return;
    }


    if (game.coins < price) {

        if (islandMessage) {

            islandMessage.textContent =
                "You don't have enough coins 😭";
        }

        return;
    }


    game.coins -= price;

    game.inventory.push(type);


    updateCoins();

    renderInventory();

    saveGame();


    if (islandMessage) {

        islandMessage.textContent =
            getGubbyName(type)
            + " added to your inventory! 🎉";
    }
}


// ============================================
// INVENTORY
// ============================================

function renderInventory() {

    if (!inventory) {
        return;
    }

    inventory.innerHTML = "";


    if (
        game.inventory.length === 0
    ) {

        inventory.innerHTML = `
            <div style="
                grid-column: 1 / -1;
                text-align: center;
                padding: 30px;
                opacity: .45;
                font-size: 13px;
            ">
                No Gubbys yet 😭
            </div>
        `;

        return;
    }


    game.inventory.forEach(
        (type, index) => {

            const item =
                document.createElement("div");

            item.className =
                "inventory-item";


            if (
                selectedInventoryIndex === index
            ) {

                item.classList.add(
                    "selected"
                );
            }


            const image =
                document.createElement("img");

            image.src =
                "gubby.png";

            image.alt =
                getGubbyName(type);


            if (type === "golden") {

                image.classList.add(
                    "golden"
                );
            }


            const name =
                document.createElement("span");

            name.textContent =
                getGubbyName(type);


            item.appendChild(image);

            item.appendChild(name);


            item.onclick = () => {

                selectGubby(index);
            };


            inventory.appendChild(item);
        }
    );
}


// ============================================
// SELECT GUBBY
// ============================================

function selectGubby(index) {

    if (
        !game.inventory[index]
    ) {
        return;
    }


    selectedInventoryIndex =
        index;


    const type =
        game.inventory[index];


    if (inventoryMessage) {

        inventoryMessage.textContent =
            getGubbyName(type)
            + " selected! Choose an empty slot.";
    }


    if (islandMessage) {

        islandMessage.textContent =
            "Choose an empty slot to place your Gubby.";
    }


    renderInventory();

    highlightSlots();
}


// ============================================
// RENDER ISLAND
// ============================================

function renderIsland() {

    const slots =
        document.querySelectorAll(".slot");


    slots.forEach(
        (slot, index) => {

            slot.innerHTML = "";

            slot.classList.remove(
                "can-place"
            );


            const type =
                game.placed[index];


            // EMPTY
            if (!type) {

                const plus =
                    document.createElement("span");

                plus.textContent =
                    "+";

                slot.appendChild(plus);

                return;
            }


            // GUBBY IMAGE
            const image =
                document.createElement("img");

            image.src =
                "gubby.png";

            image.alt =
                getGubbyName(type);

            image.className =
                "placed-gubby";


            if (type === "golden") {

                image.classList.add(
                    "golden"
                );
            }


            // CLICK TO REMOVE
            image.onclick = (event) => {

                event.stopPropagation();


                game.inventory.push(type);

                game.placed[index] =
                    null;

                selectedInventoryIndex =
                    null;


                saveGame();

                renderInventory();

                renderIsland();


                if (islandMessage) {

                    islandMessage.textContent =
                        "Gubby returned to inventory.";
                }
            };


            slot.appendChild(image);
        }
    );


    highlightSlots();
}


// ============================================
// PLACE GUBBY
// ============================================

function placeGubby(slotIndex) {

    if (
        selectedInventoryIndex === null
    ) {

        if (islandMessage) {

            islandMessage.textContent =
                "Select a Gubby from your inventory first!";
        }

        return;
    }


    if (
        game.placed[slotIndex]
    ) {

        return;
    }


    const type =
        game.inventory[
            selectedInventoryIndex
        ];


    if (!type) {

        selectedInventoryIndex =
            null;

        return;
    }


    // Put Gubby on island
    game.placed[slotIndex] =
        type;


    // Remove from inventory
    game.inventory.splice(
        selectedInventoryIndex,
        1
    );


    selectedInventoryIndex =
        null;


    if (inventoryMessage) {

        inventoryMessage.textContent =
            "Choose a Gubby.";
    }


    if (islandMessage) {

        islandMessage.textContent =
            "Your Gubby is ready to sing! 🎵";
    }


    saveGame();

    renderInventory();

    renderIsland();
}


// ============================================
// HIGHLIGHT SLOTS
// ============================================

function highlightSlots() {

    const slots =
        document.querySelectorAll(".slot");


    slots.forEach(
        (slot, index) => {

            slot.classList.remove(
                "can-place"
            );


            if (
                selectedInventoryIndex !== null &&
                !game.placed[index]
            ) {

                slot.classList.add(
                    "can-place"
                );
            }
        }
    );
}


// ============================================
// SLOT CLICK
// ============================================

document
    .querySelectorAll(".slot")
    .forEach(
        (slot, index) => {

            slot.onclick = () => {

                placeGubby(index);
            };
        }
    );


// ============================================
// PANELS
// ============================================

function openPanel(panel) {

    if (!panel) {
        return;
    }


    shopPanel?.classList.remove(
        "open"
    );

    inventoryPanel?.classList.remove(
        "open"
    );


    panel.classList.add(
        "open"
    );
}


// SHOP
const shopButton =
    document.getElementById("shopButton");

if (shopButton) {

    shopButton.onclick = () => {

        openPanel(shopPanel);
    };
}


// INVENTORY
const inventoryButton =
    document.getElementById(
        "inventoryButton"
    );

if (inventoryButton) {

    inventoryButton.onclick = () => {

        openPanel(inventoryPanel);

        renderInventory();
    };
}


// CLOSE BUTTONS
document
    .querySelectorAll(".close-button")
    .forEach(
        button => {

            button.onclick = () => {

                const panel =
                    document.getElementById(
                        button.dataset.panel
                    );


                if (panel) {

                    panel.classList.remove(
                        "open"
                    );
                }
            };
        }
    );


// ============================================
// PLAY GUBBY SOUND
// ============================================

function singGubby(type) {

    let sound;


    if (type === "golden") {

        sound = goldenSound;

    } else {

        sound = normalSound;
    }


    if (!sound) {

        console.error(
            "❌ Could not find audio element!"
        );

        return;
    }


    console.log(
        "🎵 Gubby is trying to sing:",
        type,
        sound.src
    );


    // Stop previous playback
    sound.pause();

    sound.currentTime = 0;

    sound.volume = 1;


    const playPromise =
        sound.play();


    if (playPromise) {

        playPromise
            .then(() => {

                console.log(
                    "🎵 Gubby music playing!"
                );

            })
            .catch(error => {

                console.error(
                    "❌ Gubby audio failed:",
                    error
                );

                console.log(
                    "Try clicking somewhere on the page first."
                );
            });
    }


    // Animate Gubbys
    document
        .querySelectorAll(
            ".placed-gubby"
        )
        .forEach(
            gubby => {

                gubby.classList.remove(
                    "singing"
                );


                // Force animation restart
                void gubby.offsetWidth;


                gubby.classList.add(
                    "singing"
                );


                setTimeout(
                    () => {

                        gubby.classList.remove(
                            "singing"
                        );

                    },
                    500
                );
            }
        );
}


// ============================================
// RANDOM GUBBY SINGING
// ============================================

function singingLoop() {

    const singers =
        game.placed.filter(
            type => type !== null
        );


    if (
        singers.length === 0
    ) {

        return;
    }


    const randomIndex =
        Math.floor(
            Math.random() *
            singers.length
        );


    const type =
        singers[randomIndex];


    singGubby(type);
}


// ============================================
// SING EVERY 3 SECONDS
// ============================================

setInterval(
    singingLoop,
    SING_INTERVAL
);


// ============================================
// COIN GENERATION
// ============================================

function generateCoins() {

    let earned = 0;


    game.placed.forEach(
        type => {

            if (
                type === "normal"
            ) {

                earned += 1;
            }

            else if (
                type === "golden"
            ) {

                earned += 3;
            }
        }
    );


    if (earned <= 0) {

        return;
    }


    game.coins += earned;


    updateCoins();

    saveGame();


    if (islandMessage) {

        islandMessage.textContent =
            `Your Gubbys earned 🪙 ${earned}!`;
    }


    console.log(
        `💰 Gubbys earned ${earned} coins!`
    );
}


// ============================================
// COINS EVERY 10 SECONDS
// ============================================

setInterval(
    generateCoins,
    COIN_INTERVAL
);


// ============================================
// INITIALIZE
// ============================================

updateCoins();

renderInventory();

renderIsland();


// ============================================
// AUTO SAVE
// ============================================

setInterval(
    saveGame,
    5000
);


// ============================================
// SAVE BEFORE LEAVING
// ============================================

window.addEventListener(
    "beforeunload",
    saveGame
);


console.log(
    "🟢 MY SINGING GUBBY loaded!"
);

console.log(
    "💰 Coin timer:",
    COIN_INTERVAL / 1000,
    "seconds"
);

console.log(
    "🎵 Singing timer:",
    SING_INTERVAL / 1000,
    "seconds"
);

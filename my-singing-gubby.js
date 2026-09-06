// ============================================
// MY SINGING GUBBY
// ============================================

const STARTING_COINS = 10;
const MAX_SLOTS = 6;

const COIN_INTERVAL = 10000; // 10 seconds

const SAVE_KEY = "MY_SINGING_GUBBY_SAVE_V2";

const PRICES = {
    normal: 5,
    golden: 15
};


// ============================================
// SAVE DATA
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
                : createNewSave().placed;

        // Make sure there are exactly 6 slots
        placed = placed.slice(0, MAX_SLOTS);

        while (placed.length < MAX_SLOTS) {
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

        console.warn(
            "Invalid save. Creating new game."
        );

        return createNewSave();
    }
}


let game = loadGame();

let selectedInventoryIndex = null;


// ============================================
// HTML ELEMENTS
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


// ============================================
// SAVE
// ============================================

function saveGame() {

    localStorage.setItem(
        SAVE_KEY,
        JSON.stringify(game)
    );
}


// ============================================
// COINS DISPLAY
// ============================================

function updateCoins() {

    coinAmount.textContent =
        Math.floor(game.coins);
}


// ============================================
// BUY GUBBY
// ============================================

function buyGubby(type) {

    const price = PRICES[type];

    if (price === undefined) {
        return;
    }

    if (game.coins < price) {

        islandMessage.textContent =
            "You don't have enough coins 😭";

        return;
    }

    game.coins -= price;

    game.inventory.push(type);

    saveGame();

    updateCoins();

    renderInventory();

    islandMessage.textContent =
        "New Gubby added to your inventory! 🎉";
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
// INVENTORY
// ============================================

function renderInventory() {

    inventory.innerHTML = "";

    if (game.inventory.length === 0) {

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

                item.classList.add("selected");
            }


            const image =
                document.createElement("img");

            image.src = "gubby.png";


            if (type === "golden") {

                image.classList.add("golden");
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


    inventoryMessage.textContent =
        getGubbyName(type)
        + " selected! Choose an empty slot.";


    islandMessage.textContent =
        "Choose an empty slot to place your Gubby.";


    renderInventory();

    highlightSlots();
}


// ============================================
// ISLAND
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


            // EMPTY SLOT
            if (!type) {

                const plus =
                    document.createElement("span");

                plus.textContent = "+";

                slot.appendChild(plus);

                return;
            }


            // GUBBY
            const image =
                document.createElement("img");

            image.src = "gubby.png";

            image.className =
                "placed-gubby";


            if (type === "golden") {

                image.classList.add("golden");
            }


            // CLICK GUBBY TO REMOVE
            image.onclick = (event) => {

                event.stopPropagation();


                // Return Gubby to inventory
                game.inventory.push(type);


                // Remove from island
                game.placed[index] = null;


                // Clear selection
                selectedInventoryIndex = null;


                saveGame();

                renderInventory();

                renderIsland();


                islandMessage.textContent =
                    "Gubby returned to inventory.";
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

        islandMessage.textContent =
            "Select a Gubby from your inventory first!";

        return;
    }


    // Slot already occupied
    if (game.placed[slotIndex]) {
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


    // Put Gubby into slot
    game.placed[slotIndex] =
        type;


    // Remove from inventory
    game.inventory.splice(
        selectedInventoryIndex,
        1
    );


    selectedInventoryIndex =
        null;


    inventoryMessage.textContent =
        "Choose a Gubby.";


    islandMessage.textContent =
        "Your Gubby is ready to sing! 🎵";


    saveGame();

    renderInventory();

    renderIsland();
}


// ============================================
// SLOT HIGHLIGHT
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
// SLOT CLICK EVENTS
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

    shopPanel.classList.remove("open");

    inventoryPanel.classList.remove("open");

    panel.classList.add("open");
}


// SHOP BUTTON
document
    .getElementById("shopButton")
    .onclick = () => {

        openPanel(shopPanel);
    };


// INVENTORY BUTTON
document
    .getElementById("inventoryButton")
    .onclick = () => {

        openPanel(inventoryPanel);

        renderInventory();
    };


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
// SINGING
// ============================================

function singGubby(type) {

    const sound =
        type === "golden"
            ? document.getElementById(
                "goldenSound"
            )
            : document.getElementById(
                "normalSound"
            );


    if (!sound) {
        return;
    }


    sound.currentTime = 0;


    sound.play().catch(
        () => {}
    );


    // Animate every placed Gubby
    document
        .querySelectorAll(".placed-gubby")
        .forEach(
            gubby => {

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
// RANDOM SINGING
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


// Gubbys sing every 3 seconds
setInterval(
    singingLoop,
    3000
);


// ============================================
// COIN GENERATION
// ============================================

function generateCoins() {

    let earned = 0;


    // Check EVERY island slot
    game.placed.forEach(
        type => {

            if (type === "normal") {

                earned += 1;
            }

            else if (type === "golden") {

                earned += 3;
            }
        }
    );


    // No Gubbys = no coins
    if (earned <= 0) {

        return;
    }


    // GIVE COINS
    game.coins += earned;


    updateCoins();

    saveGame();


    islandMessage.textContent =
        `Your Gubbys earned 🪙 ${earned}!`;
}


// ============================================
// IMPORTANT:
// THIS RUNS FOREVER
// ============================================

setInterval(
    generateCoins,
    COIN_INTERVAL
);


// ============================================
// INITIALIZE GAME
// ============================================

updateCoins();

renderInventory();

renderIsland();


// ============================================
// AUTO SAVE
// ============================================

// Backup save every 5 seconds
setInterval(
    saveGame,
    5000
);


// Save when leaving page
window.addEventListener(
    "beforeunload",
    saveGame
);

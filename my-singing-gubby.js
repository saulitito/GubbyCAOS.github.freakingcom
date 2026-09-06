// ========================================
// MY SINGING GUBBY
// COMPLETE SAVE + COIN SYSTEM
// ========================================


// ========================================
// CONFIG
// ========================================

const STARTING_COINS = 10;

const MAX_SLOTS = 6;


// Gubby prices

const GUBBY_PRICES = {
    normal: 5,
    golden: 15
};


// ========================================
// SAVE DATA
// ========================================

const SAVE_KEY = "mySingingGubbySave";


// Default save

const DEFAULT_SAVE = {
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


// ========================================
// LOAD SAVE
// ========================================

function loadGame() {

    try {

        const saved =
            localStorage.getItem(SAVE_KEY);


        // No save exists

        if (!saved) {

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


        const data =
            JSON.parse(saved);


        // Make sure everything is valid

        return {

            coins:
                typeof data.coins === "number"
                    ? Math.max(0, data.coins)
                    : STARTING_COINS,


            inventory:
                Array.isArray(data.inventory)
                    ? data.inventory
                    : [],


            placed:
                Array.isArray(data.placed)
                    ? data.placed.slice(0, MAX_SLOTS)
                    : DEFAULT_SAVE.placed.slice()

        };

    }

    catch (error) {

        console.warn(
            "Save data was corrupted. Creating a new save."
        );

        return {
            ...DEFAULT_SAVE,

            placed:
                DEFAULT_SAVE.placed.slice()
        };

    }

}


// ========================================
// GAME DATA
// ========================================

let game = loadGame();


// Make sure there are exactly 6 slots

while (game.placed.length < MAX_SLOTS) {

    game.placed.push(null);

}


// Currently selected inventory item

let selectedGubby = null;


// ========================================
// HTML ELEMENTS
// ========================================

const coinsText =
    document.getElementById("coins");

const inventoryList =
    document.getElementById("inventoryList");

const selectedText =
    document.getElementById("selectedText");

const shopPanel =
    document.getElementById("shopPanel");

const inventoryPanel =
    document.getElementById("inventoryPanel");

const shopButton =
    document.getElementById("shopButton");

const inventoryButton =
    document.getElementById("inventoryButton");


// ========================================
// SAVE GAME
// ========================================

function saveGame() {

    localStorage.setItem(
        SAVE_KEY,
        JSON.stringify(game)
    );

}


// ========================================
// UPDATE COINS DISPLAY
// ========================================

function updateCoins() {

    coinsText.textContent =
        Math.floor(game.coins);

}


// ========================================
// SAVE EVERYTHING
// ========================================

function updateGame() {

    updateCoins();

    saveGame();

}


// ========================================
// BUY GUBBY
// ========================================

function buyGubby(type) {

    // Check if this Gubby exists

    if (!(type in GUBBY_PRICES)) {

        console.warn(
            "Unknown Gubby:",
            type
        );

        return;

    }


    const price =
        GUBBY_PRICES[type];


    // Not enough coins

    if (game.coins < price) {

        alert(
            "YOU DON'T HAVE ENOUGH COINS 😭"
        );

        return;

    }


    // Take coins

    game.coins -= price;


    // Add Gubby to inventory

    game.inventory.push(type);


    // Save

    updateGame();


    // Refresh inventory

    renderInventory();

}


// ========================================
// INVENTORY
// ========================================

function renderInventory() {

    inventoryList.innerHTML = "";


    // Empty inventory

    if (game.inventory.length === 0) {

        inventoryList.innerHTML = `
            <div style="
                grid-column: 1 / -1;
                text-align: center;
                opacity: .5;
                padding: 25px;
            ">
                Your inventory is empty 😭
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


            // Selected

            if (
                selectedGubby === index
            ) {

                item.classList.add(
                    "selected"
                );

            }


            // Image

            const image =
                document.createElement("img");

            image.src =
                "gubby.png";


            if (type === "golden") {

                image.classList.add(
                    "gold"
                );

            }


            // Name

            const name =
                document.createElement("span");

            name.textContent =
                getGubbyName(type);


            item.appendChild(image);

            item.appendChild(name);


            // Select

            item.onclick = () => {

                selectedGubby = index;


                selectedText.textContent =
                    "Gubby selected! Choose an empty slot.";


                renderInventory();

                highlightSlots();

            };


            inventoryList.appendChild(item);

        }
    );

}


// ========================================
// GUBBY NAMES
// ========================================

function getGubbyName(type) {

    if (type === "golden") {

        return "Golden Gubby";

    }


    return "Normal Gubby";

}


// ========================================
// RENDER ISLAND
// ========================================

function renderIsland() {

    const slots =
        document.querySelectorAll(
            ".gubby-slot"
        );


    slots.forEach(
        (slot, index) => {

            slot.innerHTML = "";


            slot.classList.remove(
                "empty",
                "selected-slot"
            );


            const type =
                game.placed[index];


            // Empty

            if (!type) {

                slot.classList.add(
                    "empty"
                );

            }


            // Has Gubby

            else {

                const image =
                    document.createElement("img");


                image.src =
                    "gubby.png";


                image.className =
                    "placed-gubby";


                // Golden

                if (
                    type === "golden"
                ) {

                    image.classList.add(
                        "gold"
                    );

                }


                // Click Gubby to remove

                image.onclick = (event) => {

                    event.stopPropagation();


                    // Return to inventory

                    game.inventory.push(
                        type
                    );


                    // Empty slot

                    game.placed[index] =
                        null;


                    selectedGubby =
                        null;


                    selectedText.textContent =
                        "Select a Gubby to place it.";


                    updateGame();


                    renderInventory();

                    renderIsland();

                };


                slot.appendChild(image);

            }


            // Click empty slot

            slot.onclick = () => {

                placeGubby(index);

            };

        }
    );


    highlightSlots();

}


// ========================================
// PLACE GUBBY
// ========================================

function placeGubby(slotIndex) {

    // Nothing selected

    if (
        selectedGubby === null
    ) {

        return;

    }


    // Slot already occupied

    if (
        game.placed[slotIndex]
    ) {

        return;

    }


    // Get selected Gubby

    const type =
        game.inventory[selectedGubby];


    if (!type) {

        selectedGubby = null;

        renderInventory();

        return;

    }


    // Place it

    game.placed[slotIndex] =
        type;


    // Remove from inventory

    game.inventory.splice(
        selectedGubby,
        1
    );


    // Clear selection

    selectedGubby = null;


    selectedText.textContent =
        "Select a Gubby to place it.";


    // Save

    updateGame();


    // Refresh

    renderInventory();

    renderIsland();

}


// ========================================
// HIGHLIGHT EMPTY SLOTS
// ========================================

function highlightSlots() {

    const slots =
        document.querySelectorAll(
            ".gubby-slot"
        );


    slots.forEach(
        (slot, index) => {

            slot.classList.remove(
                "selected-slot"
            );


            if (
                selectedGubby !== null &&
                !game.placed[index]
            ) {

                slot.classList.add(
                    "selected-slot"
                );

            }

        }
    );

}


// ========================================
// PANELS
// ========================================

function openPanel(panel) {

    shopPanel.classList.remove(
        "open"
    );

    inventoryPanel.classList.remove(
        "open"
    );


    panel.classList.add(
        "open"
    );

}


shopButton.onclick = () => {

    openPanel(shopPanel);

};


inventoryButton.onclick = () => {

    openPanel(inventoryPanel);

    renderInventory();

};


document
    .querySelectorAll(".close-panel")
    .forEach(button => {

        button.onclick = () => {

            const panel =
                document.getElementById(
                    button.dataset.close
                );


            panel.classList.remove(
                "open"
            );

        };

    });


// ========================================
// SINGING
// ========================================

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


    sound.play().catch(() => {});


    // Animate all placed Gubbys

    document
        .querySelectorAll(
            ".placed-gubby"
        )
        .forEach(gubby => {

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

        });

}


// ========================================
// AUTOMATIC SINGING
// ========================================

function singingLoop() {

    const singers =
        game.placed.filter(
            gubby => gubby !== null
        );


    if (
        singers.length === 0
    ) {

        return;

    }


    const randomGubby =
        singers[
            Math.floor(
                Math.random() *
                singers.length
            )
        ];


    singGubby(
        randomGubby
    );

}


setInterval(
    singingLoop,
    3000
);


// ========================================
// START GAME
// ========================================

updateCoins();

renderInventory();

renderIsland();


// ========================================
// AUTO-SAVE
// ========================================

// Save every 10 seconds too

setInterval(
    () => {

        saveGame();

    },
    10000
);


// Save when leaving the page

window.addEventListener(
    "beforeunload",
    () => {

        saveGame();

    }
);

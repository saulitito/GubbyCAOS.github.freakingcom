// ============================================
// MY SINGING GUBBY
// ============================================


// ============================================
// CONFIG
// ============================================

const STARTING_COINS = 10;

const MAX_SLOTS = 6;

const SAVE_KEY =
    "MY_SINGING_GUBBY_SAVE_V2";


const PRICES = {

    normal: 5,

    golden: 15

};


// ============================================
// DEFAULT SAVE
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
// LOAD SAVE
// ============================================

function loadGame() {

    const saved =
        localStorage.getItem(
            SAVE_KEY
        );


    // NEW PLAYER

    if (!saved) {

        const newSave =
            createNewSave();


        localStorage.setItem(
            SAVE_KEY,
            JSON.stringify(newSave)
        );


        return newSave;

    }


    // EXISTING PLAYER

    try {

        const data =
            JSON.parse(saved);


        return {

            coins:
                typeof data.coins === "number"
                    ? Math.max(
                        0,
                        data.coins
                    )
                    : STARTING_COINS,


            inventory:
                Array.isArray(
                    data.inventory
                )
                    ? data.inventory
                    : [],


            placed:
                Array.isArray(
                    data.placed
                )
                    ? data.placed
                    : createNewSave().placed

        };

    }

    catch (error) {

        console.warn(
            "Invalid save. Creating new game."
        );


        return createNewSave();

    }

}


// ============================================
// GAME DATA
// ============================================

let game =
    loadGame();


let selectedInventoryIndex =
    null;


// ============================================
// HTML
// ============================================

const coinAmount =
    document.getElementById(
        "coinAmount"
    );


const inventory =
    document.getElementById(
        "inventory"
    );


const inventoryMessage =
    document.getElementById(
        "inventoryMessage"
    );


const islandMessage =
    document.getElementById(
        "islandMessage"
    );


const shopPanel =
    document.getElementById(
        "shopPanel"
    );


const inventoryPanel =
    document.getElementById(
        "inventoryPanel"
    );


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
// COINS
// ============================================

function updateCoins() {

    coinAmount.textContent =
        Math.floor(
            game.coins
        );

}


// ============================================
// BUY GUBBY
// ============================================

function buyGubby(type) {

    const price =
        PRICES[type];


    if (
        price === undefined
    ) {

        return;

    }


    if (
        game.coins < price
    ) {

        islandMessage.textContent =
            "You don't have enough coins 😭";

        return;

    }


    // Pay

    game.coins -= price;


    // Add to inventory

    game.inventory.push(
        type
    );


    saveGame();

    updateCoins();

    renderInventory();


    islandMessage.textContent =
        "New Gubby added to your inventory! 🎉";

}


// ============================================
// INVENTORY
// ============================================

function renderInventory() {

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
                document.createElement(
                    "div"
                );


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
                document.createElement(
                    "img"
                );


            image.src =
                "gubby.png";


            if (
                type === "golden"
            ) {

                image.classList.add(
                    "golden"
                );

            }


            const name =
                document.createElement(
                    "span"
                );


            name.textContent =
                getGubbyName(type);


            item.appendChild(
                image
            );

            item.appendChild(
                name
            );


            item.onclick = () => {

                selectGubby(index);

            };


            inventory.appendChild(
                item
            );

        }
    );

}


// ============================================
// SELECT GUBBY
// ============================================

function selectGubby(index) {

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
// NAMES
// ============================================

function getGubbyName(type) {

    if (
        type === "golden"
    ) {

        return "Golden Gubby";

    }


    return "Normal Gubby";

}


// ============================================
// ISLAND
// ============================================

function renderIsland() {

    const slots =
        document.querySelectorAll(
            ".slot"
        );


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
                    document.createElement(
                        "span"
                    );

                plus.textContent =
                    "+";


                slot.appendChild(
                    plus
                );


                return;

            }


            // GUBBY

            const image =
                document.createElement(
                    "img"
                );


            image.src =
                "gubby.png";


            image.className =
                "placed-gubby";


            if (
                type === "golden"
            ) {

                image.classList.add(
                    "golden"
                );

            }


            /*
                Clicking a placed Gubby
                returns it to inventory.
            */

            image.onclick = (event) => {

                event.stopPropagation();


                game.inventory.push(
                    type
                );


                game.placed[index] =
                    null;


                selectedInventoryIndex =
                    null;


                saveGame();


                renderInventory();

                renderIsland();


                islandMessage.textContent =
                    "Gubby returned to inventory.";

            };


            slot.appendChild(
                image
            );

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


    // Place

    game.placed[slotIndex] =
        type;


    // Remove from inventory

    game.inventory.splice(
        selectedInventoryIndex,
        1
    );


    // Clear selection

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
// SLOT HIGHLIGHTING
// ============================================

function highlightSlots() {

    const slots =
        document.querySelectorAll(
            ".slot"
        );


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
// SLOT CLICKING
// ============================================

document
    .querySelectorAll(".slot")
    .forEach(
        (slot, index) => {

            slot.onclick = () => {

                placeGubby(
                    index
                );

            };

        }
    );


// ============================================
// PANELS
// ============================================

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


document
    .getElementById("shopButton")
    .onclick = () => {

        openPanel(
            shopPanel
        );

    };


document
    .getElementById("inventoryButton")
    .onclick = () => {

        openPanel(
            inventoryPanel
        );

        renderInventory();

    };


// CLOSE BUTTONS

document
    .querySelectorAll(
        ".close-button"
    )
    .forEach(
        button => {

            button.onclick = () => {

                const panel =
                    document.getElementById(
                        button.dataset.panel
                    );


                panel.classList.remove(
                    "open"
                );

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


    // Animate every Gubby

    document
        .querySelectorAll(
            ".placed-gubby"
        )
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
// AUTOMATIC SINGING
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


setInterval(
    singingLoop,
    3000
);


// ============================================
// COIN GENERATION
// ============================================

function generateCoins() {

    let amount = 0;


    game.placed.forEach(
        type => {

            if (
                type === "normal"
            ) {

                amount += 1;

            }


            if (
                type === "golden"
            ) {

                amount += 3;

            }

        }
    );


    if (
        amount <= 0
    ) {

        return;

    }


    game.coins += amount;


    updateCoins();

    saveGame();


    islandMessage.textContent =
        `Your Gubbys earned 🪙 ${amount}!`;

}


// Every 10 seconds

setInterval(
    generateCoins,
    10000
);


// ============================================
// START
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


window.addEventListener(
    "beforeunload",
    saveGame
);

let coins = Number(
    localStorage.getItem("singingGubbyCoins")
);

if (isNaN(coins)) {
    coins = 10;
}


/*
    Inventory

    Example:
    ["normal", "normal", "golden"]
*/

let inventory =
    JSON.parse(
        localStorage.getItem("singingGubbyInventory")
    ) || [];


/*
    Six island slots.

    null = empty
*/

let placed =
    JSON.parse(
        localStorage.getItem("singingGubbyPlaced")
    ) || [
        null,
        null,
        null,
        null,
        null,
        null
    ];


while (placed.length < 6) {
    placed.push(null);
}


let selectedGubby = null;


const coinsText =
    document.getElementById("coins");

const inventoryList =
    document.getElementById("inventoryList");

const selectedText =
    document.getElementById("selectedText");


/* =========================
   SAVE
========================= */

function saveGame() {

    localStorage.setItem(
        "singingGubbyCoins",
        coins
    );

    localStorage.setItem(
        "singingGubbyInventory",
        JSON.stringify(inventory)
    );

    localStorage.setItem(
        "singingGubbyPlaced",
        JSON.stringify(placed)
    );
}


/* =========================
   COINS
========================= */

function updateCoins() {

    coinsText.textContent = coins;

    saveGame();
}


/* =========================
   BUY
========================= */

function buyGubby(type) {

    let price;

    if (type === "normal") {
        price = 5;
    }

    else if (type === "golden") {
        price = 15;
    }

    if (coins < price) {

        alert(
            "You don't have enough coins! 😭"
        );

        return;
    }


    coins -= price;

    inventory.push(type);

    updateCoins();

    renderInventory();
}


/* =========================
   INVENTORY
========================= */

function renderInventory() {

    inventoryList.innerHTML = "";

    if (inventory.length === 0) {

        inventoryList.innerHTML =
            `<div style="
                grid-column: 1 / -1;
                text-align:center;
                opacity:.5;
                padding:25px;
            ">
                Your inventory is empty 😭
            </div>`;

        return;
    }


    inventory.forEach(
        (type, index) => {

            const item =
                document.createElement("div");

            item.className =
                "inventory-item";


            if (
                selectedGubby === index
            ) {
                item.classList.add("selected");
            }


            const image =
                document.createElement("img");

            image.src =
                "gubby.png";


            if (type === "golden") {
                image.classList.add("gold");
            }


            const name =
                document.createElement("span");

            name.textContent =
                type === "golden"
                    ? "Golden Gubby"
                    : "Normal Gubby";


            item.appendChild(image);
            item.appendChild(name);


            item.onclick = () => {

                selectedGubby = index;

                selectedText.textContent =
                    "Selected! Now choose an empty island slot.";

                renderInventory();

            };


            inventoryList.appendChild(item);

        }
    );
}


/* =========================
   ISLAND
========================= */

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
                placed[index];


            if (!type) {

                slot.classList.add(
                    "empty"
                );

            }

            else {

                const image =
                    document.createElement("img");

                image.src =
                    "gubby.png";

                image.className =
                    "placed-gubby";


                if (type === "golden") {

                    image.classList.add(
                        "gold"
                    );

                }


                /*
                    Click placed Gubby
                    = return to inventory
                */

                image.onclick = (event) => {

                    event.stopPropagation();

                    inventory.push(type);

                    placed[index] = null;

                    saveGame();

                    renderIsland();
                    renderInventory();

                };


                slot.appendChild(image);

            }


            /*
                Empty slot click
            */

            slot.onclick = () => {

                if (
                    selectedGubby === null
                ) {
                    return;
                }


                if (placed[index]) {
                    return;
                }


                const type =
                    inventory[
                        selectedGubby
                    ];


                placed[index] = type;

                inventory.splice(
                    selectedGubby,
                    1
                );


                selectedGubby = null;


                selectedText.textContent =
                    "Select a Gubby to place it.";


                saveGame();

                renderIsland();
                renderInventory();

            };

        }
    );
}


/* =========================
   PANELS
========================= */

const shopButton =
    document.getElementById(
        "shopButton"
    );

const inventoryButton =
    document.getElementById(
        "inventoryButton"
    );

const shopPanel =
    document.getElementById(
        "shopPanel"
    );

const inventoryPanel =
    document.getElementById(
        "inventoryPanel"
    );


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


/* =========================
   SINGING
========================= */

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


/*
    Automatically make the
    island Gubbys sing periodically.
*/

function singingLoop() {

    const singers =
        placed.filter(
            gubby => gubby !== null
        );


    if (singers.length === 0) {
        return;
    }


    const random =
        singers[
            Math.floor(
                Math.random() *
                singers.length
            )
        ];


    singGubby(random);
}


setInterval(
    singingLoop,
    3000
);


/* =========================
   START
========================= */

updateCoins();

renderInventory();

renderIsland();

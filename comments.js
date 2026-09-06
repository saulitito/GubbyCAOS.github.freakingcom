import {
    initializeApp
}
from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";


import {
    getFirestore,
    collection,
    addDoc,
    query,
    orderBy,
    onSnapshot,
    serverTimestamp
}
from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";


// ==========================================
// FIREBASE
// ==========================================

const firebaseConfig = {

    apiKey:
        "YOUR_API_KEY",

    authDomain:
        "YOUR_PROJECT.firebaseapp.com",

    projectId:
        "YOUR_PROJECT_ID",

    storageBucket:
        "YOUR_PROJECT.firebasestorage.app",

    messagingSenderId:
        "YOUR_MESSAGING_SENDER_ID",

    appId:
        "YOUR_APP_ID"

};


const app =
    initializeApp(
        firebaseConfig
    );


const db =
    getFirestore(app);


// ==========================================
// ELEMENTS
// ==========================================

const nameInput =
    document.getElementById(
        "commentName"
    );

const textInput =
    document.getElementById(
        "commentText"
    );

const postButton =
    document.getElementById(
        "postComment"
    );

const commentsList =
    document.getElementById(
        "commentsList"
    );

const commentCount =
    document.getElementById(
        "commentCount"
    );


// ==========================================
// POST
// ==========================================

postButton.addEventListener(
    "click",
    async () => {

        const name =
            nameInput.value.trim();

        const text =
            textInput.value.trim();


        if (!name || !text) {

            return;

        }


        postButton.disabled =
            true;

        postButton.textContent =
            "POSTING...";


        try {

            await addDoc(
                collection(
                    db,
                    "comments"
                ),
                {

                    name:
                        name.slice(
                            0,
                            30
                        ),

                    text:
                        text.slice(
                            0,
                            300
                        ),

                    createdAt:
                        serverTimestamp()

                }
            );


            nameInput.value =
                "";

            textInput.value =
                "";

        }
        catch (error) {

            console.error(
                error
            );

            alert(
                "Gubby fell into the database 💀"
            );

        }


        postButton.disabled =
            false;

        postButton.textContent =
            "💬 POST COMMENT";

    }
);


// ==========================================
// LIVE COMMENTS
// ==========================================

const commentsQuery =
    query(
        collection(
            db,
            "comments"
        ),

        orderBy(
            "createdAt",
            "desc"
        )
    );


onSnapshot(
    commentsQuery,
    snapshot => {

        commentsList.innerHTML =
            "";

        commentCount.textContent =
            snapshot.size;


        snapshot.forEach(
            document => {

                const data =
                    document.data();


                const comment =
                    document.createElement(
                        "article"
                    );

                comment.className =
                    "comment";


                const name =
                    document.createElement(
                        "strong"
                    );

                name.textContent =
                    "🗣️ " +
                    (
                        data.name ||
                        "Unknown Gubby"
                    );


                const text =
                    document.createElement(
                        "p"
                    );

                text.textContent =
                    data.text ||
                    "";


                comment.appendChild(
                    name
                );

                comment.appendChild(
                    text
                );


                commentsList.appendChild(
                    comment
                );

            }
        );

    },

    error => {

        console.error(
            "Comments error:",
            error
        );

    }
);

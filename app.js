// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyCuXtajCX1ccTz-qhTFzX6oQIm6ngX7DjI",
    authDomain: "cemerlang-akademik.firebaseapp.com",
    projectId: "cemerlang-akademik",
    storageBucket: "cemerlang-akademik.firebasestorage.app",
    messagingSenderId: "644329352799",
    appId: "1:644329352799:web:06f59de006b043cd20b5ea",
    measurementId: "G-B6J4S85CYL"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Function to submit form
function submitForm() {
    const name = document.getElementById("name").value;
    const matric = document.getElementById("matric").value;
    const position = document.getElementById("position").value;
    const message = document.getElementById("message");

    if (name === "" || matric === "") {
        alert("Please fill in all fields.");
        return;
    }

    // Check quota (example logic)
    db.collection("ajk_selection")
        .where("position", "==", position)
        .get()
        .then(snapshot => {
            const count = snapshot.size;
            const quota = { "Chairperson": 1, "Vice Chairperson": 2, "Secretary": 2, "Treasurer": 1, "Public Relations": 3 };

            if (count >= quota[position]) {
                alert("Quota full for this position.");
            } else {
                db.collection("ajk_selection")
                    .add({
                        name: name,
                        matric: matric,
                        position: position,
                        timestamp: firebase.firestore.FieldValue.serverTimestamp()
                    })
                    .then(() => {
                        message.classList.remove("hidden");
                        message.textContent = "Successfully Registered!";
                    })
                    .catch(error => {
                        console.error("Error writing document: ", error);
                        alert("Error submitting form. Try again.");
                    });
            }
        })
        .catch(error => {
            console.error("Error checking quota: ", error);
        });
}

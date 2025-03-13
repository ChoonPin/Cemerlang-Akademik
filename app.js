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

// Positions Data
const positions = [
    { id: "timbalan_pengarah", name: "Timbalan Pengarah", quota: 1 },
    { id: "setiausaha", name: "Setiausaha", quota: 1 },
    { id: "bendahari", name: "Bendahari", quota: 1 },
    { id: "urus_setia_1", name: "Unit Urus Setia", quota: 2 },
    { id: "logistik_1", name: "Unit Logistik", quota: 2 },
    { id: "teknikal_1", name: "Unit Teknikal", quota: 2 },
    { id: "publisiti_1", name: "Unit Publisiti", quota: 2 },
    { id: "protokol_1", name: "Unit Protokol", quota: 2 }
];

// Load Available Positions
function loadPositions() {
    const positionsList = document.getElementById("positionsList");
    positionsList.innerHTML = "";

    positions.forEach(pos => {
        db.collection("positions").doc(pos.id).get().then(doc => {
            let quotaLeft = doc.exists ? doc.data().quota : pos.quota;
            
            if (quotaLeft > 0) {
                const li = document.createElement("li");
                li.innerHTML = `${pos.name} (Remaining: ${quotaLeft}) 
                    <button class="select-btn" onclick="selectPosition('${pos.id}', '${pos.name}')">Select</button>`;
                positionsList.appendChild(li);
            }
        });
    });
}

// Function to Select a Position
function selectPosition(positionId, positionName) {
    const fullName = document.getElementById("fullName").value.trim();
    const matricNumber = document.getElementById("matricNumber").value.trim();

    if (fullName === "" || matricNumber === "") {
        alert("Please enter your full name and matric number.");
        return;
    }

    const userRef = db.collection("selected_positions").doc(matricNumber);
    userRef.get().then(doc => {
        if (doc.exists) {
            alert("You have already selected a position!");
        } else {
            db.collection("positions").doc(positionId).get().then(doc => {
                if (doc.exists) {
                    let quotaLeft = doc.data().quota;

                    if (quotaLeft > 0) {
                        // Update quota in Firestore
                        db.collection("positions").doc(positionId).update({
                            quota: quotaLeft - 1
                        });

                        // Save user selection
                        userRef.set({
                            fullName: fullName,
                            matricNumber: matricNumber,
                            position: positionName
                        });

                        alert(`You have successfully selected ${positionName}`);
                        loadPositions();
                    } else {
                        alert("This position is already full.");
                    }
                }
            });
        }
    });
}

// Initialize Firestore Database with Default Positions
function initializeFirestoreData() {
    positions.forEach(pos => {
        db.collection("positions").doc(pos.id).get().then(doc => {
            if (!doc.exists) {
                db.collection("positions").doc(pos.id).set({
                    name: pos.name,
                    quota: pos.quota
                });
            }
        });
    });

    loadPositions();
}

// Run the Initialization Function
initializeFirestoreData();

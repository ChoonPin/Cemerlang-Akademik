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

// Positions List
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

// Initialize positions in Firestore (Run once)
// positions.forEach(pos => {
//     db.collection("positions").doc(pos.id).set({
//         name: pos.name,
//         quota: pos.quota
//     });
// });

// Load Available Positions in Real-Time
function loadPositions() {
    const tableBody = document.getElementById("positionsTable");
    tableBody.innerHTML = ""; // Clear table before adding new data

    db.collection("positions").onSnapshot(snapshot => {
        tableBody.innerHTML = ""; // Reset table

        snapshot.forEach(doc => {
            const data = doc.data();
            if (data.quota > 0) {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${data.name}</td>
                    <td>${data.quota}</td>
                    <td><button onclick="applyPosition('${doc.id}', '${data.name}', ${data.quota})">Select</button></td>
                `;
                tableBody.appendChild(row);
            }
        });
    });
}

// Apply for a Position
function applyPosition(positionId, positionName, quota) {
    const fullName = document.getElementById("fullName").value.trim();
    const matricNumber = document.getElementById("matricNumber").value.trim();

    if (fullName === "" || matricNumber === "") {
        alert("Please enter your full name and matric number before selecting a position.");
        return;
    }

    if (quota <= 0) {
        alert("Sorry, this position is already full.");
        return;
    }

    // Reduce quota in Firestore
    const positionRef = db.collection("positions").doc(positionId);
    positionRef.update({
        quota: firebase.firestore.FieldValue.increment(-1)
    }).then(() => {
        // Save user selection
        db.collection("applications").add({
            fullName: fullName,
            matricNumber: matricNumber,
            positionId: positionId,
            positionName: positionName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        }).then(() => {
            alert("Successfully applied for " + positionName);
        }).catch(error => {
            console.error("Error saving application: ", error);
        });
    }).catch(error => {
        console.error("Error updating quota: ", error);
    });
}

// Run function when page loads
window.onload = loadPositions;

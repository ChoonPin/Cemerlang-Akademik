// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getFirestore, collection, getDocs, doc, updateDoc, addDoc } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

// Firebase configuration
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
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Fetch positions and display them
async function loadPositions() {
    const positionsTable = document.getElementById("positionsTable");
    positionsTable.innerHTML = "";

    const querySnapshot = await getDocs(collection(db, "positions"));
    querySnapshot.forEach((docSnapshot) => {
        const position = docSnapshot.data();
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${position.name}</td>
            <td>${position.quota}</td>
            <td><button onclick="selectPosition('${docSnapshot.id}', '${position.name}', ${position.quota})" ${position.quota === 0 ? "disabled" : ""}>Apply</button></td>
        `;

        positionsTable.appendChild(row);
    });
}

// Function to select a position
async function selectPosition(positionId, positionName, currentQuota) {
    const fullName = document.getElementById("fullName").value.trim();
    const matricNumber = document.getElementById("matricNumber").value.trim();

    if (!fullName || !matricNumber) {
        alert("Please enter your full name and matric number.");
        return;
    }

    if (currentQuota <= 0) {
        alert("Quota is full for this position.");
        return;
    }

    // Store user selection
    await addDoc(collection(db, "selected"), {
        fullName,
        matricNumber,
        position: positionName
    });

    // Update position quota
    const positionRef = doc(db, "positions", positionId);
    await updateDoc(positionRef, {
        quota: currentQuota - 1
    });

    alert(`You have successfully applied for ${positionName}`);
    loadPositions(); // Refresh table
}

// Load positions on page load
window.onload = loadPositions;

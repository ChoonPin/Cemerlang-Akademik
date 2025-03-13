// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, getDocs, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCuXtajCX1ccTz-qhTFzX6oQIm6ngX7DjI",
    authDomain: "cemerlang-akademik.firebaseapp.com",
    projectId: "cemerlang-akademik",
    storageBucket: "cemerlang-akademik.appspot.com",
    messagingSenderId: "644329352799",
    appId: "1:644329352799:web:06f59de006b043cd20b5ea",
    measurementId: "G-B6J4S85CYL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Function to display positions
async function loadPositions() {
    const positionsDiv = document.getElementById("positions");
    positionsDiv.innerHTML = ""; // Clear existing data

    // Get all positions from Firestore
    const querySnapshot = await getDocs(collection(db, "positions"));
    querySnapshot.forEach(docSnap => {
        const positionData = docSnap.data();
        const positionId = docSnap.id;
        
        // Create position elements
        const div = document.createElement("div");
        div.classList.add("position");
        div.innerHTML = `
            <h3>${positionData.name}</h3>
            <p>Quota: <strong>${positionData.quota}</strong></p>
            <button ${positionData.quota <= 0 ? "disabled" : ""} onclick="selectPosition('${positionId}', ${positionData.quota})">
                Apply
            </button>
        `;
        positionsDiv.appendChild(div);
    });
}

// Function to handle AJK selection
window.selectPosition = async function (positionId, currentQuota) {
    if (currentQuota > 0) {
        const positionRef = doc(db, "positions", positionId);
        await updateDoc(positionRef, { quota: currentQuota - 1 }); // Decrease quota by 1
        alert("You have successfully applied!");
        loadPositions(); // Refresh the data
    } else {
        alert("This position is already full.");
    }
}

// Load positions on page load
loadPositions();

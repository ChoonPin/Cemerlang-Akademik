// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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

// Predefined positions list
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

// Function to initialize Firestore with predefined positions
async function initializePositions() {
    for (const pos of positions) {
        // Check if position already exists
        const q = query(collection(db, "positions"), where("name", "==", pos.name));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            // Add position if it doesn't exist
            await addDoc(collection(db, "positions"), {
                name: pos.name,
                quota: pos.quota
            });
        }
    }
    loadPositions();  // Refresh UI
}

// Function to load positions from Firestore
async function loadPositions() {
    const positionsDiv = document.getElementById("positions");
    positionsDiv.innerHTML = "<p>Loading...</p>";

    try {
        const querySnapshot = await getDocs(collection(db, "positions"));
        positionsDiv.innerHTML = "";

        if (querySnapshot.empty) {
            positionsDiv.innerHTML = "<p>No positions available.</p>";
            return;
        }

        querySnapshot.forEach(docSnap => {
            const positionData = docSnap.data();
            const div = document.createElement("div");
            div.classList.add("position");
            div.innerHTML = `
                <h3>${positionData.name}</h3>
                <p>Quota: <strong>${positionData.quota}</strong></p>
                <button ${positionData.quota <= 0 ? "disabled" : ""}>Apply</button>
            `;
            positionsDiv.appendChild(div);
        });
    } catch (error) {
        console.error("Error fetching positions:", error);
        positionsDiv.innerHTML = "<p>Error loading positions.</p>";
    }
}

// Run initialization on page load
initializePositions();

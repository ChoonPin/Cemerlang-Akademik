// Import Firebase SDK
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, getDoc, updateDoc, setDoc, addDoc } from "firebase/firestore";

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
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Default Positions
const defaultPositions = [
    { id: "pengarah", name: "Pengarah", quota: 1 },
    { id: "timbalan_pengarah", name: "Timbalan Pengarah", quota: 1 },
    { id: "setiausaha", name: "Setiausaha", quota: 1 },
    { id: "bendahari", name: "Bendahari", quota: 1 },
    { id: "ajk_teknikal", name: "AJK Teknikal", quota: 3 },
    { id: "ajk_makanan", name: "AJK Makanan", quota: 3 },
    { id: "ajk_logistik", name: "AJK Logistik", quota: 3 },
    { id: "ajk_promosi", name: "AJK Promosi", quota: 3 }
];

// Function to Initialize Firestore Positions
async function initializePositions() {
    const positionsRef = collection(db, "positions");
    const snapshot = await getDocs(positionsRef);

    if (snapshot.empty) {
        console.log("No positions found, adding default positions...");
        for (const pos of defaultPositions) {
            await setDoc(doc(db, "positions", pos.id), {
                name: pos.name,
                quota: pos.quota
            });
        }
    }
    loadPositions();
}

// Function to Load Positions from Firestore
async function loadPositions() {
    const positionsRef = collection(db, "positions");
    const snapshot = await getDocs(positionsRef);

    const positionSelect = document.getElementById("positionSelect");
    const positionsList = document.getElementById("positionsList");
    positionSelect.innerHTML = "";
    positionsList.innerHTML = "";

    snapshot.forEach(doc => {
        const data = doc.data();
        const option = document.createElement("option");
        option.value = doc.id;
        option.textContent = `${data.name} (Quota: ${data.quota})`;
        positionSelect.appendChild(option);

        const listItem = document.createElement("li");
        listItem.textContent = `${data.name} - Quota: ${data.quota}`;
        positionsList.appendChild(listItem);
    });
}

// Function to Submit AJK Selection
document.getElementById("ajkForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const fullName = document.getElementById("fullName").value;
    const matricNumber = document.getElementById("matricNumber").value;
    const positionId = document.getElementById("positionSelect").value;

    const positionRef = doc(db, "positions", positionId);
    const positionDoc = await getDoc(positionRef);
    if (!positionDoc.exists()) {
        alert("Error: Position does not exist!");
        return;
    }

    const data = positionDoc.data();
    if (data.quota <= 0) {
        alert("This position is full!");
        return;
    }

    // Add Application
    await addDoc(collection(db, "applications"), {
        fullName,
        matricNumber,
        position: data.name,
        timestamp: new Date()
    });

    // Update Quota
    await updateDoc(positionRef, {
        quota: data.quota - 1
    });

    alert("Application Submitted Successfully!");
    loadPositions();
});

// Initialize on Page Load
initializePositions();

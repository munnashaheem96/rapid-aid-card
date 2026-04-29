// ✅ IMPORTS (MODULAR)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// 🔥 YOUR CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyCCdAvHXKwTA-LXc01IjD0Oko56zu7M7aY",
  authDomain: "rapid-aid-48ab9.firebaseapp.com",
  projectId: "rapid-aid-48ab9",
  storageBucket: "rapid-aid-48ab9.firebasestorage.app",
  messagingSenderId: "442278868539",
  appId: "1:442278868539:web:fa88e7e2419381c696ce1e"
};

// INIT
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// GET USER ID FROM URL
const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get("id");

// LOAD USER DATA
async function loadUser() {
  const ref = doc(db, "users", userId);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    alert("User not found");
    return;
  }

  const data = snap.data();

  document.getElementById("name").innerText = data.name || "";
  document.getElementById("blood").innerText = data.bloodGroup || "";
  document.getElementById("phone").innerText = data.phone || "";
  document.getElementById("allergies").innerText = data.allergies || "";
  document.getElementById("diseases").innerText = data.diseases || "";
}

loadUser();

// 🔐 LOGIN (GOOGLE)
async function login() {
  const provider = new GoogleAuthProvider();
  await signInWithPopup(auth, provider);
  alert("Logged in");
}

// ✏️ ENABLE EDIT
function enableEdit() {
  if (!auth.currentUser || auth.currentUser.uid !== userId) {
    alert("Only owner can edit");
    return;
  }

  document.getElementById("editForm").style.display = "block";
}

// 💾 SAVE DATA
async function save() {
  const name = document.getElementById("editName").value;
  const phone = document.getElementById("editPhone").value;

  const ref = doc(db, "users", userId);

  await updateDoc(ref, {
    name: name,
    phone: phone
  });

  alert("Updated successfully");
  location.reload();
}
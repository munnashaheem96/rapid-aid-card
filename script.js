import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCCdAvHXKwTA-LXc01IjD0Oko56zu7M7aY",
  authDomain: "rapid-aid-48ab9.firebaseapp.com",
  projectId: "rapid-aid-48ab9"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const userId = new URLSearchParams(window.location.search).get("id");

// LOAD USER
async function loadUser() {
  const snap = await getDoc(doc(db, "users", userId));
  if (!snap.exists()) return alert("User not found");

  const d = snap.data();

  // BASIC
  document.getElementById("name").innerText = d.name || "";
  document.getElementById("dob").innerText = d.dob || "";
  document.getElementById("blood").innerText = d.bloodGroup || "";

  // MEDICAL
  document.getElementById("allergies").innerText = d.allergies || "None";
  document.getElementById("diseases").innerText = d.diseases || "None";
  document.getElementById("medications").innerText = d.medications || "None";

  // PHONE
  document.getElementById("phone1").innerText = d.phone || "";
  document.getElementById("phone1").href = "tel:" + d.phone;

  document.getElementById("phone2").innerText = d.phone2 || "";
  document.getElementById("phone2").href = "tel:" + (d.phone2 || "");

  // LOCATION
  if (d.lat && d.lng) {
    document.getElementById("location").innerText = `${d.lat}, ${d.lng}`;
    document.getElementById("mapLink").href =
      `https://www.google.com/maps?q=${d.lat},${d.lng}`;
  }

  // PHOTO
  document.getElementById("profileImg").src =
    d.photoUrl || "https://via.placeholder.com/100";

  // RISK
  document.getElementById("risk").innerText = generateRisk(d);
}

loadUser();

// LOGIN
window.login = async function () {
  const provider = new GoogleAuthProvider();
  await signInWithPopup(auth, provider);
  alert("Logged in");
};

// ENABLE EDIT
window.enableEdit = function () {
  if (!auth.currentUser || auth.currentUser.uid !== userId) {
    return alert("Only owner can edit");
  }
  document.getElementById("editForm").style.display = "block";
};

// SAVE
window.save = async function () {
  await updateDoc(doc(db, "users", userId), {
    name: editName.value,
    phone: editPhone.value,
    allergies: editAllergies.value
  });

  alert("Updated");
  location.reload();
};

// PDF
window.downloadPDF = function () {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.text("Emergency Profile", 20, 20);
  doc.text("Name: " + name.innerText, 20, 40);
  doc.text("Blood: " + blood.innerText, 20, 50);
  doc.text("Phone: " + phone1.innerText, 20, 60);

  doc.save("profile.pdf");
};

// AI RISK
function generateRisk(d) {
  let r = [];

  if (d.allergies) r.push("Allergies present");
  if (d.diseases) r.push("Medical condition");
  if (d.bloodGroup === "O-") r.push("Rare blood group");

  return r.join(", ") || "No major risk detected";
}
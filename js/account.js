// Importa le funzioni necessarie
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  onAuthStateChanged, // Importa per rilevare lo stato di autenticazione
  signOut,
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import {
  getFirestore,
  setDoc,
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDLhjU-P1R3g-VR3Awv-4nhXgw6tpdjqTc",
  authDomain: "liceo-pasteur-studenti-f0a8f.firebaseapp.com",
  projectId: "liceo-pasteur-studenti-f0a8f",
  storageBucket: "liceo-pasteur-studenti-f0a8f.appspot.com",
  messagingSenderId: "542827887858",
  appId: "1:542827887858:web:ff6f348d92d91c4d13a46b",
  measurementId: "G-Q526B56MBC",
};

// Inizializza Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);

const logoutButton = document.getElementById("logoutButton");

logoutButton.addEventListener("click", () => {
  localStorage.removeItem("loggedInUserId");
  signOut(auth)
    .then(() => {
      window.location.href = "index.html";
    })
    .catch((error) => {
      console.error("Error Signing out:", error);
    });
});

onAuthStateChanged(auth, (user) => {
  const loggedInUserId = localStorage.getItem("loggedInUserId");
  if (loggedInUserId) {
    console.log(user);
    const docRef = doc(db, "users", loggedInUserId);
    getDoc(docRef)
      .then((docSnap) => {
        if (docSnap.exists()) {
          const userData = docSnap.data();
          document.getElementById("loggedUserFName").innerText = userData.nome;
          document.getElementById("loggedUserLName").innerText =
            userData.cognome;
          document.getElementById("loggedUserGrade").innerText =
            userData.classe;
          document.getElementById("loggedUserEmail").innerText = userData.email;
        } else {
          console.log("no document found matching id");
        }
      })
      .catch((error) => {
        console.log("Error getting document");
      });
  } else {
    console.log("User Id not Found in Local storage");
  }
});

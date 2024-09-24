import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";
import {
  getAuth,
  onAuthStateChanged,
  setPersistence,
  browserSessionPersistence,
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";

// Configura Firebase
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
const db = getFirestore(app);
const auth = getAuth(app);

// Funzione per colorare il corso selezionato e nascondere gli altri corsi
function coloraCorsoEIsolalo(corsoId) {
  const corsoSelezionato = document.getElementById(corsoId);
  if (corsoSelezionato) {
    corsoSelezionato.style.backgroundColor = "green";
  }

  const altriCorsi = document.querySelectorAll(
    `.course-container:not(#${corsoId})`
  );
  altriCorsi.forEach((corso) => {
    corso.style.display = "none";
  });
}

// Funzione per iscrivere l'utente al corso e creare il corso se non esiste
async function iscriviAlCorso(corsoId, userData) {
  const corsoRef = doc(db, "corsi", corsoId);
  const corsoSnap = await getDoc(corsoRef);
  console.log(corsoSnap);

  if (!corsoSnap.exists()) {
    await setDoc(corsoRef, {
      partecipanti: [userData], // Aggiungi l'utente come primo partecipante
    });
    coloraCorsoEIsolalo(corsoId);
    alert("Corso creato e iscritto con successo!");
    return;
  }

  const corsoData = corsoSnap.data();
  const partecipanti = corsoData.partecipanti || [];

  if (partecipanti.length >= 20) {
    alert("Il corso è già pieno (max 20 partecipanti).");
    return;
  }

  if (partecipanti.some((p) => p.email === userData.email)) {
    alert("Sei già iscritto a questo corso.");
    return;
  }

  await updateDoc(corsoRef, {
    partecipanti: arrayUnion(userData),
  });

  coloraCorsoEIsolalo(corsoId);
  alert("Iscrizione avvenuta con successo!");
}

// Gestione dei pulsanti "Iscriviti"
const buttons = document.querySelectorAll(".iscriviti-btn");
buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const corsoId = button.closest(".course-container").id;

    const user = auth.currentUser;
    if (user) {
      const userId = user.uid;
      const email = user.email;

      // Recupera i dettagli dell'utente dal documento Firestore
      const userRef = doc(db, "users", userId);
      getDoc(userRef)
        .then((docSnap) => {
          if (docSnap.exists()) {
            const userData = docSnap.data();
            iscriviAlCorso(corsoId, {
              UID: user.uid,
              nome: userData.nome,
              cognome: userData.cognome,
              classe: userData.classe,
              email: email,
            });
          } else {
            alert("Impossibile recuperare i dati utente.");
          }
        })
        .catch((error) => {
          console.error("Errore nel recupero dei dati utente:", error);
        });
    } else {
      alert("Devi essere loggato per iscriverti a un corso.");
      window.location.href = "registrazione.html"; // Reindirizza alla pagina di login se non loggato
    }
  });
});

onAuthStateChanged(auth, async (user) => {
  const corsoRef = doc(db, "corsi", "corso-lazio");
  const corsoSnap = await getDoc(corsoRef);
  const corsoData = corsoSnap.data();
  const partecipanti = corsoData.partecipanti || [];
  console.log(corsoData);
  console.log(partecipanti);

  if (partecipanti.some((p) => p.email === user.email)) {
    coloraCorsoEIsolalo("corso-lazio");
  }
});

// for (const utente of partecipanti) {
//   // console.log(utente);
//   if (utente.email === user.email) {
//     console.log("ciaoo");
//   }
// }

// Importamos Firebase desde los enlaces directos (CDN)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Tu configuración (la que aparece en tu imagen)
const firebaseConfig = {
  apiKey: "AIzaSyBD_bvRNCKqELeJQmSCmDQ5GDNhqlcht1Q",
  authDomain: "ausherman-redesign.firebaseapp.com",
  projectId: "ausherman-redesign",
  storageBucket: "ausherman-redesign.firebasestorage.app",
  messagingSenderId: "783191979452",
  appId: "1:783191979452:web:1edb316b632029de81a7b9"
};

// Inicializamos
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

console.log("¡Firebase conectado correctamente!");

// Lógica para enviar el formulario
const form = document.getElementById("estimate-form");

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    try {
        await addDoc(collection(db, "solicitudes"), {
            nombre: document.getElementById("name").value,
            email: document.getElementById("email").value,
            servicio: document.getElementById("service").value,
            mensaje: document.getElementById("message").value,
            fecha: new Date()
        });
        alert("¡Solicitud enviada con éxito!");
        form.reset();
    } catch (error) {
        console.error("Error al guardar: ", error);
    }
});
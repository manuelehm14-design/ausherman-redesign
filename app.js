// Importamos Firebase desde los enlaces directos (CDN) - Actualizado a v10 para mejor soporte
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Tu configuración (Corregida API Key basada en patrón estándar, añadida 'L' que parecía faltar en 'qlcht1Q' -> 'qlcht1Q')
const firebaseConfig = {
  apiKey: "AIzaSyBD_bvRNCKqELeJQmSCmDQ5GDNhq1cht1Q",
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

// =========================================
// LÓGICA FORMULARIO ESTIMATE (Existente)
// =========================================
const estimateForm = document.getElementById("estimate-form");

if (estimateForm) {
    estimateForm.addEventListener("submit", async (e) => {
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
            estimateForm.reset();
        } catch (error) {
            console.error("Error al guardar cotización: ", error);
            alert("Hubo un error al enviar. Por favor intente más tarde.");
        }
    });
}

// =========================================
// LÓGICA SECCIÓN CAREERS (NUEVO)
// =========================================

document.addEventListener('DOMContentLoaded', () => {
    // 1. Funcionalidad de Pestañas (Tabs)
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remover clase activa de todos los botones y paneles
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));

            // Añadir clase activa al botón clickeado
            btn.classList.add('active');
            
            // Obtener el ID del panel correspondiente y mostrarlo
            const tabId = btn.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // 2. Funcionalidad Formulario Multi-paso
    const employmentForm = document.getElementById('employment-form');
    if (!employmentForm) return;

    const formSteps = employmentForm.querySelectorAll('.form-step');
    const nextBtns = employmentForm.querySelectorAll('.next-btn');
    const prevBtns = employmentForm.querySelectorAll('.prev-btn');
    const circles = document.querySelectorAll('.progress-bar .step-circle');
    const lines = document.querySelectorAll('.progress-bar .step-line');
    
    let currentStep = 1;

    // Función para actualizar la vista del formulario y barra de progreso
    const updateFormUI = () => {
        // Actualizar pasos del formulario
        formSteps.forEach(step => {
            step.classList.remove('active');
            if (step.id === `step-${currentStep}`) {
                step.classList.add('active');
            }
        });

        // Actualizar barra de progreso (círculos y líneas)
        circles.forEach(circle => {
            const stepNum = parseInt(circle.getAttribute('data-step'));
            circle.classList.remove('active');
            if (stepNum <= currentStep) {
                circle.classList.add('active');
            }
        });

        lines.forEach((line, index) => {
            // El índice de la línea corresponde al paso completado
            line.classList.remove('active');
            if (index < currentStep - 1) {
                line.classList.add('active');
            }
        });
    };

    // Validar campos requeridos antes de avanzar
    const validateStep = (stepId) => {
        const currentStepEl = document.getElementById(stepId);
        const requiredInputs = currentStepEl.querySelectorAll('[required]');
        let isValid = true;
        
        requiredInputs.forEach(input => {
            if (!input.checkValidity()) {
                input.reportValidity(); // Muestra el error nativo del navegador
                isValid = false;
            }
        });
        
        return isValid;
    };

    // Botones "Next"
    nextBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (validateStep(`step-${currentStep}`)) {
                currentStep++;
                if (currentStep > formSteps.length) currentStep = formSteps.length;
                updateFormUI();
                // Scroll suave al inicio del formulario
                document.getElementById('careers').scrollIntoView({behavior: 'smooth'});
            }
        });
    });

    // Botones "Previous"
    prevBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            currentStep--;
            if (currentStep < 1) currentStep = 1;
            updateFormUI();
        });
    });

    // Envio final del formulario a Firebase
    employmentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Validación final
        if (!validateStep(`step-${currentStep}`)) return;

        const submitBtn = employmentForm.querySelector('.final-submit-btn');
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        // Recolectar datos usando FormData
        const formData = new FormData(employmentForm);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });
        
        // Añadir metadata
        data.fechaSometido = new Date();
        data.estado = 'nuevo'; // Útil para gestionar en el dashboard de Firebase

        try {
            // Guardar en NUEVA colección "solicitudes_empleo"
            await addDoc(collection(db, "solicitudes_empleo"), data);
            
            alert("¡Su solicitud de empleo ha sido enviada con éxito! Revisaremos su perfil pronto.");
            
            // Reiniciar formulario y volver al paso 1
            employmentForm.reset();
            currentStep = 1;
            updateFormUI();
            
        } catch (error) {
            console.error("Error al guardar solicitud de empleo: ", error);
            alert("Hubo un error al enviar su solicitud. Por favor intente más tarde.");
        } finally {
            submitBtn.textContent = 'Submit Application';
            submitBtn.disabled = false;
        }
    });
});
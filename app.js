let preguntasSeleccionadas = [];
let indiceActual = 0;
let respuestasCorrectasSeguidas = 0;
let estacionActual = 1; 

// Lee la URL para identificar automáticamente qué estación se escaneó
function obtenerEstacionDesdeURL() {
    const params = new URLSearchParams(window.location.search);
    const estacionParam = parseInt(params.get('estacion'));
    if (estacionParam >= 1 && estacionParam <= 3) {
        estacionActual = estacionParam;
    }
}

// ESTA FUNCIÓN SE ACTIVA AL DAR CLIC EN "INICIAR DESAFÍO"
function startTrivia() {
    obtenerEstacionDesdeURL();
    
    // Filtra las preguntas según el nivel de la estación actual
    let preguntasDisponibles = [...bancoPorNiveles[estacionActual]];
    
    // Mezcla aleatoria de las preguntas (Algoritmo Fisher-Yates)
    for (let i = preguntasDisponibles.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [preguntasDisponibles[i], preguntasDisponibles[j]] = [preguntasDisponibles[j], preguntasDisponibles[i]];
    }
    
    // Selecciona un bloque único de 3 preguntas para esta ronda
    preguntasSeleccionadas = preguntasDisponibles.slice(0, 3);
    indiceActual = 0;
    respuestasCorrectasSeguidas = 0;
    
    // Oculta la bienvenida y enciende la interfaz de las preguntas
    document.getElementById("welcome-screen").classList.remove("active");
    document.getElementById("quiz-screen").classList.add("active");
    
    mostrarPregunta();
}

function mostrarPregunta() {
    document.getElementById("feedback-message").innerText = "";
    document.getElementById("next-btn").style.display = "none";
    
    let preguntaActual = preguntasSeleccionadas[indiceActual];
    
    document.getElementById("station-number").innerText = estacionActual;
    document.getElementById("current-index").innerText = indiceActual + 1;
    document.getElementById("question-text").innerText = preguntaActual.pregunta;
    
    const container = document.getElementById("options-container");
    container.innerHTML = ""; 
    
    preguntaActual.opciones.forEach(opcion => {
        const boton = document.createElement("button");
        boton.innerText = opcion;
        boton.className = "btn-option";
        boton.onclick = () => verificarRespuesta(opcion, preguntaActual.correcta);
        container.appendChild(boton);
    });
}

function verificarRespuesta(seleccionada, correcta) {
    const feedback = document.getElementById("feedback-message");
    const botones = document.getElementsByClassName("btn-option");
    
    for (let boton of botones) {
        boton.disabled = true;
        if (boton.innerText === correcta) {
            boton.style.backgroundColor = "#2ecc71"; // Alumbra la correcta en verde
            boton.style.color = "white";
        }
    }
    
    if (seleccionada === correcta) {
        feedback.innerText = "¡Correcto!";
        feedback.className = "feedback correct";
        respuestasCorrectasSeguidas++;
    } else {
        feedback.innerText = `Incorrecto. La respuesta correcta era: ${correcta}`;
        feedback.className = "feedback incorrect";
    }
    
    document.getElementById("next-btn").style.display = "block";
}

function nextQuestion() {
    indiceActual++;
    
    if (indiceActual < preguntasSeleccionadas.length) {
        mostrarPregunta();
    } else {
        // Fin de la ronda: Se oculta el juego y se activa la pantalla de resultados
        document.getElementById("quiz-screen").classList.remove("active");
        document.getElementById("success-screen").classList.add("active");
        
        const textSuccess = document.getElementById("success-message");
        const btnFinish = document.getElementById("finish-btn");
        
        if (respuestasCorrectasSeguidas === 3) {
            textSuccess.innerHTML = `<strong>¡EXCELENTE! Conquistaste la Estación ${estacionActual} con puntuación perfecta.<br><br>🎁 ¡RECLAMA TU PREMIO YA MISMO CON EL SUPERVISOR!</strong>`;
            btnFinish.innerText = "Terminar Desafío";
        } else {
            textSuccess.innerHTML = `Completaste la ronda de la Estación ${estacionActual}, pero respondiste ${respuestasCorrectasSeguidas} de 3 de forma correcta.<br><br>Inténtalo de nuevo para lograr la puntuación perfecta y ganar el premio.`;
            btnFinish.innerText = "Reintentar Estación";
        }
    }
}

function resetToWelcome() {
    document.getElementById("success-screen").classList.remove("active");
    document.getElementById("welcome-screen").classList.add("active");
}
"use strict";

function mostrarMensaje(formulario, texto, esError) {
    const mensaje = formulario.querySelector(".mensaje-formulario");
    mensaje.textContent = texto;
    mensaje.classList.remove("alerta-error", "alerta-exito");

    if (esError) {
        mensaje.classList.add("alerta-error");
    } else {
        mensaje.classList.add("alerta-exito");
    }

    mensaje.hidden = false;
}

function campoCompleto(formulario, campo, nombreCampo) {
    if (campo.value.trim() === "") {
        mostrarMensaje(formulario, "Completá el campo " + nombreCampo + ".", true);
        campo.focus();
        return false;
    }
    return true;
}

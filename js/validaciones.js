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

const formularioContacto = document.getElementById("form-contacto");

if (formularioContacto) {
    formularioContacto.addEventListener("submit", function (evento) {
        evento.preventDefault();

        const nombre = document.getElementById("nombre");
        const correo = document.getElementById("correo");
        const motivo = document.getElementById("motivo");
        const mensaje = document.getElementById("mensaje");

        if (!campoCompleto(formularioContacto, nombre, "nombre completo")) return;
        if (!campoCompleto(formularioContacto, correo, "correo electrónico")) return;

        if (!correo.checkValidity()) {
            mostrarMensaje(formularioContacto, "Ingresá un correo electrónico válido.", true);
            correo.focus();
            return;
        }

        if (!campoCompleto(formularioContacto, motivo, "motivo de la consulta")) return;
        if (!campoCompleto(formularioContacto, mensaje, "mensaje")) return;

        mostrarMensaje(formularioContacto, "Consulta enviada con éxito.", false);
    });
}

const formularioLogin = document.getElementById("form-login");

if (formularioLogin) {
    formularioLogin.addEventListener("submit", function (evento) {
        evento.preventDefault();

        const correo = document.getElementById("correo");
        const contrasena = document.getElementById("contrasena");

        if (!campoCompleto(formularioLogin, correo, "correo electrónico")) return;

        if (!correo.checkValidity()) {
            mostrarMensaje(formularioLogin, "Ingresá un correo electrónico válido.", true);
            correo.focus();
            return;
        }

        if (!campoCompleto(formularioLogin, contrasena, "contraseña")) return;

        mostrarMensaje(formularioLogin, "Inicio de sesión exitoso.", false);
    })
}

const formularioRegistro = document.getElementById("form-registro");

if (formularioRegistro) {
    formularioRegistro.addEventListener("submit", function (evento) {
        evento.preventDefault();

        const nombre = document.getElementById("nombre");
        const apellido = document.getElementById("apellido");
        const correo = document.getElementById("correo");
        const password = document.getElementById("password");
        const confirmarPassword = document.getElementById("confirmar-password");
        const terminos = document.getElementById("terminos");

        if (!campoCompleto(formularioRegistro, nombre, "nombre")) return;
        if (!campoCompleto(formularioRegistro, apellido, "apellido")) return;
        if (!campoCompleto(formularioRegistro, correo, "correo electrónico")) return;

        if (!correo.checkValidity()) {
            mostrarMensaje(formularioRegistro, "Ingresá un correo electrónico válido.", true);
            correo.focus();
            return;
        }

        if (!campoCompleto(formularioRegistro, direccion, "dirección")) return;
        if (!campoCompleto(formularioRegistro, password, "contraseña")) return;
        if (!campoCompleto(formularioRegistro, confirmarPassword, "confirmación de contraseña")) return;

        if (password.value !== confirmarPassword.value) {
            mostrarMensaje(formularioRegistro, "Las contraseñas no coinciden.", true);
            password.focus();
            return;
        }

        if (!terminos.checked) {
            mostrarMensaje(formularioRegistro, "Debes aceptar los términos y condiciones.", true);
            terminos.focus();
            return;
        }

        mostrarMensaje(formularioRegistro, "Registro completado con éxito.", false);
    });
}

const botonMenu = document.getElementById("boton-menu");
const menuPrincipal = document.getElementById("menu-principal");

if (botonMenu && menuPrincipal) {
    botonMenu.addEventListener("click", function () {
        const estaAbierto = menuPrincipal.classList.toggle("menu-abierto");
        botonMenu.setAttribute("aria-expanded", estaAbierto);
    });
}
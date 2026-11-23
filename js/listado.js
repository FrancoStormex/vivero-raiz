"use strict";

const tablaPlantas = document.getElementById("tabla-plantas");

if(tablaPlantas) {
    function crearCelda(texto) {
        const celda = document.createElement("td");
        celda.textContent = texto;
        return celda;
    }

    function crearFila(planta) {
        const fila = document.createElement("tr");

        const id = crearCelda("#" + String(planta.id).padStart(3, "0"));
        const nombre = crearCelda(planta.nombre);
        const categoria = crearCelda(planta.categoria);
        const precio = crearCelda(formatearPrecio(planta.precio));

        const acciones = document.createElement("td");
        const editar = document.createElement("a");
        editar.href = "planta-form.html?id=" + planta.id;
        editar.className = "btn-accion btn-editar";
        editar.textContent = "Editar";
        editar.title = ".";

        const eliminar = document.createElement("button");
        eliminar.type = "button";
        eliminar.className = "btn-accion btn-eliminar";
        eliminar.textContent = "Eliminar";
        eliminar.disabled = true;
        eliminar.title = "."

        acciones.append(editar, eliminar);
        fila.append(id, nombre, categoria, precio, acciones);
        return fila;
    }

    function mostrarListado() {
        tablaPlantas.replaceChildren();
        plantas.forEach(function (planta) {
            tablaPlantas.appendChild(crearFila(planta));
        })
    }

    mostrarListado();
}
"use strict";

const tablaPlantas = document.getElementById("tabla-plantas");
const estadoApiListado = document.getElementById("estado-api-listado");

/* entrega 8
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
} */

if (tablaPlantas && estadoApiListado) {
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

    function mostrarMensajeTabla(texto) {
        tablaPlantas.replaceChildren();
        const fila = document.createElement("tr");
        const celda = crearCelda(texto);
        celda.colSpan = 5;
        fila.appendChild(celda);
        tablaPlantas.appendChild(fila);
    }

    function mostrarListado(datos) {
        tablaPlantas.replaceChildren();

        if (datos.length === 0) {
            mostrarMensajeTabla("No hay plantas registradas.");
            return;
        }

        datos.forEach(function (planta) {
            tablaPlantas.appendChild(crearFila(planta));
        })
    }

    async function iniciarListado() {
        mostrarMensajeTabla("Cargando inventario...");
        const resultado = await obtenerPlantas();

        console.log("Resultado recibido por listado.js:", resultado);
        console.log("¿Se utiliza respaldo?:", resultado.respaldo);
        console.log("Plantas obtenidas:", resultado.datos);

        if (resultado.respaldo) {
            estadoApiListado.textContent = "No pudimos consultar la API. Se muestra el inventario del respaldo local.";
            estadoApiListado.hidden = false;
        } else {
            estadoApiListado.hidden = true;
        }

        mostrarListado(resultado.datos);
    }

    iniciarListado();
}
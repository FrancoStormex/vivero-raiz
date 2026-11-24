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

/* Entrega 9
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
} */

if (tablaPlantas && estadoApiListado) {
    let plantasEnTabla = [];

    function crearCelda(texto) {
        const celda = document.createElement("td");
        celda.textContent = texto;
        return celda;
    }

    function mostrarEstadoListado(texto, esError) {
        estadoApiListado.textContent = texto;
        estadoApiListado.classList.remove("alerta-error", "alerta-exito");
        estadoApiListado.classList.add(esError ? "alerta-error" : "alerta-exito");
        estadoApiListado.hidden = false;
    }

    function crearFila(planta) {
        const fila = document.createElement("tr");
        const id = crearCelda(Number(planta.id) < 0
            ? "Local " + Math.abs(Number(planta.id))
            : "#" + String(planta.id).padStart(3, "0"));
        const nombre = crearCelda(planta.nombre);
        const categoria = crearCelda(planta.categoria);
        const precio = crearCelda(formatearPrecio(planta.precio));
        const acciones = document.createElement("td");

        const editar = document.createElement("a");
        editar.href = "planta-form.html?id=" + encodeURIComponent(planta.id);
        editar.className = "btn-accion btn-editar";
        editar.textContent = "Editar";
        acciones.appendChild(editar);

        const eliminar = document.createElement("button");
        eliminar.type = "button";
        eliminar.className = "btn-accion btn-eliminar";
        eliminar.textContent = "Eliminar";
        eliminar.addEventListener("click", function () {
            confirmarEliminacion(planta, eliminar);
        });

        acciones.appendChild(eliminar);
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
        });
    }

    async function confirmarEliminacion(planta, boton) {
        const confirmado = window.confirm(
            '¿Ocultar "' + planta.nombre + '" (ID ' + planta.id + ') en este navegador? No se modificará MockAPI.'
        );
        if (!confirmado) return;

        boton.disabled = true;
        try {
            await eliminarPlanta(planta.id);

            plantasEnTabla = plantasEnTabla.filter(function (actual) {
                return String(actual.id) !== String(planta.id);
            });
            mostrarListado(plantasEnTabla);
            mostrarEstadoListado('Se eliminó la planta "' + planta.nombre + '" de este navegador.', false);
        } catch (error) {
            console.error("No se pudo eliminar la planta:", error);
            mostrarEstadoListado(error.message || "No se pudo eliminar la planta.", true);
            boton.disabled = false;
        }
    }

    async function iniciarListado() {
        mostrarMensajeTabla("Cargando inventario...");
        try {
            const resultado = await obtenerPlantas();
            plantasEnTabla = resultado.datos;
            if (resultado.respaldo) {
                mostrarEstadoListado(
                    "MockAPI no está disponible: se muestra el respaldo combinado con tus cambios locales.", true);
            } else {
                estadoApiListado.hidden = true;
            }
            mostrarListado(plantasEnTabla);
        } catch (error) {
            console.error("No se pudo leer el inventario:", error);
            mostrarEstadoListado("No se pudo leer el inventario: " + error.message, true);
            mostrarMensajeTabla("No fue posible cargar el inventario.");
        }
    }

    iniciarListado();
}
"use strict";

const formularioPlanta = document.getElementById("form-planta");

if (formularioPlanta) {
    const parametros = new URLSearchParams(window.location.search);
    const idPlanta = parametros.get("id");
    const esEdicion = idPlanta !== null;
    const tituloFormulario = document.getElementById("titulo-form-planta");
    const botonGuardar = document.getElementById("guardar-planta");

    formularioPlanta.noValidate = true;

    function campo(nombre) {
        return formularioPlanta.elements.namedItem(nombre);
    }

    function seleccionarRadio(nombre, valor) {
        formularioPlanta.querySelectorAll('input[name="' + nombre + '"]').forEach(function (opcion) {
            opcion.checked = opcion.value === String(valor);
        });
    }

    function completarFormulario(planta) {
        campo("nombre").value = planta.nombre || "";
        campo("nombreCientifico").value = planta.nombreCientifico || "";
        campo("categoria").value = planta.categoria === "aromatica" ? "aromática" : planta.categoria;
        campo("precio").value = planta.precio ?? "";
        campo("stock").value = planta.stock ?? "";
        campo("fechaIngreso").value = String(planta.fechaIngreso || "").slice(0, 10);
        campo("riego").value = planta.riego || "";
        campo("foto").value = planta.foto || "";
        campo("notas").value = planta.notas || "";

        seleccionarRadio("luz", planta.luz);
        seleccionarRadio("aptaMascotas", planta.aptaMascotas === true || planta.aptaMascotas === "true");

        const etiquetas = Array.isArray(planta.etiquetas) ? planta.etiquetas : [];
        formularioPlanta.querySelectorAll('input[name="etiquetas"]').forEach(function (opcion) {
            opcion.checked = etiquetas.includes(opcion.value);
        });
    }

    function validarFormularioPlanta() {
        const obligatorios = [
            ["nombre", "nombre"],
            ["nombreCientifico", "nombre científico"],
            ["categoria", "categoría"],
            ["precio", "precio"],
            ["stock", "stock"],
            ["fechaIngreso", "fecha de ingreso"],
            ["riego", "riego"]
        ];

        for (const obligatorio of obligatorios) {
            if (!campoCompleto(formularioPlanta, campo(obligatorio[0]), obligatorio[1])) {
                return false;
            }
        }

        if (!formularioPlanta.querySelector('input[name="luz"]:checked')) {
            mostrarMensaje(formularioPlanta, "Seleccioná una necesidad de luz.", true);
            formularioPlanta.querySelector('input[name="luz"]').focus();
            return false;
        }
        if (!formularioPlanta.querySelector('input[name="aptaMascotas"]:checked')) {
            mostrarMensaje(formularioPlanta, "Indicá si la planta es apta para mascotas.", true);
            formularioPlanta.querySelector('input[name="aptaMascotas"]').focus();
            return false;
        }

        const precio = Number(campo("precio").value);
        const stock = Number(campo("stock").value);
        if (!Number.isFinite(precio) || precio < 0) {
            mostrarMensaje(formularioPlanta, "El precio debe ser un número válido no negativo.", true);
            campo("precio").focus();
            return false;
        }
        if (!Number.isInteger(stock) || stock < 0) {
            mostrarMensaje(formularioPlanta, "El stock debe ser un número entero no negativo.", true);
            campo("stock").focus();
            return false;
        }
        if (!campo("fechaIngreso").checkValidity()) {
            mostrarMensaje(formularioPlanta, "Ingresá una fecha válida.", true);
            campo("fechaIngreso").focus();
            return false;
        }
        return true;
    }

    function obtenerDatosFormulario() {
        const etiquetas = Array.from(
            formularioPlanta.querySelectorAll('input[name="etiquetas"]:checked')
        ).map(function (opcion) {
            return opcion.value;
        });

        return {
            nombre: campo("nombre").value.trim(),
            nombreCientifico: campo("nombreCientifico").value.trim(),
            categoria: campo("categoria").value,
            luz: formularioPlanta.querySelector('input[name="luz"]:checked').value,
            riego: campo("riego").value,
            precio: Number(campo("precio").value),
            stock: Number(campo("stock").value),
            fechaIngreso: campo("fechaIngreso").value,
            aptaMascotas: formularioPlanta.querySelector('input[name="aptaMascotas"]:checked').value === "true",
            etiquetas: etiquetas,
            foto: campo("foto").value.trim(),
            notas: campo("notas").value.trim()
        };
    }

    async function iniciarFormulario() {
        if (!esEdicion) {
            tituloFormulario.textContent = "Nueva planta";
            return;
        }

        tituloFormulario.textContent = "Editar planta #" + idPlanta;
        botonGuardar.disabled = true;

        if (!/^-?\d+$/.test(idPlanta) || Number(idPlanta) === 0) {
            mostrarMensaje(formularioPlanta, "El ID de la planta no es válido.", true);
            return;
        }

        mostrarMensaje(formularioPlanta, "Cargando datos de la planta...", false);
        try {
            const resultado = await obtenerPlantaPorId(idPlanta);
            if (!resultado.dato) {
                mostrarMensaje(formularioPlanta, "No encontramos la planta solicitada.", true);
                return;
            }

            completarFormulario(resultado.dato);
            formularioPlanta.querySelector(".mensaje-formulario").hidden = true;
            botonGuardar.disabled = false;
        } catch (error) {
            console.error("Error leyendo los datos locales:", error);
            mostrarMensaje(formularioPlanta, "No se pudo leer la información: " + error.message, true);
        }
    }

    formularioPlanta.addEventListener("submit", async function (evento) {
        evento.preventDefault();
        if (botonGuardar.disabled || !validarFormularioPlanta()) {
            return;
        }

        const datosPlanta = obtenerDatosFormulario();
        botonGuardar.disabled = true;
        mostrarMensaje(formularioPlanta, "Guardando cambios en este navegador...", false);

        try {
            if (esEdicion) {
                await actualizarPlanta(idPlanta, datosPlanta);
                mostrarMensaje(formularioPlanta,
                    "Planta actualizada en este navegador. MockAPI no se modificó.", false);
            } else {
                const creada = await crearPlanta(datosPlanta);
                formularioPlanta.reset();
                mostrarMensaje(formularioPlanta,
                    "Planta creada localmente (ID: " + creada.id + "). Podés volver al inventario.", false);
            }
        } catch (error) {
            console.error("No se pudo guardar la planta:", error);
            mostrarMensaje(formularioPlanta, error.message || "No se pudo guardar la planta.", true);
        } finally {
            botonGuardar.disabled = false;
        }
    });

    iniciarFormulario();
}

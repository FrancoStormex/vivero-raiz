"use strict";

const URL_PLANTAS = "https://6b04a358db01cf4636077805.mockapi.io/vivero-raiz/v1/plantas";

async function obtenerPlantas() {

    console.log("1. Iniciando consulta a MockAPI...");
    try {
        const respuesta = await fetch(URL_PLANTAS);

        console.log("2. Respuesta HTTP:", respuesta.status);
        console.log("3. Respuesta OK:", respuesta.ok);

        if (!respuesta.ok) {
            throw new Error("Error HTTP " + respuesta.status);
        }

        console.log("4. Intentando convertir respuesta a JSON...");

        const datos = await respuesta.json();

        console.log("5. Datos recibidos:", datos);
        console.log("6. ¿Es un array?:", Array.isArray(datos));
        console.log("7. Cantidad de plantas:", datos.length);

        if (!Array.isArray(datos)) {
            throw new Error("La API no devolvió una lista de plantas.");
        }

        console.log("8. Consulta exitosa. Usando datos de MockAPI.");

        return { datos: datos, respaldo: false };
    } catch (error) {
        console.error("ERROR DETECTADO:", error);
        console.error("Mensaje:", error.message);
        console.error("Stack:", error.stack);

        console.warn("9. Activando respaldo local.");
        return { datos: plantas, respaldo: true };
    }
}

async function obtenerPlantaPorId(id) {
    try {
        const respuesta = await fetch(
            URL_PLANTAS + "?id=" + encodeURIComponent(id)
        );

        if (respuesta.status === 404) {
            return { dato: null, respaldo: false };
        }

        if (!respuesta.ok) {
            throw new Error("Error HTTP " + respuesta.status);
        }

        const dato = await respuesta.json();

        let planta;

        if (Array.isArray(dato)) {
            if (dato.length === 0) {
                return { dato: null, respaldo: false };
            }

            if (dato.length !== 1) {
                throw new Error("La API devolvió varias plantas para un ID.");
            }

            planta = dato[0];
        }

        if (!planta || typeof planta !== "object" || String(planta.id) !== String(id)) {
            throw new Error("La API no devolvió una planta válida.");
        }

        return { dato: planta, respaldo: false };

    } catch (error) {
        console.error("No fue posible consultar la ficha en MockAPI:", error);

        const plantaLocal = plantas.find(function (planta) {
            return String(planta.id) === String(id);
        });

        return { dato: plantaLocal || null, respaldo: true };
    }
}
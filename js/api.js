"use strict";

const URL_PLANTAS = "https://6b04a358db01cf4636077805.mockapi.io/vivero-raiz/v1/plantas";
const CLAVE_CAMBIOS_PLANTAS = "vivero-raiz-cambios-v1";

function leerCambiosPlantas() {
    const guardado = localStorage.getItem(CLAVE_CAMBIOS_PLANTAS);
    if (guardado === null) {
        return { creadas: [], editadas: {}, eliminadas: [] };
    }

    const cambios = JSON.parse(guardado);
    if (!cambios || !Array.isArray(cambios.creadas) ||
        !cambios.editadas || typeof cambios.editadas !== "object" ||
        Array.isArray(cambios.editadas) || !Array.isArray(cambios.eliminadas)) {
        throw new Error("Los cambios guardados en localStorage tienen un formato inválido.");
    }
    return cambios;
}

function guardarCambiosPlantas(cambios) {
    localStorage.setItem(CLAVE_CAMBIOS_PLANTAS, JSON.stringify(cambios));
}

function aplicarCambiosLocales(plantasBase, cambios) {
    const eliminadas = new Set(cambios.eliminadas.map(String));
    const idsOriginales = new Set(plantasBase.map(function (planta) {
        return String(planta.id);
    }));

    const visibles = plantasBase
        .filter(function (planta) {
            return !eliminadas.has(String(planta.id));
        })
        .map(function (planta) {
            return cambios.editadas[String(planta.id)] || planta;
        });

    Object.keys(cambios.editadas).forEach(function (id) {
        if (!idsOriginales.has(String(id)) && !eliminadas.has(String(id))) {
            visibles.push(cambios.editadas[id]);
        }
    });

    cambios.creadas.forEach(function (planta) {
        if (!eliminadas.has(String(planta.id))) {
            visibles.push(planta);
        }
    });

    return visibles;
}

/* Entrega 8 y 9 REspaldo y HTTP
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
} */

async function obtenerPlantas() {
    let datosBase;
    let respaldo = false;

    console.log("1. Iniciando consulta a MockAPI...");

    try {
        const respuesta = await fetch(URL_PLANTAS, { cache: "no-store" });
        if (!respuesta.ok) {
            throw new Error("Error HTTP " + respuesta.status);
        }

        console.log("2. Respuesta HTTP:", respuesta.status);
        console.log("3. Respuesta OK:", respuesta.ok);

        datosBase = await respuesta.json();

        console.log("5. Datos recibidos:", datosBase);
        console.log("6. ¿Es un array?:", Array.isArray(datosBase));
        console.log("7. Cantidad de plantas:", datosBase.length);

        if (!Array.isArray(datosBase)) {
            throw new Error("La API no devolvió una lista de plantas.");
        }
    } catch (error) {
        console.error("No se pudo consultar MockAPI:", error);
        datosBase = plantas;
        respaldo = true;
    }

    const cambios = leerCambiosPlantas();
    return {
        datos: aplicarCambiosLocales(datosBase, cambios),
        respaldo: respaldo
    };
}

async function obtenerPlantaPorId(id) {
    const resultado = await obtenerPlantas();
    const encontrada = resultado.datos.find(function (planta) {
        return String(planta.id) === String(id);
    });
    return { dato: encontrada || null, respaldo: resultado.respaldo };
}

async function crearPlanta(datosPlanta) {
    const cambios = leerCambiosPlantas();
    let nuevoId = -1;

    cambios.creadas.forEach(function (planta) {
        if (Number(planta.id) <= nuevoId) {
            nuevoId = Number(planta.id) - 1;
        }
    });

    const nuevaPlanta = { ...datosPlanta, id: nuevoId };
    cambios.creadas.push(nuevaPlanta);
    guardarCambiosPlantas(cambios);
    return nuevaPlanta;
}

async function actualizarPlanta(id, datosPlanta) {
    const resultado = await obtenerPlantaPorId(id);
    if (!resultado.dato) {
        throw new Error("No existe la planta que querés editar.");
    }

    const cambios = leerCambiosPlantas();
    const modificada = { ...resultado.dato, ...datosPlanta, id: resultado.dato.id };

    const posicionLocal = cambios.creadas.findIndex(function (planta) {
        return String(planta.id) === String(id);
    });

    if (posicionLocal >= 0) {
        cambios.creadas[posicionLocal] = modificada;
    } else {
        cambios.editadas[String(id)] = modificada;
    }

    guardarCambiosPlantas(cambios);
    return modificada;
}

async function eliminarPlanta(id) {
    const resultado = await obtenerPlantaPorId(id);
    if (!resultado.dato) {
        throw new Error("No existe la planta que querés eliminar.");
    }

    const cambios = leerCambiosPlantas();
    const esLocal = cambios.creadas.some(function (planta) {
        return String(planta.id) === String(id);
    });

    if (esLocal) {
        cambios.creadas = cambios.creadas.filter(function (planta) {
            return String(planta.id) !== String(id);
        });
    } else {
        if (!cambios.eliminadas.includes(String(id))) {
            cambios.eliminadas.push(String(id));
        }
        delete cambios.editadas[String(id)];
    }

    guardarCambiosPlantas(cambios);
    return true;
}
"use strict";

const detallePlanta = document.getElementById("detalle-planta");

if (detallePlanta) {
    function crearFilaDetalle(etiqueta, valor) {
        const fila = document.createElement("tr");
        const encabezado = document.createElement("th");
        const celda = document.createElement("td");

        encabezado.scope = "row";
        encabezado.textContent = etiqueta;
        celda.textContent = String(valor);
        fila.append(encabezado, celda);
        return fila;
    }

    function crearFicha(planta) {
        const articulo = document.createElement("article");
        const titulo = document.createElement("h1");
        titulo.textContent = planta.nombre;

        const cientifico = document.createElement("p");
        cientifico.textContent = planta.cientifico;

        const galeria = document.createElement("section");
        galeria.className = "galeria";
        const imagen = document.createElement("img");
        imagen.src = planta.foto;
        imagen.alt = planta.nombre;
        galeria.appendChild(imagen);

        const precio = document.createElement("p");
        precio.className = "precio-planta";
        precio.textContent = formatearPrecio(planta.precio);

        const subtitulo = document.createElement("h2");
        subtitulo.textContent = "Especificaciones técnicas";

        const tabla = document.createElement("table");
        const cuerpoTabla = document.createElement("tbody");
        cuerpoTabla.append(
            crearFilaDetalle("Categoría", planta.categoria),
            crearFilaDetalle("Luz", planta.luz),
            crearFilaDetalle("Riego", planta.riego),
            crearFilaDetalle("Stock", planta.stock),
            crearFilaDetalle("Fecha de ingreso", planta.fechaIngreso),
            crearFilaDetalle("Apta para mascotas", planta.aptaMascotas ? "Sí" : "No"),
            crearFilaDetalle("Etiquetas", Array.isArray(planta.etiquetas) ? planta.etiquetas.join(", ") || "Sin etiquetas" : "Sin etiquetas")
        );
        tabla.appendChild(cuerpoTabla);

        const tituloCuidados = document.createElement("h2");
        tituloCuidados.textContent = "Guía de cuidados";
        const notas = document.createElement("p");
        notas.textContent = planta.notas;

        const volver = document.createElement("a");
        volver.href = "catalogo.html";
        volver.className = "boton";
        volver.textContent = "Volver al catálogo";

        articulo.append(titulo, cientifico, galeria, precio, subtitulo, tabla, tituloCuidados, notas, volver);
        return articulo;
    }

   /* Entrega 8
    const parametros = new URLSearchParams(window.location.search);
    const id = Number(parametros.get("id"));

    const plantaEncontrada = plantas.find(function (planta) {
        return planta.id === id;
    });

    if (plantaEncontrada) {
        document.title = plantaEncontrada.nombre + " | Vivero Raíz";
        detallePlanta.appendChild(crearFicha(plantaEncontrada));
    } else {
        const mensaje = document.createElement("p");
        mensaje.textContent = "No encontramos la planta solicitada.";
        const volver = document.createElement("a");
        volver.href = "catalogo.html";
        volver.className = "boton";
        volver.textContent = "Volver al catálogo";
        detallePlanta.append(mensaje, volver);
    }*/

    function crearMensaje(texto) {
        const mensaje = document.createElement("p");
        mensaje.textContent = texto;
        return mensaje;
    }

    function crearVolver() {
        const enlace = document.createElement("a");
        enlace.href = "catalogo.html";
        enlace.className = "boton";
        enlace.textContent = "Volver al catálogo";
        return enlace;
    }

    async function iniciarFicha() {
        const parametros = new URLSearchParams(window.location.search);
        const id = Number(parametros.get("id"));

        if (!id && Number(id) < 1) {
            detallePlanta.replaceChildren(
                crearMensaje("El identificador de la planta no es válido."), crearVolver()
            );
            return;
        }

        detallePlanta.textContent = "Cargando ficha de planta...";
        const resultado = await obtenerPlantaPorId(id);

        console.log("Resultado recibido por planta.js:", resultado);
        console.log("¿Se utiliza respaldo?:", resultado.respaldo);
        console.log("Planta obtenida:", resultado.dato);

        detallePlanta.replaceChildren();

        if(resultado.respaldo) {
            const aviso = crearMensaje("No pudimos consultar la API. Se muestran la planta del respaldo local.");
            aviso.className = "alerta alerta-error";
            detallePlanta.appendChild(aviso);
        }

        if(resultado.dato) {
            document.title = resultado.dato.nombre + " | Vivero Raíz";
            detallePlanta.appendChild(crearFicha(resultado.dato));
        } else {
            const texto = resultado.respaldo ? "La planta no está en el respaldo local. Volvé a intentarlo cuando la API esté disponible." : "No encontramos la planta solicitada.";
            detallePlanta.append(crearMensaje(texto), crearVolver()); 
        }
    }

    iniciarFicha();
}
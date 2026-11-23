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
            crearFilaDetalle("Etiquetas", planta.etiquetas.join(", ") || "Sin etiquetas")
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
    }
}
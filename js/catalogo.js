"use strict";

const buscador = document.getElementById("buscar-planta");
const filtroCategoria = document.getElementById("filtro-categoria");
const selectorOrden = document.getElementById("ordenar-por");
const botonLimpiar = document.getElementById("limpiar-filtros");
const contenedor = document.getElementById("catalogo-plantas");
const contador = document.getElementById("contador-resultados");
const sinResultados = document.getElementById("sin-resultados");

if (buscador && filtroCategoria && selectorOrden && botonLimpiar && contenedor && contador && sinResultados) {
    
    function crearTarjeta(planta) {
        const tarjeta = document.createElement("article");
        tarjeta.className = "tarjeta-planta";

        const titulo = document.createElement("h3");
        titulo.textContent = planta.nombre;

        const cientifico = document.createElement("p");
        cientifico.textContent = planta.cientifico;

        const descripcion = document.createElement("p");
        descripcion.textContent = planta.notas;

        const figura = document.createElement("figure");
        const imagen = document.createElement("img");
        imagen.src = planta.foto;
        imagen.alt = planta.nombre;
        imagen.width = 300;
        figura.appendChild(imagen);

        const precio = document.createElement("p");
        precio.className = "precio-planta";
        precio.textContent = "Precio: " + formatearPrecio(planta.precio);

        const enlace = document.createElement("a");
        enlace.href = "planta.html?id=" + planta.id;
        enlace.className = "boton";
        enlace.textContent = "Ver detalles";

        tarjeta.append(titulo, cientifico, descripcion, figura, precio, enlace);
        return tarjeta;
    }

    function mostrarCatalogo() {
        const texto = buscador.value.trim().toLocaleLowerCase("es");
        const categoria = filtroCategoria.value;
        const orden = selectorOrden.value;

        const resultados = plantas.filter(function (planta) {
            const coincideNombre = planta.nombre.toLocaleLowerCase("es").includes(texto);
            const coincideCategoria = categoria === "" || planta.categoria === categoria;
            return coincideNombre && coincideCategoria;
        });

        if (orden === "nombre-asc") {
            resultados.sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
        } else if (orden === "nombre-desc") {
            resultados.sort((a, b) => b.nombre.localeCompare(a.nombre, "es"));
        } else if (orden === "precio-asc") {
            resultados.sort((a, b) => a.precio - b.precio);
        } else if (orden === "precio-desc") {
            resultados.sort((a, b) => b.precio - a.precio);
        }

        contenedor.replaceChildren();

        resultados.forEach(function (planta) {
            contenedor.appendChild(crearTarjeta(planta));
        });

        contador.textContent = resultados.length === 1 ? "1 planta encontrada" : resultados.length + " plantas encontradas";
        sinResultados.hidden = resultados.length !== 0;
    }

    buscador.addEventListener("input", mostrarCatalogo);
    filtroCategoria.addEventListener("change", mostrarCatalogo);
    selectorOrden.addEventListener("change", mostrarCatalogo);

    botonLimpiar.addEventListener("click", function () {
        buscador.value = "";
        filtroCategoria.value = "";
        selectorOrden.value = "original";
        mostrarCatalogo();
        buscador.focus();
    });

    mostrarCatalogo();
}
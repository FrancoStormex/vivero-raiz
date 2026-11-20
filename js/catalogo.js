"use strict";

const buscador = document.getElementById("buscar-planta");
const filtroCategoria = document.getElementById("filtro-categoria");
const selectorOrden = document.getElementById("ordenar-por");
const botonLimpiar = document.getElementById("limpiar-filtros");
const contenedor = document.getElementById("catalogo-plantas");
const contador = document.getElementById("contador-resultados");
const sinResultados = document.getElementById("sin-resultados");

if (buscador && filtroCategoria && selectorOrden && botonLimpiar && contenedor && contador && sinResultados) {
    const tarjetas = Array.from(contenedor.querySelectorAll(".tarjeta-planta"));

    const ordenOriginal = tarjetas.slice();

    function obtenerNombre(tarjeta) {
        return tarjeta.querySelector("h3").textContent.trim();
    }

    function ordenarTarjetas() {
        const orden = selectorOrden.value;
        const ordenadas = ordenOriginal.slice();

        if (orden === "nombre-asc") {
            ordenadas.sort((a, b) => obtenerNombre(a).localeCompare(obtenerNombre(b), "es"));
        } else if (orden === "nombre-desc") {
            ordenadas.sort((a, b) => obtenerNombre(b).localeCompare(obtenerNombre(a), "es"));
        } else if (orden === "precio-asc") {
            ordenadas.sort((a, b) => Number(a.dataset.precio) - Number(b.dataset.precio));
        } else if (orden === "precio-desc") {
            ordenadas.sort((a, b) => Number(b.dataset.precio) - Number(a.dataset.precio));
        }

        ordenadas.forEach(function (tarjeta) {
            contenedor.appendChild(tarjeta);
        });
    }

    function aplicarFiltros() {
        const textoBuscado = buscador.value.trim().toLocaleLowerCase("es");
        const categoriaElegida = filtroCategoria.value;

        let cantidadVisibles = 0;

        tarjetas.forEach(function (tarjeta) {
            const nombre = obtenerNombre(tarjeta).toLocaleLowerCase("es");
            const categoria = tarjeta.dataset.categoria;

            const coincideNombre = nombre.includes(textoBuscado);
            const coincideCategoria = categoriaElegida === "" || categoria === categoriaElegida;

            const debeMostrarse = coincideNombre && coincideCategoria;

            tarjeta.hidden = !debeMostrarse;

            if (debeMostrarse) {
                cantidadVisibles++;
            }
        });

        contador.textContent = cantidadVisibles === 1 ? "1 planta encontrada" : cantidadVisibles + " plantas encontradas";

        sinResultados.hidden = cantidadVisibles !== 0;

        ordenarTarjetas();
    }

    buscador.addEventListener("input", aplicarFiltros);
    filtroCategoria.addEventListener("change", aplicarFiltros);
    selectorOrden.addEventListener("change", ordenarTarjetas);

    botonLimpiar.addEventListener("click", function () {
        buscador.value = "";
        filtroCategoria.value = "";
        selectorOrden.value = "nombre-asc";
        aplicarFiltros();
        buscador.focus();
    });

    aplicarFiltros();
}
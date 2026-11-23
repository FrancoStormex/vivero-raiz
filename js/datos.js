"use strict";

const plantas = [
    {
        id: 1,
        nombre: "Suculenta",
        nombreCientifico: "Pulidonis",
        categoria: "suculenta",
        luz: "sol pleno",
        riego: "bajo",
        precio: 4200,
        stock: 15,
        fechaIngreso: "2026-11-01",
        aptaMascotas: true,
        etiquetas: ["resistente"],
        foto: "./images/suculenta.png",
        notas: "Planta que almacena agua en sus hojas y necesita poco riego."
    },
    {
        id: 2,
        nombre: "Geranio",
        nombreCientifico: "Pelargonium peltatum",
        categoria: "exterior",
        luz: "sol pleno",
        riego: "medio",
        precio: 6900,
        stock: 10,
        fechaIngreso: "2026-11-02",
        aptaMascotas: true,
        etiquetas: ["floración"],
        foto: "./images/geranio.png",
        notas: "Planta de exterior con flores vistosas. Ideal para balcones y patios; requiere luz y riego moderado."
    },
    {
        id: 3,
        nombre: "Jazmín chino",
        nombreCientifico: "Jasminum polyanthum",
        categoria: "exterior",
        luz: "sol pleno",
        riego: "medio",
        precio: 8700,
        stock: 8,
        fechaIngreso: "2026-11-03",
        aptaMascotas: true,
        etiquetas: ["floración", "colgante"],
        foto: "./images/jazmin-chino-maceta.png",
        notas: "Planta trepadora de flores fragantes. Ideal para cubrir muros y rejas. Requiere riego regular y poda."
    },
    {
        id: 4,
        nombre: "Malvón",
        nombreCientifico: "Pelargonium hortorum",
        categoria: "exterior",
        luz: "sol pleno",
        riego: "medio",
        precio: 5100,
        stock: 12,
        fechaIngreso: "2026-11-04",
        aptaMascotas: true,
        etiquetas: ["floración", "resistente"],
        foto: "./images/malvon.png",
        notas: "Planta ornamental de flores coloridas, ideal para jardines y macetas."
    },
    {
        id: 5,
        nombre: "Rayito de sol",
        nombreCientifico: "Dorotheanthus bellidiformis",
        categoria: "exterior",
        luz: "sol pleno",
        riego: "bajo",
        precio: 3800,
        stock: 18,
        fechaIngreso: "2026-11-05",
        aptaMascotas: true,
        etiquetas: ["floración", "resistente"],
        foto: "./images/rayito-de-sol.png",
        notas: "Planta de exterior con flores amarillas y naranjas. Prefiere espacios soleados."
    },
    {
        id: 6,
        nombre: "Suculenta Echeveria",
        nombreCientifico: "Echeveria elegans",
        categoria: "suculenta",
        luz: "sol pleno",
        riego: "bajo",
        precio: 6500,
        stock: 7,
        fechaIngreso: "2026-11-06",
        aptaMascotas: true,
        etiquetas: ["resistente"],
        foto: "./images/suculenta-echeveria.jpg",
        notas: "Roseta de hojas carnosas. Regar solamente cuando el sustrato se encuentre seco y proteger de heladas."
    }
];

function formatearPrecio(precio) {
    return new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS"
    }).format(precio);
}
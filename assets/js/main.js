document.addEventListener('DOMContentLoaded', () => {
    // 1. Cargar el carrito desde localStorage al iniciar
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    actualizarContador();

    // 2. Escuchar clics en los botones de "Añadir al carrito"
    document.querySelectorAll('.btn-agregar-carrito').forEach(boton => {
        boton.addEventListener('click', () => {
            const nombre = boton.getAttribute('data-nombre');
            // IMPORTANTE: Convertir a número con parseInt para que la suma funcione
            const precio = parseInt(boton.getAttribute('data-precio'));

            const producto = {
                nombre: nombre,
                precio: precio
            };

            // Volvemos a traer el carrito por si se actualizó en otra pestaña
            carrito = JSON.parse(localStorage.getItem('carrito')) || [];
            carrito.push(producto);

            // Guardar en localStorage
            localStorage.setItem('carrito', JSON.stringify(carrito));

            // Actualizar la vista
            actualizarContador();
            
            // Animación de feedback
            boton.textContent = "¡Agregado!";
            boton.classList.replace('btn-primary', 'btn-success');
            setTimeout(() => {
                boton.textContent = "Añadir al carrito";
                boton.classList.replace('btn-success', 'btn-primary');
            }, 1000);
        });
    });

    // Función para refrescar el numerito del Navbar
    function actualizarContador() {
        const contador = document.getElementById('carrito-count');
        if (contador) {
            const tempCarrito = JSON.parse(localStorage.getItem('carrito')) || [];
            contador.textContent = tempCarrito.length;
        }
    }
});

// --- FUNCIONES PARA LA PÁGINA CARRITO.HTML ---

function mostrarCarrito() {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    let tabla = document.getElementById("cuerpo-tabla");
    let totalTXT = document.getElementById("total");
    let suma = 0;

    if (!tabla) return; // Si no estamos en la página de carrito, salir

    tabla.innerHTML = ""; 

    carrito.forEach((prod, index) => {
        suma += prod.precio;
        tabla.innerHTML += `
            <tr>
                <td>${prod.nombre}</td>
                <td>$${prod.precio.toLocaleString()}</td>
                <td><button class="btn btn-sm btn-danger" onclick="borrar(${index})">X</button></td>
            </tr>
        `;
    });

    totalTXT.innerText = "$" + suma.toLocaleString();
}

// Función para borrar un solo producto
function borrar(posicion) {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    carrito.splice(posicion, 1); 
    localStorage.setItem("carrito", JSON.stringify(carrito));
    mostrarCarrito();
    
    // Si tienes el contador en el navbar, esto lo actualiza también
    const contador = document.getElementById('carrito-count');
    if (contador) contador.textContent = carrito.length;
}

// Función para vaciar todo
function vaciar() {
    if(confirm("¿Estás seguro de que quieres vaciar el carrito?")) {
        localStorage.removeItem('carrito');
        mostrarCarrito();
        const contador = document.getElementById('carrito-count');
        if (contador) contador.textContent = "0";
    }
}

// Ejecutar mostrarCarrito solo si la tabla existe (estamos en carrito.html)
window.onload = function() {
    if (document.getElementById("cuerpo-tabla")) {
        mostrarCarrito();
    }
};
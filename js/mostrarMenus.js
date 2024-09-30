function mostrarPersonalizado() {
    const bancoSeleccionado = document.getElementById("banco").value;
    const divSueldo = document.getElementById("div-sueldo");
    const tasaPersonalizada = document.getElementById("div-tasaPersonalizada");

    if (bancoSeleccionado === "Personalizado") {
        // Mostrar el div de tasa personalizada
        tasaPersonalizada.style.display = "block";
        // Ocultar el div de sueldo
        divSueldo.style.display = "none";
    } else {
        // Ocultar el div de tasa personalizada
        tasaPersonalizada.style.display = "none";
        // Mostrar el div de sueldo
        divSueldo.style.display = "block";
    }
}
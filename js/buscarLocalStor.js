function obtenerUltimaCotizacion() {
    // Verificar si hay una cotización almacenada en localStorage
    let ultimaCotizacion = localStorage.getItem('ultimaCotizacion');
    
    if (ultimaCotizacion) {
        // Si existe, mostrarla en el HTML
        document.getElementById("resultado").innerHTML = ultimaCotizacion;
    } else {
        // Si no existe, recalcular el crédito y guardar la nueva cotización
        calcularCredito(); // Llama a la función que ya tienes
        let nuevaCotizacion = document.getElementById("resultado").innerHTML;
        localStorage.setItem('ultimaCotizacion', nuevaCotizacion); // Guardar la cotización
    }
}

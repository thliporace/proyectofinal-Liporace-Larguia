let monto = prompt("Ingrese el monto del crédito:");
let interes = prompt("Ingrese la tasa de interés anual (%):");
let plazo = prompt("Ingrese el plazo en años:");

function validarDatos(monto, interes, plazo) {
    if (isNaN(monto) || isNaN(interes) || isNaN(plazo)) {
        console.log("Error: Todos los valores deben ser numéricos.");
        return false;
    }
    monto = Number(monto);
    interes = Number(interes);
    plazo = Number(plazo);

    if (monto <= 0 || interes <= 0 || plazo <= 0) {
        console.log("Error: Todos los valores deben ser mayores que cero.");
        return false;
    }
    return true;
}

function calcularCuotaMensual(monto, interes, plazo) {
    let tasaMensual = interes / 100 / 360 * 30; // tasa anual a tasa efectiva mensual
    let nPagos = plazo * 12; // plazo a meses
    let cuota = (monto * tasaMensual) / (1 - Math.pow((1 + tasaMensual), -nPagos)); // forma simplificada del calculo para facilitar. form original (P*r*(1+r)n)/((1+r)n-1

    console.log(`La cuota mensual es de $${cuota.toFixed(2)}`);

    // print consola de ctas
    for (let mes = 1; mes <= nPagos; mes++) {
        console.log(`Mes ${mes}: Pago de $${cuota.toFixed(2)}`);
    }
}

// Validación de datos ingresados
if (validarDatos(monto, interes, plazo)) {
    // Convertir a número antes de pasar a la función
    calcularCuotaMensual(Number(monto), Number(interes), Number(plazo));
} else {
    console.log("Datos inválidos, por favor inténtelo de nuevo.");
}

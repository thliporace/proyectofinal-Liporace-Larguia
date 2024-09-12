
// comentarios P/revisor 
// si vas a usar una tasa de interes con decimales asegurarese de poner el input en base a cmo tengas el idioma de la pc. Ejemplo ingles 4.4 español 4,4
// ahora las funciones se usan una sola vez pero luego en el PF se usan mas de una

let monto = prompt("Ingrese el monto del crédito:");
let interes = prompt("Ingrese la tasa de interés anual (%) solo el numero:");
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
if (validarDatos(monto, interes, plazo)) {
    // convertir valores a numericos
    calcularCuotaMensual(Number(monto), Number(interes), Number(plazo));
} else {
    console.log("Datos inválidos, por favor inténtelo de nuevo.");
}

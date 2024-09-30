// Función para obtener las condiciones del banco
function obtenerCondicionesBanco(banco) {
    return bancos[banco] || null;
}

// Función para calcular el crédito
function calcularCredito() {
    let banco = document.getElementById("banco").value;
    let sueldo = document.getElementById("sueldo").value;
    let monto = parseFloat(document.getElementById("monto-solicitado").value);
    let plazo = parseInt(document.getElementById("plazo-credito").value);
    let montoPropiedad = parseFloat(document.getElementById("valor-propiedad").value)

    // Validar que se ingresaron datos válidos
    if (monto >= montoPropiedad) {
        document.getElementById("resultado").innerHTML = "El monto solicitado del crédito excede el valor de la propiedad.";
        return;
    } else if (!banco || !sueldo || isNaN(monto) || isNaN(plazo) || monto <= 0 || plazo <= 0 || montoPropiedad <= 0) {
        document.getElementById("resultado").innerHTML = "Por favor, complete todos los campos correctamente.";
        return;
    }

    let condiciones = obtenerCondicionesBanco(banco);
    if (!condiciones) {
        document.getElementById("resultado").innerHTML = "Banco no reconocido.";
        return;
    }

    // Validar condiciones del banco (plazo, monto máximo)
    if (plazo > condiciones.plazoMax) {
        document.getElementById("resultado").innerHTML = `El plazo máximo para ${banco} es de ${condiciones.plazoMax} años.`;
        return;
    }

    if (monto > condiciones.montoMax) {
        document.getElementById("resultado").innerHTML = `El monto máximo para ${banco} es de $${condiciones.montoMax.toLocaleString()}.`;
        return;
    }

    // Obtener la tasa de interés basada en si cobra o no sueldo en el banco
    let tasa = sueldo === "si" ? condiciones.tasaConSueldo : condiciones.tasaSinSueldo;

    // Cálculo de la cuota mensual
    let tasaMensual = tasa / 12;
    let nPagos = plazo * 12;
    let cuota = (monto * tasaMensual) / (1 - Math.pow(1 + tasaMensual, -nPagos));

    // Crear resumen de la selección
    let resumenHtml = `
        <h3>Resumen de la Selección</h3>
        <p><strong>Banco:</strong> ${banco}</p>
        <p><strong>Monto a Financiar:</strong> $${monto.toFixed(2)}</p>
        <p><strong>Tasa de Interés:</strong> ${(tasa * 100).toFixed(2)}%</p>
        <p><strong>Cuota Mensual:</strong> $${cuota.toFixed(2)}</p>
    `;

    // Crear tabla de resultados
    let resultadoHtml = `
        <table class="tabla-resultado">
            <thead>
                <tr>
                    <th>Cuota</th>
                    <th>Fecha</th>
                    <th>Cuota Mensual</th>
                    <th>Intereses</th>
                    <th>Amort. Cap.</th>
                    <th>Deuda</th>
                </tr>
            </thead>
            <tbody>
    `;

    let deuda = monto;
    let fechaActual = new Date(); // Fecha actual

    // Generar la tabla de cuotas
    for (let mes = 1; mes <= nPagos; mes++) {
        let intereses = deuda * tasaMensual; // Intereses del mes
        let amortizacion = cuota - intereses; // Amortización del capital
        deuda -= amortizacion; // Deuda restante

        // Formatear la fecha para que sea más legible
        let fechaCuota = new Date(fechaActual);
        fechaCuota.setMonth(fechaCuota.getMonth() + mes);
        let fechaFormateada = fechaCuota.toLocaleDateString("es-ES");

        resultadoHtml += `
            <tr class="tabla-solucion">
                <td>${mes}</td>
                <td>${fechaFormateada}</td>
                <td>$${cuota.toFixed(2)}</td>
                <td>$${intereses.toFixed(2)}</td>
                <td>$${amortizacion.toFixed(2)}</td>
                <td>$${Math.max(deuda, 0).toFixed(2)}</td>
            </tr>
        `;
    }
    resultadoHtml += `
            </tbody>
        </table>
    `;
    document.getElementById("resultado").innerHTML = resumenHtml + resultadoHtml;
}

// Resetear el resultado y limpiar el resumen y la tabla
function resetearResultado() {
    document.getElementById("resultado").innerHTML = ""; // Limpiar el contenido del div de resultados
}
document.getElementById("reset").addEventListener("click", resetearResultado);

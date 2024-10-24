// condiciones del banco
function obtenerCondicionesBanco(banco) {
    return bancos[banco] || null;
}

// Calcular el crédito
function calcularCredito() {
    let banco = document.getElementById("banco").value;
    let sueldo = document.getElementById("sueldo").value;
    let monto = parseFloat(document.getElementById("monto-solicitado").value);
    let plazo = parseInt(document.getElementById("plazo-credito").value);
    let montoPropiedad = parseFloat(document.getElementById("valor-propiedad").value)

    // Chequear que se ingresaron datos válidos
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

    // Validar condiciones plazo y monto máximo
    if (plazo > condiciones.plazoMax) {
        document.getElementById("resultado").innerHTML = `El plazo máximo para ${banco} es de ${condiciones.plazoMax} años.`;
        return;
    }

    if (monto > condiciones.montoMax) {
        document.getElementById("resultado").innerHTML = `El monto máximo para ${banco} es de $${condiciones.montoMax.toLocaleString()}.`;
        return;
    }

    let valorUva = document.getElementById("tipo-cambio-uva").value;
    let valorUsd = document.getElementById("tipo-cambio-usd").value;
    
    let montoUVA = ((monto * valorUsd) / valorUva).toFixed(2)

    // Obtener la tasa de interés basada en si cobra o no sueldo en el banco
    let tasa = sueldo === "si" ? condiciones.tasaConSueldo : condiciones.tasaSinSueldo;

    // Cálculo de la cuota mensual
    let tasaMensual = tasa / 12;
    let nPagos = plazo * 12;
    let cuota = (montoUVA * tasaMensual) / (1 - Math.pow(1 + tasaMensual, -nPagos));

    const variacionMensual = 0.0244689679315399;
    let pesoActualizado = (valorUva*(1+variacionMensual)).toFixed(2)


    // Crear resumen de la selección
    let resumenHtml = `
        <h3>Resumen de la Selección</h3>
        <p><strong>Banco:</strong> ${banco}</p>
        <p><strong>Monto a Financiar:</strong> $${new Intl.NumberFormat('es-ES', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(montoUVA)} UVA</p>
        <p><strong>Tasa de Interés:</strong> ${(tasa * 100).toFixed(2)}%</p>
        <p><strong>Cuota Mensual:</strong> $${new Intl.NumberFormat('es-ES', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(cuota)} UVA</p>
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
                    <!-- <th>Cuota en Pesos</th>
                    <th>Deuda en Pesos</th> -->
                </tr>
            </thead>
            <tbody>
    `;

    let deuda = montoUVA;
    let fechaActual = new Date(); // Fecha actual
// Crear arrays para almacenar los valores para el gráfico
    let deudasTotales = [];
    let interesesTotales = [];
    let fechas = [];

// Generar la tabla de cuotas
for (let mes = 1; mes <= nPagos; mes++) {
    let intereses = deuda * tasaMensual; // Intereses del mes
    let amortizacion = cuota - intereses; // Amortización del capital
    deuda -= amortizacion; // Deuda restante

    // Formatear la fecha
    let fechaCuota = new Date(fechaActual);
    fechaCuota.setMonth(fechaCuota.getMonth() + mes);
    let fechaFormateada = fechaCuota.toLocaleDateString("es-ES");

    // Almacenar los valores en los arrays para el gráfico
    deudasTotales.push(Math.max(deuda, 0));
    interesesTotales.push(intereses);
    fechas.push(fechaFormateada);

    resultadoHtml += `
        <tr class="tabla-solucion">
            <td>${mes}</td>
            <td>${fechaFormateada}</td>
            <td>$${new Intl.NumberFormat('es-ES', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(cuota)}</td>
            <td>$${new Intl.NumberFormat('es-ES', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(intereses)}</td>
            <td>$${new Intl.NumberFormat('es-ES', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amortizacion)}</td>
            <td>$${new Intl.NumberFormat('es-ES', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Math.max(deuda, 0))}</td>
        </tr>
    `;
}

    resultadoHtml += `</tbody></table>`;
    document.getElementById("resultado").innerHTML = resumenHtml + resultadoHtml;

    // Guardar la cotización en el localStorage
    let cotizacionGuardada = document.getElementById("resultado").innerHTML;
    localStorage.setItem('ultimaCotizacion', cotizacionGuardada);

    // Crear las trazas para Plotly
    var trace1 = {
        x: fechas, // Eje X: Fechas
        y: deudasTotales, // Eje Y: Deuda total
        type: 'scatter',
        name: 'Deuda total'
    };

    var trace2 = {
        x: fechas, // Eje X: Fechas
        y: interesesTotales, // Eje Y: Intereses mensuales
        type: 'scatter',
        name: 'Intereses mensuales'
    };

    var data = [trace1, trace2];

    // Dibujar el gráfico
    Plotly.newPlot('myDiv', data);
}

// Resetear el resultado y limpiar el resumen y la tabla
function resetearResultado() {
    document.getElementById("resultado").innerHTML = "";
}
document.getElementById("reset").addEventListener("click", resetearResultado);

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
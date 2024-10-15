async function cotizar() {
    const fecha = document.getElementById('fecha-credito').value;
    
    if (!fecha) {
        document.getElementById('resultado').innerHTML = 'Por favor, ingrese una fecha válida.';
        return;
    }

    await buscarCotizacionUSD(fecha);
    await buscarCotizacionUVA(fecha);
}

async function buscarCotizacionUSD(fecha) {
    const urlUSD = `https://api.bcra.gob.ar/estadisticascambiarias/v1.0/Cotizaciones?fecha=${fecha}`;
    
    try {
        let response = await fetch(urlUSD);
        if (response.ok) {
            let data = await response.json();
            let detalle = data.results.detalle;
            
            let usdCotizacion = detalle.find(item => item.codigoMoneda === 'USD');

            if (usdCotizacion) {
                document.getElementById('tipo-cambio-usd').value = usdCotizacion.tipoCotizacion;
            } else {
                document.getElementById('resultado').innerHTML = `No hay cotización disponible para USD en la fecha ${fecha}.`;
            }
        } else {
            document.getElementById('resultado').innerHTML = 'Error en la solicitud: ' + response.status;
        }
    } catch (error) {
        document.getElementById('resultado').innerHTML = 'Error en la conexión: ' + error;
    }
}

async function buscarCotizacionUVA(fecha) {
    const idVariable = 31;
    const urlUVA = `https://api.bcra.gob.ar/estadisticas/v2.0/datosvariable/${idVariable}/${fecha}/${fecha}`;

    try {
        const response = await fetch(urlUVA);
        if (!response.ok) {
            throw new Error('Error en respuesta API');
        }

        const data = await response.json();
        const resultados = data.results;

        if (Array.isArray(resultados) && resultados.length > 0) {
            const cotizacionUVA = resultados[0].valor;
            document.getElementById('tipo-cambio-uva').value = cotizacionUVA;
        } else {
            document.getElementById('resultadoUva').innerHTML = 'No se encontró cotización para UVA en la fecha proporcionada';
        }
    } catch (error) {
        document.getElementById('resultadoUva').innerHTML = `Error: ${error.message}`;
    }
}

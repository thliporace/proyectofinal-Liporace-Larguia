async function buscarCotizaciones() {
    const fecha = document.getElementById('fecha').value;
    const moneda = document.getElementById('moneda').value;

    if (!fecha) {
        document.getElementById('resultado').innerHTML = 'Por favor, ingrese una fecha válida.';
        return;
    }

    const url = `https://api.bcra.gob.ar/estadisticascambiarias/v1.0/Cotizaciones?fecha=${fecha}`;
    
    try {
        let response = await fetch(url);
        if (response.ok) {
            let data = await response.json();
            let detalle = data.results.detalle;

            // Filtrar los resultados para la moneda seleccionada
            let monedaFiltrada = detalle.find(item => item.codigoMoneda === moneda);

            if (monedaFiltrada) {
                document.getElementById('resultado').innerHTML = `
                    <h3>Cotización para ${monedaFiltrada.descripcion} (${moneda})</h3>
                    <pre>Cotización al ${fecha}: ${monedaFiltrada.tipoCotizacion}</pre>
                `;
            } else {
                document.getElementById('resultado').innerHTML = `No hay cotizaciones disponibles para la moneda ${moneda} en la fecha ${fecha}.`;
            }
        } else {
            document.getElementById('resultado').innerHTML = 'Error en la solicitud: ' + response.status;
        }
    } catch (error) {
        document.getElementById('resultado').innerHTML = 'Error en la conexión: ' + error;
    }
}

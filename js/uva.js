async function buscarUva() {
    const fechaI = document.getElementById('fechaI').value;
    const fechaH = document.getElementById('fechaH').value;

    // Verificar si ambas fechas son válidas
    if (!fechaI || !fechaH) {
        document.getElementById('resultadoUva').innerHTML = 'Ingresar fechas válidas';
        return;
    }

    const idVariable = 31;
    const url = `https://api.bcra.gob.ar/estadisticas/v2.0/datosvariable/${idVariable}/${fechaI}/${fechaH}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Error en respuesta API');
        }

        const data = await response.json();
        
        // // Imprimir la respuesta completa para depuración (opcional)
        // console.log(data);  

        // Acceder a los resultados
        const resultados = data.results;  // Cambia a data.results

        if (Array.isArray(resultados) && resultados.length > 0) {
            // Generar un mensaje para todas las cotizaciones
            const cotizaciones = resultados.map(item => `Fecha: ${item.fecha}, Cotización: ${item.valor}`).join('<br>');
            document.getElementById('resultadoUva').innerHTML = `Cotizaciones del UVA a las fechas seleccionadas:<br>${cotizaciones}`;
        } else {
            document.getElementById('resultadoUva').innerHTML = 'No se encontró cotización para las fechas proporcionadas';
        }
    } catch (error) {
        document.getElementById('resultadoUva').innerHTML = `Error: ${error.message}`;
    }
}

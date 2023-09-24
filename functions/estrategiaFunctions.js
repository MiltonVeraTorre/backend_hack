const calcularInteresCompuesto = (principal, tasa, tiempo, aportacion) => {
    return principal * Math.pow((1 + tasa / 100), tiempo) + aportacion * ((Math.pow((1 + tasa / 100), tiempo) - 1) / (tasa / 100));
};
export const generarGrafica = (rendimientoAnualPromedio, monto_inicial, monto_mensual, tiempo_retorno) => {
    let montoActual = monto_inicial;
    const intervalo = tiempo_retorno / 6;
    const tasaMensual = rendimientoAnualPromedio / 12;
    const data = [];
    for (let i = 0; i <= tiempo_retorno; i += intervalo) {
        montoActual = calcularInteresCompuesto(montoActual, tasaMensual, intervalo, monto_mensual);
        data.push({ label: i, value: montoActual });
    }
    return data;
};
export function calcularPonderados(data) {
    let riesgoPonderadoTotal = 0;
    let gananciasPonderadoTotal = 0;
    for (let item of data.ponderacion) {
        const ponderacion = item.ponderacion / 100;
        const riesgo = item.fondo.riesgo_n;
        const rendimiento = parseFloat(item.fondo.rendimiento[0].rendimiento);
        riesgoPonderadoTotal += riesgo * ponderacion;
        gananciasPonderadoTotal += rendimiento * ponderacion;
    }
    return {
        riesgoPonderado: riesgoPonderadoTotal.toFixed(2),
        gananciasPonderado: gananciasPonderadoTotal.toFixed(2)
    };
}

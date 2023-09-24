

type DataPoint = {
    label: number;
    value: number;
}





const calcularInteresCompuesto = (principal: number, tasa: number, tiempo: number, aportacion: number): number => {
    return principal * Math.pow((1 + tasa/100), tiempo) + aportacion * ((Math.pow((1 + tasa/100), tiempo) - 1) / (tasa/100));
}

export const generarGrafica = (rendimientoAnualPromedio: number,monto_inicial:number,monto_mensual:number,tiempo_retorno:number): DataPoint[] => {
    let montoActual = monto_inicial;
    const intervalo = tiempo_retorno / 6;
    const tasaMensual = rendimientoAnualPromedio / 12;

    const data: DataPoint[] = [];
    for (let i = 0; i <= tiempo_retorno; i += intervalo) {
        montoActual = calcularInteresCompuesto(montoActual, tasaMensual, intervalo, monto_mensual);
        data.push({label: i, value: montoActual});
    }
    return data;
}


interface Rendimiento {
    id: number;
    limite_inferior: number;
    limite_superior: number | null;
    comision: string;
    rendimiento: string;
    fondoId: number;
}

interface Fondo {
    id: number;
    nombre: string;
    tipo_fondo: string;
    riesgo: string;
    riesgo_n: number;
    estrategia: string;
    disponibilidad: number;
    plazo_minimo: number;
    monto_minimo: string;
    tipo_inversion: string;
    rendimiento: Rendimiento[];
}

interface Ponderacion {
    id: number;
    fondoId: number;
    estrategiaId: number;
    ponderacion: number;
    fondo: Fondo;
}

interface Estrategia {
    id: number;
    nombre: string;
    aceptado: boolean;
    ponderacion: Ponderacion[];
}

export function calcularPonderados(data: Estrategia) {
    let riesgoPonderadoTotal = 0;
    let gananciasPonderadoTotal = 0;

    // Iterar sobre cada ponderación en la estrategia
    for (let item of data.ponderacion) {
        const ponderacion = item.ponderacion / 100; // Convertir el porcentaje a una fracción
        const riesgo = item.fondo.riesgo_n;
        const rendimiento = parseFloat(item.fondo.rendimiento[0].rendimiento); // Solo se toma el primer rendimiento por simplicidad

        // Calcular el riesgo y las ganancias ponderadas y agregarlos a los totales
        riesgoPonderadoTotal += riesgo * ponderacion;
        gananciasPonderadoTotal += rendimiento * ponderacion;
    }

    return {
        riesgoPonderado: riesgoPonderadoTotal.toFixed(2), // Redondear a 2 decimales
        gananciasPonderado: gananciasPonderadoTotal.toFixed(2) // Redondear a 2 decimales
    };
}





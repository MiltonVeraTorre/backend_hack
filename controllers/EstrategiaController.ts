import { Request, Response } from "express";
import { handleServerError } from "../helpers/handleServerError.js";

import OpenAI from "openai";

import { prisma } from "../index.js";
import { calcularPonderados, generarGrafica } from "../functions/estrategiaFunctions.js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const riesgos = ["extremadamamente bajo","bajo","moderado","moderado a alto","alto"];

export const crearEstrategia = async (req: Request, res: Response) => {
  const {
    objetivos,
    monto_inicial,
    monto_mensual,
    tiempo_retorno,
    tolerancia,
  } = req.body;

  try {
    // Hay que obtener los planes que cumplan las condiciones minimas del usuario
    const fondos = await prisma.fondo.findMany({
      where: {
        monto_minimo: {
          lte: monto_inicial,
        },
        riesgo_n: {
          lte: tolerancia + 1,
        },
        plazo_minimo: {
          lte: tiempo_retorno,
        },
      },
      include: {
        rendimiento: {
          where: {
            limite_inferior: {
              lte: monto_inicial,
            },
          },
        },
      },
    });

    const MAX_RETRIES = 5;
    let inversiones;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        const response = await openai.chat.completions.create({
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content:
                'Eres Ana el robot más especializado en las inversiones de banorte. \n\nComo entrada del usuario recibiras los siguientes parametros:\n\nobjetivos: Un arreglo que tiene la lista de objetivos del usuario\nmonto_inicial: El monto que el usuario esta dispuesto a invertir en el primer deposito\n,monto_mensual: El monto que el usuario esta dispue\ntiempo_retorno: La cantidad de meses en la que el usuario espera retirar su inversion\ntolerancia: Tolerancia al riesgo del 1 al 6\n\nComo entrada de los fondos compatibles obtendras lo siguiente:\n\nnombre: nombre del fondo\ntipo_fondo: tipo de fondo \nriesgo: riesgo asociado al fondo en texto\nriesgo_n: riesgo asociado al fondo en numero\nestrategia: descripcion de la estrategia que sigue el fondo\ndisponibilidad: tiempo en horas que demoraría el cliente en retirar su dinero de regreso\nplazo_minimo: Minimo monto sugerido de meses que se sugiere esperar antes de retirar la inversion\nmonto_minimo: Monto minimo desde el que se puede invertir en el fondo\ntipo_inversion:  describe si es un fondo para corto,mediano o largo plazo\nrendimiento: arreglo de rendimientos del ultimo año basados en el monto a invertir\n\nUn ejemplo de entrada sería\n\n{\n\nusuario:\n{\nobjetivos:["fondo de emergencia","guardar para el retiro"],\nmonto_inicial:2000,\n"monto_mensual:100,\ntiempo_retorno:6,\ntolerancia:3\n},\nfondos:[\n    {\n        "id": 1,\n        "nombre": "NTECT",\n        "tipo_fondo": "fondo de deuda",\n        "riesgo": "extremadamente bajo",\n        "riesgo_n": 1,\n        "estrategia": "Es un fondo 100% de deuda con un horizonte de inversión a corto plazo compuesto por valores gubernamentales y bancarios que busca obtener un rendimiento adicional a la deuda gubernamental.",\n        "disponibilidad": 0,\n        "plazo_minimo": 1,\n        "monto_minimo": "50",\n        "tipo_inversion": "corto plazo",\n        "rendimiento": [\n            {\n                "id": 1,\n                "limite_inferior": 50,\n                "limite_superior": 149999,\n                "comision": "2.05",\n                "rendimiento": "8.42",\n                "fondoId": 1\n            }\n        ]\n    },\n    {\n        "id": 2,\n        "nombre": "NTEDIG",\n        "tipo_fondo": "fondo de deuda",\n        "riesgo": "extremadamente bajo",\n        "riesgo_n": 1,\n        "estrategia": "Es un fondo 100% de deuda con un horizonte de inversión a corto plazo compuesto por valores gubernamentales y bancarios que busca obtener un rendimiento adicional a la deuda gubernamental.",\n        "disponibilidad": 0,\n        "plazo_minimo": 1,\n        "monto_minimo": "50",\n        "tipo_inversion": "corto plazo",\n        "rendimiento": [\n            {\n                "id": 8,\n                "limite_inferior": 50,\n                "limite_superior": null,\n                "comision": "1",\n                "rendimiento": "9.76",\n                "fondoId": 2\n            }\n        ]\n    }\n]\n\n}\n\n\nTu como resultado debes de imprimir que fondos escoges para el usuario y que porcentaje del capital invertirías en cada uno. Puedes escoger máximo 3 fondos pero puedes escoger menos si así lo crees conveniente. Debes imprimir dos propuestas. T .Tu resultado para un ejemplo como este sería(el ejemplo es para formato no para que uses alguna toma de decision):\n[\n[\n{"porcentaje":40,"fondo":1},\n{"porcentaje":60,"fondo":2},\n],\n[\n{"porcentaje":20,"fondo":1},\n{"porcentaje":80,"fondo":2},\n]\n]\n\n\n',
            },
            {
              role: "user",
              content: JSON.stringify({
                usuario: {
                  objetivos,
                  monto_inicial,
                  monto_mensual,
                  tiempo_retorno,
                  tolerancia,
                },
                fondos,
              }),
            },
          ],
          temperature: 1,
          max_tokens: 256,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0,
        });
        console.log(response.choices[0].message.content);

        const parsed_response = JSON.parse(
          response.choices[0].message.content ?? "{}"
        );

        inversiones = parsed_response.map((propuesta: any) => {
          const ponderaciones = propuesta.map((ponderacion: any) => {
            return {
              porcentaje: ponderacion.porcentaje,
              fondo: fondos.find((f) => f.id === ponderacion.fondo),
            };
          });
          return ponderaciones;
        });

        // Si todo fue exitoso, rompe el bucle
        break;
      } catch (error) {
        // Si el error es un error de parseo, intenta de nuevo
        if (error instanceof SyntaxError) {
          console.error(
            "Error al parsear la respuesta, intentando de nuevo..."
          );
        } else {
          // Si es otro tipo de error, rompe el bucle y maneja el error
          console.error("Error desconocido:", error);
          break;
        }
      }
    }

    const calculos = inversiones.map((propuesta) => {
      let rendimientoTotal = 0;
      let riesgoTotal = 0;

      propuesta.forEach((ponderado) => {
        const rendimientoFondo = parseFloat(
          ponderado.fondo.rendimiento[ponderado.fondo.rendimiento.length - 1]
            .rendimiento
        ); // Asumiendo que solo hay un rendimiento por fondo
        const riesgoFondo = ponderado.fondo.riesgo_n;
        const porcentaje = ponderado.porcentaje / 100; // Convertir a decimal

        rendimientoTotal += rendimientoFondo * porcentaje;
        riesgoTotal += riesgoFondo * porcentaje;
      });

      const grafica = generarGrafica(
        rendimientoTotal,
        monto_inicial,
        monto_mensual,
        tiempo_retorno
      )

      return {
        propuesta,
        rendimientoAnualPromedio: rendimientoTotal.toFixed(2), // Redondear a 2 decimales
        riesgoPromedio: riesgos[Math.ceil(riesgoTotal)-1], // Redondear a 2 decimales
        grafica,
        gananciasEsperadas:grafica[grafica.length-1]
      };
    });

    // Guardamos los resultados en la base de datos

    for(const propuesta of calculos){
        // Guardamos la estrategia
        const estrategia = await prisma.estrategia.create({
            data:{
                nombre: "Estrategia",
                aceptado: false,
                monto_inicial,
                monto_mensual,
                tiempo_retorno,
                rendimiento_anual:propuesta.rendimientoAnualPromedio,
                riesgo: propuesta.riesgoPromedio

            }
        })

        // Guardamos las ponderaciones en la base de datos
        for(const ponderacion of propuesta.propuesta){
            await prisma.ponderacion.create({
                data:{
                    fondoId:ponderacion.fondo.id,
                    estrategiaId:estrategia.id,
                    ponderacion:ponderacion.porcentaje
                }
            })
        }

        // Guardamos la grafica
        await prisma.grafica.createMany({
            data: propuesta.grafica.map((grafica)=>({
                ...grafica,
                estrategiaId:estrategia.id
            }))
        })
        
    }


    return res.json(calculos);
  } catch (error: any) {
    return handleServerError(error, "Estrategia", res);
  }
};



export const obtenerEstrategias = async (_req:Request,res:Response)=>{
    try {
        let estrategias = await prisma.estrategia.findMany({
        include:{
            ponderacion:{
                include:{
                    fondo:{
                        include:{
                            rendimiento:true
                        }
                    }
                }
            },
            grafica:{
                orderBy:{
                    label:"asc"
                }
            }
        }
        });

        estrategias = estrategias.map(estrategia=>(
            {
                ...estrategia,
                ...calcularPonderados(estrategia as any)
            }
        ))

        

        return res.json(estrategias);
    } catch (error: any) {
        return handleServerError(error, "Estrategia", res);
    }
}

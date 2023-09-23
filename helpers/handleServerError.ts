import { PrismaClientUnknownRequestError } from "@prisma/client/runtime/library";
import * as Sentry from "@sentry/node";
import { Response } from "express";

export const handleServerError = (
  error: any,
  instancia: string,
  res: Response
) => {
  console.log(error);

  switch (error?.code) {
    case "P2000":
      // Caso para error "P2000"
      return res
        .status(400)
        .json({
          msg: "Introduciste un valor invalido, por favor verifica los datos ingresados",
        });

    case "P2001":
      // Caso para error "P2001"
      return res.status(404).json({ msg: `${instancia} no existe` });

    case "P2002":
      // Caso para error "P2002"
      return res.status(400).json({ msg: `${instancia} ya existe` });

    case "P2003":
      // Caso para error "P2003"
      return res
        .status(400)
        .json({
          msg: `No se puede realizar esta operacion porque hay datos relacionados`,
        });
    case "P2004":
      // Caso para error "P2004"
      return res
        .status(400)
        .json({ msg: `Se introdujo un valor nulo en un campo requerido` });

    case "P2005":
      // Caso para error "P2005"
      return res
        .status(404)
        .json({
          msg: `No se puede relacionar ${instancia} con ese ID ya que no existe`,
        });
    case "P2006":
      // Caso para error "P2006"
      return res
        .status(404)
        .json({
          msg: `No se puede relacionar ${instancia} con ese ID ya que no existe`,
        });

    default:
      // Caso para error desconocido
      Sentry.captureException(error);
      return res
        .status(500)
        .json({
          msg: `Se ha producido un error desconocido, notificalo cuanto antes`,
        });
  }

  
};

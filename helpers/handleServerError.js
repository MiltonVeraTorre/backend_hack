import * as Sentry from "@sentry/node";
export const handleServerError = (error, instancia, res) => {
    console.log(error);
    switch (error?.code) {
        case "P2000":
            return res
                .status(400)
                .json({
                msg: "Introduciste un valor invalido, por favor verifica los datos ingresados",
            });
        case "P2001":
            return res.status(404).json({ msg: `${instancia} no existe` });
        case "P2002":
            return res.status(400).json({ msg: `${instancia} ya existe` });
        case "P2003":
            return res
                .status(400)
                .json({
                msg: `No se puede realizar esta operacion porque hay datos relacionados`,
            });
        case "P2004":
            return res
                .status(400)
                .json({ msg: `Se introdujo un valor nulo en un campo requerido` });
        case "P2005":
            return res
                .status(404)
                .json({
                msg: `No se puede relacionar ${instancia} con ese ID ya que no existe`,
            });
        case "P2006":
            return res
                .status(404)
                .json({
                msg: `No se puede relacionar ${instancia} con ese ID ya que no existe`,
            });
        default:
            Sentry.captureException(error);
            return res
                .status(500)
                .json({
                msg: `Se ha producido un error desconocido, notificalo cuanto antes`,
            });
    }
};

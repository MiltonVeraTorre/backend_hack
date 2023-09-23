import jwt from "jsonwebtoken";
import pkg from 'jsonwebtoken';
const { TokenExpiredError } = pkg;
import { prisma } from "../index.js";
const adminAuth = async (req, res, next) => {
    let token;
    if (req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const jwtSecret = process.env.JWT_SECRET || "";
            const decoded = jwt.verify(token, jwtSecret);
            if (typeof decoded === "string") {
                throw new Error("Token mal formado");
            }
            const admin = await prisma.admin.findUnique({
                where: {
                    id: decoded.id,
                },
            });
            if (!admin) {
                const error = new Error("Acceso no permitido");
                return res.status(401).json({ msg: error.message });
            }
            req.admin = admin;
            return next();
        }
        catch (error) {
            if (error instanceof TokenExpiredError) {
                return res.status(401).json({ msg: "Sesión vencida" });
            }
            return res.status(404).json({ msg: "Hubo un error" });
        }
    }
    if (!token) {
        const error = new Error("Token No valido");
        return res.status(401).json({ msg: error.message });
    }
    next();
};
export default adminAuth;

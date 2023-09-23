import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import adminRoutes from "./routes/adminRoutes";
const app = express();
export const prisma = new PrismaClient();
const whitelist = [process.env.ADMIN_URL, process.env.USER_URL];
let corsOptions;
if (process.env.NODE_ENV === "development") {
    corsOptions = {
        origin: true,
        methods: ["GET", "POST", "PUT", "DELETE"],
    };
}
else {
    corsOptions = {
        origin: function (origin, callback) {
            console.log(whitelist, origin);
            if (whitelist.includes(origin) || !origin) {
                callback(null, true);
            }
            else {
                console.log(origin);
                callback(new Error("Error de Cors"));
            }
        },
    };
}
app.use(cors(corsOptions));
app.use(express.json());
app.use("/api/admin", adminRoutes);
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Servidor Corriendo en ${PORT}`);
});
["SIGINT", "SIGTERM"].forEach((signal) => {
    process.on(signal, async () => {
        await prisma.$disconnect();
        process.exit(1);
    });
});

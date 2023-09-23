import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import morgan from "morgan";

import { PrismaClient } from "@prisma/client";

import adminRoutes from "./routes/adminRoutes";

const app = express();

export const prisma = new PrismaClient();

const whitelist = [process.env.ADMIN_URL, process.env.USER_URL];

let corsOptions: any;

if (process.env.NODE_ENV === "development") {
  // Desarrollo

  corsOptions = {
    origin: true, // Permitir cualquier origen
    methods: ["GET", "POST", "PUT", "DELETE"], // Permitir todos los métodos HTTP
  };
} else {
  // Produccion

  corsOptions = {
    origin: function (origin: string, callback: Function) {
      console.log(whitelist, origin);
      if (whitelist.includes(origin) || !origin) {
        // Puede consultar la API
        callback(null, true);
      } else {
        // No esta permitido su request
        console.log(origin);
        callback(new Error("Error de Cors"));
      }
    },
  };
}
app.use(cors(corsOptions));

app.use(express.json());

// Routing

// app.use("ruta",archivoDeRuta)
app.use("/api/admin",adminRoutes)

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

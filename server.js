import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();
const prisma = new PrismaClient();

// ✅ Middleware
app.use(cors({
  origin: "*", // oppure specifica 'https://streaming-rewards-frontend-clean.vercel.app' per sicurezza
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

// ✅ Rotte
app.use("/api/auth", authRoutes);

// ✅ Rotta root per test server
app.get("/", (req, res) => {
  res.send("🎧 Backend ONLINE ✅");
});

// ✅ Avvio server
app.listen(process.env.PORT, () => {
  console.log(`🚀 Server runniing on port ${process.env.PORT}`);
});

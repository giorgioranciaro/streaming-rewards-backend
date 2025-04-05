import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import authRoutes from "./routes/auth.js";
import artistRoutes from "./routes/artist.js";

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 4000;

// ✅ CORS Middleware completo
app.use(cors({
  origin: "https://streaming-rewards-frontend-clean.vercel.app", // dominio frontend
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

// ✅ Preflight handler (IMPORTANTISSIMO per evitare 404)
app.options("*", cors());

// ✅ Body parser
app.use(express.json());

// ✅ Rotte
app.use("/api/auth", authRoutes);
app.use("/api/artist", artistRoutes);

// ✅ Root route
app.get("/", (req, res) => {
  res.send("🎧 Backend ONLINE ✅");
});

// ✅ Avvio server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
});

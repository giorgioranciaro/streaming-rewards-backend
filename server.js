import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import authRoutes from "./routes/auth.js";
import artistRoutes from "./routes/artist.js";

dotenv.config();

const app = express(); // ✅ deve venire prima!
const prisma = new PrismaClient();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors({
  origin: "*", // o specifica 'https://streaming-rewards-frontend-clean.vercel.app'
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}
app.use(express.json());

// Rotte
app.use("/api/auth", authRoutes);
app.use("/api/artist", artistRoutes);

// Rotta root
app.get("/", (req, res) => {
  res.send("🎧 Backend ONLINE ✅");
});

// Avvio server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
});

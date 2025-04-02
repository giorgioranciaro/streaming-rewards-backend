import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 4000;

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Rotte
app.use("/api/auth", authRoutes);

// ✅ Root route per check
app.get("/", (req, res) => {
  res.send("🎧 Backend ONLINE ✅");
});

// ✅ Avvio server (necessario per Railway)
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
});

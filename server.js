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

// ✅ ABILITA CORS CORRETTAMENTE
app.use(cors({
  origin: ["http://localhost:3000", "https://streaming-rewards-frontend-clean.vercel.app"],
  credentials: true,
}));

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/artist", artistRoutes);

app.get("/", (req, res) => {
  res.send("🎧 Streaming Rewards Backend API");
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
});

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

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/artist", artistRoutes);

// HOME
app.get("/", (req, res) => {
  res.send("🎧 Streaming Rewards Backend API");
});

// AVVIO SERVER - QUESTO È ESSENZIALE
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});


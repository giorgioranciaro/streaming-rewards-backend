import express from "express";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import cors from "cors";

import authRoutes from "./routes/auth.js";
import artistRoutes from "./routes/artist.js";

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 4000;

const allowedOrigins = [
  "https://streaming-rewards-frontend-clean.vercel.app",
  "https://hoppscotch.io",
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// Gestisce correttamente le richieste preflight
app.options("*", cors());

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/artist", artistRoutes);

app.get("/", (req, res) => {
  res.send("🎧 Backend ONLINE ✅");
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
});

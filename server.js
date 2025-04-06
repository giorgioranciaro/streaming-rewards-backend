import express from "express";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import authRoutes from "./routes/auth.js";
import artistRoutes from "./routes/artist.js";
import cors from "cors";

dotenv.config();

const allowedOrigins = [
  "https://hoppscotch.io",
  "https://streaming-rewards-frontend-clean.vercel.app"
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 4000;

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Preflight handler

app.use(express.json());

// Rotte
app.use("/api/auth", authRoutes);
app.use("/api/artist", artistRoutes);

app.get("/", (req, res) => {
  res.send("🎧 Backend ONLINE ✅");
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
});

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import authRoutes from "./routes/auth.js";
import artistRoutes from "./routes/artist.js";
app.use("/api/artist", artistRoutes);


dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT;

// ✅ Middleware
app.use(cors({
  origin: "*", // oppure specifica 'https://streaming-rewards-frontend-clean.vercel.app' per sicurezza
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

// ✅ Rotte
app.use("/api/auth", authRoutes);

router.post("/rewards", authenticateToken, async (req, res) => {
  const { type, description, requiredStreams } = req.body;
  const artistId = req.user.userId;

  if (!type || !description || !requiredStreams) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const reward = await prisma.reward.create({
      data: {
        type,
        description,
        requiredStreams,
        artistId,
        isActive: true,
      },
    });

    res.status(201).json(reward);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create reward" });
  }
});


// ✅ Rotta root per test server
app.get("/", (req, res) => {
  res.send("🎧 Backend ONLINE ✅");
});

// ✅ Avvio server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
});

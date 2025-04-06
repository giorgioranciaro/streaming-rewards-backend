import express from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const router = express.Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// ✅ Middleware di autenticazione
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token mancante" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Token non valido" });
    req.user = user;
    next();
  });
}

// ✅ GET /api/artist/me - Ottieni i dati dell'artista loggato
router.get("/me", authenticateToken, async (req, res) => {
  try {
    const artist = await prisma.artist.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        name: true,
        email: true,
        bio: true,
        createdAt: true
      }
    });

    if (!artist) {
      return res.status(404).json({ error: "Artista non trovato" });
    }

    res.json(artist);
  } catch (err) {
    console.error("Errore nel recupero dei dati artista:", err);
    res.status(500).json({ error: "Errore interno del server" });
  }
});

// ✅ GET tutte le rewards dell'artista loggato
router.get("/rewards", authenticateToken, async (req, res) => {
  try {
    const artistId = req.user.userId;
    const rewards = await prisma.reward.findMany({
      where: { artistId },
      orderBy: { createdAt: "desc" },
    });
    res.json(rewards);
  } catch (err) {
    console.error("Errore nel recupero delle rewards:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// ✅ POST nuova reward (stream o share)
router.post("/rewards", authenticateToken, async (req, res) => {
  try {
    const artistId = req.user.userId;
    const { type, description, requiredStreams } = req.body;

    if (!["stream", "share"].includes(type)) {
      return res.status(400).json({ error: "Tipo di reward non valido" });
    }

    const reward = await prisma.reward.create({
      data: {
        artistId,
        type,
        description,
        requiredStreams: parseInt(requiredStreams),
      },
    });

    res.status(201).json(reward);
  } catch (err) {
    console.error("Errore nella creazione della reward:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// ✅ PUT modifica reward
router.put("/rewards/:id", authenticateToken, async (req, res) => {
  const rewardId = req.params.id;
  const artistId = req.user.userId;
  const { type, description, requiredStreams } = req.body;

  try {
    const existing = await prisma.reward.findUnique({
      where: { id: rewardId },
    });

    if (!existing || existing.artistId !== artistId) {
      return res.status(403).json({ error: "Operazione non consentita" });
    }

    const updated = await prisma.reward.update({
      where: { id: rewardId },
      data: {
        type,
        description,
        requiredStreams: parseInt(requiredStreams),
      },
    });

    res.json(updated);
  } catch (err) {
    console.error("Errore nella modifica della reward:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// ✅ DELETE cancella reward
router.delete("/rewards/:id", authenticateToken, async (req, res) => {
  const rewardId = req.params.id;
  const artistId = req.user.userId;

  try {
    const existing = await prisma.reward.findUnique({
      where: { id: rewardId },
    });

    if (!existing || existing.artistId !== artistId) {
      return res.status(403).json({ error: "Operazione non consentita" });
    }

    await prisma.reward.delete({ where: { id: rewardId } });
    res.json({ message: "Reward eliminata con successo" });
  } catch (err) {
    console.error("Errore nella cancellazione della reward:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default router;

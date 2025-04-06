import express from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const router = express.Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// Middleware di autenticazione
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

// ✅ GET /api/artist/rewards – Recupera le rewards dell'artista loggato
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

// ✅ POST /api/artist/rewards – Crea una nuova reward per l'artista loggato
router.post("/rewards", authenticateToken, async (req, res) => {
  try {
    const artistId = req.user.userId;
    const { type, description, requiredStreams } = req.body;

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

// ✅ GET /api/artist/me – Recupera i dati dell'artista loggato
router.get("/me", authenticateToken, async (req, res) => {
  try {
    const artist = await prisma.artist.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        name: true,
        email: true,
        bio: true,
        createdAt: true,
      },
    });

    if (!artist) return res.status(404).json({ error: "Artista non trovato" });

    res.json(artist);
  } catch (err) {
    console.error("Errore nel recupero dell'artista:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// ✅ PUT /api/artist/me – Aggiorna i dati dell'artista loggato
router.put("/me", authenticateToken, async (req, res) => {
  try {
    const { name, email, bio } = req.body;

    const updated = await prisma.artist.update({
      where: { id: req.user.userId },
      data: {
        name,
        email,
        bio,
      },
    });

    res.json({
      id: updated.id,
      name: updated.name,
      email: updated.email,
      bio: updated.bio,
      createdAt: updated.createdAt,
    });
  } catch (err) {
    console.error("Errore nell'aggiornamento dell'artista:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default router;

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


// ✅ PUT /api/artist/me – Aggiorna dati artista loggato
router.put("/me", authenticateToken, async (req, res) => {
  try {
    const artistId = req.user.userId;
    const { name, email, bio } = req.body;

    const updatedArtist = await prisma.artist.update({
      where: { id: artistId },
      data: {
        name,
        email,
        bio,
      },
    });

    res.json(updatedArtist);
  } catch (err) {
    console.error("Errore nell'aggiornamento artista:", err);
    res.status(500).json({ error: "Errore durante l'aggiornamento" });
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

// ✅ GET /api/artist/profile - Ottieni i dati dell'artista loggato
router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const artist = await prisma.artist.findUnique({
      where: { id: req.user.userId },
    });

    if (!artist) {
      return res.status(404).json({ error: "Artist not found" });
    }

    res.json({
      name: artist.name,
      email: artist.email,
      bio: artist.bio,
    });
  } catch (err) {
    console.error("Error fetching artist profile:", err);
    res.status(500).json({ error: "Internal server error" });
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

// 🔗 STREAMING LINKS ENDPOINTS (da inserire PRIMA di `export default router`)

// ✅ GET /api/artist/links - Recupera tutti i link dello streaming dell'artista loggato
router.get("/links", authenticateToken, async (req, res) => {
  try {
    const artistId = req.user.userId;

    const links = await prisma.streamingLink.findMany({
      where: { artistId },
      orderBy: { createdAt: "desc" },
    });

    res.json(links);
  } catch (err) {
    console.error("Errore nel recupero dei link:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// ✅ POST /api/artist/links - Crea un nuovo link di streaming
router.post("/links", authenticateToken, async (req, res) => {
  try {
    const artistId = req.user.userId;
    const { platform, url } = req.body;

    if (!platform || !url) {
      return res.status(400).json({ error: "Platform and URL are required" });
    }

    const newLink = await prisma.streamingLink.create({
      data: {
        platform,
        url,
        artistId,
      },
    });

    res.status(201).json(newLink);
  } catch (err) {
    console.error("Errore nella creazione del link:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// ✅ DELETE /api/artist/links/:id - Elimina un link di streaming
router.delete("/links/:id", authenticateToken, async (req, res) => {
  try {
    const artistId = req.user.userId;
    const linkId = req.params.id;

    const link = await prisma.streamingLink.findUnique({
      where: { id: linkId },
    });

    if (!link || link.artistId !== artistId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await prisma.streamingLink.delete({
      where: { id: linkId },
    });

    res.json({ message: "Link deleted" });
  } catch (err) {
    console.error("Errore nell'eliminazione del link:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default router;

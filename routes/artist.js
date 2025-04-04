import express from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const router = express.Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// Middleware di autenticazione per artisti
function authenticateArtist(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Missing token" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== "artist") {
      return res.status(403).json({ error: "Access denied" });
    }
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
}

// ✅ GET all rewards
router.get("/rewards", async (req, res) => {
  const rewards = await prisma.reward.findMany();
  res.json(rewards);
});

// ✅ POST crea reward
router.post("/rewards", authenticateArtist, async (req, res) => {
  const { type, description, requiredStreams } = req.body;

  if (!type || !requiredStreams) {
    return res.status(400).json({ error: "Type and requiredStreams are required" });
  }

  try {
    const reward = await prisma.reward.create({
      data: {
        type,
        description,
        requiredStreams,
        artistId: req.user.userId,
      },
    });
    res.status(201).json(reward);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default router;

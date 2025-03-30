import express from "express";
const router = express.Router();

router.post("/register", (req, res) => {
  res.send("Register route placeholder");
});

router.post("/login", (req, res) => {
  res.send("Login route placeholder");
});

export default router;

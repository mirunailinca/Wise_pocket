const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const db = require("../models");
const User = db.utilizator;

const SECRET = "cheie-secreta";

// LOGIN
router.post("/login", async (req, res) => {
  const { email, parola } = req.body;

  try {
    console.log("BODY:", req.body); //LOG 
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: "Email inexistent" });

    // console.log("User găsit:", user); //LOG
    // console.log("Parola primită:", parola);//LOG
    // console.log("Hash din DB:", user.parola);//LOG



    const valid = await bcrypt.compare(parola, user.parola);
    //console.log("Rezultat bcrypt.compare:", valid); //LOG
    if (!valid) return res.status(401).json({ message: "Parolă greșită" });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.rol }, //am schimbat din user.tip
      SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: "Eroare server", err: err.message });
  }
});

// SIGNUP
router.post("/signup", async (req, res) => {
  const { nume, prenume, email, parola, rol } = req.body;

  try {
    const existent = await User.findOne({ where: { email } });
    if (existent) return res.status(400).json({ message: "Email deja înregistrat" });

    const hashedPassword = await bcrypt.hash(parola, 10);

    const user = await User.create({
      nume,
      prenume,
      email,
      parola: hashedPassword,
      rol: rol,
    });

    res.status(201).json({ message: "Cont creat cu succes", user: { id: user.id, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: "Eroare la creare cont", err: err.message });
  }
});

module.exports = router;

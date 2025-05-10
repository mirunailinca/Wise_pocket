const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { utilizator } = require("../models");

const SECRET_KEY = "cheia-ta-secreta";

const authController = {
  // LOGIN
  login: async (req, res) => {
    const { email, parola } = req.body;

    try {
      const user = await utilizator.findOne({ where: { email } });
      if (!user) return res.status(401).json({ message: "Email invalid" });

      const parolaValida = await bcrypt.compare(parola, user.parola);
      if (!parolaValida) return res.status(401).json({ message: "Parolă greșită" });

      const token = jwt.sign({ id: user.id, rol: user.rol }, SECRET_KEY, {
        expiresIn: "1h"
      });

      res.status(200).json({ token });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // SIGNUP
  signup: async (req, res) => {
    const { nume, prenume, email, parola, rol } = req.body;

    try {
      const userExist = await utilizator.findOne({ where: { email } });
      if (userExist) return res.status(400).json({ message: "Email deja folosit" });

      const hashedPassword = await bcrypt.hash(parola, 10);

      const newUser = await utilizator.create({
        nume,
        prenume,
        email,
        parola: hashedPassword,
        rol
      });

      const token = jwt.sign({ id: newUser.id, rol: newUser.rol }, SECRET_KEY, {
        expiresIn: "1h"
      });

      res.status(201).json({ token });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
};

module.exports = authController;

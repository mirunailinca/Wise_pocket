const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { utilizator } = require("../models");

const SECRET_KEY = "cheie-secreta";

const authController = {
  // LOGIN
login: async (req, res) => {
  const { email, parola } = req.body;

  try {
    const user = await utilizator.findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: "Email invalid" });

    const parolaValida = await bcrypt.compare(parola, user.parola);
    if (!parolaValida) return res.status(401).json({ message: "Parolă greșită" });

    // 🔥 scoatem valorile clare
    const userPlain = user.get({ plain: true });

    // 🧠 vezi ce ai în consola backend
    console.log("ROL:", userPlain.rol);  
    console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!ROL:");  

    const token = jwt.sign(
      {
        id: userPlain.id,
        email: userPlain.email,
        rol: userPlain.rol   // 🔥 AICI trebuie să apară în token
      },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.status(200).json({ token });
    } catch (err) {
      console.error("Eroare la login:", err);
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
        rol,
      });

      const newUserPlain = newUser.get({ plain: true });

      const token = jwt.sign(
        {
          id: newUserPlain.id,
          email: newUserPlain.email,
          rol: newUserPlain.rol,
        },
        SECRET_KEY,
        { expiresIn: "1h" }
      );

      res.status(201).json({ token });
    } catch (err) {
      console.error("Eroare la înregistrare:", err);
      res.status(500).json({ message: err.message });
    }
  }
};

module.exports = authController;

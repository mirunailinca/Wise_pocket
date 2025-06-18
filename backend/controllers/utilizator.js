const UtilizatorDb = require("../models").utilizator;
const { utilizator: Utilizator, recompensa: Recompensa } = require("../models");

const controller = {
    createUtilizator: async (req, res) => {
        try {
          const utilizator = await UtilizatorDb.create({
            nume: req.body.nume,
            prenume: req.body.prenume,
            email: req.body.email,
            parola: req.body.parola, // recomand să criptezi parola cu bcrypt!
          });
          res.status(201).send(utilizator);
        } catch (err) {
          res.status(500).send(err.message);
        }
      },
    
      updateUtilizator: async (req, res) => {
        try {
          const utilizator = await UtilizatorDb.findByPk(req.params.id);
          if (!utilizator) return res.status(404).send("Utilizatorul nu a fost găsit");
    
          const updated = await utilizator.update({
            nume: req.body.nume,
            prenume: req.body.prenume,
            email: req.body.email,
            parola: req.body.parola,
            rol: req.body.rol,
          });
          res.status(200).send(updated);
        } catch (err) {
          res.status(500).send(err.message);
        }
      },
    
      deleteUtilizator: async (req, res) => {
        try {
          const utilizator = await UtilizatorDb.findByPk(req.params.id);
          if (!utilizator) return res.status(404).send("Utilizatorul nu a fost găsit");
    
          await utilizator.destroy();
          res.status(200).send("Utilizator șters cu succes");
        } catch (err) {
          res.status(500).send(err.message);
        }
      },
    
      getAllUtilizatori: async (req, res) => {
        try {
          const utilizatori = await UtilizatorDb.findAll();
          res.status(200).send(utilizatori);
        } catch (err) {
          res.status(500).send(err.message);
        }
      },
    
      getUtilizatorById: async (req, res) => {
        try {
          const utilizator = await UtilizatorDb.findByPk(req.params.id);
          if (!utilizator) return res.status(404).send("Utilizatorul nu a fost găsit");
          res.status(200).send(utilizator);
        } catch (err) {
          res.status(500).send(err.message);
        }
      },

      getProfilComplet: async (req, res) => {
    try {
      const userId = req.params.id;

      const utilizator = await Utilizator.findByPk(userId);
      if (!utilizator) return res.status(404).json({ error: "Utilizatorul nu a fost găsit" });

      const recompensa = await Recompensa.findOne({
        where: { utilizator_id: userId }
      });

      const puncte = recompensa ? recompensa.puncte : 0;

      res.status(200).json({
        id: utilizator.id,
        nume: utilizator.nume,
        prenume: utilizator.prenume,
        email: utilizator.email,
        puncte
      });

      } catch (err) {
        res.status(500).json({ error: err.message });
      }
  }
}

module.exports = controller;
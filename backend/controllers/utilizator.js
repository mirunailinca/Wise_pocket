const UtilizatorDb = require("../models").utilizator;

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
      }
}

module.exports = controller;
const RecompensaDb = require("../models").recompensa;

const controller = {
  createRecompensa: async (req, res) => {
    try {
      const recompensa = await RecompensaDb.create({
        puncte: req.body.puncte,
        id_utilizator: req.body.id_utilizator,
      });
      res.status(201).send(recompensa);
    } catch (err) {
      res.status(500).send(err.message);
    }
  },

  updateRecompensa: async (req, res) => {
    try {
      const recompensa = await RecompensaDb.findByPk(req.params.id);
      if (!recompensa) return res.status(404).send("Recompensa nu a fost găsită");

      const updated = await recompensa.update(req.body);
      res.status(200).send(updated);
    } catch (err) {
      res.status(500).send(err.message);
    }
  },

  deleteRecompensa: async (req, res) => {
    try {
      const recompensa = await RecompensaDb.findByPk(req.params.id);
      if (!recompensa) return res.status(404).send("Recompensa nu a fost găsită");

      await recompensa.destroy();
      res.status(200).send("Recompensa ștearsă cu succes");
    } catch (err) {
      res.status(500).send(err.message);
    }
  },

  getAllRecompense: async (req, res) => {
    try {
      const recompense = await RecompensaDb.findAll();
      res.status(200).send(recompense);
    } catch (err) {
      res.status(500).send(err.message);
    }
  },

  getRecompensaById: async (req, res) => {
    try {
      const recompensa = await RecompensaDb.findByPk(req.params.id);
      if (!recompensa) return res.status(404).send("Recompensa nu a fost găsită");
      res.status(200).send(recompensa);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
};

module.exports = controller;
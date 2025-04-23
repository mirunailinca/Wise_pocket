const BugetDb = require("../models").buget;

const controller = {
  createBuget: async (req, res) => {
    try {
      const buget = await BugetDb.create({
        totalitate_cheltuieli: req.body.totalitate_cheltuieli,
        perioada: req.body.perioada,
        suma: req.body.suma,
        id_utilizator: req.body.id_utilizator,
        data_inceput: req.body.data_inceput
      });
      res.status(201).send(buget);
    } catch (err) {
      res.status(500).send(err.message);
    }
  },

  updateBuget: async (req, res) => {
    try {
      const buget = await BugetDb.findByPk(req.params.id);
      if (!buget) return res.status(404).send("Bugetul nu a fost găsit");

      const updated = await buget.update(req.body);
      res.status(200).send(updated);
    } catch (err) {
      res.status(500).send(err.message);
    }
  },

  deleteBuget: async (req, res) => {
    try {
      const buget = await BugetDb.findByPk(req.params.id);
      if (!buget) return res.status(404).send("Bugetul nu a fost găsit");

      await buget.destroy();
      res.status(200).send("Buget șters cu succes");
    } catch (err) {
      res.status(500).send(err.message);
    }
  },

  getAllBugete: async (req, res) => {
    try {
      const bugete = await BugetDb.findAll();
      res.status(200).send(bugete);
    } catch (err) {
      res.status(500).send(err.message);
    }
  },

  getBugetById: async (req, res) => {
    try {
      const buget = await BugetDb.findByPk(req.params.id);
      if (!buget) return res.status(404).send("Bugetul nu a fost găsit");
      res.status(200).send(buget);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
};

module.exports = controller;
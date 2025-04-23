const CategorieDb = require("../models").categorieCheltuiala;

const controller = {
  createCategorie: async (req, res) => {
    try {
      const categorie = await CategorieDb.create({
        denumire: req.body.denumire,
      });
      res.status(201).send(categorie);
    } catch (err) {
      res.status(500).send(err.message);
    }
  },

  updateCategorie: async (req, res) => {
    try {
      const categorie = await CategorieDb.findByPk(req.params.id);
      if (!categorie) return res.status(404).send("Categoria nu a fost gasită");

      const updated = await categorie.update({
        denumire: req.body.denumire,
      });
      res.status(200).send(updated);
    } catch (err) {
      res.status(500).send(err.message);
    }
  },

  deleteCategorie: async (req, res) => {
    try {
      const categorie = await CategorieDb.findByPk(req.params.id);
      if (!categorie) return res.status(404).send("Categoria nu a fost găsită");

      await categorie.destroy();
      res.status(200).send("Categorie ștearsă cu succes");
    } catch (err) {
      res.status(500).send(err.message);
    }
  },

  getAllCategorii: async (req, res) => {
    try {
      const categorii = await CategorieDb.findAll();
      res.status(200).send(categorii);
    } catch (err) {
      res.status(500).send(err.message);
    }
  },

  getCategorieById: async (req, res) => {
    try {
      const categorie = await CategorieDb.findByPk(req.params.id);
      if (!categorie) return res.status(404).send("Categoria nu a fost găsită");
      res.status(200).send(categorie);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
};

module.exports = controller;
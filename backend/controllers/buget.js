const BugetDb = require("../models").buget;
const { Op } = require("sequelize");
const CheltuialaDb = require("../models").cheltuiala;

const controller = {
  createBuget: async (req, res) => {
    try {
      const { perioada, suma, utilizator_id, data_inceput, denumire } = req.body;
            if (!perioada || !suma || !utilizator_id || !data_inceput) {
  return res.status(400).send("Toate câmpurile sunt necesare.");
}

      const inceput = new Date(data_inceput);
      let durataZile;

      switch (perioada.toLowerCase()) {
        case "saptamana":
          durataZile = 7;
          break;
        case "luna":
          durataZile = 30;
          break;
        case "an":
          durataZile = 365;
          break;
        default:
          return res.status(400).send("Perioadă invalidă. Folosește: saptamana, luna sau an.");
      }

      const sfarsit = new Date(inceput);
      sfarsit.setDate(inceput.getDate() + durataZile);

      const cheltuieli = await CheltuialaDb.findAll({
        where: {
          utilizator_id: utilizator_id,
          data: {
            [Op.between]: [inceput, sfarsit]
          }
        }
      });

      const totalitate_cheltuieli = cheltuieli.reduce((acc, ch) => acc + ch.suma, 0);



      const buget = await BugetDb.create({
        totalitate_cheltuieli,
        perioada,
        suma,
        utilizator_id, //OARE AICI
        data_inceput,
        denumire
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
  },

  getBugeteByUser: async (req, res) => {
  try {
    const bugete = await BugetDb.findAll({
      where: { utilizator_id: req.params.userId } //OARE
    });
    res.status(200).json(bugete);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
  },

  getTotalCheltuitPeBuget: async (req, res) => {
  try {
    const bugetId = req.params.id;
    const b = await BugetDb.findByPk(bugetId);

    if (!b) return res.status(404).json({ message: "Bugetul nu a fost găsit" });

    const dataSfarsit = new Date(b.data_inceput);

    if (b.perioada === "saptamana") {
      dataSfarsit.setDate(dataSfarsit.getDate() + 7);
    } else if (b.perioada === "luna") {
      dataSfarsit.setDate(dataSfarsit.getDate() + 30);
    }

    const cheltuieli = await CheltuialaDb.findAll({
      where: {
        utilizator_id: b.utilizator_id,
        data: {
          [Op.gte]: new Date(b.data_inceput),
          [Op.lte]: dataSfarsit
        }
      }
    });

    const totalCheltuit = cheltuieli.reduce((acc, curr) => acc + curr.suma, 0);

    res.status(200).json({
      sumaAlocata: b.suma,
      totalCheltuit
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
};

module.exports = controller;
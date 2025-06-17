const { recompensa: RecompensaDb, buget: Buget, cheltuiala: Cheltuiala } = require("../models");
const { Op } = require("sequelize");
const dayjs = require("dayjs");

const controller = {
  createRecompensa: async (req, res) => {
    try {
      const recompensa = await RecompensaDb.create({
        puncte: req.body.puncte,
        utilizator_id: req.body.utilizator_id,
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
  },

  // ✅ Logica de verificare a bugetelor și acordare de puncte
  verificaRecompense: async (req, res) => {
    try {
      const bugete = await Buget.findAll();

      for (const buget of bugete) {
        const dataFinal = dayjs(buget.data_inceput).add(parseInt(buget.perioada), 'day');
        if (dataFinal.isAfter(dayjs())) continue;

        const cheltuieli = await Cheltuiala.findAll({
          where: {
            utilizator_id: buget.utilizator_id,
            data: {
              [Op.between]: [buget.data_inceput, dataFinal.toDate()]
            }
          }
        });

        const total = cheltuieli.reduce((acc, ch) => acc + ch.suma, 0);

        if (total <= buget.suma) {
          const recompensa = await RecompensaDb.findOne({
            where: { utilizator_id: buget.utilizator_id }
          });

          if (recompensa) {
            recompensa.puncte += 10;
            await recompensa.save();
          } else {
            await RecompensaDb.create({ utilizator_id: buget.utilizator_id, puncte: 10 });
          }
        }
      }

      res.json({ message: "Recompense verificate și actualizate cu succes." });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Eroare la verificarea recompenselor." });
    }
  }
};

module.exports = controller;

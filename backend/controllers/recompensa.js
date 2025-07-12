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
  getRecompensaByUserId: async (req, res) => {
  try {
    const recompensa = await RecompensaDb.findOne({
      where: { utilizator_id: req.params.id }
    });
    if (!recompensa) return res.status(404).json({ puncte: 0 });
    res.status(200).json(recompensa);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
,
// verificaRecompense: async (req, res) => {
//   try {
//     const utilizatorId = req.user.id;

//     // 1. Căutăm bugetele doar pentru acest utilizator
//     const bugete = await Buget.findAll({
//       where: { utilizator_id: utilizatorId }
//     });

//     let puncte = 0;

//     for (const buget of bugete) {
//       const durataZile = buget.perioada === "saptamana" ? 7 :
//                          buget.perioada === "luna" ? 30 : 365;

//       const dataFinal = dayjs(buget.data_inceput).add(durataZile, 'day');

//       // 2. Dacă perioada nu s-a încheiat, ignorăm
//       if (dayjs().isBefore(dataFinal, 'day')) continue;

//       // 3. Căutăm cheltuielile în perioada bugetului
//       const cheltuieli = await Cheltuiala.findAll({
//         where: {
//           utilizator_id: utilizatorId,
//           data: {
//             [Op.between]: [dayjs(buget.data_inceput).startOf('day').toDate(), dataFinal.endOf('day').toDate()]
//           }
//         }
//       });

//       const total = cheltuieli.reduce((acc, ch) => acc + ch.suma, 0);

//       // 4. Dacă a respectat bugetul, primește 10 puncte
//       if (total <= buget.suma) {
//         puncte += 10;
//       }
//     }

//     // 5. Returnăm direct punctele (fără salvare în BD)
//     res.json({ puncte });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Eroare la verificarea recompenselor." });
//   }
// }
verificaRecompense: async (req, res) => {
  try {
    const utilizatorId = req.body.utilizator_id;

    const bugete = await Buget.findAll({
      where: { utilizator_id: utilizatorId }
    });

    let puncte = 0;

    for (const buget of bugete)
   {
      const durataZile = buget.perioada === "saptamana" ? 7 :
                         buget.perioada === "luna" ? 30 : 365;

      const dataFinal = dayjs(buget.data_inceput).add(durataZile, 'day');
      if (dayjs().isBefore(dataFinal, 'day')) continue;

      const cheltuieli = await Cheltuiala.findAll({
        where: {
          utilizator_id: utilizatorId,
          data: {
            [Op.between]: [
              dayjs(buget.data_inceput).startOf("day").toDate(),
              dataFinal.endOf("day").toDate()
            ]
          }
        }
      });

      const total = cheltuieli.reduce((acc, ch) => acc + ch.suma, 0);
      if (total <= buget.suma) {
        puncte += 10;
      }
              console.log(
          `🔍 Buget ID ${buget.id} (${buget.perioada}, ${buget.data_inceput}): ` +
          `suma alocată = ${buget.suma}, total cheltuit = ${total} ` +
          `-> ${total <= buget.suma ? "✅ RESPECTAT" : "❌ DEPĂȘIT"}`
        );
    }
  
    res.json({ puncte });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Eroare la verificarea recompenselor." });
  }
}

};

module.exports = controller;

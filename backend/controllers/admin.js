const jwt = require('jsonwebtoken');
const { utilizator, cheltuiala, buget } = require('../models');

const getOverviewStats = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Token lipsă" });
    }

    const decoded = jwt.verify(token, process.env.SECRET);
    const user = await utilizator.findByPk(decoded.id);

    if (!user || user.rol !== "admin") {
      return res.status(403).json({ message: "Acces interzis. Doar administratorii pot accesa această resursă." });
    }

    const totalUtilizatori = await utilizator.count();
    const totalCheltuieli = await cheltuiala.sum('suma');

    const medieCheltuiala = await cheltuiala.sequelize.query(
    'SELECT AVG(suma) AS medie FROM cheltuiala',
    { type: cheltuiala.sequelize.QueryTypes.SELECT }
    );

    const medieCheltuialaFinal = parseFloat(medieCheltuiala[0]?.medie ?? 0).toFixed(2);

    const totalBugete = await buget.count();

    const [rezultat] = await buget.sequelize.query(
      'SELECT COUNT(DISTINCT utilizator_id) AS total FROM buget'
    );
    const utilizatoriCuBugete = rezultat[0].total;
    
    const [mediePerUserResult] = await cheltuiala.sequelize.query(
    `SELECT AVG(total) AS medie_per_user
    FROM (
        SELECT utilizator_id, SUM(suma) AS total
        FROM cheltuiala
        GROUP BY utilizator_id
    ) AS subquery`
    );
    const medieCheltuieliPerUtilizator = parseFloat(mediePerUserResult[0].medie_per_user || 0).toFixed(2);

    const [mediiPeLuna] = await cheltuiala.sequelize.query(
    `SELECT DATE_FORMAT(data, '%Y-%m') AS luna, 
            AVG(suma) AS medie
    FROM cheltuiala
    GROUP BY luna
    ORDER BY luna DESC
    LIMIT 6`
    );


    return res.status(200).json({
      totalUtilizatori,
      totalCheltuieli,
      medieCheltuiala: medieCheltuialaFinal,
      totalBugete,
      utilizatoriCuBugete,
      medieCheltuieliPerUtilizator,
      mediiPeLuna,

    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getOverviewStats
};

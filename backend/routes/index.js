const express = require("express");
const router = express.Router();

const utilizatorRouter = require("./utilizator");
const bugetRouter = require("./buget");
const cheltuialaRouter = require("./cheltuiala");
const recompensaRouter = require("./recompensa");
const categorieRouter = require("./categorieCheltuiala");
const adminRoutes = require('./admin');

router.use("/utilizatori", utilizatorRouter);
router.use("/bugete", bugetRouter);
router.use("/cheltuieli", cheltuialaRouter);
router.use("/recompense", recompensaRouter);
router.use("/categorii", categorieRouter);
router.use('/admin', adminRoutes);

module.exports = router;
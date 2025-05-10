const express = require("express");
const router = express.Router();

const utilizatorRouter = require("./utilizator");
const bugetRouter = require("./buget");
const cheltuialaRouter = require("./cheltuiala");
const recompensaRouter = require("./recompensa");
const categorieRouter = require("./categorieCheltuiala");

// 🔧 Adaugă asta:
const authRouter = require("./auth");

router.use("/utilizatori", utilizatorRouter);
router.use("/bugete", bugetRouter);
router.use("/cheltuieli", cheltuialaRouter);
router.use("/recompense", recompensaRouter);
router.use("/categorii", categorieRouter);

// ✅ Activează această rută:
router.use("/auth", authRouter);

module.exports = router;

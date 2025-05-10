const express = require("express");
const router = express.Router();
const { cheltuialaController } = require("../controllers");

router.get("/", cheltuialaController.getAllCheltuieli);
router.get("/:id", cheltuialaController.getCheltuialaById);
router.post("/", cheltuialaController.createCheltuiala);
router.put("/:id", cheltuialaController.updateCheltuiala);
router.delete("/:id", cheltuialaController.deleteCheltuiala);

router.get("/ultimele/:userId", cheltuialaController.getUltimeleCheltuieliByUser);


module.exports = router;
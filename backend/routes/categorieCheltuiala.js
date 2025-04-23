const express = require("express");
const router = express.Router();
const { categorieCheltuialaController } = require("../controllers");

router.get("/", categorieCheltuialaController.getAllCategorii);
router.get("/:id", categorieCheltuialaController.getCategorieById);
router.post("/", categorieCheltuialaController.createCategorie);
router.put("/:id", categorieCheltuialaController.updateCategorie);
router.delete("/:id", categorieCheltuialaController.deleteCategorie);

module.exports = router;
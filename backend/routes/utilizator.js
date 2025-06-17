const express = require("express");
const router = express.Router();
const { utilizatorController } = require("../controllers");

router.get("/profil/:id", utilizatorController.getProfilComplet);
router.get("/", utilizatorController.getAllUtilizatori);
router.get("/:id", utilizatorController.getUtilizatorById);
router.post("/", utilizatorController.createUtilizator);
router.put("/:id", utilizatorController.updateUtilizator);
router.delete("/:id", utilizatorController.deleteUtilizator);

module.exports = router;
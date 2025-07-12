const express = require("express");
const router = express.Router();
const { recompensaController } = require("../controllers");

router.get("/verifica", recompensaController.verificaRecompense);

router.post("/verifica", recompensaController.verificaRecompense);

router.get("/", recompensaController.getAllRecompense);
router.get("/utilizator/:id", recompensaController.getRecompensaByUserId);

router.get("/:id", recompensaController.getRecompensaById);
router.post("/", recompensaController.createRecompensa);
router.put("/:id", recompensaController.updateRecompensa);
router.delete("/:id", recompensaController.deleteRecompensa);

module.exports = router;
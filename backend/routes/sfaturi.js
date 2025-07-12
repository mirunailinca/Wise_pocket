const express = require("express");
const router = express.Router();
const { genereazaSfaturi } = require("../controllers/sfaturi");

router.get("/personalizate", genereazaSfaturi);
router.get("/test", (req, res) => {
  res.send("Ruta test funcționează ✅");
});

module.exports = router;

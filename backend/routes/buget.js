const express = require("express");
const router = express.Router();
const { bugetController } = require("../controllers");

router.get("/user/:userId", bugetController.getBugeteByUser);
router.get("/:id/progres", bugetController.getTotalCheltuitPeBuget);
router.get("/", bugetController.getAllBugete);
router.get("/:id", bugetController.getBugetById);
router.post("/", bugetController.createBuget);
router.put("/:id", bugetController.updateBuget);
router.delete("/:id", bugetController.deleteBuget);

module.exports = router;
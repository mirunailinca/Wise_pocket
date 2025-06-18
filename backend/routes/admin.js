const express = require('express');
const router = express.Router();

const { getOverviewStats } = require('../controllers/admin');

router.get('/overview', getOverviewStats);

module.exports = router;

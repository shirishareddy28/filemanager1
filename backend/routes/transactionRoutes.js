// routes/transactionRoutes.js
const express = require('express');
const {
    seedDatabase,
    getTransactions,
    getStatistics,
    getBarChart,
    getPieChart,
    getCombinedData,
} = require('../controllers/transactionController');

const router = express.Router();

router.get('/seed', seedDatabase);
router.get('/transactions', getTransactions);
router.get('/statistics', getStatistics);
router.get('/bar-chart', getBarChart);
router.get('/pie-chart', getPieChart);
router.get('/combined-data', getCombinedData);

module.exports = router;

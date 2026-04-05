const express = require('express');
const router = express.Router();
const { getSummary, getTrends } = require('../controllers/dashboardController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/summary', authorize('admin', 'analyst', 'viewer'), getSummary);
router.get('/trends', authorize('admin', 'analyst'), getTrends);

module.exports = router;

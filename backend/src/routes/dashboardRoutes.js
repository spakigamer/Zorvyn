const express = require('express');
const router = express.Router();
const { getSummary, getTrends, getCategories } = require('../controllers/dashboardController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/summary', authorize('admin', 'analyst', 'viewer'), getSummary);
router.get('/trends', authorize('admin', 'analyst', 'viewer'), getTrends);
router.get('/categories', authorize('admin', 'analyst', 'viewer'), getCategories);

module.exports = router;

const express = require('express');
const router = express.Router();
const { getRecords, createRecord, updateRecord, deleteRecord } = require('../controllers/recordController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/')
    .get(getRecords)
    .post(authorize('admin', 'analyst'), createRecord);

router.route('/:id')
    .put(authorize('admin', 'analyst'), updateRecord)
    .delete(authorize('admin', 'analyst'), deleteRecord);

module.exports = router;

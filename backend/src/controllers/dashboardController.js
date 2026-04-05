const mongoose = require('mongoose');
const Record = require('../models/Record');

// @desc    Get dashboard summary
// @route   GET /api/dashboard/summary
// @access  Private/Admin/Analyst
exports.getSummary = async (req, res, next) => {
    try {
        const match = {};
        if (req.query.userId && mongoose.Types.ObjectId.isValid(req.query.userId)) {
            match.createdBy = new mongoose.Types.ObjectId(req.query.userId);
        }

        const summary = await Record.aggregate([
            { $match: match },
            {
                $group: {
                    _id: '$type',
                    totalAmount: { $sum: '$amount' }
                }
            }
        ]);

        let income = 0;
        let expense = 0;

        summary.forEach(item => {
            if (item._id === 'income') {
                income = item.totalAmount;
            } else if (item._id === 'expense') {
                expense = item.totalAmount;
            }
        });

        res.status(200).json({
            success: true,
            data: {
                totalIncome: income,
                totalExpense: expense,
                balance: income - expense
            }
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get trends
// @route   GET /api/dashboard/trends
// @access  Private/Admin/Analyst
exports.getTrends = async (req, res, next) => {
    try {
        const match = {};
        if (req.query.userId && mongoose.Types.ObjectId.isValid(req.query.userId)) {
            match.createdBy = new mongoose.Types.ObjectId(req.query.userId);
        }

        const trends = await Record.aggregate([
            { $match: match },
            {
                $group: {
                    _id: {
                        month: { $month: '$date' },
                        year: { $year: '$date' },
                        type: '$type'
                    },
                    totalAmount: { $sum: '$amount' }
                }
            },
            {
                $sort: { '_id.year': 1, '_id.month': 1 }
            }
        ]);

        res.status(200).json({
            success: true,
            data: trends
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get category breakdown
// @route   GET /api/dashboard/categories
// @access  Private/Admin/Analyst/Viewer
exports.getCategories = async (req, res, next) => {
    try {
        const match = {};
        if (req.query.userId && mongoose.Types.ObjectId.isValid(req.query.userId)) {
            match.createdBy = new mongoose.Types.ObjectId(req.query.userId);
        }

        const categories = await Record.aggregate([
            { $match: match },
            {
                $group: {
                    _id: { category: '$category', type: '$type' },
                    totalAmount: { $sum: '$amount' }
                }
            },
            { $sort: { totalAmount: -1 } }
        ]);

        res.status(200).json({
            success: true,
            data: categories
        });
    } catch (err) {
        next(err);
    }
};

const Record = require('../models/Record');

// @desc    Get dashboard summary
// @route   GET /api/dashboard/summary
// @access  Private/Admin/Analyst
exports.getSummary = async (req, res, next) => {
    try {
        const summary = await Record.aggregate([
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
        const trends = await Record.aggregate([
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

const Record = require('../models/Record');

// @desc    Get all records
// @route   GET /api/records
// @access  Private
exports.getRecords = async (req, res, next) => {
    try {
        let query;

        // Copy req.query
        const reqQuery = { ...req.query };

        // Fields to exclude
        const removeFields = ['select', 'sort', 'page', 'limit'];

        // Loop over removeFields and delete them from reqQuery
        removeFields.forEach(param => delete reqQuery[param]);

        // Create query string
        let queryStr = JSON.stringify(reqQuery);

        // Create operators ($gt, $gte, etc)
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

        // Create query object
        const finalQuery = JSON.parse(queryStr);
        
        // Handle regex search for category
        if (req.query.category) {
            finalQuery.category = { $regex: req.query.category, $options: 'i' };
        }

        // Finding resource
        query = Record.find(finalQuery).populate({
            path: 'createdBy',
            select: 'name email role'
        });

        // Note: For Viewer and Analyst, they can see all records, or maybe only their own?
        // Usually in finance dashboards, Analysts/Admins see all records.
        // Viewers might see all but they have read-only access.
        // The PDF says "Viewer: read-only access", "Analyst: read + analytics", "Admin: full access".
        // This implies they can view all records.

        // Select Fields
        if (req.query.select) {
            const fields = req.query.select.split(',').join(' ');
            query = query.select(fields);
        }

        // Sort
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            query = query.sort('-createdAt');
        }

        // Pagination
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const total = await Record.countDocuments(finalQuery);

        query = query.skip(startIndex).limit(limit);

        // Executing query
        const records = await query;

        // Pagination result
        const pagination = {};

        if (endIndex < total) {
            pagination.next = {
                page: page + 1,
                limit
            };
        }

        if (startIndex > 0) {
            pagination.prev = {
                page: page - 1,
                limit
            };
        }

        res.status(200).json({
            success: true,
            total,
            count: records.length,
            pagination,
            data: records
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Create record
// @route   POST /api/records
// @access  Private/Admin/Analyst
exports.createRecord = async (req, res, next) => {
    try {
        // Add user to req.body
        req.body.createdBy = req.user.id;

        const record = await Record.create(req.body);

        res.status(201).json({
            success: true,
            data: record
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Update record
// @route   PUT /api/records/:id
// @access  Private/Admin/Analyst
exports.updateRecord = async (req, res, next) => {
    try {
        let record = await Record.findById(req.params.id);

        if (!record) {
            return res.status(404).json({ success: false, error: 'Record not found' });
        }

        record = await Record.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: record });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete record
// @route   DELETE /api/records/:id
// @access  Private/Admin/Analyst
exports.deleteRecord = async (req, res, next) => {
    try {
        const record = await Record.findByIdAndDelete(req.params.id);

        if (!record) {
            return res.status(404).json({ success: false, error: 'Record not found' });
        }

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        next(err);
    }
};

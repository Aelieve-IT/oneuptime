/**
 *
 * Copyright HackerBay, Inc.
 *
 */

var express = require('express');
var router = express.Router();

var AuditLogsService = require('../services/auditLogsService');
var getUser = require('../middlewares/user').getUser;
var isUserMasterAdmin = require('../middlewares/user').isUserMasterAdmin;

var sendErrorResponse = require('../middlewares/response').sendErrorResponse;
var sendListResponse = require('../middlewares/response').sendListResponse;

router.get('/allAuditLogs', getUser, isUserMasterAdmin, async function(
    req,
    res
) {
    try {
        const skip = req.query.skip;
        const limit = req.query.limit;
        const auditLogs = await AuditLogsService.getAllAuditLogs(skip, limit);
        const count = await AuditLogsService.countBy({});

        return sendListResponse(req, res, auditLogs, count);
    } catch (error) {
        return sendErrorResponse(req, res, error);
    }
});

router.post('/search', getUser, isUserMasterAdmin, async function(req, res) {
    try {
        const filter = req.body.filter;
        const skip = req.query.skip;
        const limit = req.query.limit;
        const query = {
            'reqLog.apiSection': { $regex: new RegExp(filter), $options: 'i' }
        };

        const searchedAuditLogs = await AuditLogsService.searchAuditLogs(
            query,
            skip,
            limit
        );
        const count = await AuditLogsService.countBy(query);

        return sendListResponse(req, res, searchedAuditLogs, count);
    } catch (error) {
        return sendErrorResponse(req, res, error);
    }
});

module.exports = router;

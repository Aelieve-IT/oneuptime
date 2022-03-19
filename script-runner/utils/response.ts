import { Request, Response } from 'common-server/utils/express';

export default {
    sendSuccessResponse: function(req: Request, res: Response, data: $TSFixMe) {
        return res.status(200).send(data);
    },
    sendErrorResponse: function(req: Request, res: Response, error: $TSFixMe) {
        if (
            error.message &&
            error.code !== 'ENOTFOUND' &&
            error.code !== 'ECONNREFUSED'
        ) {
            return res
                .status(error.code || 400)
                .send({ message: error.message });
        } else if (
            error.code === 'ENOTFOUND' ||
            error.code === 'ECONNREFUSED'
        ) {
            return res.status(400).send({ message: error.message });
        } else {
            return res.status(500).send({ message: 'Server Error.' });
        }
    },
};
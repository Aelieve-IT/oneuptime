import express, {
    ExpressRequest,
    ExpressResponse,
} from 'common-server/Utils/Express';
const getUser = require('../middlewares/user').getUser;

import { isAuthorized } from '../middlewares/authorization';
import {
    sendErrorResponse,
    sendItemResponse,
} from 'common-server/Utils/Response';
import Exception from 'common/types/exception/Exception';

import GitCredentialService from '../Services/gitCredentialService';

const router = express.getRouter();

router.post(
    '/:projectId/gitCredential',
    getUser,
    isAuthorized,
    async (req: ExpressRequest, res: ExpressResponse) => {
        try {
            const { gitUsername, gitPassword, sshTitle, sshPrivateKey } =
                req.body;
            const { projectId } = req.params;

            if (gitUsername && gitPassword) {
                const response = await GitCredentialService.create({
                    gitUsername,
                    gitPassword,
                    projectId,
                });
                return sendItemResponse(req, res, response);
            } else if (sshTitle && sshPrivateKey) {
                const response = await GitCredentialService.create({
                    sshTitle,
                    sshPrivateKey,
                    projectId,
                });
                return sendItemResponse(req, res, response);
            } else {
                return sendErrorResponse(req, res, {
                    code: 400,
                    message: 'Git Credential or Ssh is required',
                });
            }
        } catch (error) {
            return sendErrorResponse(req, res, error as Exception);
        }
    }
);

router.get(
    '/:projectId/gitCredential',
    getUser,
    isAuthorized,
    async (req: ExpressRequest, res: ExpressResponse) => {
        try {
            const { projectId } = req.params;

            const selectGitCredentials =
                'sshTitle sshPrivateKey gitUsername gitPassword iv projectId deleted';

            const populateGitCredentials = [
                { path: 'projectId', select: 'name slug' },
            ];
            const gitCredentials = await GitCredentialService.findBy({
                query: { projectId },
                select: selectGitCredentials,
                populate: populateGitCredentials,
            });
            return sendItemResponse(req, res, gitCredentials);
        } catch (error) {
            return sendErrorResponse(req, res, error as Exception);
        }
    }
);

router.put(
    '/:projectId/gitCredential/:credentialId',
    getUser,
    isAuthorized,
    async (req: ExpressRequest, res: ExpressResponse) => {
        try {
            const { credentialId } = req.params;
            const { gitUsername, gitPassword, sshTitle, sshPrivateKey } =
                req.body;

            const data = {};

            if (gitUsername) {
                data.gitUsername = gitUsername;
            }
            if (gitPassword) {
                data.gitPassword = gitPassword;
            }

            if (sshTitle) {
                data.sshTitle = sshTitle;
            }

            if (sshPrivateKey) {
                data.sshPrivateKey = sshPrivateKey;
            }

            const gitCredential = await GitCredentialService.updateOneBy(
                { _id: credentialId },
                data
            );
            return sendItemResponse(req, res, gitCredential);
        } catch (error) {
            return sendErrorResponse(req, res, error as Exception);
        }
    }
);

router.delete(
    '/:projectId/gitCredential/:credentialId',
    getUser,
    isAuthorized,
    async (req: ExpressRequest, res: ExpressResponse) => {
        try {
            const { credentialId } = req.params;

            const deletedGitCredential = await GitCredentialService.deleteBy({
                _id: credentialId,
            });

            return sendItemResponse(req, res, deletedGitCredential);
        } catch (error) {
            return sendErrorResponse(req, res, error as Exception);
        }
    }
);

export default router;
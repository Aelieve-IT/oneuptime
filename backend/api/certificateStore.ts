import express, {
    ExpressRequest,
    ExpressResponse,
} from 'common-server/Utils/Express';
import {
    sendErrorResponse,
    sendItemResponse,
} from 'common-server/Utils/Response';
import Exception from 'common/types/exception/Exception';

import CertificateStoreService from '../Services/certificateStoreService';
import StatusPageService from '../Services/statusPageService';
import SiteManagerService from '../Services/siteManagerService';

const router = express.getRouter();

// store certificate details to the db
router.post('/store', async (req: ExpressRequest, res: ExpressResponse) => {
    try {
        const data = req.body;

        const certificate = await CertificateStoreService.create(data);
        return sendItemResponse(req, res, certificate);
    } catch (error) {
        return sendErrorResponse(req, res, error as Exception);
    }
});

// update certificate details in the db
router.put('/store/:id', async (req: ExpressRequest, res: ExpressResponse) => {
    try {
        const { id } = req.params;
        const certificate = await CertificateStoreService.updateOneBy(
            { id },
            req.body
        );

        return sendItemResponse(req, res, certificate);
    } catch (error) {
        return sendErrorResponse(req, res, error as Exception);
    }
});

// fetch a certificate detail
router.get('/store/:id', async (req: ExpressRequest, res: ExpressResponse) => {
    try {
        const { id } = req.params;
        const certificate = await CertificateStoreService.findOneBy({
            query: { id },
            select: 'id privateKeyPem privateKeyJwk cert chain privKey subject altnames issuedAt expiresAt deleted deletedAt',
        });

        return sendItemResponse(req, res, certificate);
    } catch (error) {
        return sendErrorResponse(req, res, error as Exception);
    }
});

// fetch a certificate by the subject
// called from the status page project
router.get(
    '/store/cert/:subject',
    async (req: ExpressRequest, res: ExpressResponse) => {
        try {
            const { subject } = req.params;
            const certificate = await CertificateStoreService.findOneBy({
                query: { subject },
                select: 'id privateKeyPem privateKeyJwk cert chain privKey subject altnames issuedAt expiresAt deleted deletedAt',
            });

            return sendItemResponse(req, res, certificate);
        } catch (error) {
            return sendErrorResponse(req, res, error as Exception);
        }
    }
);

// delete an certificate detail
router.delete(
    '/store/:id',
    async (req: ExpressRequest, res: ExpressResponse) => {
        try {
            const { id } = req.params;

            const certificate = await CertificateStoreService.deleteBy({ id });
            return sendItemResponse(req, res, certificate);
        } catch (error) {
            return sendErrorResponse(req, res, error as Exception);
        }
    }
);

router.post('/certOrder', async (req: ExpressRequest, res: ExpressResponse) => {
    try {
        const domains = [];

        const greenlock = global.greenlock;
        // to refresh the managers set clearManager to true
        const { domain, clearManagers } = req.body;

        if (greenlock) {
            if (clearManagers) {
                await SiteManagerService.hardDelete({});
            }

            if (domain) {
                // delete any previous manager for this domain
                if (!clearManagers) {
                    await SiteManagerService.hardDelete({
                        subject: { $in: [domain] },
                    });
                }

                await greenlock.add({
                    subject: domain,
                    altnames: [domain],
                });

                return sendItemResponse(
                    req,
                    res,
                    `SSL certificate order for ${domain} is processed, check domain in few minutes`
                );
            }

            const statusPages = await StatusPageService.findBy({
                query: {
                    'domains.enableHttps': { $eq: true },
                    'domains.autoProvisioning': { $eq: true },
                    'domains.domain': { $type: 'string' },
                },
                skip: 0,
                limit: 99999,
                select: 'domains',
            });

            for (const statusPage of statusPages) {
                for (const domain of statusPage.domains) {
                    if (
                        domain.domain &&
                        domain.domain.trim() &&
                        domain.enableHttps &&
                        domain.autoProvisioning
                    ) {
                        domains.push(domain.domain);
                    }
                }
            }

            if (greenlock) {
                if (!clearManagers && domains && domains.length > 0) {
                    await SiteManagerService.hardDelete({
                        subject: { $in: domains },
                    });
                }
                for (const domain of domains) {
                    // run in the background
                    greenlock.add({
                        subject: domain,
                        altnames: [domain],
                    });
                }
            }

            return sendItemResponse(
                req,
                res,
                'Certificate renewal triggered...'
            );
        }
    } catch (error) {
        return sendErrorResponse(req, res, error as Exception);
    }
});

// delete ssl certificate for a particular domain
// and remove it from certificate order queue
// id => domain/subdomain
router.delete(
    '/certDelete/:id',
    async (req: ExpressRequest, res: ExpressResponse) => {
        try {
            const greenlock = global.greenlock;
            const { id } = req.body;

            if (greenlock) {
                await greenlock.remove({ subject: id });
                await CertificateStoreService.deleteBy({
                    id,
                });
            }

            return sendItemResponse(
                req,
                res,
                `Certificate deleted and cert order removed from queue`
            );
        } catch (error) {
            return sendErrorResponse(req, res, error as Exception);
        }
    }
);

export default router;
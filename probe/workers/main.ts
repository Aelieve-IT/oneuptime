import logger from 'common-server/Utils/Logger';
import ProbeAPI from '../utils/api';
import ApiMonitors from './apiMonitors';
import UrlMonitors from './urlMonitors';
import IPMonitors from './ipMonitors';
import ServerMonitors from './serverMonitors';

import IncomingHttpRequestMonitors from './incomingHttpRequestMonitors';
import KubernetesMonitors from './kubernetesMonitors';
let limit = process.env['RESOURCES_LIMIT'];

if (limit && typeof limit === 'string') {
    limit = parseInt(limit);
}

import asyncSleep from 'await-sleep';

const _this = {
    runJob: async function () {
        logger.info(`Getting a list of ${limit} monitors`);

        let monitors = await ProbeAPI.get('probe/monitors', limit);
        monitors = JSON.parse(monitors.data); // parse the stringified data

        logger.info(`Number of Monitors fetched - ${monitors.length} monitors`);

        if (monitors.length === 0) {
            // there are no monitors to monitor. Sleep for 30 seconds and then wake up.
            logger.info('No monitors to monitor. Sleeping for 30 seconds.');
            await asyncSleep(30 * 1000);
        }

        // loop over the monitor
        for (const monitor of monitors) {
            logger.info(`Monitor ID ${monitor._id}: Currently monitoring`);
            if (monitor.type === 'api') {
                logger.info(
                    `Monitor ID ${monitor._id}: Start monitoring API monitor`
                );
                await ApiMonitors.ping({ monitor });
                logger.info(
                    `Monitor ID ${monitor._id}: End monitoring API monitor`
                );
            } else if (monitor.type === 'url') {
                logger.info(
                    `Monitor ID ${monitor._id}: Start monitoring URL monitor`
                );
                await UrlMonitors.ping({ monitor });
                logger.info(
                    `Monitor ID ${monitor._id}: End monitoring URL monitor`
                );
            } else if (monitor.type === 'ip') {
                logger.info(
                    `Monitor ID ${monitor._id}: Start monitoring IP monitor`
                );
                await IPMonitors.ping({ monitor });
                logger.info(
                    `Monitor ID ${monitor._id}: End monitoring IP monitor`
                );
            } else if (
                monitor.type === 'server-monitor' &&
                monitor.agentlessConfig
            ) {
                logger.info(
                    `Monitor ID ${monitor._id}: Start monitoring Server monitor`
                );
                await ServerMonitors.run({ monitor });
                logger.info(
                    `Monitor ID ${monitor._id}: End monitoring Server monitor`
                );
            } else if (monitor.type === 'incomingHttpRequest') {
                logger.info(
                    `Monitor ID ${monitor._id}: Start monitoring Incoming HTTP Request monitor`
                );
                await IncomingHttpRequestMonitors.run({ monitor });
                logger.info(
                    `Monitor ID ${monitor._id}: End monitoring Incoming HTTP Request monitor`
                );
            } else if (monitor.type === 'kubernetes') {
                logger.info(
                    `Monitor ID ${monitor._id}: Start monitoring Kubernetes monitor`
                );
                await KubernetesMonitors.run({ monitor });
                logger.info(
                    `Monitor ID ${monitor._id}: End monitoring Kubernetes monitor`
                );
            }
        }
    },
};

export default _this;
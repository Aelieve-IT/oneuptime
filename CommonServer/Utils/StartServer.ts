import './Environment';
import './Process';
import logger from './Logger';
import cors from 'cors';
import Port from 'Common/Types/Port';
import Express, {
    ExpressRequest,
    ExpressResponse,
    NextFunction,
    ExpressJson,
    ExpressUrlEncoded,
    ExpressApplication,
    RequestHandler,
    OneUptimeRequest,
    ExpressStatic,
} from './Express';
// Connect common api's.
import CommonAPI from '../API/Index';
import NotFoundException from 'Common/Types/Exception/NotFoundException';
import { JSONObject } from 'Common/Types/JSON';
import OneUptimeDate from 'Common/Types/Date';
import LocalCache from '../Infrastructure/LocalCache';
import Exception from 'Common/Types/Exception/Exception';
import ObjectID from 'Common/Types/ObjectID';
import StatusCode from 'Common/Types/API/StatusCode';
import Typeof from 'Common/Types/Typeof';
import Response from './Response';
import JSONFunctions from 'Common/Types/JSONFunctions';
import API from 'Common/Utils/API';
import URL from 'Common/Types/API/URL';
import { AppVersion, DashboardApiHostname } from '../EnvironmentConfig';
import { DashboardApiRoute } from 'Common/ServiceRoute';
import HTTPResponse from 'Common/Types/API/HTTPResponse';
import HTTPErrorResponse from 'Common/Types/API/HTTPErrorResponse';
import ServerException from 'Common/Types/Exception/ServerException';
// import zlib from 'zlib';
// import OpenTelemetrySDK from "./OpenTelemetry";

const app: ExpressApplication = Express.getExpressApp();

app.disable('x-powered-by');
app.set('port', process.env['PORT']);
app.set('view engine', 'ejs');

const jsonBodyParserMiddleware = ExpressJson({ limit: '50mb', extended: true }); // 50 MB limit.

const urlEncodedMiddleware = ExpressUrlEncoded({ limit: '50mb', extended: true }); // 50 MB limit.

const logRequest: RequestHandler = (
    req: ExpressRequest,
    _res: ExpressResponse,
    next: NextFunction
): void => {
    (req as OneUptimeRequest).id = ObjectID.generate();
    (req as OneUptimeRequest).requestStartedAt = OneUptimeDate.getCurrentDate();

    const method: string = req.method;
    const url: string = req.url;

    const header_info: string = `Request ID: ${(req as OneUptimeRequest).id
        } -- POD NAME: ${process.env['POD_NAME'] || 'NONE'
        } -- METHOD: ${method} -- URL: ${url.toString()}`;

    const body_info: string = `Request ID: ${(req as OneUptimeRequest).id
        } -- Request Body: ${req.body ? JSON.stringify(req.body, null, 2) : 'EMPTY'
        }`;

    logger.info(header_info + '\n ' + body_info);
    next();
};

const setDefaultHeaders: RequestHandler = (
    req: ExpressRequest,
    res: ExpressResponse,
    next: NextFunction
): void => {

    if (typeof req.body === Typeof.String) {
        req.body = JSONFunctions.parse(req.body);
    }
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Origin', req.headers['origin']);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header(
        'Access-Control-Allow-Headers',
        'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept,Authorization'
    );

    next();
};

app.use(cors());
app.use(setDefaultHeaders);

/*
 * Add limit of 10 MB to avoid "Request Entity too large error"
 * https://stackoverflow.com/questions/19917401/error-request-entity-too-large
 */

app.use(function (req, res, next) {
    if (req.headers['content-encoding'] === 'gzip') {
        // var gunzip = zlib.createGunzip();
        // req.pipe(gunzip);
        // var buffer: any = [];
        // gunzip.on('data', function (data) {
        //     buffer.push(data.toString());
        // }).on('end', function () {
        //     req.body = buffer.join('');
        //     next();
        // }).on('error', function (e) {
        //     next(e);
        // });
        next();
    } else {
        jsonBodyParserMiddleware(req, res, next);
    }
});

app.use(function (req, res, next) {
    
    if (req.headers['content-encoding'] === 'gzip') {
        next();
    } else {
        urlEncodedMiddleware(req, res, next);
    }
});


app.use(logRequest);

const init: Function = async (
    appName: string,
    port?: Port,
    isFrontendApp?: boolean
): Promise<ExpressApplication> => {
    logger.info(`App Version: ${AppVersion.toString()}`);

    await Express.launchApplication(appName, port);
    LocalCache.setString('app', 'name', appName);
    CommonAPI(appName);

    if (isFrontendApp) {
        app.use(ExpressStatic('/usr/src/app/public'));

        app.get(
            [`/${appName}/env.js`, '/env.js'],
            async (req: ExpressRequest, res: ExpressResponse) => {
                // ping api server for database config.

                const databaseConfig:
                    | HTTPResponse<JSONObject>
                    | HTTPErrorResponse = await API.get<JSONObject>(
                        URL.fromString(
                            `http://${DashboardApiHostname}/${DashboardApiRoute}/global-config/vars`
                        )
                    );

                if (databaseConfig instanceof HTTPErrorResponse) {
                    // error getting database config.
                    return Response.sendErrorResponse(
                        req,
                        res,
                        new ServerException('Error getting database config.')
                    );
                }

                const env: JSONObject = {
                    ...process.env,
                    ...databaseConfig.data,
                };

                const script: string = `
    if(!window.process){
      window.process = {}
    }

    if(!window.process.env){
      window.process.env = {}
    }
    const envVars = '${JSON.stringify(env)}';
    window.process.env = JSON.parse(envVars);
  `;

                Response.sendJavaScriptResponse(req, res, script);
            }
        );

        app.use(`/${appName}`, ExpressStatic('/usr/src/app/public'));

        app.get(
            `/${appName}/dist/bundle.js`,
            (_req: ExpressRequest, res: ExpressResponse) => {
                res.sendFile('/usr/src/app/public/dist/bundle.js');
            }
        );

        app.get('/*', (_req: ExpressRequest, res: ExpressResponse) => {
            res.sendFile('/usr/src/app/public/index.html');
        });
    }

    // Attach Error Handler.
    app.use(
        (
            err: Error | Exception,
            _req: ExpressRequest,
            res: ExpressResponse,
            next: NextFunction
        ) => {
            logger.error(err);

            if (res.headersSent) {
                return next(err);
            }

            if (err instanceof Promise) {
                err.catch((exception: Exception) => {
                    if (
                        StatusCode.isValidStatusCode(
                            (exception as Exception).code
                        )
                    ) {
                        res.status((exception as Exception).code);
                        res.send({ error: (exception as Exception).message });
                    } else {
                        res.status(500);
                        res.send({ error: 'Server Error' });
                    }
                });
            } else if (err instanceof Exception) {
                res.status((err as Exception).code);
                res.send({ error: (err as Exception).message });
            } else {
                res.status(500);
                res.send({ error: 'Server Error' });
            }
        }
    );

    app.post('*', (req: ExpressRequest, res: ExpressResponse) => {
        return Response.sendErrorResponse(
            req,
            res,
            new NotFoundException('Not found')
        );
    });

    app.put('*', (req: ExpressRequest, res: ExpressResponse) => {
        return Response.sendErrorResponse(
            req,
            res,
            new NotFoundException('Not found')
        );
    });

    app.delete('*', (req: ExpressRequest, res: ExpressResponse) => {
        return Response.sendErrorResponse(
            req,
            res,
            new NotFoundException('Not found')
        );
    });

    app.get('*', (req: ExpressRequest, res: ExpressResponse) => {
        return Response.sendErrorResponse(
            req,
            res,
            new NotFoundException('Not found')
        );
    });

    // await OpenTelemetrySDK.start();

    return app;
};

export default init;

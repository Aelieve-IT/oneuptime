import {
    ExpressRequest,
    ExpressResponse,
    ExpressStatic,
} from 'common-server/Utils/Express';

import app from 'common-server/utils/StartServer';

import path from 'path';

import HTTPTestServerResponse from './types/HttpTestServerResponse';
import ResponseType from 'common/types/api/ResponseType';

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(ExpressStatic('public'));

app.use(require('./api/settings'));
app.use(require('./api/webhooks'));

app.get('/', (_req: ExpressRequest, res: ExpressResponse) => {
    res.status(HTTPTestServerResponse.statusCode.toNumber());
    const header = HTTPTestServerResponse.headers;

    for (const key in header) {
        res.setHeader(key, header[key] as string);
    }

    setTimeout(function () {
        if (HTTPTestServerResponse.responseType === ResponseType.HTML) {
            res.setHeader('Content-Type', 'text/html');
            return res.send(HTTPTestServerResponse.htmlBody);
        } else {
            res.setHeader('Content-Type', 'application/json');
            return res.send(HTTPTestServerResponse.jsonBody);
        }
    }, HTTPTestServerResponse.responseTime.toNumber());
});

app.use('/*', (_req: ExpressRequest, res: ExpressResponse) => {
    res.status(404).render('notFound.ejs', {});
});
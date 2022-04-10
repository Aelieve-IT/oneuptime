import {
    ExpressRequest,
    ExpressResponse,
    ExpressStatic,
} from 'common-server/Utils/Express';

import app from 'common-server/utils/StartServer';

import path from 'path';

// set the view engine to ejs
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// public static files
app.use(ExpressStatic(path.join(__dirname, 'public'), { maxAge: 2592000 }));

app.use(
    '/docs',
    ExpressStatic(path.join(__dirname, 'public'), { maxAge: 2592000 })
);

// index page
app.get(['/', '/docs'], (_req: ExpressRequest, res: ExpressResponse) => {
    res.render('pages/index');
});

export default app;
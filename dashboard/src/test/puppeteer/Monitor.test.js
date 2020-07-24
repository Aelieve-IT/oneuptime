const puppeteer = require('puppeteer');
const utils = require('./test-utils');
const init = require('./test-init');
const { Cluster } = require('puppeteer-cluster');

require('should');

// user credentials
const email = utils.generateRandomBusinessEmail();
const password = '1234567890';
const callSchedule = utils.generateRandomString();
const testServerMonitorName = utils.generateRandomString();

describe('Monitor API', () => {
    const operationTimeOut = 500000;

    let cluster;

    beforeAll(async () => {
        jest.setTimeout(500000);

        cluster = await Cluster.launch({
            concurrency: Cluster.CONCURRENCY_PAGE,
            puppeteerOptions: utils.puppeteerLaunchConfig,
            puppeteer,
            timeout: utils.timeout,
        });

        cluster.on('taskerror', err => {
            throw err;
        });

        return await cluster.execute(null, async ({ page }) => {
            const user = {
                email,
                password,
            };
            await init.registerUser(user, page);
            await init.loginUser(user, page);
            await init.addSchedule(callSchedule, page);
        });
    });

    afterAll(async () => {
        await cluster.idle();
        await cluster.close();
    });

    const componentName = utils.generateRandomString();
    const monitorName = utils.generateRandomString();
    const callScheduleMonitorName = utils.generateRandomString();

    test(
        'Should create new monitor with correct details',
        async () => {
            return await cluster.execute(null, async ({ page }) => {
                // Create Component first
                // Redirects automatically component to details page
                await init.addComponent(componentName, page);

                await page.waitForSelector('#form-new-monitor');
                await page.click('input[id=name]');
                await page.type('input[id=name]', monitorName);
                await init.selectByText('#type', 'url', page);
                await page.waitForSelector('#url');
                await page.click('#url');
                await page.type('#url', 'https://google.com');
                await page.click('button[type=submit]');

                let spanElement = await page.waitForSelector(
                    `#monitor-title-${monitorName}`
                );
                spanElement = await spanElement.getProperty('innerText');
                spanElement = await spanElement.jsonValue();
                spanElement.should.be.exactly(monitorName);
            });
        },
        operationTimeOut
    );

    test(
        'should display lighthouse scores',
        async () => {
            return await cluster.execute(null, async ({ page }) => {
                // Navigate to Component details
                await init.navigateToMonitorDetails(
                    componentName,
                    monitorName,
                    page
                );

                await page.waitFor(280000);

                let lighthousePerformanceElement = await page.waitForSelector(
                    `#lighthouse-performance-${monitorName}`
                );
                lighthousePerformanceElement = await lighthousePerformanceElement.getProperty(
                    'innerText'
                );
                lighthousePerformanceElement = await lighthousePerformanceElement.jsonValue();
                lighthousePerformanceElement.should.endWith('%');

                let lighthouseAccessibilityElement = await page.waitForSelector(
                    `#lighthouse-accessibility-${monitorName}`
                );
                lighthouseAccessibilityElement = await lighthouseAccessibilityElement.getProperty(
                    'innerText'
                );
                lighthouseAccessibilityElement = await lighthouseAccessibilityElement.jsonValue();
                lighthouseAccessibilityElement.should.endWith('%');

                let lighthouseBestPracticesElement = await page.waitForSelector(
                    `#lighthouse-bestPractices-${monitorName}`
                );
                lighthouseBestPracticesElement = await lighthouseBestPracticesElement.getProperty(
                    'innerText'
                );
                lighthouseBestPracticesElement = await lighthouseBestPracticesElement.jsonValue();
                lighthouseBestPracticesElement.should.endWith('%');

                let lighthouseSeoElement = await page.waitForSelector(
                    `#lighthouse-seo-${monitorName}`
                );
                lighthouseSeoElement = await lighthouseSeoElement.getProperty(
                    'innerText'
                );
                lighthouseSeoElement = await lighthouseSeoElement.jsonValue();
                lighthouseSeoElement.should.endWith('%');

                let lighthousePwaElement = await page.waitForSelector(
                    `#lighthouse-pwa-${monitorName}`
                );
                lighthousePwaElement = await lighthousePwaElement.getProperty(
                    'innerText'
                );
                lighthousePwaElement = await lighthousePwaElement.jsonValue();
                lighthousePwaElement.should.endWith('%');
            });
        },
        operationTimeOut
    );

    test(
        'should display multiple probes and monitor chart on refresh',
        async () => {
            return await cluster.execute(null, async ({ page }) => {
                // Navigate to Component details
                await init.navigateToComponentDetails(componentName, page);

                await page.reload({
                    waitUntil: ['networkidle0', 'domcontentloaded'],
                });

                const probe0 = await page.waitForSelector('#probes-btn0');
                const probe1 = await page.waitForSelector('#probes-btn1');

                expect(probe0).toBeDefined();
                expect(probe1).toBeDefined();

                const monitorStatus = await page.waitForSelector(
                    `#monitor-status-${monitorName}`
                );
                const sslStatus = await page.waitForSelector(
                    `#ssl-status-${monitorName}`
                );

                expect(monitorStatus).toBeDefined();
                expect(sslStatus).toBeDefined();
            });
        },
        operationTimeOut
    );

    test(
        'Should create new monitor with call schedule',
        async () => {
            return await cluster.execute(null, async ({ page }) => {
                // Navigate to Component details
                await init.navigateToComponentDetails(componentName, page);

                await page.waitForSelector('#form-new-monitor');
                await page.waitForSelector('#name');
                await page.click('input[id=name]');
                await page.type('input[id=name]', callScheduleMonitorName);
                await init.selectByText('#type', 'url', page);
                await init.selectByText('#callSchedule', callSchedule, page);
                await page.waitForSelector('#url');
                await page.type('#url', 'https://google.com');
                await page.click('button[type=submit]');

                let spanElement = await page.waitForSelector(
                    `#monitor-title-${callScheduleMonitorName}`
                );
                spanElement = await spanElement.getProperty('innerText');
                spanElement = await spanElement.jsonValue();
                spanElement.should.be.exactly(callScheduleMonitorName);
            });
        },
        operationTimeOut
    );

    test(
        'Should not create new monitor when details are incorrect',
        async () => {
            return await cluster.execute(null, async ({ page }) => {
                // Navigate to Component details
                await init.navigateToComponentDetails(componentName, page);

                // await page.waitForSelector('#monitors');
                // await page.click('#monitors');
                await page.waitForSelector('#form-new-monitor');
                await page.waitForSelector('#name');
                await init.selectByText('#type', 'url', page);
                await page.waitForSelector('#url');
                await page.type('#url', 'https://google.com');
                await page.click('button[type=submit]');

                let spanElement = await page.waitForSelector(
                    '#form-new-monitor span#field-error'
                );
                spanElement = await spanElement.getProperty('innerText');
                spanElement = await spanElement.jsonValue();
                spanElement.should.be.exactly(
                    'This field cannot be left blank'
                );
            });
        },
        operationTimeOut
    );

    test(
        'should display SSL enabled status',
        async () => {
            return await cluster.execute(null, async ({ page }) => {
                // Navigate to Component details
                await init.navigateToComponentDetails(componentName, page);

                await page.waitFor(10000);

                let sslStatusElement = await page.waitForSelector(
                    `#ssl-status-${monitorName}`,
                    { visible: true }
                );
                sslStatusElement = await sslStatusElement.getProperty(
                    'innerText'
                );
                sslStatusElement = await sslStatusElement.jsonValue();
                sslStatusElement.should.be.exactly('Enabled');
            });
        },
        operationTimeOut
    );

    test(
        'should display SSL not found status',
        async () => {
            return await cluster.execute(null, async ({ page }) => {
                // Navigate to Component details
                await init.navigateToComponentDetails(componentName, page);

                await page.waitForSelector('#form-new-monitor');
                await page.click('input[id=name]');
                await page.type('input[id=name]', testServerMonitorName);
                await init.selectByText('#type', 'url', page);
                await page.waitForSelector('#url');
                await page.click('#url');
                await page.type('#url', utils.HTTP_TEST_SERVER_URL);
                await page.click('button[type=submit]');
                await page.waitFor(280000);

                let sslStatusElement = await page.waitForSelector(
                    `#ssl-status-${testServerMonitorName}`,
                    { visible: true }
                );
                sslStatusElement = await sslStatusElement.getProperty(
                    'innerText'
                );
                sslStatusElement = await sslStatusElement.jsonValue();
                sslStatusElement.should.be.exactly('No SSL Found');
            });
        },
        operationTimeOut
    );

    test(
        'should display SSL self-signed status',
        async () => {
            const selfSignedMonitorName = utils.generateRandomString();

            return await cluster.execute(null, async ({ page }) => {
                // Navigate to Component details
                await init.navigateToComponentDetails(componentName, page);

                await page.waitForSelector('#form-new-monitor');
                await page.click('input[id=name]');
                await page.type('input[id=name]', selfSignedMonitorName);
                await init.selectByText('#type', 'url', page);
                await page.waitForSelector('#url');
                await page.click('#url');
                await page.type('#url', 'https://self-signed.badssl.com');
                await page.click('button[type=submit]');
                await page.waitFor(280000);

                let sslStatusElement = await page.waitForSelector(
                    `#ssl-status-${selfSignedMonitorName}`,
                    { visible: true }
                );
                sslStatusElement = await sslStatusElement.getProperty(
                    'innerText'
                );
                sslStatusElement = await sslStatusElement.jsonValue();
                sslStatusElement.should.be.exactly('Self Signed');
            });
        },
        operationTimeOut
    );

    test(
        'should display monitor status online for monitor with large response header',
        async () => {
            const bodyText = utils.generateRandomString();

            const testServer = async ({ page }) => {
                await page.goto(utils.HTTP_TEST_SERVER_URL + '/settings');
                await page.evaluate(
                    () => (document.getElementById('responseTime').value = '')
                );
                await page.evaluate(
                    () => (document.getElementById('statusCode').value = '')
                );
                await page.evaluate(
                    () => (document.getElementById('header').value = '')
                );
                await page.evaluate(
                    () => (document.getElementById('body').value = '')
                );
                await page.waitForSelector('#responseTime');
                await page.click('input[name=responseTime]');
                await page.type('input[name=responseTime]', '0');
                await page.waitForSelector('#statusCode');
                await page.click('input[name=statusCode]');
                await page.type('input[name=statusCode]', '200');
                await page.select('#responseType', 'html');
                await page.waitForSelector('#header');
                await page.click('textarea[name=header]');
                await page.type(
                    'textarea[name=header]',
                    `{
                        "Connection": "keep-alive",
                        "Content-Security-Policy": "script-src 'self' https://www.gstatic.cn *.acceleratoradmin.com *.adpclientappreciation.com *.lincolnelectricdigitalrewards.com *.boschappliancedigitalrewards.com *.prepaiddigitalsolutions.com *.purestoragedigitalrewards.com *.prepaiddigitalsolutions.com *.purestoragedigitalrewards.com *.thermadorappliancedigitalrewards.com *.tranedigitalrewards.com *.americanstandardairdigitalrewards.com *.myacuvuedigitalrewards.com *.attrecognition.com *.coopervisiondigitalrewards.com *.allglobalcircle-rewards.com *.habcard.com *.minimotoringredemption.com *.minimotoringrewardsredemption.com *.ultimaterewardsredemption.com *.mystarzrewards.com *.e-rewardsmedicalrewards.com *.recognizingyourewards.com *.kelloggsdigitalrewards.ca *.valvolinedigitalrewards.com *.goodyeardigitalrewards.com *.alconchoicepayments.com *.geappliancesdigitalrewards.com *.topcashbackdigitalsolutions.com *.topcashbackdigitalsolutions.co.uk *.prosper2card.co.uk *.ppdslab.com *.cooperdigitalrewards.com *.tranedigitalrewards.com https://cdn.datatables.net https://www.google-analytics.com https://www.recaptcha.net https://ajax.aspnetcdn.com https://stackpath.bootstrapcdn.com https://cdnjs.cloudflare.com https://maxcdn.bootstrapcdn.com *.google.com *.googletagmanager.com https://www.gstatic.com https://ajax.googleapis.com https://*.msecnd.net *.acceleratoradmin.com *.mxpnl.com *.greencompasspay.com *.360digitalpayments.com *.adpclientappreciation.com *.alconchoicepayments.com *.allglobalcircle-rewards.com *.americanstandardairdigitalrewards.com *.attrecognition.com *.bittyadvancecard.com *.bmwrebateredemption.com *.bmwultimaterewardsredemption.com *.boschappliancedigitalrewards.com *.cbdatsbypay.com *.ceomovementpay.com *.cooperdigitalrewards.com *.coopervisiondigitalrewards.com *.digitalwalletdemo.com *.emrispay.com *.e-rewardsmedicalrewards.com *.expectationsrewards.co.uk *.ferrerorecognition.com *.fundkitecard.com *.geappliancesdigitalrewards.com *.gettogether-pjlibraryrewards.org *.goodyeardigitalrewards.com *.greencompasspay.com *.guustodigitalrewards.com *.habcard.com *.healthyhempfarmspay.com *.honey20pay.com *.hoolalifepay.com *.kelloggsdigitalrewards.ca *.leafywellpay.com *.lincolnelectricdigitalrewards.com *.minimotoringredemption.com *.minimotoringrewardsredemption.com *.minirebateredemption.com *.myacuvuedigitalrewards.com *.mygocardspay.com *.myrevealpay.com *.my-rewardcard.com *.mystarzrewards.com *.natureancepay.com *.NNAPartsDigitalRewards.com *.noble8pay.com *.onelogicmoney.com *.perksatworkcard.com *.ppdslab.com *.ppdslabautomation.com *.prepaiddigitalsolutions.com *.prosper2card.co.uk *.purestoragedigitalrewards.com *.pyurlifepay.com *.recognizingyourewards.com *.redgagedirect.com *.sanctuarygirlpay.com *.swiftimplementations.com *.thermadorappliancedigitalrewards.com *.tirestorerewards.com *.topcashbackdigitalsolutions.co.uk *.topcashbackdigitalsolutions.com *.tranedigitalrewards.com *.ultimaterewardsredemption.com *.uulalacard.com *.valvolinedigitalrewards.com *.vsponeprepaidcard.com *.wealthbuilderpay.com *.worldpaymerchantrewards.com *.yourrewardpass.com topcashbackdigitalsolutions.co.uk https://cdn.highimpactpayments.com 'unsafe-inline';style-src 'self' cdn.highimpactpayments.com *.acceleratoradmin.com *.adpclientappreciation.com *.lincolnelectricdigitalrewards.com *.boschappliancedigitalrewards.com *.prepaiddigitalsolutions.com *.purestoragedigitalrewards.com *.prepaiddigitalsolutions.com *.purestoragedigitalrewards.com *.thermadorappliancedigitalrewards.com *.tranedigitalrewards.com *.americanstandardairdigitalrewards.com *.myacuvuedigitalrewards.com *.attrecognition.com *.coopervisiondigitalrewards.com *.allglobalcircle-rewards.com *.habcard.com *.minimotoringredemption.com *.minimotoringrewardsredemption.com *.ultimaterewardsredemption.com *.mystarzrewards.com *.e-rewardsmedicalrewards.com *.recognizingyourewards.com *.kelloggsdigitalrewards.ca *.valvolinedigitalrewards.com *.goodyeardigitalrewards.com *.alconchoicepayments.com *.geappliancesdigitalrewards.com *.topcashbackdigitalsolutions.com *.topcashbackdigitalsolutions.co.uk *.prosper2card.co.uk *.ppdslab.com *.cooperdigitalrewards.com *.tranedigitalrewards.com https://cdn.datatables.net https://ajax.aspnetcdn.com https://maxcdn.bootstrapcdn.com https://cdnjs.cloudflare.com https://stackpath.bootstrapcdn.com *.greencompasspay.com *.360digitalpayments.com *.adpclientappreciation.com *.alconchoicepayments.com *.allglobalcircle-rewards.com *.americanstandardairdigitalrewards.com *.attrecognition.com *.bittyadvancecard.com *.bmwrebateredemption.com *.bmwultimaterewardsredemption.com *.boschappliancedigitalrewards.com *.cbdatsbypay.com *.ceomovementpay.com *.cooperdigitalrewards.com *.coopervisiondigitalrewards.com *.digitalwalletdemo.com *.emrispay.com *.e-rewardsmedicalrewards.com *.expectationsrewards.co.uk *.ferrerorecognition.com *.fundkitecard.com *.geappliancesdigitalrewards.com *.gettogether-pjlibraryrewards.org *.goodyeardigitalrewards.com *.greencompasspay.com *.guustodigitalrewards.com *.habcard.com *.healthyhempfarmspay.com *.honey20pay.com *.hoolalifepay.com *.kelloggsdigitalrewards.ca *.leafywellpay.com *.lincolnelectricdigitalrewards.com *.minimotoringredemption.com *.minimotoringrewardsredemption.com *.minirebateredemption.com *.myacuvuedigitalrewards.com *.mygocardspay.com *.myrevealpay.com *.my-rewardcard.com *.mystarzrewards.com *.natureancepay.com *.NNAPartsDigitalRewards.com *.noble8pay.com *.onelogicmoney.com *.perksatworkcard.com *.ppdslab.com *.ppdslabautomation.com *.prepaiddigitalsolutions.com *.prosper2card.co.uk *.purestoragedigitalrewards.com *.pyurlifepay.com *.recognizingyourewards.com *.redgagedirect.com *.sanctuarygirlpay.com *.swiftimplementations.com *.thermadorappliancedigitalrewards.com *.tirestorerewards.com *.topcashbackdigitalsolutions.co.uk *.topcashbackdigitalsolutions.com *.tranedigitalrewards.com *.ultimaterewardsredemption.com *.uulalacard.com *.valvolinedigitalrewards.com *.vsponeprepaidcard.com *.wealthbuilderpay.com *.worldpaymerchantrewards.com *.yourrewardpass.com topcashbackdigitalsolutions.co.uk https://cdn.highimpactpayments.com 'unsafe-inline';connect-src 'self' *.acceleratoradmin.com *.adpclientappreciation.com *.lincolnelectricdigitalrewards.com *.boschappliancedigitalrewards.com *.prepaiddigitalsolutions.com *.purestoragedigitalrewards.com *.prepaiddigitalsolutions.com *.purestoragedigitalrewards.com *.thermadorappliancedigitalrewards.com *.tranedigitalrewards.com *.americanstandardairdigitalrewards.com *.myacuvuedigitalrewards.com *.attrecognition.com *.coopervisiondigitalrewards.com *.allglobalcircle-rewards.com *.habcard.com *.minimotoringredemption.com *.minimotoringrewardsredemption.com *.ultimaterewardsredemption.com *.mystarzrewards.com *.e-rewardsmedicalrewards.com *.recognizingyourewards.com *.kelloggsdigitalrewards.ca *.valvolinedigitalrewards.com *.goodyeardigitalrewards.com *.alconchoicepayments.com *.geappliancesdigitalrewards.com *.topcashbackdigitalsolutions.com *.topcashbackdigitalsolutions.co.uk *.prosper2card.co.uk *.ppdslab.com *.cooperdigitalrewards.com https://www.google-analytics.com *.visualstudio.com *.acceleratoradmin.com api.mixpanel.com *.greencompasspay.com *.360digitalpayments.com *.adpclientappreciation.com *.alconchoicepayments.com *.allglobalcircle-rewards.com *.americanstandardairdigitalrewards.com *.attrecognition.com *.bittyadvancecard.com *.bmwrebateredemption.com *.bmwultimaterewardsredemption.com *.boschappliancedigitalrewards.com *.cbdatsbypay.com *.ceomovementpay.com *.cooperdigitalrewards.com *.coopervisiondigitalrewards.com *.digitalwalletdemo.com *.emrispay.com *.e-rewardsmedicalrewards.com *.expectationsrewards.co.uk *.ferrerorecognition.com *.fundkitecard.com *.geappliancesdigitalrewards.com *.gettogether-pjlibraryrewards.org *.goodyeardigitalrewards.com *.greencompasspay.com *.guustodigitalrewards.com *.habcard.com *.healthyhempfarmspay.com *.honey20pay.com *.hoolalifepay.com *.kelloggsdigitalrewards.ca *.leafywellpay.com *.lincolnelectricdigitalrewards.com *.minimotoringredemption.com *.minimotoringrewardsredemption.com *.minirebateredemption.com *.myacuvuedigitalrewards.com *.mygocardspay.com *.myrevealpay.com *.my-rewardcard.com *.mystarzrewards.com *.natureancepay.com *.NNAPartsDigitalRewards.com *.noble8pay.com *.onelogicmoney.com *.perksatworkcard.com *.ppdslab.com *.ppdslabautomation.com *.prepaiddigitalsolutions.com *.prosper2card.co.uk *.purestoragedigitalrewards.com *.pyurlifepay.com *.recognizingyourewards.com *.redgagedirect.com *.sanctuarygirlpay.com *.swiftimplementations.com *.thermadorappliancedigitalrewards.com *.tirestorerewards.com *.topcashbackdigitalsolutions.co.uk *.topcashbackdigitalsolutions.com *.tranedigitalrewards.com *.ultimaterewardsredemption.com *.uulalacard.com *.valvolinedigitalrewards.com *.vsponeprepaidcard.com *.wealthbuilderpay.com *.worldpaymerchantrewards.com *.yourrewardpass.com topcashbackdigitalsolutions.co.uk https://api-js.mixpanel.com api-js.mixpanel.com api-js.mixpanel.com https://cdn.highimpactpayments.com;font-src 'self' cdn.highimpactpayments.com https://ajax.aspnetcdn.com *.tranedigitalrewards.com maxcdn.bootstrapcdn.com cdnjs.cloudflare.com *.acceleratoradmin.com https://cdn.highimpactpayments.com;img-src 'self' cdn.highimpactpayments.com https://cdnjs.cloudflare.com https://www.google-analytics.com *.acceleratoradmin.com data: data: https://cdn.highimpactpayments.com;frame-src 'self' https://www.recaptcha.net/ https://www.google.com *.acceleratoradmin.com *.adpclientappreciation.com *.lincolnelectricdigitalrewards.com *.boschappliancedigitalrewards.com *.prepaiddigitalsolutions.com *.purestoragedigitalrewards.com *.prepaiddigitalsolutions.com *.purestoragedigitalrewards.com *.thermadorappliancedigitalrewards.com *.tranedigitalrewards.com *.americanstandardairdigitalrewards.com *.myacuvuedigitalrewards.com *.attrecognition.com *.coopervisiondigitalrewards.com *.allglobalcircle-rewards.com *.habcard.com *.minimotoringredemption.com *.minimotoringrewardsredemption.com *.ultimaterewardsredemption.com *.mystarzrewards.com *.e-rewardsmedicalrewards.com *.recognizingyourewards.com *.kelloggsdigitalrewards.ca *.valvolinedigitalrewards.com *.goodyeardigitalrewards.com *.alconchoicepayments.com *.geappliancesdigitalrewards.com *.topcashbackdigitalsolutions.com *.topcashbackdigitalsolutions.co.uk *.prosper2card.co.uk *.ppdslab.com *.cooperdigitalrewards.com *.youtube.com https://youtu.be https://testcommon.swiftprepaid.com https://common.swiftprepaid.com *.greencompasspay.com *.360digitalpayments.com *.adpclientappreciation.com *.alconchoicepayments.com *.allglobalcircle-rewards.com *.americanstandardairdigitalrewards.com *.attrecognition.com *.bittyadvancecard.com *.bmwrebateredemption.com *.bmwultimaterewardsredemption.com *.boschappliancedigitalrewards.com *.cbdatsbypay.com *.ceomovementpay.com *.cooperdigitalrewards.com *.coopervisiondigitalrewards.com *.digitalwalletdemo.com *.emrispay.com *.e-rewardsmedicalrewards.com *.expectationsrewards.co.uk *.ferrerorecognition.com *.fundkitecard.com *.geappliancesdigitalrewards.com *.gettogether-pjlibraryrewards.org *.goodyeardigitalrewards.com *.greencompasspay.com *.guustodigitalrewards.com *.habcard.com *.healthyhempfarmspay.com *.honey20pay.com *.hoolalifepay.com *.kelloggsdigitalrewards.ca *.leafywellpay.com *.lincolnelectricdigitalrewards.com *.minimotoringredemption.com *.minimotoringrewardsredemption.com *.minirebateredemption.com *.myacuvuedigitalrewards.com *.mygocardspay.com *.myrevealpay.com *.my-rewardcard.com *.mystarzrewards.com *.natureancepay.com *.NNAPartsDigitalRewards.com *.noble8pay.com *.onelogicmoney.com *.perksatworkcard.com *.ppdslab.com *.ppdslabautomation.com *.prepaiddigitalsolutions.com *.prosper2card.co.uk *.purestoragedigitalrewards.com *.pyurlifepay.com *.recognizingyourewards.com *.redgagedirect.com *.sanctuarygirlpay.com *.swiftimplementations.com *.thermadorappliancedigitalrewards.com *.tirestorerewards.com *.topcashbackdigitalsolutions.co.uk *.topcashbackdigitalsolutions.com *.tranedigitalrewards.com *.ultimaterewardsredemption.com *.uulalacard.com *.valvolinedigitalrewards.com *.vsponeprepaidcard.com *.wealthbuilderpay.com *.worldpaymerchantrewards.com *.yourrewardpass.com topcashbackdigitalsolutions.co.uk https://cdn.highimpactpayments.com",
                        "Pragma": "no-cache",
                        "Referrer-Policy": "strict-origin",
                        "Request-Context": "appId=cid-v1:f6c2aaf9-503c-4efd-b90b-010255daaa8d",
                        "Server": "Kestrel",
                        "Set-Cookie": ".AspNetCore.Mvc.CookieTempDataProvider=CfDJ8PriW8VpBIRPo51qMDgzq4Zj6vj_43mJxcKilJDLtxRtiYklbJPut5ndVVaj-W2WxhDuIe_2Dkx7sOkynLl3nnpF6DKN4pag_TA6YEUVrZaCML2yvy6tF_W0x9IDY0gt6ng3DIaVEKo3M0FICa3tw_oeDMlxOjYNmfoj06IHR0kK; path=/; samesite=lax; httponly",
                        "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
                        "Vary": "Accept-Encoding",
                        "X-Content-Type-Options": "nosniff",
                        "X-Frame-Options": "SAMEORIGIN",
                        "X-Permitted-Cross-Domain-Policies": "None",
                        "X-XSS-Protection": "1; mode=block"
                    }`
                );
                await page.waitForSelector('#body');
                await page.click('textarea[name=body]');
                await page.type(
                    'textarea[name=body]',
                    `<h1 id="html"><span>${bodyText}</span></h1>`
                );
                await page.click('button[type=submit]');
                await page.waitForSelector('#save-btn');
            };

            const dashboard = async ({ page }) => {
                // Navigate to Component details
                await init.navigateToComponentDetails(componentName, page);
                await page.waitFor(280000);

                let monitorStatusElement = await page.waitForSelector(
                    `#monitor-status-${testServerMonitorName}`,
                    { visible: true }
                );
                monitorStatusElement = await monitorStatusElement.getProperty(
                    'innerText'
                );
                monitorStatusElement = await monitorStatusElement.jsonValue();
                monitorStatusElement.should.be.exactly('Online');
            };

            await cluster.execute(null, testServer);
            await cluster.execute(null, dashboard);
        },
        operationTimeOut
    );

    test(
        'should degrade (not timeout and return status code 408) monitor with response time longer than 60000ms and status code 200',
        async () => {
            const bodyText = utils.generateRandomString();

            const testServer = async ({ page }) => {
                await page.goto(utils.HTTP_TEST_SERVER_URL + '/settings');
                await page.evaluate(
                    () => (document.getElementById('responseTime').value = '')
                );
                await page.evaluate(
                    () => (document.getElementById('statusCode').value = '')
                );
                await page.evaluate(
                    () => (document.getElementById('header').value = '{}')
                );
                await page.evaluate(
                    () => (document.getElementById('body').value = '')
                );
                await page.waitForSelector('#responseTime');
                await page.click('input[name=responseTime]');
                await page.type('input[name=responseTime]', '60000');
                await page.waitForSelector('#statusCode');
                await page.click('input[name=statusCode]');
                await page.type('input[name=statusCode]', '200');
                await page.select('#responseType', 'html');
                await page.waitForSelector('#body');
                await page.click('textarea[name=body]');
                await page.type(
                    'textarea[name=body]',
                    `<h1 id="html"><span>${bodyText}</span></h1>`
                );
                await page.click('button[type=submit]');
                await page.waitForSelector('#save-btn');
            };

            const dashboard = async ({ page }) => {
                // Navigate to Component details
                await init.navigateToComponentDetails(componentName, page);
                await page.waitFor(280000);

                let monitorStatusElement = await page.waitForSelector(
                    `#monitor-status-${testServerMonitorName}`,
                    { visible: true }
                );
                monitorStatusElement = await monitorStatusElement.getProperty(
                    'innerText'
                );
                monitorStatusElement = await monitorStatusElement.jsonValue();
                monitorStatusElement.should.be.exactly('Degraded');
            };

            await cluster.execute(null, testServer);
            await cluster.execute(null, dashboard);
        },
        operationTimeOut
    );
});

describe('API Monitor API', () => {
    const operationTimeOut = 500000;

    let cluster;

    beforeAll(async () => {
        jest.setTimeout(500000);

        cluster = await Cluster.launch({
            concurrency: Cluster.CONCURRENCY_PAGE,
            puppeteerOptions: utils.puppeteerLaunchConfig,
            puppeteer,
            timeout: utils.timeout,
        });

        cluster.on('taskerror', err => {
            throw err;
        });

        const testServer = async ({ page }) => {
            await page.goto(utils.HTTP_TEST_SERVER_URL + '/settings');
            await page.evaluate(
                () => (document.getElementById('responseTime').value = '')
            );
            await page.evaluate(
                () => (document.getElementById('statusCode').value = '')
            );
            await page.evaluate(
                () => (document.getElementById('header').value = '')
            );
            await page.evaluate(
                () => (document.getElementById('body').value = '')
            );
            await page.waitForSelector('#responseTime');
            await page.click('input[name=responseTime]');
            await page.type('input[name=responseTime]', '0');
            await page.waitForSelector('#statusCode');
            await page.click('input[name=statusCode]');
            await page.type('input[name=statusCode]', '200');
            await page.select('#responseType', 'json');
            await page.waitForSelector('#header');
            await page.click('textarea[name=header]');
            await page.type(
                'textarea[name=header]',
                '{"Content-Type":"application/json"}'
            );
            await page.waitForSelector('#body');
            await page.click('textarea[name=body]');
            await page.type('textarea[name=body]', '{"status":"ok"}');
            await page.click('button[type=submit]');
            await page.waitForSelector('#save-btn');
        };

        await cluster.execute(null, testServer);

        return await cluster.execute(null, async ({ page }) => {
            const user = {
                email: utils.generateRandomBusinessEmail(),
                password,
            };
            await init.registerUser(user, page);
            await init.loginUser(user, page);
        });
    });

    afterAll(async () => {
        await cluster.idle();
        await cluster.close();
    });

    const componentName = utils.generateRandomString();
    const monitorName = utils.generateRandomString();

    test(
        'should not add API monitor with invalid url',
        async () => {
            return await cluster.execute(null, async ({ page }) => {
                // Create Component first
                // Redirects automatically component to details page
                await init.addComponent(componentName, page);

                await page.waitForSelector('#form-new-monitor');
                await page.click('input[id=name]');
                await page.type('input[id=name]', monitorName);
                await init.selectByText('#type', 'api', page);
                await init.selectByText('#method', 'get', page);
                await page.waitForSelector('#url');
                await page.click('#url');
                await page.type('#url', 'https://google.com');
                await page.click('button[type=submit]');

                let spanElement = await page.waitForSelector(
                    '#formNewMonitorError'
                );
                spanElement = await spanElement.getProperty('innerText');
                spanElement = await spanElement.jsonValue();
                spanElement.should.be.exactly(
                    'Monitor url should not be a website.'
                );
            });
        },
        operationTimeOut
    );

    test(
        'should not add API monitor with invalid payload',
        async () => {
            return await cluster.execute(null, async ({ page }) => {
                // Navigate to Component details
                await init.navigateToComponentDetails(componentName, page);

                await page.waitForSelector('#form-new-monitor');
                await page.click('input[id=name]');
                await page.type('input[id=name]', monitorName);
                await init.selectByText('#type', 'api', page);
                await init.selectByText('#method', 'post', page);
                await page.waitForSelector('#url');
                await page.click('#url');
                await page.type(
                    '#url',
                    'https://fyipe.com/api/monitor/valid-project-id'
                );
                await page.click('button[type=submit]');

                let spanElement = await page.waitForSelector(
                    '#formNewMonitorError'
                );
                spanElement = await spanElement.getProperty('innerText');
                spanElement = await spanElement.jsonValue();
                spanElement.should.be.exactly('Unauthorized');
            });
        },
        operationTimeOut
    );

    test(
        'should add API monitor with valid url and payload',
        async () => {
            return await cluster.execute(null, async ({ page }) => {
                // Navigate to Component details
                await init.navigateToComponentDetails(componentName, page);

                await page.waitForSelector('#form-new-monitor');
                await page.click('input[id=name]');
                await page.type('input[id=name]', monitorName);
                await init.selectByText('#type', 'api', page);
                await init.selectByText('#method', 'get', page);
                await page.waitForSelector('#url');
                await page.click('#url');
                await page.type('#url', utils.HTTP_TEST_SERVER_URL);
                await page.click('button[type=submit]');

                let spanElement = await page.waitForSelector(
                    `#monitor-title-${monitorName}`
                );
                spanElement = await spanElement.getProperty('innerText');
                spanElement = await spanElement.jsonValue();
                spanElement.should.be.exactly(monitorName);
            });
        },
        operationTimeOut
    );

    it(
        'should delete API monitor',
        async () => {
            expect.assertions(1);
            return await cluster.execute(null, async ({ page }) => {
                // Navigate to Monitor details
                await init.navigateToMonitorDetails(
                    componentName,
                    monitorName,
                    page
                );

                const deleteButtonSelector = `#delete_${monitorName}`;
                await page.click(deleteButtonSelector);

                const confirmDeleteButtonSelector = '#deleteMonitor';
                await page.waitForSelector(confirmDeleteButtonSelector);
                await page.click(confirmDeleteButtonSelector);
                await page.waitFor(5000);

                const selector = `span#monitor-title-${monitorName}`;

                const spanElement = await page.$(selector);
                expect(spanElement).toEqual(null);
            });
        },
        operationTimeOut
    );
});

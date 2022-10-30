const delay = require('delay');
const puppeteer = require('puppeteer');

async function runBrowser( argv ) {
    console.log("module runBrowser.js ", argv)

    const browser = await puppeteer.launch({
        defaultViewport: {
            width: 300,
            height: 500,
        },
        dumpio: true, // console.log works within page.evaluate()
        bindAddress: '0.0.0.0',
        args: [
            '--no-sandbox',
            '--headless',
            '--disable-gpu',
            '--disable-dev-shm-usage',
            '--remote-debugging-port=9222',
            '--remote-debugging-address=0.0.0.0',
        ],
    });

    const page = await browser.newPage();

    if (argv.userAgent) await page.setUserAgent(argv.userAgent);

    try {
        // @see https://stackoverflow.com/questions/62852714/pyppeteer-wait-until-all-elements-of-page-is-loaded
        await page.goto(argv.url, {waitUntil: 'domcontentloaded', timeout: 16000});
    } catch(e) {
        log.error(e);
        return '';
    }
    //if (argv.delay) await delay(argv.delay);

    //page.on('console.log', msg => console.log(msg.text()));

    
    let txt = await page.evaluate( argv.evalFunction);

    console.log('browser.txt: ', txt);

    await browser.close();
    return txt;
}


module.exports = { runBrowser }
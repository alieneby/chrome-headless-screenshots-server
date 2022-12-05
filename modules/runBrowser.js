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
        let waitUntil 
            = argv.waitUntil == 'networkidle0' ? 'networkidle0' : 'domcontentloaded';
        
        
        let timeout
            = ( argv.timeout && Number.isInteger(argv.timeout) && argv.timeout < 60000 )  
            ?  argv.timeout 
            : 4000;    

        let gotoParams = { waitUntil: waitUntil, timeout: timeout };
        console.error('gotoParams: ', gotoParams);

        await page.goto(argv.url, gotoParams);

    } catch(e) {
        console.error('Exception page.goto() ', e);
        return '';
    }

    if (argv.delay) {       
        let delaySec = argv.delay < 1000 ? argv.delay : argv.delay / 1000; 
        console.log('');
        console.log('wait ' + delaySec + ' seconds');
        await delay(delaySec * 1000);
        console.log('wait done');
    }

    if (argv.jsString) {       
        console.log('adding: ' + argv.jsString);
        const resultArticle = await page.evaluate(argv.jsString);
        console.log('result: ' + resultArticle);
    }
    //page.on('console.log', msg => console.log(msg.text()));

    
    let txt = await page.evaluate( argv.evalFunction);

    console.log('browser.txt: ', txt);

    await browser.close();
    return txt;
}


module.exports = { runBrowser }
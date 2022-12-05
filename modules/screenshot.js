const delay = require('delay');
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const {imgDirectory, port} = require('../config.js');


const screenshot = async (req, res) => {
    console.log('http params ', req.query);
    let query = req.query || {};
    let basename = query.url || 'noBaseName';
    let width = isIntBetween(query.width, 0, 4000) || 1920;
    let height = isIntBetween(query.height, 0, 4000) || 1080;
    let delay = isIntBetween(query.delay, 0, 10000) || 5000; // milliseconds
    
    let format = ['webp','png','jpeg'].includes(query.format) ? query.format: 'webp';

    basename = basename.replace('https://', '')
        .replace('http://', '')
        .replace(/[^a-zA-Z0-9_-]/g, '');

    console.log('basename', basename);

    await takeScreenshot({
        width: width,
        height: height,
        delay: delay,
        outputDir: imgDirectory,
        filename: basename,
        format: format,
        url: query.url
    });

    let absImg = imgDirectory +  '/' + basename + '.' + format;
    console.log('Image saved ', absImg)
    console.log('Send ', absImg)
    //res.send('Hello World!!!')
    res.sendFile(absImg,
        (err) => {
            if (err) {
                res.status(err.status).end();
            }
            console.log('Delete file ', absImg)
            fs.unlinkSync(absImg);
        }
    );
}

function isIntBetween(str, min, max) {
    if ( ! str ) {
        return false;
    }
    let i = parseInt(str);
    return i==str && i>=min && i<=max ? i : false;
}

async function takeScreenshot(argv) {
    console.log("takeScreenshot ", argv)

    //console.log(`takeScreenshot lunch browser`)
    const browser = await puppeteer.launch({
        defaultViewport: {
            width: argv.width,
            height: argv.height,
        },
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

    if (argv.cookies) {
        let cookies = JSON.parse(argv.cookies);
        if (Array.isArray(cookies)) {
            await page.setCookie(...cookies);
        } else {
            await page.setCookie(cookies);
        }
    }

    if (argv.cookiesFile) {
        let cookies = JSON.parse(
            fs.readFileSync(path.join(argv.inputDir, argv.cookiesFile))
        );
        if (Array.isArray(cookies)) {
            await page.setCookie(...cookies);
        } else {
            await page.setCookie(cookies);
        }
    }

    //console.log(`takeScreenshot call url ${argv.url}`)
    await page.goto(argv.url);

    if (argv.delay) await delay(argv.delay);
    
    //console.log(`takeScreenshot make screenshot ${argv.filename}.${argv.format}`)
    await page.screenshot({
        path: path
            .join(argv.outputDir, argv.filename + '.' + argv.format)
            .toString(),
        type: argv.format,
    });

    //console.log(`takeScreenshot close browser`)
    await browser.close();
}

module.exports = { screenshot }
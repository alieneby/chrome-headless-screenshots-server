const delay = require('delay');
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const {imgDirectory, port} = require('../config.js');

async function heisePlainText(argv) {
    console.log("heise ", argv)

    //console.log(`takeScreenshot lunch browser`)
    const browser = await puppeteer.launch({
        defaultViewport: {
            width: 300,
            height: 500,
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

    try {
        // @see https://stackoverflow.com/questions/62852714/pyppeteer-wait-until-all-elements-of-page-is-loaded
        await page.goto(argv.url, {waitUntil: 'domcontentloaded', timeout: 16000});
    } catch(e) {
        return '';
    }

    //if (argv.delay) await delay(argv.delay);

    page.on('console', msg => console.log(msg.text()));

    let txt = await page.evaluate(_ => {
        console.log('page.evaluate() started');
        document.querySelector("div.article-content")
                .querySelectorAll('[instant],[data-collapse-content],figcaption')
                .forEach(x=>{ console.log(x.innerText); x.remove()});
        console.log('page.evaluate() add removed'); 
        let txt = document.querySelector("div.article-content").innerText; 
        txt = txt.replace(/Kommentare lesen.*/gm,'');
        txt = txt.replace(/\(This article is also available in english\)/gm,''); 
        txt = txt.replace(/Zur Startseite/gm,''); 
        txt = txt.replace(/Lesen Sie auch/gm,''); 
        
        txt = txt.trim();
               
        console.log('page.evaluate().txt ', txt);
        return txt;
    });

    console.log('browser.txt ', txt);

    //console.log(`takeScreenshot close browser`)
    await browser.close();
    return txt;
}

const heise = async (req, res) => {
    let query = req.query || {};
    let txt = await heisePlainText({
        delay: 2,
        url: query.url
    });
    res.send(txt);
}

module.exports = { heise }
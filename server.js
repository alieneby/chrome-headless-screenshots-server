const puppeteer = require('puppeteer');
var yargs = require('yargs');
const delay = require('delay');
const fs = require('fs');
const path = require('path');

const express = require('express')
const app = express()
const port = 3000
const directory = 'images';

// ON STARTUP DELETE image content
fs.readdir(directory, (err, files) => {
    if (err) throw err;
    for (const file of files) {
        if (file.match(/^[\.\/]/)) continue;
        console.log('delete ' + directory + '/' + file);
        fs.unlink(path.join(directory, file), err => {
            if (err) throw err;
        });
    }
});


app.use(express.json());

app.get('/screenshot/stop', async (req, res) => {
    shutDown();
});


app.post('/screenshot/', async (req, res) => {
    console.log('body', req.body);

    let basename = req.body?.url || '';

    basename = basename.replace('https://', '')
        .replace('http://', '')
        .replace(/[^a-zA-Z0-9_-]/g, '');
    console.log('basename', basename);
    await takeScreenshot({
        width: 1920,
        height: 1080,
        delay: 4000,
        outputDir: directory,
        filename: basename,
        format: 'webp',
        url: req.body.url
    });

    let absImg = __dirname + '/' + directory + '/' + basename + '.webp';
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

})


let server = app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})



async function takeScreenshot(argv) {
    //console.log("takeScreenshot ", argv)

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



// ======================= shutdown


process.on('SIGTERM', shutDown);
process.on('SIGINT', shutDown);

let connections = [];

server.on('connection', connection => {
    connections.push(connection);
    connection.on('close', () => connections = connections.filter(curr => curr !== connection));
});

function shutDown() {
    console.log('Received kill signal, shutting down gracefully');
    server.close(() => {
        console.log('Closed out remaining connections');
        process.exit(0);
    });

    setTimeout(() => {
        console.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
    }, 10000);

    connections.forEach(curr => curr.end());
    setTimeout(() => connections.forEach(curr => curr.destroy()), 5000);
}
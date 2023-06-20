const {port} = require('./config.js');
const delay = require('delay');
const {screenshot} = require('./modules/screenshot');
const {heise} = require('./modules/heise');
const {terraMystica} = require('./modules/terraMystica');
const {cropFm} = require('./modules/cropFm');
const {metaTags} = require('./modules/metaTags');
const {readability} = require('./modules/readability');
const {clearImageFolder} = require('./modules/clearImageFolder');
const {youtubeSubtitles} = require('./modules/youtubeSubtitles');
const {youtubeIsEmbeddable2023} = require('./modules/youtubeIsEmbeddable2023');
const {youtubeScreenshot} = require('./modules/youtubeScreenshot');
//const {youtubeIsEmbeddable} = require('./modules/youtubeIsEmbeddable');
//const {youtubeIsEmbeddableHtml} = require('./modules/youtubeIsEmbeddableHtml');
const {listenOnKeyControlC} = require('./modules/controlC');
const { Mutex } = require('async-mutex');

const express = require('express')
const app = express()
const mutex = new Mutex();

// ON STARTUP DELETE image folder
clearImageFolder();

app.use(express.json());
app.setMaxListeners(4)


/*
let wait4BrowserObj = {
    running: false,
    counter: 0,
    start: () => {
        wait4BrowserObj.running = true;
    },
    end: () => {
        wait4BrowserObj.running = false;
    },
    exclusive: async() => {
        const release = await mutex.acquire();

        if (wait4BrowserObj.counter>5) {
            console.log('screenshot already running');
            release();
            return false;
        }
        wait4BrowserObj.counter++;

        if ( wait4BrowserObj.running ) {
            console.log('Other screenshot is running');

            // wait a radnom time between 0 and 2 seconds
            await delay( Math.random() * 2000 );

            for ( let i = 0; i < 10 && wait4BrowserObj.running; i++ ) {
                await delay( 1000 );
            }

            if ( wait4BrowserObj.running ) {
                console.log( 'screenshot too many requests' );
                wait4BrowserObj.counter--;
                release();
                return false;
            }
        }
        release();
        return true; // ok to start
    },
}
*/


app.get('/screenshot/stop', async (req, res) => {
    shutDown();
});


app.get('/', async (req, res) => {
    const release = await mutex.acquire();
    try {
        console.log('Task start');
        let url = req?.query?.url || '';
        console.log( `screenshot url: ${url}` );
        console.log( new Date().toISOString() );
        if ( url.indexOf( 'youtube' ) > 0 || url.indexOf( 'youtu.be' ) > 0 ) {
            await youtubeScreenshot(req, res);
        } else {
            await screenshot(req, res);
        }
        console.log('Task end');
      } finally {
        release();
      }
});

app.get('/heise', heise);
app.get('/terraMystica', terraMystica);
app.get('/youtubeSubtitles', youtubeSubtitles);
app.get('/youtubeIsEmbeddable', youtubeIsEmbeddable2023);
//app.get('/youtubeIsEmbeddable', youtubeIsEmbeddable);
//app.get('/youtubeIsEmbeddableHtml', youtubeIsEmbeddableHtml);
app.get('/cropFm', cropFm);
app.get('/metaTags', metaTags);
app.get('/readability', readability);
app.get('/web', readability);


let server = app.listen(port, () => {
    console.log( `Example app listening on port ${port}` )
})

// ======================= shutdown
listenOnKeyControlC( process, server );
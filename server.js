const {port} = require('./config.js');
const {screenshot} = require('./modules/screenshot');
const {heise} = require('./modules/heise');
const {terraMystica} = require('./modules/terraMystica');
const {cropFm} = require('./modules/cropFm');
const {readability} = require('./modules/readability');
const {clearImageFolder} = require('./modules/clearImageFolder');
const {youtubeSubtitles} = require('./modules/youtubeSubtitles');
const {youtubeIsEmbeddable} = require('./modules/youtubeIsEmbeddable');
const {youtubeIsEmbeddableHtml} = require('./modules/youtubeIsEmbeddableHtml');
const {listenOnKeyControlC} = require('./modules/controlC');

const express = require('express')
const app = express()

// ON STARTUP DELETE image folder
clearImageFolder();

app.use(express.json());

app.get('/screenshot/stop', async (req, res) => {
    shutDown();
});

app.get('/', screenshot)
app.get('/heise', heise);
app.get('/terraMystica', terraMystica);
app.get('/youtubeSubtitles', youtubeSubtitles);
app.get('/youtubeIsEmbeddable', youtubeIsEmbeddable);
app.get('/youtubeIsEmbeddableHtml', youtubeIsEmbeddableHtml);
app.get('/cropFm', cropFm);
app.get('/readability', readability);
app.get('/web', readability);


let server = app.listen(port, () => {
    console.log( `Example app listening on port ${port}` )
})

// ======================= shutdown
listenOnKeyControlC( process, server );
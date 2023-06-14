const {runBrowser} = require('./runBrowser.js');
const axios = require('axios');

const youtubeIsEmbeddable2023 = async (req, res) => {
    console.log('youtubeIsEmbeddable URL: ', req.query?.url || 'url missing!' );
    if ( ! req.query?.url ) {
        console.error('youtubeIsEmbeddable URL missing!' );
        res.send('');
        return;
    }

    let ytId = req.query.url.replace( /^.*=/, '' );
    console.log('youtubeIsEmbeddable ytId: ', ytId);

    if ( ! ytId ||  ytId == req.query.url) {
        console.error('youtubeIsEmbeddable watch?v=ID missing!' );
        res.send('');
        return;
    } 

    const videoUrl = 'https://www.youtube.com/watch?v='+ytId;
    const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(videoUrl)}&format=json`;

    axios.get(oembedUrl)
      .then(response => {
        const html = response.data.html;
        console.log(html);
        res.send('EMBEDDABLE ' + ytId);
      })
      .catch(error => {
        console.error(`Fehler: ${error} Response Code: ` +  error.response?.status);
        res.send('NOT EMBEDDABLE ' + ytId + (  error.response?.status == 400 ? ' INVALID' : ''));
      });
}

module.exports = {
    "youtubeIsEmbeddable2023": youtubeIsEmbeddable2023
}
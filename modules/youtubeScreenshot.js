const https = require('https');

const youtubeScreenshot = async (req, res) => {
    console.log('youtubeScreenshot URL: ', req.query?.url || 'url missing!' );
    if ( ! req.query?.url ) {
        console.error('youtubeScreenshot URL missing!' );
        res.send('');
        return;
    }

    let ytId = req.query.url.replace( /^.*=/, '' );
    console.log('youtubeScreenshot ytId: ', ytId);

    if ( ! ytId ||  ytId == req.query.url) {
        console.error('youtubeScreenshot watch?v=ID missing!' );
        res.send('');
        return;
    } 
    const url = `https://img.youtube.com/vi/${ytId}/default.jpg`;
    https.get(url, function(response) {
      response.pipe(res);
  });
}

module.exports = {
    "youtubeScreenshot": youtubeScreenshot
}
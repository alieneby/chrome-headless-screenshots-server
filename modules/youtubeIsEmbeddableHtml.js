const fs = require('fs');

const youtubeIsEmbeddableHtml = async (req, res) => {
    console.log('youtubeIsEmbeddableHtml');
    try {
        const strHtml = fs.readFileSync('modules/youtubeIsEmbeddableHtml.html', {encoding: 'utf-8'})
        res.send(strHtml);
    
    } catch ( e ) {
        res.send( "Exception: " + e);
        console.log('youtubeIsEmbeddableHtml ', e);
    }
}

module.exports = { 
    "youtubeIsEmbeddableHtml": youtubeIsEmbeddableHtml
}
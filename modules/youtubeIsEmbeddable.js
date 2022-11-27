const {runBrowser} = require('./runBrowser.js');


let scanPage= _ => {  
    console.log('page.evaluate() started ' );
    if ( ! document ) {
        console.log('page.evaluate() no document!!!!! ' );
        return "";
    }
    
    let inputMyInfo = document.querySelectorAll('#myInfo');

    if ( ! inputMyInfo || ! inputMyInfo.length) {
        console.log('page.evaluate() no document.getElementById(#myInfo))!');
        console.log( JSON.stringify(document) );
        return "";
    }

    return inputMyInfo[0].value;
}

const youtubeIsEmbeddable = async (req, res) => {
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

    try {
        let txt = await runBrowser({
            delay: 2, 
            url: 'http://localhost:3000/youtubeIsEmbeddableHtml?'+ytId,
            evalFunction: scanPage
        });
        res.send(txt);
    
    } catch ( e ) {        
        res.send( "Exception: " + e);
        console.log('youtubeIsEmbeddable Exc. ', e);
    }
}

module.exports = { 
    "youtubeIsEmbeddable": youtubeIsEmbeddable
}
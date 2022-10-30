const {runBrowser} = require('../modules/runBrowser.js');

let scanPage = _ => {
    console.log( 'heise.js scanPage() ' );
    if ( ! document ) {
        console.log('heise.js scanPage() no document!!!!! ' );
    }
    
    if ( ! document.querySelector("div.article-content") ) {
        console.log('heise.js scanPage() no document.querySelector(div.article-content)!!!!!');
        console.log( document.innerText );
        return "";
    }

    document.querySelector("div.article-content")
            .querySelectorAll('[instant],[data-collapse-content],figcaption')
            .forEach( x => { x.remove(); } );
    
    // Lesen sie auch
    document.querySelectorAll('[data-component="RecommendationBox"]')
        .forEach( x => { x.remove(); } );

    document.querySelectorAll('footer')
        .forEach( x => { x.remove(); } );
        
    let txt = document.querySelector("div.article-content").innerText; 
    txt = txt.replace(/Kommentare lesen.*/gm,'');
    txt = txt.replace(/\(This article is also available in english\)/gm,''); 
    txt = txt.replace(/Zur Startseite/gm,''); 
    txt = txt.replace(/Lesen Sie auch/gm,''); 
    
    txt = txt.trim();
           
    // console.log('heise.js scanPage() txt ', txt.substr(0, 200));
    return txt;
}


const heise = async (req, res) => {
    console.log('heise URL: ', req.query?.url || 'url missing!' );
    try {
        let query = req.query || {};
        let txt = await runBrowser({
            delay: 2,
            url: query.url,
            evalFunction: scanPage
        });
        res.send(txt);
    
    } catch ( e ) {        
        res.send( "Exception: " + e);
        console.log('heise ', e);
    }
}

module.exports = { heise }
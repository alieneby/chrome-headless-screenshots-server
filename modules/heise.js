const {runBrowser} = require('../modules/runBrowser.js');

let scanPage = _ => {
    console.log('page.evaluate() started ' );
    if ( ! document ) {
        console.log('page.evaluate() no document!!!!! ' );
    }
    
    if ( ! document.querySelector("div.article-content") ) {
        console.log('page.evaluate() no document.querySelector(div.article-content)!!!!!');
        console.log( document.innerText );
        return "";
    }

    document.querySelector("div.article-content")
            .querySelectorAll('[instant],[data-collapse-content],figcaption')
            .forEach(x=>{ console.log(x.innerText); x.remove()});
    console.log('page.evaluate() add removed');
    
    // Lesen sie auch
    document.querySelectorAll('[data-component="RecommendationBox"]')
        .forEach(x=>{ console.log(x.innerText); x.remove()});

    document.querySelectorAll('footer')
        .forEach(x=>{ console.log(x.innerText); x.remove()});
        
    let txt = document.querySelector("div.article-content").innerText; 
    txt = txt.replace(/Kommentare lesen.*/gm,'');
    txt = txt.replace(/\(This article is also available in english\)/gm,''); 
    txt = txt.replace(/Zur Startseite/gm,''); 
    txt = txt.replace(/Lesen Sie auch/gm,''); 
    
    txt = txt.trim();
           
    console.log('page.evaluate().txt ', txt);
    return txt;
}


const heise = async (req, res) => {
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
const {runBrowser} = require('./runBrowser.js');


let scanPage= _ => {  
    console.log('page.evaluate() started ' );
    if ( ! document ) {
        console.log('page.evaluate() no document!!!!! ' );
    }
    
    let contentDiv = document.querySelector('#archive_show_container');

    if ( ! contentDiv ) {
        console.log('page.evaluate() no document.querySelector(#archive_show_container])!');
        console.log( document.innerText );
        return "";
    }

    // Image entfernen
    document.querySelectorAll('#archive_show_container .silbentrennung span').forEach( x => x.remove());

    let arrTxt = [];
    document.querySelectorAll('#archive_show_container .silbentrennung ').forEach( x => arrTxt.push(x.innerText));

    let txt = arrTxt.join(' ')
        .replaceAll("\n", ' ')
        .replaceAll("\t", ' ')
        .replaceAll(/[^a-zA-Z0-9äüößÄÖÜß +-\.;\(\):]/g, '')
        .trim();

    return txt;
}

const cropFm = async (req, res) => {
    console.log('cropFm URL: ', req.query?.url || 'url missing!' );
    if ( ! req.query?.url ) {
        console.error('cropFm URL missing!' );
        res.send('');
        return;
    }
    try {
        let query = req.query || {};
        let txt = await runBrowser({
            delay: 6, //Angular!!!
            url: query.url,
            evalFunction: scanPage
        });
        res.send(txt);
    
    } catch ( e ) {        
        res.send( "Exception: " + e);
        console.log('cropFm Exc. ', e);
    }
}

module.exports = { 
    "cropFm": cropFm
}
const {runBrowser} = require('../modules/runBrowser.js');


let scanFeed = _ => {  
    console.log('page.evaluate() started ' );
    if ( ! document ) {
        console.log('page.evaluate() no document!!!!! ' );
    }
    
    let arrPA = document.querySelectorAll('p[style] > a[href]');

    if ( ! arrPA ) {
        console.log('page.evaluate() no document.querySelector(p[style] > a[href])!!!!!');
        console.log( document.innerText );
        return "";
    }

    let arr = [];

    arrPA.forEach( node => {

        let descr = node.parentElement.querySelector('span.hascaption').innerText;

        arr.push({
            url: node.href,
            title: node.title,
            descr: descr
        });

    });
    
    return JSON.stringify(arr);
}

let scanPage= _ => {  
    console.log('page.evaluate() started ' );
    if ( ! document ) {
        console.log('page.evaluate() no document!!!!! ' );
    }
    
    let contentDiv = document.querySelector('#content_area');

    if ( ! contentDiv ) {
        console.log('page.evaluate() no document.querySelector(#content_area])!!!!!');
        console.log( document.innerText );
        return "";
    }

    // Buchwerbung entfernen
    contentDiv.querySelectorAll('div.j-hgrid, div.j-gallery, div.j-imageSubtitle,  div.j-hr').forEach( x => x.remove())

    let txt = contentDiv.innerText
        .replaceAll("\n", ' ')
        .replaceAll("\t", ' ')
        .replace(/Fernando Calvo.*/gi, '')
        .replaceAll(/[^a-zA-Z0-9äüößÄÖÜß +-\.;\(\):]/g, '');
    return txt;
}


const terraMysticaFeed = async (req, res) => {
    try {        
        let query = req.query || {};
        let url = query?.url ? query.url : "https://terra-mystica.jimdofree.com/";
        let evalFunction = query?.url ? scanPage : scannFeed;
        let txt = await runBrowser({
            delay: 2,
            url: url,
            evalFunction: evalFunction
        });        
        res.send(txt);
    
    } catch ( e ) {        
        res.send( "Exception: " + e);
        console.log('heise ', e);
    }
}


module.exports = { terraMysticaFeed }
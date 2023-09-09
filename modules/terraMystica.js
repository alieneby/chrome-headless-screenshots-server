const {runBrowser} = require('../modules/runBrowser.js');


let scanFeed = _ => {  
    console.log('page.evaluate() started ' );
    if ( ! document ) {
        console.log('page.evaluate() no document!!!!! ' );
    }

    let arrPA = document.querySelectorAll('div[data-container=content] > div > div.j-textWithImage > div  div.cc-m-textwithimage-inline-rte');
    console.log('page.evaluate() 3 ' );

    if ( ! arrPA ) {
        console.log('page.evaluate() no document.querySelector(div[data-container=content] > div > div.j-textWithImage > div  div.cc-m-textwithimage-inline-rte)!!!!!');
        console.log( document.innerText );
        return "";
    }

    let arr = [];
    console.log('page.evaluate() 5 ' );

    arrPA.forEach( node => {
        console.log('page.evaluate() 6' );
        let arrP = node.querySelectorAll('p');
        if ( ! arrP || arrP.length < 4 ) {
            return;
        }

        let title = arrP[2].innerText;
        let descr = arrP[3].innerText;
        if (descr) descr = descr.replace(/ \[mehr.*\]/g, '');
        let url = node.querySelector('a[href]')['href']

        arr.push({
            url: url,
            title: title,
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
        console.log( document?.innerText || 'NO INNERTEXT!' );
        return "";
    }

    console.log( 'contentDiv.querySelectorAll()' );
    // Buchwerbung entfernen
    contentDiv.querySelectorAll('div.j-hgrid, div.j-gallery, div.j-imageSubtitle,  div.j-hr').forEach( x => x.remove())

    console.log( 'contentDiv.innerText()' );
    if ( ! contentDiv || !  contentDiv.innerText ) {
        console.log('page.evaluate() no contentDiv!!!!!');
        return "";
    }

    let txt = contentDiv.innerText
        .replaceAll("\n", ' ')
        .replaceAll("\t", ' ')
        .replace(/Fernando Calvo.*/gi, '')
        .replaceAll(/[^a-zA-Z0-9äüößÄÖÜß +-\.;\(\):]/g, '');
    return txt;
}


const terraMysticaFeed = async (req, res) => {
    try {     
        let txt = await runBrowser({
            delay: 3,
            url: "https://terra-mystica.jimdofree.com/",
            evalFunction: scanFeed
        });        
        res.send(txt);
    
    } catch ( e ) {        
        res.send( "Exception: " + e);
        console.log('terraMystica ', e);
    }
}

const terraMysticaText = async (req, res) => {
    try {        
        let query = req.query || {};
        let txt = await runBrowser({
            delay: 2,
            url: query?.url,
            evalFunction: scanPage
        });        
        res.send(txt);
    
    } catch ( e ) {        
        res.send( "Exception: " + e);
        console.log('heise ', e);
    }
}
const terraMystica= async (req, res) => {
        let query = req.query || {};
        return query?.url ? (terraMysticaText)(req, res)  : (terraMysticaFeed)(req, res) 
    }

module.exports = { 
    "terraMystica": terraMystica
}
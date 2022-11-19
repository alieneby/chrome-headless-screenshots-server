const {runBrowser} = require('./runBrowser.js');
const {Readability} = require('@mozilla/readability/index.js');
const fs = require('fs');
const readabilityJsStr = fs.readFileSync('node_modules/@mozilla/readability/Readability.js', {encoding: 'utf-8'})

function executor() {
   console.log('executor started ');   
   let article = new Readability({}, document).parse();
   if (!article) return '';
   if (!article.textContent) return '';

   let txt =  article.textContent
   .replaceAll("\n", ' ')
   .replaceAll("\t", ' ')
   .replaceAll(/[^a-zA-Z0-9äüößÄÖÜß +-\.;\(\):]/g, '')
   .replaceAll(/[ ]{2,100}/g, ' ')
   .trim();

   return ( article.title ? article.title + "\n" : '' ) + txt;
}

const readability = async (req, res) => {
    console.log('readability URL: ', req.query?.url || 'url missing!' );
    if ( ! req.query?.url ) {
        console.error('readability URL missing!' );
        res.send('');
        return;
    }

    let scanPage = `
        (function(){
        ${readabilityJsStr}
        ${executor}
        return executor();
        }())
    `;

    try {
        let query = req.query || {};
        let txt = await runBrowser({
            delay: 1, 
            url: query.url,
            evalFunction: scanPage
        });
        res.send(txt);
    
    } catch ( e ) {        
        res.send( "Exception: " + e);
        console.log('readability ', e);
    }
}

module.exports = { 
    "readability": readability
}
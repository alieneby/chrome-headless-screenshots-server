const {runBrowser} = require('./runBrowser.js');

let scanPage = _ => {
    console.log('page.evaluate() started ' );

    let jsonModel = {
        title: '',
        description: '',
        author_name: '',
        canonical: '',
        thumbnail_url: '',
        img_w: '',
        img_h: '',
        favicon_is_a_guess: '',
        favicon: '',
        domain: '',
        host: '',
        url: ''
    };

    if ( ! document ) {
        console.log('page.evaluate() no document!!!!! ' );
        return jsonModel;
    }

    //jsonModel.title = document.querySelector('title')?.innerText || '';
    jsonModel.description = document.querySelector('description')?.innerText || '';
    if ( ! jsonModel.description ) {

        jsonModel.description
             = document.querySelector('meta[name="description"]')?.getAttribute('content')
             || '';
    }
    jsonModel.author_name = document.querySelector('meta[name="author"]')?.getAttribute('content') || '';
    //jsonModel.canonical = document.querySelector('link[rel="canonical"]')?.getAttribute('href') || '';
    jsonModel.host = document.location.host;
    jsonModel.domain = jsonModel.host.replace(/(https?:\/\/)?(www.)?/, '').split('/')[0];

    // Favicon
    jsonModel.favicon
        = document.querySelector('link[rel="shortcut icon"]')?.getAttribute('href')
        || document.querySelector('link[rel="icon"]')?.getAttribute('href')
        || '';

    if (jsonModel.favicon && jsonModel.favicon.startsWith('/')) {
        jsonModel.favicon = document.location.origin + jsonModel.favicon;
    }

    jsonModel.favicon_is_a_guess = jsonModel.favicon ? true : false;


    // OpenGraph OG Tags
    if ( ! jsonModel.title ) {
        jsonModel.title = document.querySelector('meta[property="og:title"]')?.getAttribute('content') || '';
    }
    if ( ! jsonModel.description ) {
        jsonModel.description = document.querySelector('meta[property="og:description"]')?.getAttribute('content') || '';
    }
    if ( ! jsonModel.canonical ) {
        jsonModel.canonical = document.querySelector('meta[property="og:url"]')?.getAttribute('content') || '';
    }
    if ( ! jsonModel.thumbnail_url ) {
        jsonModel.thumbnail_url = document.querySelector('meta[property="og:image"]')?.getAttribute('content') || '';
        jsonModel.img_w = document.querySelector('meta[property="og:image:width"]')?.getAttribute('content') || '';
        jsonModel.img_h = document.querySelector('meta[property="og:image:height"]')?.getAttribute('content') || '';
        if (jsonModel.thumbnail_url && jsonModel.thumbnail_url.startsWith('/')) {
            jsonModel.thumbnail_url = document.location.origin + jsonModel.thumbnail_url;
        }
    }
    if ( ! jsonModel.host ) {
        jsonModel.host = document.querySelector('meta[property="og:site_name"]')?.getAttribute('content') || '';
        jsonModel.domain = jsonModel.host.replace(/(https?:\/\/)?(www.)?/, '').split('/')[0];
    }


    // Twitter Tags
    if ( ! jsonModel.title ) {
        jsonModel.title = document.querySelector('meta[name="twitter:title"]')?.getAttribute('content') || '';
    }
    if ( ! jsonModel.description ) {
        jsonModel.description = document.querySelector('meta[name="twitter:description"]')?.getAttribute('content') || '';
    }
    if ( ! jsonModel.thumbnail_url ) {
        jsonModel.thumbnail_url = document.querySelector('meta[name="twitter:image"]')?.getAttribute('content') || '';

        jsonModel.img_w = document.querySelector('meta[name="twitter:image:width"]')?.getAttribute('content') || '';
        jsonModel.img_h = document.querySelector('meta[name="twitter:image:height"]')?.getAttribute('content') || '';

        if (jsonModel.thumbnail_url && jsonModel.thumbnail_url.startsWith('/')) {
            jsonModel.thumbnail_url = document.location.origin + jsonModel.thumbnail_url;
        }   
    }

    return jsonModel;
}

const metaTags = async (req, res) => {
    console.log('metaTags URL: ', req.query?.url || 'url missing!' );
    if ( ! req.query?.url ) {
        console.error('metaTags URL missing!' );
        res.send('');
        return;
    }
    try {
        let query = req.query || {};

        let jsonModel = await runBrowser({
            delay: 6, //Angular!!!
            url: query.url,
            evalFunction: scanPage
        });

        jsonModel.url = query.url;

        //console.log('metaTags jsonModel ', jsonModel);

        // header for json
        res.setHeader('Content-Type', 'application/json');

        res.send(jsonModel);
    
    } catch ( e ) {        
        res.send( "Exception: " + e);
        console.log('metaTags Exc. ', e);
    }
}

module.exports = {
    "metaTags": metaTags
}
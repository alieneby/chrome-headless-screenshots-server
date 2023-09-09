const {runBrowser} = require('./runBrowser.js');


let scanFeed = _ => {
    console.log('page.evaluate() started ' );
    if ( ! document ) {
        console.log('page.evaluate() no document!!!!! ' );
    }

    let arrPA = document.querySelectorAll('.post .post-title a[href]');
    console.log('page.evaluate() 3 ' );

    if ( ! arrPA ) {
        console.log('page.evaluate() no document.querySelectorAll(...!!!!');
        console.log( document.innerText );
        return "";
    }

    let arr = [];
    console.log('page.evaluate() 5 ' );

    arrPA.forEach( node => {
        console.log('page.evaluate() 6' );

        let title = node.innerText
            .replace(/[\n\t\s]/g, ' ')
            .replace(/ +/g, ' ')
            .trim();

        let url = node['href'];

        arr.push({
            url: url,
            title: title
        });

    });

    return JSON.stringify(arr);
}

const feed = async (req, res) => {
    try {     
        let txt = await runBrowser({
            delay: 5,
            url: "https://ufoscriptorium.blogspot.com/search?max-results=3&start=0&by-date=true",
            evalFunction: scanFeed
        });
        res.send(txt);

    } catch ( e ) {
        res.send( "Exception: " + e);
        console.log('greyhunter ', e);
    }
}


const greyhunter= async (req, res) => {
    return (feed)(req, res)
}

module.exports = { 
    "greyhunter": greyhunter
}
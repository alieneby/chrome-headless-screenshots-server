
const {getSubtitles} = require('youtube-captions-scraper');
const {exampleEn, exampleDe} =  require('../modules/youtubeSubtitlesExample.js');

/**

https://www.npmjs.com/package/youtube-captions-scraper

*/



// SIMULATION for https://www.youtube.com/watch?v=0dDhjYp6MG8
/*
const exampleResponse = [{
    "start": "0.24",
    dur: "6.18",
    text: "Dieses Video wird von Squarespace unterstützt! Hey, Hey Marcus House mit dir hier. Wir haben heute einige"
  },
  {
    start: "6.42",
    dur: "5.34",
    text: "großartige Starship-Neuigkeiten. Abschließend Hinweise darauf, wann wir diesen Orbitalflugtest von Starship sehen werden,"
  }
];
*/

function objToTxt( obj ) {
    if ( ! obj || ! obj?.length) {
        console.error("subtitles objToTxt() ERROR: no obj or obj.length");
        return "";
    }
    let txt = "";
    obj.forEach(element => {
        txt += " " + element?.text?.trim(); 
    });
    txt = txt.replace('\t'," ").replace(".", ".\n").trim();
    console.log( 'objToTxt() ', txt);
    return txt;
}

const youtubeSubtitles = async (req, res) => {
    let query = req.query || {};
    let id = query?.id || '';
    let lang = query?.lang || 'de';

    console.log( 'youtubeSubtitles() id: ', id, ', lang: ', lang);

    if ( ! id ) {
        res.send("");
        return; 
    }

    if ( id == '0dDhjYp6MG8' ) { // UAMN EN Example
        let txt = objToTxt( exampleEn );
        console.log( 'youtubeSubtitles() EN simulation');
        res.send( txt );
        return;
    }

    if ( id == '2f_aT2XnB_s' ) { // LPIndie DE Example
        let txt = objToTxt( exampleDe );        
        console.log( 'youtubeSubtitles() DE simulation ');
        res.send( txt );
        return;
    }

    try {
        await getSubtitles({
            videoID: id, // youtube video id
            lang: lang // default: `en`

        }).then(function(captions) {
            let txt = objToTxt( captions );
            res.send(txt);
            return;
        });

    } catch ( e ) {
        console.error("ERROR1: YoutubeId: " + id + ", language: " + lang + " subtitle issues: " + e );
        if ( lang == 'en' ) {
            res.send("");
            return;
        }

        try {
            await getSubtitles({
                videoID: id, // youtube video id
                lang: 'en' // default: `en`
              }).then(function(captions) {
                let txt = objToTxt( captions );
                res.send(txt);
                return;
              });
    
        } catch( e ) {
            console.log("ERROR2: Youtube " + id + ", en subtitle issues: " + e );
            res.send("");
            return;
        }
    }


}

module.exports = { youtubeSubtitles }
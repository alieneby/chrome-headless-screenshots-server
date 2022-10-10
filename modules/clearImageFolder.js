
const fs = require('fs');
const path = require('path');
const {imgDirectory} = require('../config.js');


const clearImageFolder = () => {
    
    fs.readdir(imgDirectory, (err, files) => {
        if (err) throw err;
        for (const file of files) {
            if (file.match(/^[\.\/]/)) continue;
            console.log('delete ' + imgDirectory + '/' + file);
            fs.unlink(path.join( imgDirectory, file ), err => {
                if (err) throw err;
            });
        }
    });
}

exports.clearImageFolder = clearImageFolder;
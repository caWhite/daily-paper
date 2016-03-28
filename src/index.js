const request = require('request');
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
var exec = require('child_process').exec;
let picturesDir = path.join(process.env.HOME, "Pictures", "Unsplash Daily");

fs.access(picturesDir, fs.W_OK, (error) => {
    if (error && error.code === 'ENOENT') {
      console.log(`${picturesDir} not found. Creating it now . . .`);
        mkdirp(picturesDir, () => {
            DownloadPhoto(picturesDir);
        });
    } else {
        DownloadPhoto(picturesDir);
    }
});

function DownloadPhoto(picturesDir) {
    let filepath = path.join(picturesDir, (Date.now() + '.png'));
    let stream = request("http://source.unsplash.com/category/nature").pipe(fs.createWriteStream(filepath));
    stream.on('finish', () => {
        SetPhoto(filepath);
    });
}

function SetPhoto(file) {
    let child = exec(`osascript -e 'tell application "System Events" to set picture of every desktop to ("${file}") as POSIX file as alias'`, function(err, stdout, stderr) {
        if (err) {
            console.log(err);
            process.exit(1);
        }
        console.log(stdout);
    });
}

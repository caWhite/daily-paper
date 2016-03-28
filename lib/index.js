'use strict';

var request = require('request');
var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var exec = require('child_process').exec;
var picturesDir = path.join(process.env.HOME, "Pictures", "Unsplash Daily");

fs.access(picturesDir, fs.W_OK, function (error) {
    if (error && error.code === 'ENOENT') {
        console.log(picturesDir + ' not found. Creating it now . . .');
        mkdirp(picturesDir, function () {
            DownloadPhoto(picturesDir);
        });
    } else {
        DownloadPhoto(picturesDir);
    }
});

function DownloadPhoto(picturesDir) {
    var filepath = path.join(picturesDir, Date.now() + '.png');
    var stream = request("http://source.unsplash.com/category/nature").pipe(fs.createWriteStream(filepath));
    stream.on('finish', function () {
        SetPhoto(filepath);
    });
}

function SetPhoto(file) {
    var child = exec('osascript -e \'tell application "System Events" to set picture of every desktop to ("' + file + '") as POSIX file as alias\'', function (err, stdout, stderr) {
        if (err) {
            console.log(err);
            process.exit(1);
        }
        console.log(stdout);
    });
}
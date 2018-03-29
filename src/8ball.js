
'use strict'

let fs = require('fs');

let ballFile = "8ball.txt"

function getRandomAnswer(callback) {
    getFileContent(ballFile, function (data) {
        let answers = data.split(";")
        let index = Math.round(Math.random()*answers.length)
        callback(answers[index])
    })
}

function getFileContent(srcPath, callback) {
    fs.readFileSync(srcPath, 'utf8', function (err, data) {
            if (err) throw err;
            callback(data);
        }
    );
}

module.exports = {
    getRandomAnswer
}
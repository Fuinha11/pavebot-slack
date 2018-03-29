
'use strict'

let fs = require('fs');

let ballFile = "./src/files/8ball.txt"

function getRandomAnswer() {
    let answers = getFileContent(ballFile).split("; ")
    let index = Math.round(Math.random() * (answers.length-1))
    return answers[index]
}

function getFileContent(srcPath) {
    console.log("ta rolando content")
    return fs.readFileSync(srcPath, 'utf8')
}

function dump() {
    return getFileContent(ballFile)
}

module.exports = {
    getRandomAnswer,
    dump
}
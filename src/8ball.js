
'use strict'

let fs = require('fs');

let ballFile = "./src/files/8ball.txt"

function getRandomAnswer() {
    let answers = getFileContent(ballFile).split("; ")
    let index = Math.round(Math.random() * (answers.length-1))
    return answers[index]
}

function getFileContent(srcPath) {
    return fs.readFileSync(srcPath, 'utf8')
}

function dump() {
    let answers = getFileContent(ballFile).split("; ")
    return answers.join('\n')
}

function addAnswer(answer) {
    answer = "; " + answer
    console.log(answer)
    fs.appendFileSync(ballFile, answer);
    return dump()
}

module.exports = {
    getRandomAnswer,
    addAnswer,
    dump
}

'use strict'

let fs = require('fs');
const _ = require('lodash');

let perolasFile = "./src/files/perolas.txt"

function getRandomAnswer() {
    let answers = getFileContent(perolasFile).split("; ")
    let index = Math.round(Math.random() * (answers.length-1))
    return answers[index]
}

function getFileContent(srcPath) {
    return fs.readFileSync(srcPath, 'utf8')
}

function dump() {
    let answers = getFileContent(perolasFile).split("; ")
    return answers.join('\n')
}

function getLast() {
    let answers = getFileContent(perolasFile).split("; ")
    return _.last(answers)
}

function addPerola(perola) {
    if (perolas.includes("; "))
        throw "Perolas não podem ter ; jagunço"
    perola = "; " + perola
    console.log(perola)
    fs.appendFileSync(perolasFile, perola);
    return getLast()
}

function searchPerola(content) {
    let answers = getFileContent(perolasFile).split("; ")
    let results = new Array()
    for (let i = 0; i < answers.length; i++) {
        if (answers[i].toLowerCase().includes(content.toLowerCase()))
        results.add(answers[i])
    }
    if (results.length === 0)
        return "Não achei nada =("
    else
        return results.join("\n")
}

module.exports = {
    getRandomAnswer,
    addPerola,
    searchPerola,
    dump
}
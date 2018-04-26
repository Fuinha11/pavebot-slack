
'use strict'

const _ = require('lodash')

function rollDice(words) {
    let title = ':d20: Rolando '
    let body = ""
    let sum = 0
    let dices = []
    let bonus = 0
    let needsTotal = false

    for (let j = 0; j < words.length; j++) {
        if (words[j].match('\\d+d\\d+'))
            dices.push(words[j])
        else if (words[j].match('\\+\\d+'))
            bonus += parseInt(words[j].split('+')[1])
    }

    if (dices.length === 0) {
        dices.push('1d20')
    }

    for (let j = 0; j < dices.length; j++) {
        if (j !== 0) {
            body += '----------\n\n'
            if (j !== dices.length -1)
                title += ', '
            else
                title += ' e '
        }
        title += dices[j]
        let times = parseInt(dices[j].split('d')[0])
        let size = parseInt(dices[j].split('d')[1])
        if (times > 1 || j > 0)
            needsTotal = true
        body += dices[j] + ':\n'
        for (let i = 0; i < times; i++){
            let number = Math.ceil(Math.random() * (size))
            body += '🎲 = ' + number + '\n'
            sum += number
        }
    }

    if (bonus !== 0) {
        title += ' +' + bonus
        body += '----------\n\n +' + bonus + '\n'
        sum += bonus
        needsTotal = true
    }

    if (needsTotal)
        body += '----------\n\nTotal = ' + sum

    return {body:body, title:title}
}

function chtuluFicha() {
    let title = 'Criando um investigador aleatório :mag:'
    let body = "-------------------\n"
    body += 'FOR: ' + _.pad(sumDice(3, 6, 0), 2) + '\tCON: ' + _.pad(sumDice(3, 6, 0), 2) + '\n'
    body += 'DES: ' + _.pad(sumDice(3, 6, 0), 2) + '\tINT: ' + _.pad(sumDice(2, 6, 6), 2) + '\n'
    body += 'TAM: ' + _.pad(sumDice(2, 6, 6), 2) + '\tPOD: ' + _.pad(sumDice(3, 6, 0), 2) + '\n'
    body += 'APA: ' + _.pad(sumDice(3, 6, 0), 2) + '\tEDU: ' + _.pad(sumDice(3, 6, 3), 2) + '\n'
    body += "-------------------\n"
    return {body:body, title:title}
}

function sumDice(times, size, bonus) {
    let sum = 0
    for (let i = 0; i < times; i++){
        let number = Math.ceil(Math.random() * (size))
        sum += number
    }
    return sum + bonus
}

module.exports = {
    rollDice,
    chtuluFicha,
}
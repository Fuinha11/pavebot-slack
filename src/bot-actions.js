
'use strict'

const slack = require('slack')
const _ = require('lodash')
const config = require('./config')
const bola = require('./8ball')
const perola = require('./perolas')
const gActions = require('./google-actions')
const deck = require('./deck')

function lolBack(msg) {
    postRawMessage(msg.channel, `lol back to you mofo`)
}

function emailBack(msg) {
    postMessage(msg.channel, `O email oficial do Modo Pavêtivo é pavetivo@gmail.com a senha é epaveoupacume`, ':love_letter:')
}

function surubao(msg) {
    postRawMessage(msg.channel, `:eyes: Eu ouvi surubão? :aw_yeah:`)
}

function mentions(msg) {
   postMessage(msg.channel, `🤖 Beep boop: qq seis qué cmg carái?!`)
}

function spam(msg) {
    let words = splitRemoveCommand(msg.text)
    let amount = parseInt(words[0])
    if (!amount || amount > 50)
        amount = 5
    else
        words = words.slice(1)
    let time = parseInt(words[0])
    if (!time || time > 60000 || time < 666)
        time = 666
    else
        words = words.slice(1)
    let spamMessage = words.join(" ")
    if (spamMessage === '')
        spamMessage = 'Spamming you :pave:'
    let i = 0
    let timer = setInterval(function () {
        i++
        if (i >= amount)
            clearInterval(timer)
        postRawMessage(msg.channel, spamMessage)
    }, time)

}

function rollDice(msg) {
    let words = splitRemoveCommand(msg.text)
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

    if (dices.length === 0){
        title += '1d20'
        let number = Math.ceil(Math.random() * (20))
        body += '🎲 = ' + number + '\n'
        postMessage(msg.channel, body, title)
        return
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

    postMessage(msg.channel, body, title)
}

function drawCard(msg) {
    let words = splitRemoveCommand(msg.text)
    let times = parseInt(words[0])
    if (!times || times > 15)
        times = 1

    postMessage(msg.channel, deck.drawMultipleCards(times), "Comprando uma carta 🎴")
}

function bolaCommand(msg) {
    let message = splitRemoveCommand(msg.text)
    switch (message[0]) {
        case "add":
            postMessage(msg.channel, bola.addAnswer(message.slice(1).join(" ")))
            logMessage(bola.dump())
            break
        case "dump":
            postMessage(msg.channel, bola.dump())
            break
        case "help":
            postMessage(msg.channel, bola.help())
            break
        default:
            let title = message.join(" ")
            title = ":8ball: " + title
            let answer = bola.getRandomAnswer()
            postMessage(msg.channel, answer, title)
            break
    }

}

function perolaCommand(msg) {
    let message = splitRemoveCommand(msg.text)
    switch (message[0]) {
        case "search":
            postMessage(msg.channel, perola.searchPerola(message.slice(1).join(" ")))
            break
        case "add":
            postMessage(msg.channel, perola.addPerola(message.slice(1).join(" ")))
            logMessage(perola.dump())
            break
        case "bulk":
            postMessage(msg.channel, perola.bulkAdd(message.slice(1).join(" ")))
            logMessage(perola.dump())
            break
        case "dump":
            postMessage(msg.channel, perola.dump())
            break
        case "help":
            postMessage(msg.channel, perola.help())
            break
        case "last":
            postMessage(msg.channel, perola.getLast())
            break
        default:
            postMessage(msg.channel, perola.getRandomAnswer())
    }
}

function gSearch(msg) {
    let message = splitRemoveCommand(msg.text).join(" ")
    if (message.startsWith("help"))
        postMessage(msg.channel, gActions.help())
    else {
        postMessage(msg.channel, '[Google] ' + message)
        gActions.luckySearch(message, function (url) {
            gResponse(msg.channel, message, url)
        })
    }
}

function ySearch(msg) {
    let message = splitRemoveCommand(msg.text).join(" ")
    postMessage(msg.channel, '[YouTube] ' + message)
    gActions.youtubeSearch(message, function (url) {
        gResponse(msg.channel, message, url)
    })
}

function wSearch(msg) {
    let message = splitRemoveCommand(msg.text).join(" ")
    postMessage(msg.channel, '[Wikipedia] ' + message)
    gActions.wikiSearch(message, function (url) {
        gResponse(msg.channel, message, url)
    })
}

function gResponse(channel, message, url) {
    try {
        if (url.startsWith("http://ipv4.google.com/sorry/")) {
            postMessage(channel, "Sorry guys, o tio Google me bloqueou... T~T")
            logMessage("Sorry guys, o tio Google me bloqueou... T~T\nUrl: " + url)
        }
        else if (url.startsWith("http://www.google"))
            postMessage(channel, "[ " + message + " ] Não achei nada ='(")
        else
            postRawMessage(channel, "[ " + message + " ] " + url)
    } catch (e) {
        logMessage('Deu merda no google =(\n link: ' + url + '\nerro: ' + e.toString())
        postMessage(channel, "[ " + message + " ] Não achei nada ='(")
    }
}

function help(msg) {

    let attachments = '['
        + '{"title":":8ball: Bola 8", "color":"#000", "text":"' + bola.help() + '"},'
        + '{"title":":mag: Google", "color":"#e20000", "text":"' + gActions.help() + '"},'
        + '{"title":":d20: d20", "color":"#a111d6", "text":"' + diceHelp() + '"},'
        + '{"title":":face_palm::skin-tone-5: Perolas", "color":"#fc9300", "text":"' + perola.help() + '"},'
        + '{"title":"🤖 PaveBot", "color":"#2fb4fc", "text":"' + botHelp() + '"},'
        + '{"title":"🤖 PaveBot", "color":"#2fb4fc","image_url":"https://pavebot-slack.herokuapp.com/files/d20.png", "text":"' + botHelp() + '"}'
        + ']'

    slack.chat.postMessage({
        token: config('SLACK_TOKEN'),
        icon_emoji: config('ICON_EMOJI'),
        channel: msg.channel,
        username: 'PaveBot',
        text: "Esse é um help geralzão assim...\nCaso eu tenha cochilado :sleeping: use o /wakeup pra me acordar :alarm_clock:\n\n",
        attachments: attachments
    }, (err, data) => {
        if (err) logMessage("buguei: - " + err.status + err.message)
        let txt = _.truncate(data.message.text)
        console.log(`🤖 : "${txt}"`)
    })
}

function botHelp() {
    return "!lol, rí de você" +
        "\n!email, infos do email pavetivo" +
        "\n!spam, spama o FDP sem dó!" +
        "\n!help, esse super mega helper " +
        "\n!draw (n), compra n cartas"
}

function diceHelp() {
    return "!roll, rola um d20" +
        "\n!roll (n)d(m), rola n dm" +
        "\n!roll (n)d(m) +x, rola n dm e soma x" +
        "\nDica: vc pode mandar quantos dados e quantos bonus quiser"
}

function postMessage(channel, body, title) {
    title = title !== undefined ? title : ""
    slack.chat.postMessage({
        token: config('SLACK_TOKEN'),
        icon_emoji: config('ICON_EMOJI'),
        channel: channel,
        unfurl_links: true,
        username: 'PaveBot',
        text: title + " ```" + body + "```"
    }, (err, data) => {
        if (err) logMessage("buguei: - " + err.status + err.message)
        let txt = _.truncate(data.message.text)
        console.log(`🤖 : "${txt}"`)
    })
}

function postRawMessage(channel, message) {
    slack.chat.postMessage({
        token: config('SLACK_TOKEN'),
        icon_emoji: config('ICON_EMOJI'),
        channel: channel,
        unfurl_links: true,
        username: 'PaveBot',
        text: message
    }, (err, data) => {
        if (err) logMessage("buguei: - " + err.status + err.message)
        let txt = _.truncate(data.message.text)
        console.log(`🤖 : "${txt}"`)
    })
}

function logMessage(message) {
    postMessage('CA7MF19JT', message)
}

function splitRemoveCommand(message) {
    let words = message.split(" ")
    return words.slice(1)
}

module.exports = {
    mentions,
    emailBack,
    surubao,
    lolBack,
    spam,
    bolaCommand,
    help,
    perolaCommand,
    logMessage,
    postRawMessage,
    gSearch,
    ySearch,
    wSearch,
    rollDice,
    drawCard
}
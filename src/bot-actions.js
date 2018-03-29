
'use strict'

const slack = require('slack')
const _ = require('lodash')
const config = require('./config')
const bola = require('./8ball')
const perola = require('./perolas')

function lolBack(msg) {
    postMessage(msg.channel, `lol back to you mofo`)
}

function emailBack(msg) {
    postMessage(msg.channel, `O email oficial do Modo Pavêtivo é pavetivo@gmail.com a senha é epaveoupacume`)
}

function mentions(msg) {
   postMessage(msg.channel, `beep boop: qq seis qué cmg carái?!`)
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
        postMessage(msg.channel, spamMessage)
    }, time)

}

function bolaCommand(msg) {
    let message = splitRemoveCommand(msg.text)
    switch (message[0]) {
        case "add":
            postMessage(msg.channel, bola.addAnswer(message.slice(1).join(" ")))
            break
        case "dump":
            postMessage(msg.channel, bola.dump())
            break
        case "help":
            postMessage(msg.channel, bola.help())
            break
        default:
            let finalMessage = message.join(" ")
            finalMessage += "? \n"
            let answer = bola.getRandomAnswer()
            finalMessage += answer
            postMessage(msg.channel, finalMessage)
            break
    }

}

function bolaOito(msg) {
    let finalMessage = splitRemoveCommand(msg.text).join(" ")
    finalMessage += "? \n"
    let answer = bola.getRandomAnswer()
    finalMessage += answer
    postMessage(msg.channel, finalMessage)
}

function bolaOitoAdd(msg) {
    let finalMessage = splitRemoveCommand(msg.text).join(" ")
    postMessage(msg.channel, bola.addAnswer(finalMessage))
}

function bolaOitoDump(msg) {
    postMessage(msg.channel, bola.dump())
}

function perolaCommand(msg) {
    let message = splitRemoveCommand(msg.text)
    switch (message[0]) {
        case "search":
            postMessage(msg.channel, perola.searchPerola(message.slice(1).join(" ")))
            break
        case "add":
            postMessage(msg.channel, perola.addPerola(message.slice(1).join(" ")))
            break
        case "dump":
            postMessage(msg.channel, perola.dump())
            break
        default:
            postMessage(msg.channel, perola.getRandomAnswer())
    }
}

function help(msg) {
    let attachments = [
        {
            title: 'Bola 8, a mágica e mística',
            color: '#2FA44F',
            text: bola.help(),
            mrkdwn_in: ['text']
        },
        {
            title: 'Bola 8, a mágica e mística',
            color: '#2FA44F',
            text: bola.help(),
            mrkdwn_in: ['text']
        }
    ]
    slack.chat.postMessage({
        token: config('SLACK_TOKEN'),
        icon_emoji: config('ICON_EMOJI'),
        channel: msg.channel,
        username: 'PaveBot',
        text: "Esse é um help geralzão assim...",
        attachments: attachments
    }, (err, data) => {
        if (err) throw err
        let txt = _.truncate(data.message.text)
        console.log(`🤖  beep boop: I responded with "${txt}"`)
    })
}

function postMessage(channel, message) {
    slack.chat.postMessage({
        token: config('SLACK_TOKEN'),
        icon_emoji: config('ICON_EMOJI'),
        channel: channel,
        username: 'PaveBot',
        text: "```" + message + "```"
    }, (err, data) => {
        if (err) throw err
        let txt = _.truncate(data.message.text)
        console.log(`🤖  beep boop: I responded with "${txt}"`)
    })
}

function splitRemoveCommand(message) {
    let words = message.split(" ")
    return words.slice(1)
}


module.exports = {
    mentions,
    emailBack,
    lolBack,
    spam,
    bolaCommand,
    help,
    bolaOito,
    bolaOitoAdd,
    bolaOitoDump,
    perolaCommand,
}

'use strict'

const slack = require('slack')
const _ = require('lodash')
const config = require('./config')
const bola = require('./8ball')

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
    throw "lol deu merda"
    let words = msg.text.split(" ")

    let amount = parseInt(words[1])

    if (!amount || amount > 50)
        amount = 5

    for (let i = 0; i < amount; i++) {
        let spamMessage = words.slice(2).join(" ")
        if (spamMessage === '')
            spamMessage = 'Spamming you :pave:'
        let timeout = (i * 666) + 1000
        setTimeout(postMessage(msg.channel, spamMessage), timeout)
    }
}

function bolaOito(msg) {
    let words = msg.text.split(" ")
    let finalMessage = words.slice(1).join(" ")
    finalMessage += "? \n "
    bola.getRandomAnswer(function (message) {
        finalMessage += message
        postMessage(msg.channel, finalMessage)
    })
}

function postMessage(channel, message) {
    slack.chat.postMessage({
        token: config('SLACK_TOKEN'),
        icon_emoji: config('ICON_EMOJI'),
        channel: channel,
        username: 'PaveBot',
        text: message
    }, (err, data) => {
        if (err) throw err
        let txt = _.truncate(data.message.text)
        console.log(`🤖  beep boop: I responded with "${txt}"`)
    })
}


module.exports = {
    mentions,
    emailBack,
    lolBack,
    spam,
    bolaOito
}
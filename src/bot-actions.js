
'use strict'

const slack = require('slack')
const _ = require('lodash')
const config = require('./config')

function lolBack(msg) {
    postMessage(msg.channel, `lol back to you mofo`)
}

function emailBack(msg) {
    postMessage(msg.channel, `O email oficial do Modo Pavêtivo é pavetivo@gmail.com a senha é epaveoupacume`)
}

function mentions(msg) {
   postMessage(msg.channel, `beep boop: I hear you loud and clear!`)
}

function spam(msg) {
    let words = msg.text.split(" ")

    let amount = parseInt(words[1])

    if (!amount)
        amount = 5

    for (let i = 0; i < amount; i++) {
        let spamMessage = words.slice(2).join(" ")
        if (spamMessage === '')
            spamMessage = 'Spamming you :pave:'
        setTimeout(postMessage(msg.channel, spamMessage), 666)
    }
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
    spam
}
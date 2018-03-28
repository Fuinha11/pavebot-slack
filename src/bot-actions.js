
'use strict'

const slack = require('slack')
const _ = require('lodash')
const config = require('./config')

function lolBack(msg) {
    slack.chat.postMessage({
        token: config('SLACK_TOKEN'),
        icon_emoji: config('ICON_EMOJI'),
        channel: msg.channel,
        username: 'Starbot',
        text: `lol back to you mofo`
    }, (err, data) => {
        if (err) throw err
        let txt = _.truncate(data.message.text)
        console.log(`🤖  beep boop: I responded with "${txt}"`)
    })
}

function emailBack(msg) {
    slack.chat.postMessage({
        token: config('SLACK_TOKEN'),
        icon_emoji: config('ICON_EMOJI'),
        channel: msg.channel,
        username: 'Starbot',
        text: `O email oficial do Modo Pavêtivo é pavetivo@gmail.com a senha é epaveoupacume`
    }, (err, data) => {
        if (err) throw err
        let txt = _.truncate(data.message.text)
        console.log(`🤖  beep boop: I responded with "${txt}"`)
    })
}

function mentions(msg) {
    slack.chat.postMessage({
        token: config('SLACK_TOKEN'),
        icon_emoji: config('ICON_EMOJI'),
        channel: msg.channel,
        username: 'Starbot',
        text: `beep boop: I hear you loud and clear!`
    }, (err, data) => {
        if (err) throw err
        let txt = _.truncate(data.message.text)
        console.log(`🤖  beep boop: I responded a mention with "${txt}"`)
    })
}

function spam(msg) {
    let words = msg.text.split(" ")

    let amount = parseInt(words[1])
    if (amount) {
        for (let i = 0; i < amount; i++){
            words.slice(2)
            let spamMessage = words.join(" ")
            if (spamMessage === '')
                spamMessage = 'Spamming you'
            slack.chat.postMessage({
                token: config('SLACK_TOKEN'),
                icon_emoji: config('ICON_EMOJI'),
                channel: msg.channel,
                username: 'Starbot',
                text: spamMessage
            }, (err, data) => {
                if (err) throw err
                let txt = _.truncate(data.message.text)
                console.log(`🤖  beep boop: I responded a mention with "${txt}"`)
            })
        }
    }
}

module.exports = {
    mentions,
    emailBack,
    lolBack,
    spam
}

'use strict'

const slack = require('slack')
const _ = require('lodash')
const config = require('./config')

let bot = slack.rtm.client()

bot.started((payload) => {
  this.self = payload.self
})

bot.message((msg) => {
  if (!msg.user) return
  if (_.includes(msg.text.match(/<@([A-Z0-9])+>/igm), `<@${this.self.id}>`)) mentions(msg)

    let words = msg.text.split(" ")

    switch (words[0]) {
        case "!lol":
            lolBack(msg)
            break
        case "!email":
            emailBack(msg)
            break
    }

})

module.exports = bot

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
        text: `beep boop: I hear you loud and clear!"`
    }, (err, data) => {
        if (err) throw err

        let txt = _.truncate(data.message.text)

        console.log(`🤖  beep boop: I responded a mention with "${txt}"`)
    })
}

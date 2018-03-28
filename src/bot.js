
'use strict'

const slack = require('slack')
const _ = require('lodash')
const config = require('./config')
const actions = require('./bot-actions')

let bot = slack.rtm.client()

bot.started((payload) => {
  this.self = payload.self
})

bot.message((msg) => {
  if (!msg.user) return
  if (_.includes(msg.text.match(/<@([A-Z0-9])+>/igm), `<@${this.self.id}>`)) actions.mentions(msg)

    let words = msg.text.split(" ")

    switch (words[0]) {
        case "!lol":
            actions.lolBack(msg)
            break
        case "!email":
            actions.emailBack(msg)
            break
        case "!spam":
            actions.spam(msg)
            break
    }

})

module.exports = bot
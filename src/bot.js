
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
    try {
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
            case "!8ball":
                actions.bolaCommand(msg)
                break
            case "!8":
                actions.bolaCommand(msg)
                break
            case "!perola":
                actions.perolaCommand(msg)
                break
            case "!help":
                actions.help(msg)
                break
            case "!g":
                actions.gSearch(msg)
                break
            case "!y":
                actions.ySearch(msg)
                break
            case "!w":
                actions.wSearch(msg)
                break
            case "!roll":
                actions.rollDice(msg)
                break
            case "!draw":
                actions.drawCard(msg)
                break
            case "!env":
                actions.chtuluFicha(msg)
                break
        }

        if (msg.text.includes("surub"))
            actions.surubao(msg)

    } catch (e) {
        actions.logMessage("buguei: - " + e.toString())
    }

})

module.exports = bot
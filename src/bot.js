
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

    let text = String(msg.text)
    console.log(text)
  if (text == "!lol") {
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

})

module.exports = bot

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

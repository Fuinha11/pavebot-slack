
'use strict'

const express = require('express')
const proxy = require('express-http-proxy')
const bodyParser = require('body-parser')
const _ = require('lodash')
const config = require('./config')
const commands = require('./commands')
const helpCommand = require('./commands/help')
const googleCommand = require('./commands/google')
const bola = require('./8ball')
const google = require('./google-actions')

let bot = require('./bot')

let app = express()

if (config('PROXY_URI')) {
  app.use(proxy(config('PROXY_URI'), {
    forwardPath: (req, res) => { return require('url').parse(req.url).path }
  }))
}

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => { res.send('\n 👋 🌍 \n') })

app.get('/8ball', (req, res) => {res.send(bola.getRandomAnswer())})

app.get('/search', (req, res) => {res.send(google.luckySearch("macaco", function (hue) {
}))})

app.post('/commands/starbot', (req, res) => {
  let payload = req.body

  if (!payload || payload.token !== config('STARBOT_COMMAND_TOKEN')) {
    let err = '✋  Star—what? An invalid slash token was provided\n' +
              '   Is your Slack slash token correctly configured?'
    console.log(err)
    res.status(401).end(err)
    return
  }

  let cmd = _.reduce(commands, (a, cmd) => {
    return payload.text.match(cmd.pattern) ? cmd : a
  }, helpCommand)

  cmd.handler(payload, res)
})

app.post('/commands/wakeup', (req, res) => {
    let payload = req.body

    if (!payload || payload.token !== config('STARBOT_COMMAND_TOKEN')) {
        let err = '✋  Star—what? An invalid slash token was provided\n' +
            '   Is your Slack slash token correctly configured?'
        console.log(err)
        res.status(401).end(err)
        return
    }

    let cmd = _.reduce(commands, (a, cmd) => {
        return payload.text.match(cmd.pattern) ? cmd : a
    }, googleCommand)

    cmd.handler(payload, res)
})

app.listen(config('PORT'), (err) => {
  if (err) throw err

  console.log(`\n🚀  Starbot LIVES on PORT ${config('PORT')} 🚀`)

  if (config('SLACK_TOKEN')) {
    console.log(`🤖  beep boop: @pavebot is real-time\n`)
    bot.listen({ token: config('SLACK_TOKEN') })
  }
})
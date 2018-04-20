
'use strict'

const slack = require('slack')
const _ = require('lodash')
const config = require('./config')
const bola = require('./8ball')
const perola = require('./perolas')
const gActions = require('./google-actions')

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

function rollDsix(msg) {
    let words = splitRemoveCommand(msg.text)
    let times = parseInt(words[0])
    if (!times || times > 15)
        times = 1
    else
        words = words.slice(1)
    let size = parseInt(words[0])
    if (!size)
        size = 20

    let answer = ""

    for (let i = 0; i < times; i++){
        let number = Math.ceil(Math.random() * (size))
        answer += '🎲 = ' + number + '\n'
    }

    let title = ""
    if (times === 1)
         title = ':d20: Rolando um d' + size
    else
        title = ':d20: Rolando ' + times + ' d' + size

    postMessage(msg.channel, answer, title)
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
    if (url.startsWith("http://ipv4.google.com/sorry/")) {
        postMessage(channel, "Sorry guys, o tio Google me bloqueou... T~T")
        logMessage("Sorry guys, o tio Google me bloqueou... T~T\nUrl: " + url)
    }
    else if (url.startswith("http://www.google"))
        postMessage( channel, "[ " + message + " ] Não achei nada ='(")
    else
        postRawMessage( channel, "[ " + message + " ] " + url)

}

function help(msg) {

    let attachments = '['
        + '{"title":":8ball: Bola 8", "color":"#000", "text":"' + bola.help() + '"},'
        + '{"title":":mag: Google", "color":"#e20000", "text":"' + gActions.help() + '"},'
        + '{"title":":d20: d20", "color":"#a111d6", "text":"' + diceHelp() + '"},'
        + '{"title":":face_palm::skin-tone-5: Perolas", "color":"#fc9300", "text":"' + perola.help() + '"},'
        + '{"title":"🤖 PaveBot", "color":"#2fb4fc", "text":"' + botHelp() + '"}'
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
        "\n!help, esse super mega helper "
}

function diceHelp() {
    return "!d20, rola um d20" +
        "\n!d20 (n), rola n d20" +
        "\n!d20 (n) (m), rola n dm"
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
    rollDsix
}
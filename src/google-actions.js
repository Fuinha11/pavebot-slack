
'use strict'

const request = require('request');

function luckySearch(searchName, callback) {
    searchName = searchName.replace(" ", '+')
    let url = 'http://www.google.com/search?q=' + searchName + '&btnI'
    request(url, function (error, response, body) {
        callback(this.uri.href)
    })
}

function imageSearch(searchName, callback) {
    //Fix me this is not working
    searchName = searchName.replace(" ", '+')
    let url = 'http://www.google.com/search?q=' + searchName + '&btnI'
    request(url, function (error, response, body) {
        callback(this.uri.href)
    })
}

function youtubeSearch(searchName, callback) {
    searchName = searchName.replace(" ", '+')
    let url = 'http://www.google.com/search?q=site%3Ayoutube.com+' + searchName + '&btnI'
    request(url, function (error, response, body) {
        callback(this.uri.href)
    })
}

function wikiSearch(searchName, callback) {
    searchName = searchName.replace(" ", '+')
    let url = 'http://www.google.com/search?q=site%3Awikipedia.org+' + searchName + '&btnI'
    request(url, function (error, response, body) {
        callback(this.uri.href)
    })
}

function parseResponse(resp) {
    let index = resp.indexOf("<h3 class=\"r\"><a href=\"/url?q=") + 30
    let words = resp.substr(index).split("&amp")
    return words[0]
}

module.exports = {
    luckySearch,
    youtubeSearch,
    wikiSearch
}


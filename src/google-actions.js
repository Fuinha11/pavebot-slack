
'use strict'

const request = require('request');

function luckySearch(searchName, callback) {
    searchName = searchName.split(" ").join("+")
    let url = 'http://www.google.com/search?q=' + searchName + '&safe=inactive&btnI'
    const options = {
        url: url,
        method: 'GET',
        followAllRedirects: true,
        followRedirect: true
    };
    request(options, function (error, response, body) {
        if (error)
            console.log(error.toString())
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
    let url = 'site%3Ayoutube.com+' + searchName
    luckySearch(url, callback)
}

function wikiSearch(searchName, callback) {
    searchName = searchName.replace(" ", '+')
    let url = 'site%3Awikipedia.org+' + searchName
    luckySearch(url, callback)
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



'use strict'

const request = require('request');

function luckySearch(searchName, callback) {
    searchName = searchName.replace(" ", '+')
    let url = 'http://www.google.com/search?q=' + searchName
    request(url, function (error, response, body) {
        let resp = parseResponse(body.toString())
        callback(resp)
    })
}

function youtubeSearch(searchName) {
    searchName = searchName.replace(" ", '+')
    let url = 'http://www.google.com/search?q=site%3Awww.youtube.com+' + searchName
    request(url, function (error, response, body) {
        console.log('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        let resp = parseResponse(body.toString())
    })
}

function parseResponse(resp) {
    let index = resp.indexOf("<h3 class=\"r\"><a href=\"/url?q=") + 30
    let words = resp.substr(index).split("&amp")
    return words[0]
}

module.exports = {
    luckySearch,
    youtubeSearch
}


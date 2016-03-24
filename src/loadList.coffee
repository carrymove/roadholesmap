# loadList.coffee
# All about loading playlist with videos
require './utils/array.coffee'
config = require './config.coffee'
player = require('./player.coffee')()

# store it as a global
window.videos = []
window.viewed = 0

loadList = (token) ->
  url = 'https://www.googleapis.com/youtube/v3/playlistItems?part=snippet' +
                                                            '&maxResults=50' +
                                                            '&playlistId=' + config.playlistId +
                                                            '&key=' + config.key

  url += '&pageToken=' + token if token?

  xhr = new XMLHttpRequest()
  xhr.open 'GET', url, true
  xhr.onload = ->
    res = JSON.parse this.responseText

    for item in res.items
      window.videos.push
        id: item.snippet.resourceId.videoId
        coordinates: JSON.parse item.snippet.description.split(/\n/)[0]
        address: item.snippet.description.split(/\n/)[1]

    if res.nextPageToken # recursively load all videos using nextPageToken
      # fast play
      if window.videos.length >= config.fastPlay and window.viewed is 0 and player._loaded
        window.videos.shuffle()

        player.playNext()

      loadList res.nextPageToken
    else
      window.videos.splice 0, window.viewed # remove videos that user already saw
      window.videos.shuffle()

      if window.viewed is 0
        player.playNext()

  xhr.send()

# export
module.exports = loadList
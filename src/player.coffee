# player.coffee
# Player init and aliases
require './utils/array.coffee'
map = require('./map.coffee')()

player = {}
player._loaded = false

player.onReady = ->
  player.yt.setSize window.innerWidth, window.innerHeight
  player._loaded = true

player.onStateChange = (e) ->
  if e.data is YT.PlayerState.ENDED
    player.playNext()

  # if e.data is YT.PlayerState.PLAYING
  #   map.setCenter [-74, 38]

player.onError = (e) ->
  player.playNext()

player.onPlaybackQualityChange = ->

# time to load YT player
player.yt = new YT.Player 'video',
  playerVars:
    'rel': 0 # remove related videos
    'controls': 0 # remove controls
    'showinfo': 0 # remove title
    'autoplay': 1 # ???
    'disablekb': 1 # remove keyboard controls
    'iv_load_policy': 3 # remove annotations
  events:
    'onReady': player.onReady,
    'onStateChange': player.onStateChange,
    'onError': player.onError,
    'onPlaybackQualityChange': player.onPlaybackQualityChange

# resize on resize (sic!)
window.onresize = ->
  player.yt.setSize window.innerWidth, window.innerHeight

# aliases
player.loadById = (id) ->
  player.yt.loadVideoById id

# I think, I'll never use it :)
player.play = ->
  player.yt.playVideo()

player.pause = ->
  player.yt.pauseVideo()

player.loadById = (id) ->
  player.yt.loadVideoById id

player.playNext = ->
  window.viewed++

  videos = window.videos
  viewed = window.viewed

  if videos[viewed]? # not end?
    map.flyTo
      center: videos[viewed].coordinates
      zoom: 14

    console.log videos[viewed].address

    player.loadById videos[viewed].id
  else
    videos.shuffle()
    viewed = 0

    map.flyTo
      center: videos[viewed].coordinates
      zoom: 14

    console.log videos[viewed].address

    player.loadById videos[viewed].id

player.getVolume = ->
  player.yt.getVolume()

player.setVolume = (a) ->
  player.yt.setVolume a

# export
module.exports = (callback) ->
  if callback
    player.yt.addEventListener 'onReady', ->
      player.yt.setSize window.innerWidth, window.innerHeight
      player._loaded = true

      callback()

    return player
  else
    return player
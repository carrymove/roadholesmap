# index.coffee
window.onYouTubeIframeAPIReady = ->
  player = require('./player.coffee') ->
    map = require('./map.coffee') ->
      map.setLayoutProperty 'country-label-lg', 'text-field', '{name_ru}'

      require('./loadList.coffee')()

      setInterval ->
        player.playNext()
      , 3000
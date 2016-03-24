# map.coffee
config = require './config.coffee'

mapboxgl.accessToken = config.mapToken

map = new mapboxgl.Map
  container: 'map'
  style: 'mapbox://styles/mapbox/dark-v8'
  center: [73.36967526977534, 54.99210827927987]
  zoom: 12
  interactive: false

# export
module.exports = (callback) ->
  if callback
    window._maponload = setInterval ->
      if map.loaded()
        clearInterval window._maponload

        callback()
    , 250

    return map
  else
    return map
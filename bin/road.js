(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var config;

config = {
  playlistId: 'PLy_pe5XDDZ1L1zz_DiMYyahzjKdc1hf0D',
  key: 'AIzaSyCFWImJNon0aKly3AyMPORALPd2YtyxZ5w',
  mapToken: 'pk.eyJ1IjoidXBpc2ZyZWUiLCJhIjoiendQb1RXOCJ9.kWzWlTV5W5XyfNwCRktbbA',
  fastPlay: 5
};

module.exports = config;


},{}],2:[function(require,module,exports){
window.onYouTubeIframeAPIReady = function() {
  var player;
  return player = require('./player.coffee')(function() {
    var map;
    return map = require('./map.coffee')(function() {
      map.setLayoutProperty('country-label-lg', 'text-field', '{name_ru}');
      require('./loadList.coffee')();
      return setInterval(function() {
        return player.playNext();
      }, 3000);
    });
  });
};


},{"./loadList.coffee":3,"./map.coffee":4,"./player.coffee":5}],3:[function(require,module,exports){
var config, loadList, player;

require('./utils/array.coffee');

config = require('./config.coffee');

player = require('./player.coffee')();

window.videos = [];

window.viewed = 0;

loadList = function(token) {
  var url, xhr;
  url = 'https://www.googleapis.com/youtube/v3/playlistItems?part=snippet' + '&maxResults=50' + '&playlistId=' + config.playlistId + '&key=' + config.key;
  if (token != null) {
    url += '&pageToken=' + token;
  }
  xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.onload = function() {
    var i, item, len, ref, res;
    res = JSON.parse(this.responseText);
    ref = res.items;
    for (i = 0, len = ref.length; i < len; i++) {
      item = ref[i];
      window.videos.push({
        id: item.snippet.resourceId.videoId,
        coordinates: JSON.parse(item.snippet.description.split(/\n/)[0]),
        address: item.snippet.description.split(/\n/)[1]
      });
    }
    if (res.nextPageToken) {
      if (window.videos.length >= config.fastPlay && window.viewed === 0 && player._loaded) {
        window.videos.shuffle();
        player.playNext();
      }
      return loadList(res.nextPageToken);
    } else {
      window.videos.splice(0, window.viewed);
      window.videos.shuffle();
      if (window.viewed === 0) {
        return player.playNext();
      }
    }
  };
  return xhr.send();
};

module.exports = loadList;


},{"./config.coffee":1,"./player.coffee":5,"./utils/array.coffee":6}],4:[function(require,module,exports){
var config, map;

config = require('./config.coffee');

mapboxgl.accessToken = config.mapToken;

map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/dark-v8',
  center: [73.36967526977534, 54.99210827927987],
  zoom: 12,
  interactive: false
});

module.exports = function(callback) {
  if (callback) {
    window._maponload = setInterval(function() {
      if (map.loaded()) {
        clearInterval(window._maponload);
        return callback();
      }
    }, 250);
    return map;
  } else {
    return map;
  }
};


},{"./config.coffee":1}],5:[function(require,module,exports){
var map, player;

require('./utils/array.coffee');

map = require('./map.coffee')();

player = {};

player._loaded = false;

player.onReady = function() {
  player.yt.setSize(window.innerWidth, window.innerHeight);
  return player._loaded = true;
};

player.onStateChange = function(e) {
  if (e.data === YT.PlayerState.ENDED) {
    return player.playNext();
  }
};

player.onError = function(e) {
  return player.playNext();
};

player.onPlaybackQualityChange = function() {};

player.yt = new YT.Player('video', {
  playerVars: {
    'rel': 0,
    'controls': 0,
    'showinfo': 0,
    'autoplay': 1,
    'disablekb': 1,
    'iv_load_policy': 3
  },
  events: {
    'onReady': player.onReady,
    'onStateChange': player.onStateChange,
    'onError': player.onError,
    'onPlaybackQualityChange': player.onPlaybackQualityChange
  }
});

window.onresize = function() {
  return player.yt.setSize(window.innerWidth, window.innerHeight);
};

player.loadById = function(id) {
  return player.yt.loadVideoById(id);
};

player.play = function() {
  return player.yt.playVideo();
};

player.pause = function() {
  return player.yt.pauseVideo();
};

player.loadById = function(id) {
  return player.yt.loadVideoById(id);
};

player.playNext = function() {
  var videos, viewed;
  window.viewed++;
  videos = window.videos;
  viewed = window.viewed;
  if (videos[viewed] != null) {
    map.flyTo({
      center: videos[viewed].coordinates,
      zoom: 14
    });
    console.log(videos[viewed].address);
    return player.loadById(videos[viewed].id);
  } else {
    videos.shuffle();
    viewed = 0;
    map.flyTo({
      center: videos[viewed].coordinates,
      zoom: 14
    });
    console.log(videos[viewed].address);
    return player.loadById(videos[viewed].id);
  }
};

player.getVolume = function() {
  return player.yt.getVolume();
};

player.setVolume = function(a) {
  return player.yt.setVolume(a);
};

module.exports = function(callback) {
  if (callback) {
    player.yt.addEventListener('onReady', function() {
      player.yt.setSize(window.innerWidth, window.innerHeight);
      player._loaded = true;
      return callback();
    });
    return player;
  } else {
    return player;
  }
};


},{"./map.coffee":4,"./utils/array.coffee":6}],6:[function(require,module,exports){
Array.prototype.shuffle = function() {
  var currentIndex, randomIndex, results, temporaryValue;
  currentIndex = this.length;
  results = [];
  while (currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = this[currentIndex];
    this[currentIndex] = this[randomIndex];
    results.push(this[randomIndex] = temporaryValue);
  }
  return results;
};


},{}]},{},[2]);

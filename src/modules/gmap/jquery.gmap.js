(function($, window) {
  // Default options
  var defaults = {
    api: '',
    lang: 'ru',
    styles: [],
    markerDefaults: {},
    center: {
      lat: 51.61801655,
      lng: 54.93164063
    },
    zoom: 16,
    disableDefaultUI: true,
    markers: []
  };

  var GMap = function GMap(el, options) {
    var _ = this,
      it = (_.it = el),
      options = (_.options = options || {}),
      data = (_.data = $(el).data('gmap') || {}),
      defs = (_.defaults = defaults || {}),
      sets = (_.settings = $.extend(true, {}, defs, options, data)),
      map = (_.map = {});

    _.checkScript();
  };

  var proto = GMap.prototype;

  /**
   * Load map
   */
  proto.loadMap = function() {
    var _ = this,
      it = _.it,
      sets = _.settings,
      map;

    // Init map
    _.map = map = new google.maps.Map(it, sets);

    // Init markers
    $.each(sets.markers, function(i, marker) {
      var ext = $.extend(true, {}, sets.markerDefaults, marker, {
        map: map
      });

      new google.maps.Marker(ext);
    });

    google.maps.event.addListenerOnce(map, 'idle', function() {
      $(it).trigger('mapLoaded.gmap', [_, this]);
    });
  };

  /**
   * Check loaded script
   */
  proto.checkScript = function() {
    var _ = this,
      sets = _.settings;

    var script = $(
      'script[src="https://maps.googleapis.com/maps/api/js?key=' +
        sets.api +
        '&language=' +
        sets.lang +
        '"]'
    );

    if (script.length && typeof google === 'object' && 'maps' in google) {
      _.loadMap();
    } else if (script.length && typeof google !== 'object') {
      script.on('load', function() {
        _.loadMap.call(_);
      });
    } else {
      _.loadScript(sets.api, function() {
        _.loadMap.call(_);
      });
    }
  };

  /**
   * Load script
   */
  proto.loadScript = function(api, callback) {
    var _ = this,
      sets = _.settings;

    var script = $('<script/>').attr(
      'src',
      'https://maps.googleapis.com/maps/api/js?key=' +
        api +
        '&language=' +
        sets.lang +
        ''
    );

    script.on('load', function() {
      if (callback && typeof callback === 'function') callback();
    });

    $('body')
      .get(0)
      .appendChild(script.get(0));
  };

  $.fn.gMap = function(options) {
    var maps = this;

    $.each(maps, function(key, map) {
      var $map = $(map);
      
      map.gMap = new GMap(map, options);
    });

    return this;
  };

  GMap.defaults = defaults;
  window.GMap = GMap;
})(jQuery, window);

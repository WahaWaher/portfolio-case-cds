$(document).ready((function (window, document) {
  /**
   * GoogleMaps
   * get coords: https://www.gps-coordinates.net/
   */
  var gmapSets = {
    api: 'AIzaSyBjRSvOYrqSK2hd__oTm-cjjWKIlHHXbBQ',
  };

  // GoogleMaps: Common
  $('.g-map:not(.lazyload)').gMap(gmapSets);

  // GoogleMaps: Lazy
  $(document).on('lazybeforeunveil', function(e) {
    var $target = $(e.target);

    if ($target.hasClass('g-map'))
      setTimeout(function() {
        $target.gMap(gmapSets);
      }, 0);
  });

  /**
   * Fancybox basic options
   */
  $.extend(true, $.fancybox.defaults, {
    lang: 'en',
  });

  /**
   * Rellax
   */
  $('.rellax-box img').each(function(key, item) {
    item.rellax = new Rellax(item);
  });
  
  /**
   * Animation on lazyloaded
   */
  $(document)
    .on('lazybeforeunveil', function(e) {
      $(e.target).css('opacity', 0);
    })
    .on('lazyloaded', function(e) {
      var $target = $(e.target);

      $target.animateCSS('fadeIn', {
        duration: 500,
        clear: true,
        start: function() {
          setTimeout(function() {
            $target.css('opacity', '');
          }, 525);
        },
        complete: function() {
          $target.css('opacity', '');
        }
      });
    });

  /**
   * LazySizes Init
   */
  lazySizes.init();

  /**
   * AppDrawer
   */
  (function () {

    var $drawers = $('[data-drawer]');
    var $swithes = $('[data-drawerToggle]');

    $drawers.each(function(i, drawer) {
      var $drawer = $(drawer);
      var data = $drawer.data('drawer');
      var options = {};

      if (typeof data === 'string') {
        options.id = data;
      } else if (typeof data === 'object' && typeof data !== null) {
        options = data;
      }

      var sets = $.extend(true, {}, {
        // Defaults...
        active: 'is-active',
        open: '',
        close: '',
        autoClose: true, 
      }, options);

      var $switch = $('[data-drawerToggle="' + sets.id + '"');

      drawer.drawer = {
        open: function () {
          if (sets.autoClose) {
            $drawers.removeClass(sets.active);
            $swithes.removeClass(sets.active);
          }

          $switch.addClass(sets.active);
          $drawer.addClass(sets.active);
        },
        close: function () {
          $switch.removeClass(sets.active);
          $drawer.removeClass(sets.active);
        }
      };

      $('[data-drawerToggle="' + sets.id + '"').on('click', function() {
        var isOpen = $drawer.hasClass('is-active');
        if (isOpen) {
          drawer.drawer.close();
        } else {
          drawer.drawer.open();
        }
      });
    });
  })();

  /**
   * Scroll to block
   */
  // Scroll to selector
  function scrollToSelector(selector) {
    if (!selector) return false;

    $('html,body')
      .stop()
      .animate(
        {
          scrollTop: getOffset(selector)
        },
        {
          duration: 1100,
          easing: 'swing',
          step: function(now, fx) {
            var newDest = getOffset(selector);

            if (fx.end !== newDest) fx.end = newDest;
          },
          complete: function() {
            if (history.pushState) {
              history.pushState(null, null, selector);
            } else {
              location.hash = selector;
            }
          }
        }
      );
  }

  // Gets current offsetTop
  function getOffset(selector) {
    var offset = $(selector).offset();

    return offset ? offset.top : 0;
  }

  if (location.hash) {
    // Disable default anchor scroll
    setTimeout(function() {
      window.scrollTo(0, 0);
    }, 0);

    // Animate anchor scroll when page loaded
    setTimeout(function() {
      scrollToSelector(location.hash);
    }, 250);
  }

  $('a.scroll-to').click(function() {
    var $this = $(this);
    var href = $this.attr('href');
    var parts = href.split('#');
    var selector = parts[1] ? '#' + parts[1] : '';

    if (!selector) return false;

    // disable animate scroll for links that lead to other pages
    if (parts[0]) return;

    scrollToSelector(selector);

    return false;
  });
  /* Scroll to block: End */
})(window, document));

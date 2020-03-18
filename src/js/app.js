$(document).ready(function() {
  /**
   * Animation on lazyloaded
   */
  $(document)
    .on('lazybeforeunveil', function(e) {
      $(e.target).css('opacity', 0);
    })
    .on('lazyloaded', function(e) {
      $(e.target).animateCSS('fadeIn', {
        duration: 1000,
        clear: true,
        complete: function() {
          $(e.target).css('opacity', '');
        }
      });
    });

  /**
   * LazySizes Init
   */
  lazySizes.init();

  /* Back to top button: Start */
  var navButton = $('#top-button'),
    screenHeight = $(window).height(),
    topShow = screenHeight, // hidden before (screenHeight or Number), px
    navSpeed = 1200; // speed, ms

  function scrollCalc() {
    var scrollOut = $(window).scrollTop();

    if (
      scrollOut > topShow &&
      (navButton.attr('class') == '' || navButton.attr('class') == undefined)
    )
      navButton
        .fadeIn()
        .removeClass('down')
        .addClass('up')
        .attr('title', 'Наверх');
    if (scrollOut < topShow && navButton.attr('class') == 'up')
      navButton.fadeOut().removeClass('up down');
    if (scrollOut > topShow && navButton.attr('class') == 'down')
      navButton
        .fadeIn()
        .removeClass('down')
        .addClass('up');
  }

  $(window).bind('scroll', scrollCalc);
  var lastPos = 0;

  navButton.bind('click', function() {
    scrollOut = $(window).scrollTop();

    if (navButton.attr('class') == 'up') {
      lastPos = scrollOut;
      $(window).unbind('scroll', scrollCalc);

      $('body, html').animate(
        {
          scrollTop: 0
        },
        navSpeed,
        'swing',
        function() {
          navButton
            .removeClass('up')
            .addClass('down')
            .attr('title', 'Back');
          $(window).bind('scroll', scrollCalc);
        }
      );
    }
    if (navButton.attr('class') == 'down') {
      $(window).unbind('scroll', scrollCalc);

      $('body, html').animate(
        {
          scrollTop: lastPos
        },
        navSpeed,
        'swing',
        function() {
          navButton
            .removeClass('down')
            .addClass('up')
            .attr('title', 'Top');
          $(window).bind('scroll', scrollCalc);
        }
      );
    }
  });
  /* Back to top button: End */
});

/**
 * Add lazy events for scroll and resize
 */
(function($) {
  var opt = $.extend({
    timeout: 250, // How often the event can fire in milliseconds
    realEvents: ['scroll', 'resize'],
    prefix: 'lazy'
  }, typeof(LazyEventConfig) === 'undefined' ? {} : LazyEventConfig);

  timers = {};

  // Handle a real event
  beLazy = function(event) {
    // If there's no timer for this event
    if (!timers[event.type]) {
      // Create a timer for this event
      timers[event.type] = window.setTimeout(function() {
        // Once the timer ticks, clear the timer
        timers[event.type] = null;
        // And trigger lazy event
        $(window).trigger(opt.prefix + event.type);
      }, opt.timeout);
    }
  }

  // Watch the real events to trigger lazy events
  for (var i = opt.realEvents.length - 1; i >= 0; i--) {
    $(window).on(opt.realEvents[i], beLazy);
  }
})(jQuery);

/**
 * Basic animation library
 * Animate the CSS attribute in the data attribute between the
 * set values over the scroll range
 */
(function($) {
  $.fn.dsAnimate = function(opts) {
    var settings = $.extend({
      scrollTarget: document,
      animOffset: 100, // Offset from bottom of screen before animation starts
      // 100px accounts for disapearing address bars on mobile browsers
      animDuration: 0.6, // Percentage of the screen the animation occurs over
      animStart: 90,
      animEnd: 0,
      elements: this
    }, opts);

    $(window).on('lazyresize', function() {
      settings.windowHeight = $(this).height();
      settings.animWindow = settings.windowHeight * settings.animDuration;
    });
    $(window).trigger('lazyresize');

    $(settings.scrollTarget).scroll(function() {
      var currentTop = $(this).scrollTop();
      var currentBottom = currentTop + settings.windowHeight;
      var animTop = currentBottom - settings.animWindow;

      settings.elements.each(function() {
        var trg = $(this);
        var relTop = trg.parent().offset().top /*+ trg.parent().height()*/ - animTop;
        var animPos = relTop / settings.animWindow;

        if (animPos > 0 && animPos < 1) {
//          var animDeg = ((settings.animEnd - settings.animStart) * animPos) + settings.animStart;
          var animDeg = animPos * trg.data('animstart');
          trg.css('transform', trg.data('anim') + '(' + animDeg + 'deg)');
        } else {
          trg.css('transform', '');
        }
      });
    });
 
    // Make sure all the elements have the attributes we need
    return this.each(function() {
      var that = $(this);
      $(['animStart', 'animEnd', 'animDuration', 'animOffset']).each(function() {
        if (typeof(that.data(this.toLowerCase()) === 'undefined')) {
          that.attr('data-' + this, settings[this]);
        }
      });
    });
  }
}(jQuery));

/**
 * Match Heights and scrolling navigation
 */
$(function() {
  $('#examples h3').matchHeight();
  $('[data-anim]').dsAnimate();

  $('a[href^="#"]').on('click',function (e) {
    e.preventDefault();
    var target = this.hash;
    $target = $(target);
    $('html, body').stop().animate({
      'scrollTop':  $target.offset().top
    }, 900, 'swing', function () {
      window.location.hash = target;
    });
  });
  
  var menuTopToggle = 0;
  
  $(window).on('lazyResize', function() {
    menuTopToggle = $('header').height();
  }).trigger('lazyResize').on('lazyscroll', function() {
    if ($(this).scrollTop() > menuTopToggle) {
      $('#backtop').removeClass('hidden');
    } else {
      $('#backtop').addClass('hidden');
    }
  });

});


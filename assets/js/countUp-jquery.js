// Dependency: CountUp.js: https://github.com/inorganik/CountUp.js

(function ($) {
  $.fn.countup = function (params) {
    // make sure dependency is present
    if (typeof CountUp !== 'function') {
      console.error('countUp.js is a required dependency of countUp-jquery.js.');
      return;
    }

    var defaults = {
      startVal: 0,
      decimalPlaces: 0,
      duration: 2,
      separator: ".",
      decimal: ","
    };

    if (typeof params === 'number') {
      defaults.endVal = params;
    }
    else if (typeof params === 'object') {
      $.extend(defaults, params);
    }
    else {
      console.error('countUp-jquery requires its argument to be either an object or number');
      return;
    }

    this.each(function (i, elem) {
      var countUp = new CountUp(elem, defaults.endVal, defaults);
      countUp.start();
    });

    return this;
  };

}(jQuery));
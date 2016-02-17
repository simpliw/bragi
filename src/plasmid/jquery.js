/**
 * Created by bqxu on 16/2/17.
 */
let main = require('./index.js');
let {parse} = require('./core/parse.js');
(function ($) {
  // Extend jQuery
  $.Plasmid = {
    parse: function (text) {
      return parse(text);
    }
  };

  // Extend jQuery object
  $.fn.Plasmid = function (options) {
    var self = this;

    // Get options
    var opts = $.extend({}, $.fn.Plasmid.defaults, options);
    // Get gbff by AJAX
    if (opts.gbffUrl) $.ajax({url: opts.gbffUrl}).done(function (data) {
      opts.gbff = $.Plasmid.parse(data);
      main.init(self[0], opts)
    });
    // Render SVG
    main.init(self[0], opts)
  };

})(require('jquery'));

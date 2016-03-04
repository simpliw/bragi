/**
 * Created by bqxu on 16/2/17.
 */
let {Plasmid} = require('./index.js');
let {parse} = require('./data/parse.js');
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
      Plasmid(self[0], opts)
    });
    // Render SVG
    Plasmid(self[0], opts)
  };

})(require('jquery'));

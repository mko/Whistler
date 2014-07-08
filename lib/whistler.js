/*
 * Algorithmically reversible, database-less URL Shortener
 * for Node.js by Michael Owens <mk@mowens.com>.
 *
 * Whistler is an implementation of Tantek Çelik's
 * Whistle URL shortener design pattern. Read the
 * design pattern to understand how it works.
 *           http://tantek.pbworks.com/Whistle
 *
 * Released under CC BY-SA 3.0:
 *           http://creativecommons.org/licenses/by-sa/3.0/
 */

var NewBase60 = require('newbase60');
var moment = require('moment');

// Converts a Published Datetime, Content Type, and Content Ordinal into a shortened URL fragment.
function shorten(published, contentType, ordinal) {
  var sxg = NewBase60.DateToSXGF(published, 3);
  return contentType + '/' + sxg + ordinal;
}

// Converts a shortened URL fragment (i.e. 't/4432' or 't4432') into an expanded Whistle URL fragment (i.e. '2010/034/t2' or '2010/02/03/t2').
function expand(fragment, dateFormat) {
  var sxg;
  var ordinal;
  var contentType = fragment.charAt(0);

  // Check if fragment is an extra short URL fragment (i.e. 't4432') or normal short URL fragment (i.e. 't/4432')
  if(fragment.charAt(1) == '/') {
    sxg = fragment.substr(2,3);
    ordinal = fragment.charAt(5)
  } else {
    sxg = fragment.substr(1,3);
    ordinal = fragment.charAt(4)
  }

  // Convert Sexagesimal into Date Object
  var dateObj = NewBase60.toDate(sxg);

  // Use Moment to Format date portion of Whistler string ('YYYY/DDD' format is recommended)
  var dateString = moment(dateObj).format(dateFormat);

  return dateString + '/' + contentType + ordinal;
}

// Explains a shortened URL fragment, returning a JSON object representation of the URL.
function explain(fragment) {
  var sxg;
  var ordinal;
  var contentType = fragment.charAt(0);

  // Check if fragment is an extra short URL fragment (i.e. 't4432') or normal short URL fragment (i.e. 't/4432')
  if(fragment.charAt(1) == '/') {
    sxg = fragment.substr(2,3);
    ordinal = fragment.charAt(5)
  } else {
    sxg = fragment.substr(1,3);
    ordinal = fragment.charAt(4)
  }

  // Convert Sexagesimal into Date Object
  var dateObj = NewBase60.toDate(sxg);

  return {
    date: dateObj,
    content: contentType,
    ordinal: ordinal
  };
}

module.exports.shorten = shorten;
module.exports.expand = expand;
module.exports.explain = explain;

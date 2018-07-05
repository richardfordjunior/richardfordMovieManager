'use strict';
const _ = require('lodash');

exports.formatMovieLength = function(valIn){
  _.map(valIn,(n)=>{
    return n.length = formatLength(n.length);
 })

 function formatLength(n){
  var num = n;
  var hours = (num / 60);
  var rhours = Math.floor(hours);
  var minutes = (hours - rhours) * 60;
  var rminutes = Math.round(minutes);
  return `${rhours} hr ${rminutes} min`;
 }
}
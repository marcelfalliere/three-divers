
var on_debug = false
    on_perf = false

if (on_debug) var debug = console.log.bind(window.console)
else var debug = function(){}

var last_perf_start;
if (on_perf) var perf = console.log.bind(window.console)
else var perf = function(){}
var perf_start = function() {
  last_perf_start = new Date().getTime();
}
var perf_end = function(label) {
  perf("label took " + Math.round( (last_perf_start - new Date().getTime()) / 1000 ) + "s")
}

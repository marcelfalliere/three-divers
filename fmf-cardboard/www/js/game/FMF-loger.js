
var on_error = true
    on_debug = false
    on_info = true
    on_perf = false


if (on_error) var error = console.error.bind(window.console)
else var error = function(){}

if (on_debug) var debug = console.log.bind(window.console)
else var debug = function(){}

if (on_info) var info = console.info.bind(window.console)
else var info = function(){}


var last_perf_start;
if (on_perf) var perf = console.log.bind(window.console)
else var perf = function(){}
var perf_start = function() {
  last_perf_start = new Date().getTime();
}
var perf_end = function(label) {
  perf("label took " + Math.round( (last_perf_start - new Date().getTime()) / 1000 ) + "s")
}

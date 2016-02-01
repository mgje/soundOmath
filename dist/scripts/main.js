(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

$(document).ready(function () {

	var updateGraph = function updateGraph(data) {
		var grp = svg.selectAll('g').data(data);

		var selection = grp.selectAll('rect').data(function (d) {
			return d;
		}).attr('fill', function (d, i) {
			return lookup[d[1]];
		});

		selection.enter().append('rect').attr('x', function (d, i) {
			return 28 * i;
		}).attr('width', rw).attr('height', rh);

		selection.exit().remove();
	};

	var renderGraph = function renderGraph(data) {
		// Create a group for each row in the data matrix and
		// translate the group vertically
		var grp = svg.selectAll('g').data(data).enter().append('g').attr('transform', function (d, i) {
			return 'translate(0, ' + 54 * i + ')';
		});

		// For each group, create a set of rectangles and bind
		// them to the inner array (the inner array is already
		// binded to the group)
		grp.selectAll('rect').data(function (d) {
			return d;
		}).enter().append('rect').attr('x', function (d, i) {
			return 28 * i;
		}).attr('fill', function (d, i) {
			return lookup[d[1]];
		}).attr('width', rw).attr('height', rh);

		//Modulo 10 ticks       
		grp.selectAll('line').data(function (d) {
			return d;
		}).enter().append('line').filter(function (d, i) {
			return i % 10 === 0;
		}).attr('x1', function (d, i) {
			return 280 * i + 1;
		}).attr('y1', 20).attr('x2', function (d, i) {
			return 280 * i + 1;
		}).attr('y2', 40).style('stroke', 'black').style('stroke-width', '2px');

		// Text
		grp.selectAll('text').data(function (d) {
			return d;
		}).enter().append('text').filter(function (d, i) {
			return i % 10 === 0;
		}).attr('x', function (d, i) {
			return 280 * i + 5;
		}).attr('y', '38').attr('font-family', 'sans-serif').text(function (d, i, k) {
			return k * 40 + i * 10 + 1;
		});
	};

	// get values
	var getButtonIds = function getButtonIds() {
		return ['#btn-row1-1', '#btn-row1-2', '#btn-row1-3', '#btn-row1-4'];
	};

	var readInput = function readInput() {
		var ids = getButtonIds();
		var out = [];
		for (var i in ids) {
			var val = $(ids[i]).parent().parent().children('input')[0].value;
			out.push(val);
		}
		return out;
	};

	// Redraw Game
	var redraw = function redraw(inpstrarr) {
		var inp = [];
		// parse input
		for (var i = 0; i < inpstrarr.length; i++) {
			inp.push(parseInt(inpstrarr[i]));
		};

		// init values
		var t = 1,
		    // cout value
		data = [],
		    col = undefined,
		    nextEvent = undefined,
		    tmp = 0;

		for (var i = 0; i < inp.length; i++) {
			col = i;
			nextEvent = inp[col];
			if (nextEvent > 0) {
				break;
			}
		}

		for (var k = 0; k < rowN; k += 1) {
			var row = [];
			data.push(row);
			for (var i = 0; i < colN; i += 1) {
				if (t === nextEvent) {
					// jump over 0 color entries
					tmp = col + 1; // black has index 0
					// if something is zero go further
					while (inp[(col + 1) % inp.length] < 1) {
						col = (col + 1) % inp.length;
					}
					nextEvent += inp[(col + 1) % inp.length];
					col = (col + 1) % inp.length; // next color
				} else {
						tmp = 0;
					}
				row.push([t, tmp]);
				t = t + 1;
			}
		}
		return data;
	};

	var highlightEl = function highlightEl(el, col, time) {
		$(el).attr("fill", hlookup[col]);
		setTimeout(function () {
			$(el).attr("fill", lookup[col]);
		}, time * 1000);
	};

	var registerInputOnChange = function registerInputOnChange() {
		var ids = getButtonIds();
		for (var i in ids) {
			$(ids[i]).parent().parent().children('input.form-control').change(function () {
				var newdata = redraw(readInput());
				updateGraph(newdata);
			});
		}
	};

	// Listen on Menu entry
	var registerButton = function registerButton() {
		var idArr = getButtonIds();
		var ec = jQuery.Event('change');

		var _loop = function _loop(i) {
			$(idArr[i]).parent().children('ul.dropdown-menu').on('click', function (e) {
				$(idArr[i]).parent().parent().children('input.form-control').attr('value', e.target.text)
				//send change event
				.trigger(ec);
			});
		};

		for (var i in idArr) {
			_loop(i);
		}
	};

	var registerPlayButton = function registerPlayButton() {
		$('#playmusicbtn').on('click', function (e) {
			runSeq = true;
			playMusic();
			//alert('here');
		});
	};

	var registerStopButton = function registerStopButton() {
		$('#stopmusicbtn').on('click', function (e) {
			runSeq = false;
			//alert('here');
		});
	};

	// const registerParameterButton = () => {
	// 	$('#parameterbtn').on('click', (e) => {
	// 		let el = d3.selectAll('rect')[0][4];
	// 		let time = 0.9;
	// 		highlightEl(el,0,time);
	// 	});
	// };

	$('#paraOszbtn').on('click', function (e) {
		var s2 = $('input[name=speed]:checked', '#parameterModal').val();
		var s = $('input[name=oszform]:checked', '#parameterModal').val();
		//if (! typeof s === "undefined" && ! typeof s2  === "undefined"){
		if (!false) {
			oscillatorType = s;
			soundSpeed = parseFloat(s2);
			$('#parameterModal').modal('hide');
		}
	});

	// Sound Definition

	var playSound = function playSound(startTime, pitch, duration, gain) {
		//let startTime = audioContext.currentTime + delay;
		var endTime = startTime + duration;

		var outgain = audioContext.createGain();
		outgain.gain.value = gain;
		outgain.connect(audioContext.destination);

		var envelope = audioContext.createGain();
		envelope.connect(outgain);
		envelope.gain.value = 0;

		envelope.gain.setTargetAtTime(1, startTime, envelopeStartEndTime[0]);
		envelope.gain.setTargetAtTime(0, endTime, envelopeStartEndTime[1]);

		var oscillator = audioContext.createOscillator();
		oscillator.connect(envelope);

		oscillator.type = oscillatorType;
		oscillator.detune.value = pitch * 100;
		oscillator.frequency.value = 240;

		var vibrato = audioContext.createGain();
		vibrato.gain.value = vibratogain;
		vibrato.connect(oscillator.detune);

		var lfo = audioContext.createOscillator();
		lfo.connect(vibrato);
		lfo.frequency.value = lfofreq;

		oscillator.start(startTime);
		lfo.start(startTime);
		oscillator.stop(endTime + 2);
		lfo.stop(endTime + 2);
	};

	/// Play Loop
	var runSequencers = function runSequencers() {
		if (!runSeq || soundQueue.length === 0) {
			console.log("stop");return;
		}
		var ct = audioContext.currentTime;
		while (soundQueue.length > 0 && soundQueue[0][0] < ct + 0.15) {
			//console.log('ct:'+ct+'planed time:'+soundQueue[0][0]);
			var tone = soundQueue.splice(0, 1);
			// playsound (starttime, pitch, duration,             gaiin)
			playSound(tone[0][0], sounds[tone[0][1]][0], tone[0][2], sounds[tone[0][1]][2]);
			// element              color       duration
			highlightEl(tone[0][3], tone[0][1], tone[0][2]);
		}
		setTimeout(runSequencers, 90);
	};

	/// sounds start here
	/// Sound var
	var runSeq = true;
	var soundQueue = [];

	var audioContext = null;

	if ('webkitAudioContext' in window) {
		audioContext = new webkitAudioContext();
	} else {
		audioContext = new AudioContext();
	}

	var soundSpeed = 0.5;
	var toneduration = 0.3;
	var vibratogain = 0.3;
	var envelopeStartEndTime = [0.01, 0.1];
	var lfofreq = 6; //5
	// Parametrization of the 5 tones  Pitch duration volume gain
	var sounds = [[-10, 0.5, 0.1], [3, 0.5, 0.9], [10, 0.5, 0.9], [15, 0.5, 0.9], [0, 0.5, 0.9]];
	var oscillatorType = 'sawtooth'; //'sine'; // 'sawtooth'

	/// Sound Methods
	var playMusic = function playMusic() {
		// fill soundQueue	
		var rectarr = d3.selectAll('rect').data();
		var elarr = d3.selectAll('rect')[0];
		var startTime = audioContext.currentTime;
		//console.log('Start'+startTime);
		soundQueue = [];
		for (var i = 0; i < rectarr.length; i++) {
			var v = rectarr[i][1];
			//playSound(i,sounds[v][0],sounds[v][1],sounds[v][2]);
			//alert(i);
			var tmp = [];
			tmp.push(i * soundSpeed + startTime);
			tmp.push(v);
			tmp.push(toneduration);
			tmp.push(elarr[i]);
			soundQueue.push(tmp);
		}
		//console.log('startsequencer'+audioContext.currentTime);
		runSequencers();
	};

	// Init Screen
	var width = 1230,
	    height = 225,
	    div = d3.select('#chart'),
	    svg = div.append('svg').attr('width', width).attr('height', height),
	   
	//grid   
	rw = 20,
	    rh = 20,
	    rowN = 4,
	    colN = 40,
	   
	//colordefinition
	lookup = ['#454545', '#296EAA', '#D43F3A', '#5CB85C', '#46B0CF'],
	    hlookup = ['#000000', '#094E8A', '#A41F1A', '#3C983C', '#2690AF'],
	    rrange = lookup.length;

	// Register Buttons
	registerButton();
	registerInputOnChange();
	var mydata = redraw(readInput());
	renderGraph(mydata);
	registerPlayButton();
	registerStopButton();
	// registerParameterButton();
});

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvc2NyaXB0cy9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQSxFQUFFLFFBQUYsRUFBWSxLQUFaLENBQWtCLFlBQVU7O0FBRTVCLEtBQU0sY0FBYyxTQUFkLFdBQWMsQ0FBQyxJQUFELEVBQVU7QUFDN0IsTUFBSSxNQUFNLElBQUksU0FBSixDQUFjLEdBQWQsRUFDTCxJQURLLENBQ0EsSUFEQSxDQUFOLENBRHlCOztBQUk3QixNQUFJLFlBQVksSUFBSSxTQUFKLENBQWMsTUFBZCxFQUFzQixJQUF0QixDQUEyQixVQUFDLENBQUQ7VUFBTztHQUFQLENBQTNCLENBQ2QsSUFEYyxDQUNULE1BRFMsRUFDRCxVQUFDLENBQUQsRUFBRyxDQUFIO1VBQVMsT0FBTyxFQUFFLENBQUYsQ0FBUDtHQUFULENBRFgsQ0FKeUI7O0FBTzdCLFlBQVUsS0FBVixHQUNFLE1BREYsQ0FDUyxNQURULEVBRUssSUFGTCxDQUVVLEdBRlYsRUFFZSxVQUFDLENBQUQsRUFBSSxDQUFKO1VBQVcsS0FBSyxDQUFMO0dBQVgsQ0FGZixDQUdLLElBSEwsQ0FHVSxPQUhWLEVBR21CLEVBSG5CLEVBSUssSUFKTCxDQUlVLFFBSlYsRUFJb0IsRUFKcEIsRUFQNkI7O0FBYTdCLFlBQVUsSUFBVixHQUFpQixNQUFqQixHQWI2QjtFQUFWLENBRlE7O0FBa0I1QixLQUFNLGNBQWMsU0FBZCxXQUFjLENBQUMsSUFBRCxFQUFVOzs7QUFHN0IsTUFBSSxNQUFNLElBQUksU0FBSixDQUFjLEdBQWQsRUFDTCxJQURLLENBQ0EsSUFEQSxFQUVMLEtBRkssR0FHTCxNQUhLLENBR0UsR0FIRixFQUlMLElBSkssQ0FJQSxXQUpBLEVBSWEsVUFBQyxDQUFELEVBQUksQ0FBSjtVQUFVLGtCQUFrQixLQUFLLENBQUwsR0FBUyxHQUEzQjtHQUFWLENBSm5COzs7OztBQUh5QixLQVk3QixDQUFJLFNBQUosQ0FB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U3RDLGNBQVcsSUFBWCxDQUFnQixHQUFoQixFQVRzQztHQUF2Qzs7QUFQdUIsZUFtQnBCLEdBbkJvQjtFQUFOOzs7QUExUlUsS0FpVHJCLFFBQVEsSUFBUjtLQUNILFNBQVMsR0FBVDtLQUNBLE1BQU0sR0FBRyxNQUFILENBQVUsUUFBVixDQUFOO0tBQ0EsTUFBTSxJQUFJLE1BQUosQ0FBVyxLQUFYLEVBQ0QsSUFEQyxDQUNJLE9BREosRUFDYSxLQURiLEVBRUQsSUFGQyxDQUVJLFFBRkosRUFFYyxNQUZkLENBQU47OztBQUlBLE1BQUssRUFBTDtLQUNBLEtBQUssRUFBTDtLQUNBLE9BQU0sQ0FBTjtLQUNBLE9BQU0sRUFBTjs7O0FBRUEsVUFBUyxDQUFDLFNBQUQsRUFBVyxTQUFYLEVBQXFCLFNBQXJCLEVBQStCLFNBQS9CLEVBQXlDLFNBQXpDLENBQVQ7S0FDQSxVQUFVLENBQUMsU0FBRCxFQUFXLFNBQVgsRUFBcUIsU0FBckIsRUFBK0IsU0FBL0IsRUFBeUMsU0FBekMsQ0FBVjtLQUNBLFNBQVMsT0FBTyxNQUFQOzs7QUEvVGUsZUFrVTNCLEdBbFUyQjtBQW1VM0IseUJBblUyQjtBQW9VM0IsS0FBSSxTQUFTLE9BQU8sV0FBUCxDQUFULENBcFV1QjtBQXFVM0IsYUFBWSxNQUFaLEVBclUyQjtBQXNVM0Isc0JBdFUyQjtBQXVVM0I7O0NBdlVpQixDQUFsQjtBQUE0QiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xuXG5jb25zdCB1cGRhdGVHcmFwaCA9IChkYXRhKSA9PiB7XG5cdGxldCBncnAgPSBzdmcuc2VsZWN0QWxsKCdnJylcblx0ICAgIC5kYXRhKGRhdGEpO1xuXG5cdGxldCBzZWxlY3Rpb24gPSBncnAuc2VsZWN0QWxsKCdyZWN0JykuZGF0YSgoZCkgPT4gZClcblx0XHQuYXR0cignZmlsbCcsIChkLGkpID0+IGxvb2t1cFtkWzFdXSk7XG5cblx0c2VsZWN0aW9uLmVudGVyKClcblx0XHQuYXBwZW5kKCdyZWN0Jylcblx0ICAgIC5hdHRyKCd4JywgKGQsIGkpID0+ICAyOCAqIGkpXG5cdCAgICAuYXR0cignd2lkdGgnLCBydylcblx0ICAgIC5hdHRyKCdoZWlnaHQnLCByaCk7XG5cblx0c2VsZWN0aW9uLmV4aXQoKS5yZW1vdmUoKTsgICAgXG59O1xuXG5jb25zdCByZW5kZXJHcmFwaCA9IChkYXRhKSA9PiB7XG5cdC8vIENyZWF0ZSBhIGdyb3VwIGZvciBlYWNoIHJvdyBpbiB0aGUgZGF0YSBtYXRyaXggYW5kXG5cdC8vIHRyYW5zbGF0ZSB0aGUgZ3JvdXAgdmVydGljYWxseVxuXHRsZXQgZ3JwID0gc3ZnLnNlbGVjdEFsbCgnZycpXG5cdCAgICAuZGF0YShkYXRhKVxuXHQgICAgLmVudGVyKClcblx0ICAgIC5hcHBlbmQoJ2cnKVxuXHQgICAgLmF0dHIoJ3RyYW5zZm9ybScsIChkLCBpKSA9PiAndHJhbnNsYXRlKDAsICcgKyA1NCAqIGkgKyAnKScpO1xuXG5cdC8vIEZvciBlYWNoIGdyb3VwLCBjcmVhdGUgYSBzZXQgb2YgcmVjdGFuZ2xlcyBhbmQgYmluZCBcblx0Ly8gdGhlbSB0byB0aGUgaW5uZXIgYXJyYXkgKHRoZSBpbm5lciBhcnJheSBpcyBhbHJlYWR5XG5cdC8vIGJpbmRlZCB0byB0aGUgZ3JvdXApXG5cdGdycC5zZWxlY3RBbGwoJ3JlY3QnKVxuXHQgICAgLmRhdGEoKGQpID0+IGQpXG5cdCAgICAuZW50ZXIoKVxuXHQgICAgLmFwcGVuZCgncmVjdCcpXG5cdCAgICAgICAgLmF0dHIoJ3gnLCAoZCwgaSkgPT4gIDI4ICogaSlcblx0ICAgICAgICAuYXR0cignZmlsbCcsIChkLGkpID0+IGxvb2t1cFtkWzFdXSlcblx0ICAgICAgICAuYXR0cignd2lkdGgnLCBydylcblx0ICAgICAgICAuYXR0cignaGVpZ2h0JywgcmgpOyAgICAgXG5cblx0Ly9Nb2R1bG8gMTAgdGlja3MgICAgICAgIFxuXHRncnAuc2VsZWN0QWxsKCdsaW5lJylcblx0ICAgIC5kYXRhKCAoZCkgPT4gZClcblx0ICAgIC5lbnRlcigpLmFwcGVuZCgnbGluZScpXG5cdCAgICAuZmlsdGVyKChkLGkpID0+IGklMTA9PT0wKVxuICBcdFx0XHQuYXR0cigneDEnLCAgKGQsIGkpID0+IDI4MCAqIGkrMSlcbiAgXHRcdFx0LmF0dHIoJ3kxJywgMjApXG4gIFx0XHRcdC5hdHRyKCd4MicsIChkLCBpKSA9PiAyODAgKiBpKzEpXG4gIFx0XHRcdC5hdHRyKCd5MicsNDApXG4gIFx0XHRcdC5zdHlsZSgnc3Ryb2tlJywgJ2JsYWNrJylcbiAgXHRcdFx0LnN0eWxlKCdzdHJva2Utd2lkdGgnLCcycHgnKTsgICAgICBcblxuICBcdC8vIFRleHQgXG4gIFx0Z3JwLnNlbGVjdEFsbCgndGV4dCcpXG5cdCAgICAuZGF0YSggKGQpID0+IGQpXG5cdCAgICAuZW50ZXIoKS5hcHBlbmQoJ3RleHQnKVxuXHQgICAgLmZpbHRlcigoZCxpKSA9PiBpJTEwPT09MClcblx0ICAgIFx0LmF0dHIoJ3gnLCAoZCwgaSkgPT4geyByZXR1cm4gMjgwICogaSs1OyB9KVxuXHQgICAgXHQuYXR0cigneScsICczOCcpICBcblx0ICAgIFx0LmF0dHIoJ2ZvbnQtZmFtaWx5JywgJ3NhbnMtc2VyaWYnKSBcblx0ICAgIFx0LnRleHQoIChkLCBpLGspID0+IGsqNDAraSoxMCsxKTsgXG59O1xuXG4vLyBnZXQgdmFsdWVzXG5jb25zdCBnZXRCdXR0b25JZHMgPSAoKSA9PiBbJyNidG4tcm93MS0xJywnI2J0bi1yb3cxLTInLCcjYnRuLXJvdzEtMycsJyNidG4tcm93MS00J107XG5cbmNvbnN0IHJlYWRJbnB1dCA9ICgpID0+IHtcblx0bGV0IGlkcyA9IGdldEJ1dHRvbklkcygpO1xuXHRsZXQgb3V0ID0gW107XG5cdGZvciAobGV0IGkgaW4gaWRzKSB7XG5cdFx0bGV0IHZhbCA9ICQoaWRzW2ldKVxuXHRcdFx0XHRcdFx0LnBhcmVudCgpXG5cdFx0XHRcdFx0XHQucGFyZW50KClcblx0XHRcdFx0XHRcdC5jaGlsZHJlbignaW5wdXQnKVswXS52YWx1ZTtcblx0XHRvdXQucHVzaCh2YWwpO1xuXHR9XG5cdHJldHVybiBvdXQ7XG59O1xuXG4vLyBSZWRyYXcgR2FtZVxuY29uc3QgcmVkcmF3ID0gKGlucHN0cmFycikgPT4ge1xuXHRsZXQgaW5wID0gW107XG5cdC8vIHBhcnNlIGlucHV0XG5cdGZvciAobGV0IGkgPSAwOyBpIDwgaW5wc3RyYXJyLmxlbmd0aDsgaSsrKXtcblx0XHRpbnAucHVzaChwYXJzZUludChpbnBzdHJhcnJbaV0pKTtcblx0fTtcblxuICAgIC8vIGluaXQgdmFsdWVzXG5cdGxldCB0ID0gMSwgLy8gY291dCB2YWx1ZVxuXHRcdGRhdGEgPSBbXSxcblx0XHRjb2wsXG5cdFx0bmV4dEV2ZW50LFxuXHRcdHRtcCA9IDA7XG5cblx0Zm9yIChsZXQgaSA9IDA7IGkgPCBpbnAubGVuZ3RoOyBpKyspe1xuXHRcdGNvbCA9IGk7XG5cdFx0bmV4dEV2ZW50ID0gaW5wW2NvbF07XG5cdFx0aWYgKG5leHRFdmVudCA+IDApe1xuXHRcdFx0YnJlYWs7XG5cdFx0fVxuXHR9XG5cblx0Zm9yIChsZXQgayA9IDA7IGsgPCByb3dOOyBrICs9IDEpIHtcblx0XHRsZXQgcm93ID0gW107XG5cdFx0ZGF0YS5wdXNoKHJvdyk7XG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBjb2xOOyBpICs9MSl7XG5cdFx0XHRpZiAodCA9PT0gIG5leHRFdmVudCl7XG5cdFx0XHRcdC8vIGp1bXAgb3ZlciAwIGNvbG9yIGVudHJpZXNcblx0XHRcdFx0dG1wID0gY29sKzE7IC8vIGJsYWNrIGhhcyBpbmRleCAwXG5cdFx0XHRcdC8vIGlmIHNvbWV0aGluZyBpcyB6ZXJvIGdvIGZ1cnRoZXJcblx0XHRcdFx0d2hpbGUgKGlucFsoY29sKzEpJWlucC5sZW5ndGhdIDwgMSl7XG5cdFx0XHRcdFx0Y29sID0gKGNvbCsxKSVpbnAubGVuZ3RoO1xuXHRcdFx0XHR9XG5cdFx0XHRcdG5leHRFdmVudCArPSBpbnBbKGNvbCsxKSVpbnAubGVuZ3RoXTtcblx0XHRcdFx0Y29sID0gKGNvbCsxKSVpbnAubGVuZ3RoOyAvLyBuZXh0IGNvbG9yXG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0bXAgPSAwO1xuXHRcdFx0fVxuXHRcdFx0cm93LnB1c2goW3QsIHRtcF0pO1xuXHRcdFx0dCA9IHQgKyAxO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gZGF0YTtcbn07XG5cblxuY29uc3QgaGlnaGxpZ2h0RWwgID0gKGVsLGNvbCx0aW1lKSA9PntcbiAgICQoZWwpLmF0dHIoIFwiZmlsbFwiLCBobG9va3VwW2NvbF0pO1xuICAgc2V0VGltZW91dCgoKSA9PiB7JChlbCkuYXR0ciggXCJmaWxsXCIsIGxvb2t1cFtjb2xdKTt9LHRpbWUqMTAwMCk7XG5cbn07XG5cbmNvbnN0IHJlZ2lzdGVySW5wdXRPbkNoYW5nZSA9ICgpID0+IHtcblx0bGV0IGlkcyA9IGdldEJ1dHRvbklkcygpO1xuXHRmb3IgKGxldCBpIGluIGlkcykge1xuXHRcdCQoaWRzW2ldKVxuXHRcdFx0LnBhcmVudCgpXG5cdFx0XHQucGFyZW50KClcblx0XHRcdC5jaGlsZHJlbignaW5wdXQuZm9ybS1jb250cm9sJylcblx0XHRcdC5jaGFuZ2UoKCkgPT4ge1xuXHRcdFx0XHRsZXQgbmV3ZGF0YSA9IHJlZHJhdyhyZWFkSW5wdXQoKSk7XG5cdFx0XHRcdHVwZGF0ZUdyYXBoKG5ld2RhdGEpO1xuXHRcdFx0fSk7XG5cdH1cbn07XG5cbi8vIExpc3RlbiBvbiBNZW51IGVudHJ5XG5jb25zdCByZWdpc3RlckJ1dHRvbiA9ICgpID0+IHtcblx0bGV0IGlkQXJyID0gZ2V0QnV0dG9uSWRzKCk7XG5cdGxldCBlYyA9IGpRdWVyeS5FdmVudCggJ2NoYW5nZScgKTtcbiAgICBmb3IgKGxldCBpIGluIGlkQXJyKSB7XG4gICAgXHQkKGlkQXJyW2ldKVxuXHRcdFx0LnBhcmVudCgpXG5cdFx0XHQuY2hpbGRyZW4oJ3VsLmRyb3Bkb3duLW1lbnUnKVxuXHRcdFx0Lm9uKCdjbGljaycsIChlKSA9PiB7XG5cdFx0XHRcdCQoaWRBcnJbaV0pXG5cdFx0XHRcdC5wYXJlbnQoKVxuXHRcdFx0XHQucGFyZW50KClcblx0XHRcdFx0LmNoaWxkcmVuKCdpbnB1dC5mb3JtLWNvbnRyb2wnKVxuXHRcdFx0XHQuYXR0cigndmFsdWUnLGUudGFyZ2V0LnRleHQpXG5cdFx0XHRcdC8vc2VuZCBjaGFuZ2UgZXZlbnRcblx0XHRcdFx0LnRyaWdnZXIoZWMpO1xuXHRcdH0pO1x0XG4gICAgfVxufTtcblxuY29uc3QgcmVnaXN0ZXJQbGF5QnV0dG9uID0gKCkgPT4ge1xuXHQkKCcjcGxheW11c2ljYnRuJykub24oJ2NsaWNrJywgKGUpID0+IHtcblx0XHRydW5TZXEgPSB0cnVlO1xuXHRcdHBsYXlNdXNpYygpO1xuXHRcdC8vYWxlcnQoJ2hlcmUnKTtcblx0fSk7XG59O1xuXG5jb25zdCByZWdpc3RlclN0b3BCdXR0b24gPSAoKSA9PiB7XG5cdCQoJyNzdG9wbXVzaWNidG4nKS5vbignY2xpY2snLCAoZSkgPT4ge1xuXHRcdHJ1blNlcSA9IGZhbHNlO1xuXHRcdC8vYWxlcnQoJ2hlcmUnKTtcblx0fSk7XG59O1xuXG4vLyBjb25zdCByZWdpc3RlclBhcmFtZXRlckJ1dHRvbiA9ICgpID0+IHtcbi8vIFx0JCgnI3BhcmFtZXRlcmJ0bicpLm9uKCdjbGljaycsIChlKSA9PiB7XG4vLyBcdFx0bGV0IGVsID0gZDMuc2VsZWN0QWxsKCdyZWN0JylbMF1bNF07XG4vLyBcdFx0bGV0IHRpbWUgPSAwLjk7XG4vLyBcdFx0aGlnaGxpZ2h0RWwoZWwsMCx0aW1lKTtcbi8vIFx0fSk7XG4vLyB9O1xuXG4kKCcjcGFyYU9zemJ0bicpLm9uKCdjbGljaycsIChlKSA9PiB7XG5cdGxldCBzMiA9ICQoJ2lucHV0W25hbWU9c3BlZWRdOmNoZWNrZWQnLCAnI3BhcmFtZXRlck1vZGFsJykudmFsKCk7XG5cdGxldCBzID0gJCgnaW5wdXRbbmFtZT1vc3pmb3JtXTpjaGVja2VkJywgJyNwYXJhbWV0ZXJNb2RhbCcpLnZhbCgpO1xuXHQvL2lmICghIHR5cGVvZiBzID09PSBcInVuZGVmaW5lZFwiICYmICEgdHlwZW9mIHMyICA9PT0gXCJ1bmRlZmluZWRcIil7XG5cdGlmICghIGZhbHNlKXtcblx0XHRvc2NpbGxhdG9yVHlwZSA9IHM7XG5cdFx0c291bmRTcGVlZCA9IHBhcnNlRmxvYXQoczIpO1xuXHRcdCQoJyNwYXJhbWV0ZXJNb2RhbCcpLm1vZGFsKCdoaWRlJyk7XG5cdH1cbn0pO1xuXG5cblxuLy8gU291bmQgRGVmaW5pdGlvblxuXG5cbmNvbnN0IHBsYXlTb3VuZCA9IChzdGFydFRpbWUsIHBpdGNoLCBkdXJhdGlvbiwgZ2FpbikgPT4ge1xuXHQvL2xldCBzdGFydFRpbWUgPSBhdWRpb0NvbnRleHQuY3VycmVudFRpbWUgKyBkZWxheTtcbiAgXHRsZXQgZW5kVGltZSA9IHN0YXJ0VGltZSArIGR1cmF0aW9uO1xuXG4gIFx0bGV0IG91dGdhaW4gPSBhdWRpb0NvbnRleHQuY3JlYXRlR2FpbigpO1xuICBcdG91dGdhaW4uZ2Fpbi52YWx1ZSA9IGdhaW47XG4gIFx0b3V0Z2Fpbi5jb25uZWN0KGF1ZGlvQ29udGV4dC5kZXN0aW5hdGlvbik7IFx0XG5cbiAgXHRsZXQgZW52ZWxvcGUgPSBhdWRpb0NvbnRleHQuY3JlYXRlR2FpbigpO1xuICBcdGVudmVsb3BlLmNvbm5lY3Qob3V0Z2Fpbik7XG4gIFx0ZW52ZWxvcGUuZ2Fpbi52YWx1ZSA9IDA7XG4gIFx0XG4gIFx0ZW52ZWxvcGUuZ2Fpbi5zZXRUYXJnZXRBdFRpbWUoMSwgc3RhcnRUaW1lLCBlbnZlbG9wZVN0YXJ0RW5kVGltZVswXSk7XG4gIFx0ZW52ZWxvcGUuZ2Fpbi5zZXRUYXJnZXRBdFRpbWUoMCwgZW5kVGltZSwgZW52ZWxvcGVTdGFydEVuZFRpbWVbMV0pO1xuXG4gIFx0bGV0IG9zY2lsbGF0b3IgPSBhdWRpb0NvbnRleHQuY3JlYXRlT3NjaWxsYXRvcigpO1xuICBcdG9zY2lsbGF0b3IuY29ubmVjdChlbnZlbG9wZSk7XG5cbiAgXHRvc2NpbGxhdG9yLnR5cGUgPSBvc2NpbGxhdG9yVHlwZTtcbiAgXHRvc2NpbGxhdG9yLmRldHVuZS52YWx1ZSA9IHBpdGNoICogMTAwO1xuICBcdG9zY2lsbGF0b3IuZnJlcXVlbmN5LnZhbHVlID0gMjQwO1xuXG5cdGxldCB2aWJyYXRvID0gYXVkaW9Db250ZXh0LmNyZWF0ZUdhaW4oKTtcblx0dmlicmF0by5nYWluLnZhbHVlID0gdmlicmF0b2dhaW47XG5cdHZpYnJhdG8uY29ubmVjdChvc2NpbGxhdG9yLmRldHVuZSk7XG5cblx0bGV0IGxmbyA9IGF1ZGlvQ29udGV4dC5jcmVhdGVPc2NpbGxhdG9yKCk7XG5cdGxmby5jb25uZWN0KHZpYnJhdG8pO1xuXHRsZm8uZnJlcXVlbmN5LnZhbHVlID1sZm9mcmVxOyBcblxuXHRvc2NpbGxhdG9yLnN0YXJ0KHN0YXJ0VGltZSk7XG4gIFx0bGZvLnN0YXJ0KHN0YXJ0VGltZSk7XG4gIFx0b3NjaWxsYXRvci5zdG9wKGVuZFRpbWUgKzIgKTtcbiAgXHRsZm8uc3RvcChlbmRUaW1lICsyKTtcblxufTtcblxuLy8vIFBsYXkgTG9vcFxuY29uc3QgcnVuU2VxdWVuY2VycyA9ICgpID0+IHtcblx0aWYgKCFydW5TZXEgfHwgc291bmRRdWV1ZS5sZW5ndGggPT09IDApe2NvbnNvbGUubG9nKFwic3RvcFwiKTtyZXR1cm47fVxuXHRsZXQgY3QgPSBhdWRpb0NvbnRleHQuY3VycmVudFRpbWU7XG5cdHdoaWxlIChzb3VuZFF1ZXVlLmxlbmd0aD4wICYmIHNvdW5kUXVldWVbMF1bMF08IGN0KzAuMTUpe1xuXHRcdC8vY29uc29sZS5sb2coJ2N0OicrY3QrJ3BsYW5lZCB0aW1lOicrc291bmRRdWV1ZVswXVswXSk7XG5cdFx0bGV0IHRvbmUgPSBzb3VuZFF1ZXVlLnNwbGljZSgwLDEpO1xuXHRcdC8vIHBsYXlzb3VuZCAoc3RhcnR0aW1lLCBwaXRjaCwgZHVyYXRpb24sICAgICAgICAgICAgIGdhaWluKVxuXHRcdHBsYXlTb3VuZCh0b25lWzBdWzBdLHNvdW5kc1t0b25lWzBdWzFdXVswXSx0b25lWzBdWzJdLHNvdW5kc1t0b25lWzBdWzFdXVsyXSk7XHRcdFxuXHRcdC8vIGVsZW1lbnQgICAgICAgICAgICAgIGNvbG9yICAgICAgIGR1cmF0aW9uXG5cdFx0aGlnaGxpZ2h0RWwodG9uZVswXVszXSx0b25lWzBdWzFdLHRvbmVbMF1bMl0pO1xuXHR9XG5cdHNldFRpbWVvdXQocnVuU2VxdWVuY2Vycyw5MCk7XG59XG5cbi8vLyBzb3VuZHMgc3RhcnQgaGVyZVxuLy8vIFNvdW5kIHZhclxubGV0IHJ1blNlcSA9IHRydWU7XG5sZXQgc291bmRRdWV1ZSA9IFtdO1xuXG52YXIgYXVkaW9Db250ZXh0ID0gbnVsbDtcblxuaWYoJ3dlYmtpdEF1ZGlvQ29udGV4dCcgaW4gd2luZG93KSB7XG4gICAgYXVkaW9Db250ZXh0ID0gbmV3IHdlYmtpdEF1ZGlvQ29udGV4dCgpO1xufSBlbHNlIHtcblx0YXVkaW9Db250ZXh0ID0gbmV3IEF1ZGlvQ29udGV4dCgpO1xufVxuXG5sZXQgc291bmRTcGVlZCA9IDAuNTtcbmxldCB0b25lZHVyYXRpb24gPSAwLjM7XG5sZXQgdmlicmF0b2dhaW4gPSAwLjM7XG5sZXQgZW52ZWxvcGVTdGFydEVuZFRpbWUgPSBbMC4wMSwwLjFdO1xubGV0IGxmb2ZyZXEgPSA2OyAgLy81XG4vLyBQYXJhbWV0cml6YXRpb24gb2YgdGhlIDUgdG9uZXMgIFBpdGNoIGR1cmF0aW9uIHZvbHVtZSBnYWluXG5jb25zdCBzb3VuZHMgPSBbWy0xMCwgMC41LDAuMV0sWzMsIDAuNSwwLjldLFsxMCwgMC41LDAuOV0sWzE1LCAwLjUsMC45XSxbMCwgMC41LDAuOV1dO1xubGV0IG9zY2lsbGF0b3JUeXBlID0gJ3Nhd3Rvb3RoJzsgLy8nc2luZSc7IC8vICdzYXd0b290aCdcblxuXG5cblxuLy8vIFNvdW5kIE1ldGhvZHNcbmNvbnN0IHBsYXlNdXNpYyA9ICgpID0+IHtcblx0Ly8gZmlsbCBzb3VuZFF1ZXVlXHRcblx0bGV0IHJlY3RhcnIgPSBkMy5zZWxlY3RBbGwoJ3JlY3QnKS5kYXRhKCk7XG5cdGxldCBlbGFyciA9IGQzLnNlbGVjdEFsbCgncmVjdCcpWzBdO1xuICAgIGxldCBzdGFydFRpbWUgPSBhdWRpb0NvbnRleHQuY3VycmVudFRpbWU7XG4gICAgLy9jb25zb2xlLmxvZygnU3RhcnQnK3N0YXJ0VGltZSk7XG4gICAgc291bmRRdWV1ZSA9W107XG5cdGZvciAobGV0IGk9MDsgaSA8IHJlY3RhcnIubGVuZ3RoOyBpKyspIHtcblx0XHRsZXQgdiA9IHJlY3RhcnJbaV1bMV07XG5cdFx0Ly9wbGF5U291bmQoaSxzb3VuZHNbdl1bMF0sc291bmRzW3ZdWzFdLHNvdW5kc1t2XVsyXSk7XG5cdFx0Ly9hbGVydChpKTtcblx0XHRsZXQgdG1wID0gW107XG5cdFx0dG1wLnB1c2goaSpzb3VuZFNwZWVkK3N0YXJ0VGltZSk7XG5cdFx0dG1wLnB1c2godik7XG5cdFx0dG1wLnB1c2godG9uZWR1cmF0aW9uKTtcblx0XHR0bXAucHVzaChlbGFycltpXSk7XG5cdFx0c291bmRRdWV1ZS5wdXNoKHRtcCk7XG5cdH1cblx0Ly9jb25zb2xlLmxvZygnc3RhcnRzZXF1ZW5jZXInK2F1ZGlvQ29udGV4dC5jdXJyZW50VGltZSk7XG4gICAgcnVuU2VxdWVuY2VycygpO1xufTtcblxuLy8gSW5pdCBTY3JlZW5cblx0Y29uc3Qgd2lkdGggPSAxMjMwLFxuICAgIGhlaWdodCA9IDIyNSxcbiAgICBkaXYgPSBkMy5zZWxlY3QoJyNjaGFydCcpLFxuICAgIHN2ZyA9IGRpdi5hcHBlbmQoJ3N2ZycpXG4gICAgICAgIC5hdHRyKCd3aWR0aCcsIHdpZHRoKVxuICAgICAgICAuYXR0cignaGVpZ2h0JywgaGVpZ2h0KSxcbiAgICAvL2dyaWQgICAgXG4gICAgcncgPSAyMCxcbiAgICByaCA9IDIwLFxuICAgIHJvd04gPTQsXG4gICAgY29sTiA9NDAsXG4gICAgLy9jb2xvcmRlZmluaXRpb25cbiAgICBsb29rdXAgPSBbJyM0NTQ1NDUnLCcjMjk2RUFBJywnI0Q0M0YzQScsJyM1Q0I4NUMnLCcjNDZCMENGJ10sXG4gICAgaGxvb2t1cCA9IFsnIzAwMDAwMCcsJyMwOTRFOEEnLCcjQTQxRjFBJywnIzNDOTgzQycsJyMyNjkwQUYnXSxcbiAgICBycmFuZ2UgPSBsb29rdXAubGVuZ3RoO1xuXG5cdC8vIFJlZ2lzdGVyIEJ1dHRvbnNcblx0cmVnaXN0ZXJCdXR0b24oKTtcblx0cmVnaXN0ZXJJbnB1dE9uQ2hhbmdlKCk7XG5cdGxldCBteWRhdGEgPSByZWRyYXcocmVhZElucHV0KCkpO1xuXHRyZW5kZXJHcmFwaChteWRhdGEpO1xuXHRyZWdpc3RlclBsYXlCdXR0b24oKTtcblx0cmVnaXN0ZXJTdG9wQnV0dG9uKCk7XG5cdC8vIHJlZ2lzdGVyUGFyYW1ldGVyQnV0dG9uKCk7XG5cbn0pO1xuXG5cblxuIl19
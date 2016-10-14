(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

$(document).ready(function () {
	// Model
	// ----------------------------------------------------------
	// Sound constansts presets
	var tones = [{
		'nr': 0,
		'gain': 0.2,
		'vol': '20%',
		'color': '#757575',
		'hover': '#000000',
		'instrument': 'D3',
		'id': 'ig-row1-0',
		'visible': true
	}, {
		'nr': 1,
		'gain': 0.8,
		'vol': '20%',
		'color': '#296EAA',
		'hover': '#094E8A',
		'instrument': 'A4',
		'id': 'ig-row1-1',
		'visible': true
	}, {
		'nr': 2,
		'gain': 0.0,
		'vol': '0%',
		'color': '#5491B5',
		'hover': '#346175',
		'instrument': 'F3',
		'id': 'ig-row1-2',
		'visible': false
	}, {
		'nr': 3,
		'gain': 0.0,
		'vol': '0%',
		'color': '#79BEFA',
		'hover': '#599EBA',
		'instrument': 'G3',
		'id': 'ig-row1-3',
		'visible': false
	}, {
		'nr': 4,
		'gain': 0.5,
		'vol': '40%',
		'color': '#4BA84B',
		'hover': '#2B882B',
		'instrument': 'D4',
		'id': 'ig-row2-1',
		'visible': true
	}, {
		'nr': 5,
		'gain': 0.0,
		'vol': '0%',
		'color': '#547249',
		'hover': '#245219',
		'instrument': 'B4',
		'id': 'ig-row2-2',
		'visible': false
	}, {
		'nr': 6,
		'gain': 0.0,
		'vol': '0%',
		'color': '#1F6241',
		'hover': '#1F6241',
		'instrument': 'C4',
		'id': 'ig-row2-3',
		'visible': false
	}, {
		'nr': 7,
		'gain': 0.3,
		'vol': '80%',
		'color': '#DB3833',
		'hover': '#AB1813',
		'instrument': 'G4',
		'id': 'ig-row3-1',
		'visible': true
	}, {
		'nr': 8,
		'gain': 0.0,
		'vol': '0%',
		'color': '#B30B0B',
		'hover': '#530B0B',
		'instrument': 'E4',
		'id': 'ig-row3-2',
		'visible': false
	}, {
		'nr': 9,
		'gain': 0.0,
		'vol': '0%',
		'color': '#A1123F',
		'hover': '#51021F',
		'instrument': 'F4',
		'id': 'ig-row3-3',
		'visible': false
	}];

	// sounds
	var notes = {
		'D3': {
			'freq': 440,
			'detune': -700
		},
		'E3': {
			'freq': 440,
			'detune': -500
		},
		'F3': {
			'freq': 440,
			'detune': -400
		},
		'G3': {
			'freq': 440,
			'detune': -200
		},
		'A4': {
			'freq': 440,
			'detune': 0
		},
		'B4': {
			'freq': 440,
			'detune': 200
		},
		'C4': {
			'freq': 440,
			'detune': 300
		},
		'D4': {
			'freq': 440,
			'detune': 500
		},
		'E4': {
			'freq': 440,
			'detune': 700
		},
		'F4': {
			'freq': 440,
			'detune': 800
		},
		'G4': {
			'freq': 440,
			'detune': 1000
		}
	};

	var screenView = {
		'1': {
			'visible': true,
			'graph': 'chart',
			'data': true

		},
		'2': {
			'visible': true,
			'graph': 'chart-2',
			'addrow': false,
			'redrow': true,
			'data': true,
			'changerowid': 'addrow2'
		},
		'3': {
			'visible': false,
			'graph': 'chart-3',
			'addrow': true,
			'redrow': false,
			'data': true,
			'changerowid': 'addrow3'
		},
		'4': {
			'visible': true,
			'graph': 'chart-sum',
			'data': true
		},
		'archild': '<div action="plus"><i class="fa fa-plus-square"></i><span>Ton-Zahlenreihe</span></div>',
		'minrowchild': '<div action="minus"><i class="fa fa-minus-square"></i><span>Ton-Zahlenreihe</span></div>',
		'addbttn': '<span class="glyphicon glyphicon-plus"></span>',
		'minbttn': '<span class="glyphicon glyphicon-minus"></span>'
	};

	// ----------------------------------------------------------
	// Model End

	var range = function range(begin, end) {
		var interval = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

		var out = [];
		for (var _i = begin; _i < end; _i += interval) {
			out.push(_i);
		}
		return out;
	};

	// ----------------------------------------------------------
	// Visual D3JS Start

	// Constants for D3JS
	var rw = 20,
	    // rect width
	rh = 20,
	    // rect height
	rowN = 1,
	    // number of rows
	colN = 48; // number of columns

	// Main visual D3 update function
	var updateGraph = function updateGraph(data, svg, lookup, checksum) {
		// draw sumation row
		if (checksum) {
			var grp = svg.selectAll('svg g').data(data);

			var innergrp = grp.selectAll('g').data(function (d) {
				return d;
			});

			// case 3 -> 2 -> 1 remove g
			innergrp.exit().remove();

			innergrp.enter().append('g').attr('transform', function (d, i) {
				return 'translate(' + 28 * i + ',0)';
			});

			// select rects
			var rects = innergrp.selectAll('rect').data(function (d) {
				return d;
			});

			// case 3 -> 2 -> 1 remove rects
			rects.exit().remove();

			//update color pos width
			rects.attr('fill', function (d, i) {
				return lookup[d];
			}).attr('x', function (d, i, k) {
				return rw / data[0][k].length * i;
			}).attr('width', function (d, i, k) {
				return rw / data[0][k].length;
			}).enter().append('rect')
			//add color pos width hight
			.attr('fill', function (d, i) {
				return lookup[d];
			}).attr('x', function (d, i, k) {
				return rw / data[0][k].length * i;
			}).attr('width', function (d, i, k) {
				return rw / data[0][k].length;
			}).attr('height', rh);

			// draw a single row
		} else {
			svg.selectAll('svg g rect').data(data[0])
			// update color
			.attr('fill', function (d, i) {
				return lookup[d];
			}).enter().append('rect').attr('x', function (d, i) {
				return 28 * i;
			}).attr('width', rw).attr('height', rh);
			//.remove();
		}
	};

	var renderGraph = function renderGraph(data, svg, lookup, checksum) {
		// Create a group for each row in the data matrix and
		// translate the group vertically
		var grp = svg.selectAll('svg g').data(data).enter().append('g').attr('transform', function (d, i) {
			return 'translate(0, ' + 54 * i + ')';
		});

		if (checksum) {
			//inner structure
			var ingrp = grp.selectAll('g').data(function (d) {
				return d;
			}).enter().append('g').attr('transform', function (d, i) {
				return 'translate(' + 28 * i + ',0)';
			});

			ingrp.selectAll('rect').data(function (d) {
				return d;
			}).enter().append('rect').attr('x', function (d, i, k) {
				return rw / data[0][k].length * i;
			}).attr('fill', function (d, i) {
				return lookup[d];
			}).attr('width', function (d, i, k) {
				return rw / data[0][k].length;
			}).attr('height', rh);
		} else {
			// For each group, create a set of rectangles and bind
			// them to the inner array (the inner array is already
			// binded to the group)
			grp.selectAll('rect')
			// .filter( (d,i) => typeof d[i] === 'number')
			.data(function (d) {
				return d;
			}).enter().append('rect').attr('x', function (d, i) {
				return 28 * i;
			}).attr('fill', function (d, i) {
				return lookup[d];
			}).attr('width', rw).attr('height', rh);
		}

		//Modulo 10 ticks
		grp.selectAll('line').data(function (d) {
			var tmp = Math.trunc(d.length / 10);
			var out = new Array(tmp + 1).fill(0);
			return out;
		}).enter().append('line').attr('x1', function (d, i) {
			return 280 * i + 1;
		}).attr('y1', 20).attr('x2', function (d, i) {
			return 280 * i + 1;
		}).attr('y2', 40).style('stroke', 'black').style('stroke-width', '2px');

		// Text
		grp.selectAll('text').data(function (d) {
			var tmp = Math.trunc(d.length / 10);
			var out = new Array(tmp + 1).fill(0);
			return out;
		}).enter().append('text')
		//.filter((d,i) => i%10===0)
		.attr('x', function (d, i) {
			return 280 * i + 5;
		}).attr('y', '38').attr('font-family', 'sans-serif').text(function (d, i, k) {
			return k * 40 + i * 10 + 1;
		});
	};
	// ----------------------------------------------------------
	// Visual D3JS End

	// User Interactions
	// reads Parameter Ton Zahl for row one
	var readInput = function readInput(row) {
		// Element ID of Buttons
		var ids = [1, 2, 3].map(function (i) {
			return '#btn-row' + row + '-' + i;
		});
		var out = [];
		var elval = void 0,
		    val = void 0;
		ids.forEach(function (el) {
			elval = $(el).parent().parent().children('input')[0];
			val = elval !== 'undefined' ? elval.value : 0;
			out.push(val);
		});
		return out;
	};

	// Sum all rows together
	// Reduce data from 3 arrays to one Array
	var reduce3data = function reduce3data(arrB, arrG, arrR) {
		var out = [];
		var outer = [];
		outer.push(out);
		var tmp = void 0,
		    s = void 0;
		for (var _i2 = 0; _i2 < arrB.length; _i2++) {
			tmp = [];
			tmp.push(arrB[_i2]);
			tmp.push(arrG[_i2] === 0 ? 0 : arrG[_i2] + 3);
			tmp.push(arrR[_i2] === 0 ? 0 : arrR[_i2] + 6);
			s = new Set(tmp);
			if (s.size > 1 && s.has(0)) {
				s.delete(0);
			}
			out.push(Array.from(s));
		}
		return outer;
	};

	// calculate a numberarray
	// Redraw Game
	var redraw = function redraw(inpstrarr) {
		var inp = [];
		// parse input
		for (var _i3 = 0; _i3 < inpstrarr.length; _i3++) {
			inp.push(parseInt(inpstrarr[_i3]));
		};

		// init values
		var t = 1,
		    // cout value
		data = [],
		    col = void 0,
		    nextEvent = void 0,
		    tmp = 0;

		// determine the start value;
		for (var _i4 = 0; _i4 < inp.length; _i4++) {
			col = _i4;
			nextEvent = inp[col];
			if (nextEvent > 0) {
				break;
			}
		}
		for (var k = 0; k < rowN; k += 1) {
			var row = [];
			data.push(row);
			for (var _i5 = 0; _i5 < colN; _i5 += 1) {
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
				// just array
				row.push(tmp);
				//row.push([t, tmp]);
				t = t + 1;
			}
		}
		return data;
	};

	//Highlight Element when played
	var highlightEl = function highlightEl(el, col, time, hover) {
		$(el).attr("fill", hover);
		setTimeout(function () {
			$(el).attr("fill", col);
		}, time * 1000);
	};

	//React on change of input number
	//calculate and redraw row, calculate data for all rows and
	//apply reducedata
	// TO DO Performance Optimazation
	var registerInputOnChange = function registerInputOnChange(row, svg, lookup) {
		var ids = [1, 2, 3].map(function (i) {
			return '#btn-row' + row + '-' + i;
		});
		ids.forEach(function (el) {
			$(el).parent().parent().children('input.form-control').change(function () {
				var newdata = redraw(readInput(row));
				updateGraph(newdata, svg, lookup, false);
				var mydata = redraw(readInput(1));
				var mydataGreen = redraw(readInput(2));
				var mydataRed = redraw(readInput(3));
				var newdata2 = reduce3data(mydata[0], mydataGreen[0], mydataRed[0]);
				updateGraph(newdata2, svgList[3], [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(function (i) {
					return tones[i].color;
				}), true);
			});
		});
	};

	// Registration of count Button
	var registerButton = function registerButton(row) {
		var ids = [1, 2, 3].map(function (i) {
			return '#btn-row' + row + '-' + i;
		});
		ids.forEach(function (el) {
			$(el).parent().children('ul.dropdown-menu').on('click', function (e) {
				var inpEl = e.target.parentElement.parentElement.parentElement.parentElement.children[1];
				inpEl.setAttribute('value', e.target.text);
				$(inpEl).val(e.target.text);
				// trigger to react on number change
				$(inpEl).trigger(jQuery.Event('change'));
			});
		});
	};

	// Register Ton button
	var registerTonButton = function registerTonButton(row) {
		var ids = [1, 2, 3].map(function (i) {
			return '#btn-row' + row + '-' + i + '-ton';
		});
		ids.forEach(function (el) {
			$(el).parent().children('ul.dropdown-menu').on('click', function (e) {
				// index have to survive :)
				var nr = parseInt(e.target.parentElement.parentElement.getAttribute('nr'));
				tones[nr].instrument = e.target.text;
				updateInput(tones, nr);
			});
		});
	};
	//Register first Black Button
	var registerBlackTonButton = function registerBlackTonButton() {
		$('#btn-row0-0-ton').parent().children('ul.dropdown-menu').on('click', function (e) {
			tones[0].instrument = e.target.text;
			updateInput(tones, 0);
		});
	};
	// Register Volumen button
	var registerVolumeButton = function registerVolumeButton(row) {
		var ids = [1, 2, 3].map(function (i) {
			return '#btn-row' + row + '-' + i + '-volume';
		});
		ids.forEach(function (el) {
			$(el).parent().children('ul.dropdown-menu').on('click', function (e) {
				var nr = parseInt(e.target.parentElement.parentElement.getAttribute('nr'));
				tones[nr].vol = e.target.text;
				tones[nr].gain = parseInt(e.target.text) * 1.0 / 100;
				updateInput(tones, nr);
			});
		});
	};

	// Register First Gray Button
	var registerBlackVolumeButton = function registerBlackVolumeButton() {
		$('#btn-row0-0-volume').parent().children('ul.dropdown-menu').on('click', function (e) {
			tones[0].vol = e.target.text;
			tones[0].gain = parseInt(e.target.text) * 1.0 / 100;
			updateInput(tones, 0);
		});
	};

	// Helperclass Add or update a Text in a button
	var changeTextInLastSpan = function changeTextInLastSpan(sEl, txt) {
		if (sEl.children().length < 2) {
			var el = document.createElement('span');
			el.appendChild(document.createTextNode(txt));
			sEl.append(el);
		} else {
			sEl.children().last().text(txt);
		}
	};

	// update view if button model changed
	var updateInput = function updateInput(obj, nr) {
		//let iel = $('#'+obj[nr].id).children('input');
		var rownr = void 0,
		    id = void 0;
		if (nr < 1) {
			rownr = 0;
			id = nr;
		} else {
			rownr = Math.trunc((nr - 1) / 3) + 1;
			id = (nr - 1) % 3 + 1;
		}

		var btn = $('#' + 'btn-row' + rownr + '-' + id + '-ton');
		var txt = ' ' + obj[nr].instrument;
		changeTextInLastSpan(btn, txt);

		btn = $('#' + 'btn-row' + rownr + '-' + id + '-volume');
		txt = ' ' + obj[nr].vol;
		changeTextInLastSpan(btn, txt);
		// }
	};

	// update all Button views
	var syncFormDisplay = function syncFormDisplay(obj) {
		for (var _i6 = 0; _i6 < obj.length; _i6++) {
			updateInput(obj, _i6);
		}
	};

	// Register Play Button
	var registerPlayButton = function registerPlayButton() {
		$('#playmusicbtn').on('click', function (e) {
			runSeq = true;
			playMusic();
		});
	};

	// Register Stop Button
	var registerStopButton = function registerStopButton() {
		$('#stopmusicbtn').on('click', function (e) {
			runSeq = false;
		});
	};

	// Register all ScreenPlusBttns
	var registerScreenPlusBttn = function registerScreenPlusBttn() {

		var ids = [1, 2, 3].map(function (i) {
			return '#btn-row' + i + '-2-add';
		});
		ids.forEach(function (el) {
			$(el).on('click', function (e) {
				var nr = void 0;
				var k = 2;
				var ta = e.target.getAttribute('action');
				if (typeof ta === 'undefined' || ta === null) {
					ta = e.target.parentElement.getAttribute('action');
				}

				var tmp = ta.split('');
				nr = (parseInt(tmp[1]) - 1) * 3 + k;
				if (tmp[0] === '+') {
					tones[nr].visible = true;
					$('#' + tones[nr].id).show();
				}
				if (tmp[0] === '-') {
					tones[nr].visible = false;
					$('#' + tones[nr].id).hide();
				}
				updateScreenPlusElement();
			});
		});

		ids = [1, 2, 3].map(function (i) {
			return '#btn-row' + i + '-3-add';
		});
		ids.forEach(function (el) {
			$(el).on('click', function (e) {
				var nr = void 0;
				var k = 3;
				var ta = e.target.getAttribute('action');
				if (typeof ta === 'undefined' || ta === null) {
					ta = e.target.parentElement.getAttribute('action');
				}
				var tmp = ta.split('');
				nr = (parseInt(tmp[1]) - 1) * 3 + k;
				if (tmp[0] === '+') {
					tones[nr].visible = true;
					$('#' + tones[nr].id).show();
				}
				if (tmp[0] === '-') {
					tones[nr].visible = false;
					$('#' + tones[nr].id).hide();
				}
				updateScreenPlusElement();
			});
		});
	};

	var registerScreenRowPlusBttn = function registerScreenRowPlusBttn() {
		['addrow2', 'addrow3'].forEach(function (s) {
			$('#' + s).on('click', function (e) {
				var ta = $(e.target).children('div');
				var act = void 0;
				if (ta.length > 0) {
					act = ta[0].getAttribute('action');
				} else {
					act = e.target.parentElement.getAttribute('action');
				}

				var nr = s.split('')[6];
				if (act === 'plus') {
					screenView[nr].visible = true;
					screenView[nr].addrow = false;
					screenView[nr].redrow = true;
					if (nr === '3') {
						screenView['2'].redrow = false;
					}
					if (nr === '2') {
						screenView['3'].addrow = true;
					}
				}
				if (act === 'minus') {
					screenView[nr].visible = false;
					screenView[nr].addrow = true;
					screenView[nr].redrow = false;
					if (nr === '2') {
						screenView['3'].addrow = false;
					}
					if (nr === '3') {
						screenView['2'].redrow = true;
					}
				}
				updateScreen();
				updateRowButtons();
			});
		});
	};

	// Sound
	// ----------------------------------------------------------
	var playSound = function playSound(startTime, pitchNr, duration, gainOld) {
		//let startTime = audioContext.currentTime + delay;
		var endTime = startTime + duration;
		//let pitch = tones[pitchNr].instrument;
		var gain = tones[pitchNr].gain;

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
		oscillator.detune.value = notes[tones[pitchNr].instrument].detune;
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
			var item = soundQueue.splice(0, 1);
			// playsound (starttime, pitch, duration,             gaiin)
			//playSound(item[0][0],sounds[item[0][1]][0],item[0][2],tones[item[0][1]].gain);

			playSound(item[0][0], item[0][1], item[0][2], tones[item[0][1]].gain);
			// element              color       duration                 hovercolor
			highlightEl(item[0][3], tones[item[0][1]].color, item[0][2], tones[item[0][1]].hover);
		}
		setTimeout(runSequencers, 90);
	};

	/// Important Sound Variables !!!
	var runSeq = true;
	var soundQueue = [];
	var audioContext = null;

	try {
		window.AudioContext = window.AudioContext || window.webkitAudioContext;
		var audioContext = new AudioContext();
	} catch (e) {
		console.log("No Web Audio API support");
	}
	// TODO Feedback if it is not working with the used device

	//IOS Start IOSHACK
	$('body').on('touchend', function (e) {
		//alert('start sound
		// create empty buffer
		var buffer = audioContext.createBuffer(1, 1, 22050);
		var source = audioContext.createBufferSource();
		source.buffer = buffer;

		// connect to output (your speakers)
		source.connect(audioContext.destination);

		// play the file
		if (typeof source.noteOn !== 'undefined') {
			source.noteOn(0);
		}
		var src = null;
		src = audioContext.createOscillator();
		src.type = 'square';
		src.frequency.value = 440;
		src.connect(audioContext.destination);
		var ct = audioContext.currentTime;
		src.start(ct + 0.05);
		src.stop(ct + 0.06);
		// Event onlie once
		$('body').unbind('touchend');
	});
	//IOS END

	/// Main Sound Play Method Fill the queue and time the visual
	var playMusic = function playMusic() {
		// fill soundQueue
		var j = void 0;
		var rectarr = d3.select('#chart-sum').select('g').selectAll('g').data();
		var elarr = d3.select('#chart-sum').select('g').selectAll('g')[0];
		var startTime = audioContext.currentTime;
		//console.log('Start'+startTime);
		soundQueue = [];
		for (var _i7 = 0; _i7 < rectarr.length; _i7++) {
			var v = rectarr[_i7];
			for (j = 0; j < v.length; j++) {
				//playSound(i,sounds[v][0],sounds[v][1],sounds[v][2]);
				//alert(i);
				var tmp = [];
				tmp.push(_i7 * soundSpeed + startTime + j * 0.0001);
				tmp.push(v[j]);
				tmp.push(toneduration);
				tmp.push(d3.select(elarr[_i7]).selectAll('rect')[0][j]);
				soundQueue.push(tmp);
			}
		}
		//console.log('startsequencer'+audioContext.currentTime);
		runSequencers();
	};
	// sound constants
	var soundSpeed = 0.5;
	var toneduration = 0.3;
	var vibratogain = 0.3;
	var envelopeStartEndTime = [0.01, 0.1];
	var lfofreq = 6; //5
	var oscillatorType = 'sawtooth'; //'sine'; // 'sawtooth'
	// ----------------------------------------------------------
	// Sound End


	// Screen Interaction add und remove mnues
	// ----------------------------------------------------------
	var nrOfActiveBttnGroup = function nrOfActiveBttnGroup(nr) {
		var arr = [1, 2, 3].map(function (i) {
			return (nr - 1) * 3 + i;
		});
		var barr = arr.map(function (i) {
			return tones[i].visible;
		});
		var tarr = barr.filter(function (i) {
			return i === true;
		});
		return tarr.length;
	};
	var changeScreenbttn = function changeScreenbttn(id, html, act) {
		$(id).attr('action', act).children().replaceWith(html);
	};

	var hideAndsetRowZero = function hideAndsetRowZero(row) {
		var el = void 0,
		    inpEl = void 0;
		for (var _i8 = conf[row - 1][0]; _i8 < conf[row - 1][1]; _i8++) {
			el = $('#' + tones[_i8].id);
			el.hide();
			// hide all + - signs
			[2, 3].forEach(function (i) {
				$('#btn-row' + row + '-' + i + '-add').hide();
			});
			if (typeof el.children('input')[0] !== 'undefined') {
				inpEl = el.children('input')[0];
				inpEl.value = 0;
				$(inpEl).trigger(jQuery.Event('change'));
			}
		}
	};

	var showRow = function showRow(row) {
		$('#btn-row' + row + '-1-add').show();
		var i = conf[row - 1][0];
		$('#' + tones[i].id).show();
	};

	var updateRowButtons = function updateRowButtons() {
		['2', '3'].forEach(function (row) {
			if (screenView[row].addrow) {
				$('#' + screenView[row].changerowid).children('div').replaceWith(screenView.archild);
				$('#' + screenView[row].changerowid).show();
			}
			if (screenView[row].redrow) {
				$('#' + screenView[row].changerowid).children('div').replaceWith(screenView.minrowchild);
				$('#' + screenView[row].changerowid).show();
			}
			if (!screenView[row].redrow && !screenView[row].addrow) {
				$('#' + screenView[row].changerowid).hide();
			}
		});
	};

	var updateScreen = function updateScreen() {
		var s = '';
		['2', '3'].forEach(function (row) {
			s = '#' + screenView[row].graph;
			if (screenView[row].visible) {
				$(s).show();
				showRow(parseInt(row));
				updateScreenPlusElement();
			} else {
				$(s).hide();
				hideAndsetRowZero(parseInt(row));
			}
		});
	};

	// three possible states
	var updateScreenPlusElement = function updateScreenPlusElement() {
		var nr = void 0,
		    el = void 0,
		    inpEl = void 0;
		[1, 2, 3].forEach(function (i) {
			if (screenView[i].visible) {
				nr = nrOfActiveBttnGroup(i);
				switch (nr) {
					case 1:
						changeScreenbttn('#btn-row' + i + '-2-add', screenView.addbttn, '+' + i);
						$('#btn-row' + i + '-2-add').show();
						$('#btn-row' + i + '-3-add').hide();
						el = $('#' + tones[i * 3].id);
						if (typeof el.children('input')[0] !== 'undefined') {
							inpEl = el.children('input')[0];
							inpEl.value = 0;
							$(inpEl).trigger(jQuery.Event('change'));
						}
						el = $('#' + tones[i * 3 - 1].id);
						if (typeof el.children('input')[0] !== 'undefined') {
							inpEl = el.children('input')[0];
							inpEl.value = 0;
							$(inpEl).trigger(jQuery.Event('change'));
						}
						break;
					case 2:
						changeScreenbttn('#btn-row' + i + '-2-add', screenView.minbttn, '-' + i);
						$('#btn-row' + i + '-2-add').show();
						changeScreenbttn('#btn-row' + i + '-3-add', screenView.addbttn, '+' + i);
						$('#btn-row' + i + '-3-add').show();
						el = $('#' + tones[i * 3].id);
						if (typeof el.children('input')[0] !== 'undefined') {
							inpEl = el.children('input')[0];
							inpEl.value = 0;
							$(inpEl).trigger(jQuery.Event('change'));
						}
						break;
					case 3:
						$('#btn-row' + i + '-2-add').hide();
						changeScreenbttn('#btn-row' + i + '-3-add', screenView.minbttn, '-' + i);
						$('#btn-row' + i + '-3-add').show();
						break;
					default:
				}
			}
		});
	};
	var dispNavElements = function dispNavElements(obj) {
		obj.map(function (o) {
			if (o.visible) {
				$('#' + o.id).show();
			} else {
				var el = $('#' + o.id);
				el.hide();
				// TODO reset INPUT
				if (typeof el.children('input')[0] !== 'undefined') {
					el.children('input')[0].value = 0;
				}
				//console.log(el.children('input')[0].value);
			}
		});
	};

	// Init Screen
	var initd3js = function initd3js(elId) {
		var width = 1280,
		    height = 45;
		var sr_viewport = '0 0 ' + (width + 70) + ' ' + height;
		var div = d3.select(elId),
		    svg = div.append('svg').attr('width', width).attr('height', height).attr('viewBox', sr_viewport).attr('preserveAspectRatio', 'xMidYMid meet');
		return svg;
	};
	// Main
	// ----------------------------------------------------------
	// configure display
	dispNavElements(tones);
	syncFormDisplay(tones);
	updateScreenPlusElement();

	// bind data and render d3js
	var conf = [[1, 4], [4, 7], [7, 10], [1, 10]];
	var svgList = [];
	var mydataList = [];
	var svg = null;
	var arr = [];
	var lookup = null;
	var mydata = null;
	var i = void 0,
	    j = void 0;
	var tmpw = $(window).width();

	for (i = 1; i < 5; i++) {
		svg = initd3js('#' + screenView['' + i].graph);
		svg.attr('width', tmpw);
		svgList.push(svg);
		arr = [0];
		var _iteratorNormalCompletion = true;
		var _didIteratorError = false;
		var _iteratorError = undefined;

		try {
			for (var _iterator = range(conf[i - 1][0], conf[i - 1][1])[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
				j = _step.value;

				arr.push(j);
			}
		} catch (err) {
			_didIteratorError = true;
			_iteratorError = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion && _iterator.return) {
					_iterator.return();
				}
			} finally {
				if (_didIteratorError) {
					throw _iteratorError;
				}
			}
		}

		lookup = arr.map(function (i) {
			return tones[i].color;
		});
		if (i < 4) {
			mydata = redraw(readInput(i));
			mydataList.push(mydata);
			registerInputOnChange(i, svg, lookup);
			renderGraph(mydata, svg, lookup, false);
		} else {
			mydata = reduce3data(mydataList[0][0], mydataList[1][0], mydataList[2][0]);
			renderGraph(mydata, svg, lookup, true);
		}
	}
	// responsive change
	d3.select(window).on('resize', function () {
		var winWidth = $(window).width();
		for (var _i9 = 0; _i9 < svgList.length; _i9++) {
			svgList[_i9].attr("width", winWidth);
		}
	});

	// Register Buttons
	// blackbutton only one registration
	registerBlackVolumeButton();
	registerBlackTonButton();

	// Register 3 rows V Button
	[1, 2, 3].forEach(function (i) {
		return registerButton(i);
	});
	[1, 2, 3].forEach(function (i) {
		return registerTonButton(i);
	});
	[1, 2, 3].forEach(function (i) {
		return registerVolumeButton(i);
	});

	registerScreenPlusBttn();
	registerScreenRowPlusBttn();
	registerPlayButton();
	registerStopButton();
	updateScreen();
	updateRowButtons();
});

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvc2NyaXB0cy9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQSxFQUFFLFFBQUYsRUFBWSxLQUFaLENBQWtCLFlBQVU7QUFDNUI7QUFDQTtBQUNBO0FBQ0EsS0FBSSxRQUFRLENBQUM7QUFDWixRQUFLLENBRE87QUFFWixVQUFPLEdBRks7QUFHWixTQUFNLEtBSE07QUFJVCxXQUFRLFNBSkM7QUFLWixXQUFRLFNBTEk7QUFNWixnQkFBYSxJQU5EO0FBT1osUUFBSyxXQVBPO0FBUVosYUFBVTtBQVJFLEVBQUQsRUFVWjtBQUNDLFFBQUssQ0FETjtBQUVDLFVBQU8sR0FGUjtBQUdDLFNBQU0sS0FIUDtBQUlDLFdBQVEsU0FKVDtBQUtDLFdBQVEsU0FMVDtBQU1DLGdCQUFhLElBTmQ7QUFPQyxRQUFLLFdBUE47QUFRQyxhQUFVO0FBUlgsRUFWWSxFQW9CWjtBQUNDLFFBQUssQ0FETjtBQUVDLFVBQU8sR0FGUjtBQUdDLFNBQU0sSUFIUDtBQUlDLFdBQVEsU0FKVDtBQUtDLFdBQVEsU0FMVDtBQU1DLGdCQUFhLElBTmQ7QUFPQyxRQUFLLFdBUE47QUFRQyxhQUFVO0FBUlgsRUFwQlksRUE4Qlo7QUFDQyxRQUFLLENBRE47QUFFQyxVQUFPLEdBRlI7QUFHQyxTQUFNLElBSFA7QUFJQyxXQUFRLFNBSlQ7QUFLQyxXQUFRLFNBTFQ7QUFNQyxnQkFBYSxJQU5kO0FBT0MsUUFBSyxXQVBOO0FBUUMsYUFBVTtBQVJYLEVBOUJZLEVBeUNaO0FBQ0MsUUFBSyxDQUROO0FBRUMsVUFBTyxHQUZSO0FBR0MsU0FBTSxLQUhQO0FBSUMsV0FBUSxTQUpUO0FBS0MsV0FBUSxTQUxUO0FBTUMsZ0JBQWEsSUFOZDtBQU9DLFFBQUssV0FQTjtBQVFDLGFBQVU7QUFSWCxFQXpDWSxFQW1EWjtBQUNDLFFBQUssQ0FETjtBQUVDLFVBQU8sR0FGUjtBQUdDLFNBQU0sSUFIUDtBQUlD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ekI7QUFDQTtBQUNGLEVBTkQ7O0FBUUg7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxFQUFDLENBQUQsRUFBRyxDQUFILEVBQUssQ0FBTCxFQUFRLE9BQVIsQ0FBZ0IsVUFBQyxDQUFEO0FBQUEsU0FBTyxlQUFlLENBQWYsQ0FBUDtBQUFBLEVBQWhCO0FBQ0EsRUFBQyxDQUFELEVBQUcsQ0FBSCxFQUFLLENBQUwsRUFBUSxPQUFSLENBQWdCLFVBQUMsQ0FBRDtBQUFBLFNBQU8sa0JBQWtCLENBQWxCLENBQVA7QUFBQSxFQUFoQjtBQUNBLEVBQUMsQ0FBRCxFQUFHLENBQUgsRUFBSyxDQUFMLEVBQVEsT0FBUixDQUFnQixVQUFDLENBQUQ7QUFBQSxTQUFPLHFCQUFxQixDQUFyQixDQUFQO0FBQUEsRUFBaEI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0F0L0JEIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XG4vLyBNb2RlbFxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gU291bmQgY29uc3RhbnN0cyBwcmVzZXRzXG5sZXQgdG9uZXMgPSBbe1xuXHQnbnInOjAsXG5cdCdnYWluJzowLjIsXG5cdCd2b2wnOicyMCUnLFxuICAgICdjb2xvcic6JyM3NTc1NzUnLFxuXHQnaG92ZXInOicjMDAwMDAwJyxcblx0J2luc3RydW1lbnQnOidEMycsXG5cdCdpZCc6J2lnLXJvdzEtMCcsXG5cdCd2aXNpYmxlJzp0cnVlXG59LFxue1xuXHQnbnInOjEsXG5cdCdnYWluJzowLjgsXG5cdCd2b2wnOicyMCUnLFxuXHQnY29sb3InOicjMjk2RUFBJyxcblx0J2hvdmVyJzonIzA5NEU4QScsXG5cdCdpbnN0cnVtZW50JzonQTQnLFxuXHQnaWQnOidpZy1yb3cxLTEnLFxuXHQndmlzaWJsZSc6dHJ1ZVxufSxcbntcblx0J25yJzoyLFxuXHQnZ2Fpbic6MC4wLFxuXHQndm9sJzonMCUnLFxuXHQnY29sb3InOicjNTQ5MUI1Jyxcblx0J2hvdmVyJzonIzM0NjE3NScsXG5cdCdpbnN0cnVtZW50JzonRjMnLFxuXHQnaWQnOidpZy1yb3cxLTInLFxuXHQndmlzaWJsZSc6ZmFsc2Vcbn0sXG57XG5cdCducic6Myxcblx0J2dhaW4nOjAuMCxcblx0J3ZvbCc6JzAlJyxcblx0J2NvbG9yJzonIzc5QkVGQScsXG5cdCdob3Zlcic6JyM1OTlFQkEnLFxuXHQnaW5zdHJ1bWVudCc6J0czJyxcblx0J2lkJzonaWctcm93MS0zJyxcblx0J3Zpc2libGUnOmZhbHNlXG59LFxuXG57XG5cdCducic6NCxcblx0J2dhaW4nOjAuNSxcblx0J3ZvbCc6JzQwJScsXG5cdCdjb2xvcic6JyM0QkE4NEInLFxuXHQnaG92ZXInOicjMkI4ODJCJyxcblx0J2luc3RydW1lbnQnOidENCcsXG5cdCdpZCc6J2lnLXJvdzItMScsXG5cdCd2aXNpYmxlJzp0cnVlXG59LFxue1xuXHQnbnInOjUsXG5cdCdnYWluJzowLjAsXG5cdCd2b2wnOicwJScsXG5cdCdjb2xvcic6JyM1NDcyNDknLFxuXHQnaG92ZXInOicjMjQ1MjE5Jyxcblx0J2luc3RydW1lbnQnOidCNCcsXG5cdCdpZCc6J2lnLXJvdzItMicsXG5cdCd2aXNpYmxlJzpmYWxzZVxufSxcbntcblx0J25yJzo2LFxuXHQnZ2Fpbic6MC4wLFxuXHQndm9sJzonMCUnLFxuXHQnY29sb3InOicjMUY2MjQxJyxcblx0J2hvdmVyJzonIzFGNjI0MScsXG5cdCdpbnN0cnVtZW50JzonQzQnLFxuXHQnaWQnOidpZy1yb3cyLTMnLFxuXHQndmlzaWJsZSc6ZmFsc2Vcbn0sXG57XG5cdCducic6Nyxcblx0J2dhaW4nOjAuMyxcblx0J3ZvbCc6JzgwJScsXG5cdCdjb2xvcic6JyNEQjM4MzMnLFxuXHQnaG92ZXInOicjQUIxODEzJyxcblx0J2luc3RydW1lbnQnOidHNCcsXG5cdCdpZCc6J2lnLXJvdzMtMScsXG5cdCd2aXNpYmxlJzp0cnVlXG59LFxue1xuXHQnbnInOjgsXG5cdCdnYWluJzowLjAsXG5cdCd2b2wnOicwJScsXG5cdCdjb2xvcic6JyNCMzBCMEInLFxuXHQnaG92ZXInOicjNTMwQjBCJyxcblx0J2luc3RydW1lbnQnOidFNCcsXG5cdCdpZCc6J2lnLXJvdzMtMicsXG5cdCd2aXNpYmxlJzpmYWxzZVxufSxcbntcblx0J25yJzo5LFxuXHQnZ2Fpbic6MC4wLFxuXHQndm9sJzonMCUnLFxuXHQnY29sb3InOicjQTExMjNGJyxcblx0J2hvdmVyJzonIzUxMDIxRicsXG5cdCdpbnN0cnVtZW50JzonRjQnLFxuXHQnaWQnOidpZy1yb3czLTMnLFxuXHQndmlzaWJsZSc6ZmFsc2Vcbn1dO1xuXG4vLyBzb3VuZHNcbmxldCBub3RlcyA9IHtcblx0J0QzJzoge1xuXHRcdCdmcmVxJzogNDQwLFxuXHRcdCdkZXR1bmUnOiAtNzAwXG5cdH0sXG5cdCdFMyc6IHtcblx0XHQnZnJlcSc6IDQ0MCxcblx0XHQnZGV0dW5lJzogLTUwMFxuXHR9LFxuXHQnRjMnOiB7XG5cdFx0J2ZyZXEnOiA0NDAsXG5cdFx0J2RldHVuZSc6IC00MDBcblx0fSxcblx0J0czJzoge1xuXHRcdCdmcmVxJzogNDQwLFxuXHRcdCdkZXR1bmUnOiAtMjAwXG5cdH0sXG5cdCdBNCc6IHtcblx0XHQnZnJlcSc6IDQ0MCxcblx0XHQnZGV0dW5lJzogMFxuXHR9LFxuXHQnQjQnOiB7XG5cdFx0J2ZyZXEnOiA0NDAsXG5cdFx0J2RldHVuZSc6IDIwMFxuXHR9LFxuXHQnQzQnOiB7XG5cdFx0J2ZyZXEnOiA0NDAsXG5cdFx0J2RldHVuZSc6IDMwMFxuXHR9LFxuXHQnRDQnOiB7XG5cdFx0J2ZyZXEnOiA0NDAsXG5cdFx0J2RldHVuZSc6IDUwMFxuXHR9LFxuXHQnRTQnOiB7XG5cdFx0J2ZyZXEnOiA0NDAsXG5cdFx0J2RldHVuZSc6IDcwMFxuXHR9LFxuXHQnRjQnOiB7XG5cdFx0J2ZyZXEnOiA0NDAsXG5cdFx0J2RldHVuZSc6IDgwMFxuXHR9LFxuXHQnRzQnOiB7XG5cdFx0J2ZyZXEnOiA0NDAsXG5cdFx0J2RldHVuZSc6IDEwMDBcblx0fVxufTtcblxubGV0IHNjcmVlblZpZXcgPSB7XG5cdCcxJyA6IHtcblx0XHQndmlzaWJsZScgXHQ6IHRydWUsXG5cdFx0J2dyYXBoJ1x0XHQ6ICdjaGFydCcsXG5cdFx0J2RhdGEnXHRcdDogdHJ1ZVxuXG5cdH0sXG5cdCcyJ1x0OiB7XG5cdFx0J3Zpc2libGUnICBcdDogdHJ1ZSxcblx0XHQnZ3JhcGgnXHRcdDogJ2NoYXJ0LTInLFxuXHRcdCdhZGRyb3cnXHQ6IGZhbHNlLFxuXHRcdCdyZWRyb3cnXHQ6IHRydWUsXG5cdFx0J2RhdGEnXHRcdDogdHJ1ZSxcblx0XHQnY2hhbmdlcm93aWQnIDogJ2FkZHJvdzInXG5cdH0sXG5cdCczJ1x0OiB7XG5cdFx0J3Zpc2libGUnICBcdDogZmFsc2UsXG5cdFx0J2dyYXBoJ1x0XHQ6ICdjaGFydC0zJyxcblx0XHQnYWRkcm93J1x0OiB0cnVlLFxuXHRcdCdyZWRyb3cnXHQ6IGZhbHNlLFxuXHRcdCdkYXRhJ1x0XHQ6IHRydWUsXG5cdFx0J2NoYW5nZXJvd2lkJyA6ICdhZGRyb3czJ1xuXHR9LFxuXHQnNCdcdDoge1xuXHRcdCd2aXNpYmxlJyAgXHQ6IHRydWUsXG5cdFx0J2dyYXBoJ1x0XHQ6ICdjaGFydC1zdW0nLFxuXHRcdCdkYXRhJ1x0XHQ6IHRydWVcblx0fSxcblx0J2FyY2hpbGQnIFx0XHQ6ICc8ZGl2IGFjdGlvbj1cInBsdXNcIj48aSBjbGFzcz1cImZhIGZhLXBsdXMtc3F1YXJlXCI+PC9pPjxzcGFuPlRvbi1aYWhsZW5yZWloZTwvc3Bhbj48L2Rpdj4nLFxuXHQnbWlucm93Y2hpbGQnIFx0OiAnPGRpdiBhY3Rpb249XCJtaW51c1wiPjxpIGNsYXNzPVwiZmEgZmEtbWludXMtc3F1YXJlXCI+PC9pPjxzcGFuPlRvbi1aYWhsZW5yZWloZTwvc3Bhbj48L2Rpdj4nLFxuXHQnYWRkYnR0bidcdFx0OiAnPHNwYW4gY2xhc3M9XCJnbHlwaGljb24gZ2x5cGhpY29uLXBsdXNcIj48L3NwYW4+Jyxcblx0J21pbmJ0dG4nXHRcdDogJzxzcGFuIGNsYXNzPVwiZ2x5cGhpY29uIGdseXBoaWNvbi1taW51c1wiPjwvc3Bhbj4nXG59O1xuXG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIE1vZGVsIEVuZFxuXG5cdGNvbnN0IHJhbmdlID0gKGJlZ2luLCBlbmQsIGludGVydmFsID0gMSkgPT4ge1xuXHRcdGxldCBvdXQgPSBbXTtcblx0XHRmb3IgKGxldCBpID0gYmVnaW47IGkgPCBlbmQ7IGkgKz0gaW50ZXJ2YWwpIHtcbiAgICAgICAgIFx0b3V0LnB1c2goaSk7XG4gICAgIFx0fVxuICAgICBcdHJldHVybiBvdXQ7XG5cdH07XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFZpc3VhbCBEM0pTIFN0YXJ0XG5cbi8vIENvbnN0YW50cyBmb3IgRDNKU1xuY29uc3QgcncgPSAyMCwgLy8gcmVjdCB3aWR0aFxucmggPSAyMCwgLy8gcmVjdCBoZWlnaHRcbnJvd04gPTEsIC8vIG51bWJlciBvZiByb3dzXG5jb2xOID00ODsgLy8gbnVtYmVyIG9mIGNvbHVtbnNcblxuLy8gTWFpbiB2aXN1YWwgRDMgdXBkYXRlIGZ1bmN0aW9uXG5jb25zdCB1cGRhdGVHcmFwaCA9IChkYXRhLHN2Zyxsb29rdXAsY2hlY2tzdW0pID0+IHtcblx0Ly8gZHJhdyBzdW1hdGlvbiByb3dcblx0aWYgKGNoZWNrc3VtKXtcblx0XHRsZXQgZ3JwID0gc3ZnLnNlbGVjdEFsbCgnc3ZnIGcnKVxuXHQgICAgLmRhdGEoZGF0YSk7XG5cblx0ICAgIGxldCBpbm5lcmdycCA9IGdycC5zZWxlY3RBbGwoJ2cnKVxuXHQgICAgLmRhdGEoKGQpID0+IGQpO1xuXG5cdCAgICAvLyBjYXNlIDMgLT4gMiAtPiAxIHJlbW92ZSBnXG5cdCAgICBpbm5lcmdycFxuXHQgICAgLmV4aXQoKVxuXHQgICAgLnJlbW92ZSgpO1xuXG5cdCAgICBpbm5lcmdycFxuXHQgICAgLmVudGVyKClcblx0XHQuYXBwZW5kKCdnJylcblx0XHQuYXR0cigndHJhbnNmb3JtJywgKGQsIGkpID0+ICd0cmFuc2xhdGUoJyArIDI4ICogaSArICcsMCknKTtcblxuXHRcdC8vIHNlbGVjdCByZWN0c1xuXHRcdGxldCByZWN0cz1pbm5lcmdycC5zZWxlY3RBbGwoJ3JlY3QnKVxuXHRcdC5kYXRhKChkKSA9PiBkKTtcblxuXHRcdC8vIGNhc2UgMyAtPiAyIC0+IDEgcmVtb3ZlIHJlY3RzXG5cdFx0cmVjdHMuZXhpdCgpXG5cdFx0LnJlbW92ZSgpO1xuXG5cdFx0Ly91cGRhdGUgY29sb3IgcG9zIHdpZHRoXG5cdFx0cmVjdHMuYXR0cignZmlsbCcsIChkLGkpID0+IGxvb2t1cFtkXSlcblx0XHQuYXR0cigneCcsIChkLCBpLGspID0+ICBydy9kYXRhWzBdW2tdLmxlbmd0aCAqIGkpXG5cdFx0LmF0dHIoJ3dpZHRoJywgKGQsaSxrKSA9PiAgcncvZGF0YVswXVtrXS5sZW5ndGgpXG5cdFx0LmVudGVyKClcblx0XHQuYXBwZW5kKCdyZWN0Jylcblx0XHQvL2FkZCBjb2xvciBwb3Mgd2lkdGggaGlnaHRcblx0XHQuYXR0cignZmlsbCcsIChkLGkpID0+IGxvb2t1cFtkXSlcblx0XHQuYXR0cigneCcsIChkLCBpLGspID0+ICBydy9kYXRhWzBdW2tdLmxlbmd0aCAqIGkpXG5cdFx0LmF0dHIoJ3dpZHRoJywgKGQsaSxrKSA9PiAgcncvZGF0YVswXVtrXS5sZW5ndGgpXG5cdFx0LmF0dHIoJ2hlaWdodCcsIHJoKTtcblxuXHQvLyBkcmF3IGEgc2luZ2xlIHJvd1xuXHR9IGVsc2Uge1xuXHRcdHN2Zy5zZWxlY3RBbGwoJ3N2ZyBnIHJlY3QnKVxuXHRcdC5kYXRhKGRhdGFbMF0pXG5cdFx0Ly8gdXBkYXRlIGNvbG9yXG5cdFx0LmF0dHIoJ2ZpbGwnLCAoZCxpKSA9PiBsb29rdXBbZF0pXG5cdFx0LmVudGVyKClcblx0XHQuYXBwZW5kKCdyZWN0Jylcblx0ICAgIC5hdHRyKCd4JywgKGQsIGkpID0+ICAyOCAqIGkpXG5cdCAgICAuYXR0cignd2lkdGgnLCBydylcblx0ICAgIC5hdHRyKCdoZWlnaHQnLCByaCk7XG5cdCAgICAvLy5yZW1vdmUoKTtcblx0fVxufTtcblxuY29uc3QgcmVuZGVyR3JhcGggPSAoZGF0YSxzdmcsbG9va3VwLGNoZWNrc3VtKSA9PiB7XG5cdC8vIENyZWF0ZSBhIGdyb3VwIGZvciBlYWNoIHJvdyBpbiB0aGUgZGF0YSBtYXRyaXggYW5kXG5cdC8vIHRyYW5zbGF0ZSB0aGUgZ3JvdXAgdmVydGljYWxseVxuXHRsZXQgZ3JwID0gc3ZnLnNlbGVjdEFsbCgnc3ZnIGcnKVxuXHQgICAgLmRhdGEoZGF0YSlcblx0ICAgIC5lbnRlcigpXG5cdCAgICAuYXBwZW5kKCdnJylcblx0ICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCAoZCwgaSkgPT4gJ3RyYW5zbGF0ZSgwLCAnICsgNTQgKiBpICsgJyknKTtcblxuXHRpZiAoY2hlY2tzdW0pe1xuXHRcdC8vaW5uZXIgc3RydWN0dXJlXG5cdFx0bGV0IGluZ3JwID0gZ3JwLnNlbGVjdEFsbCgnZycpXG5cdFx0ICAgIC5kYXRhKChkKSA9PiBkKVxuXHRcdCAgICAuZW50ZXIoKVxuXHRcdCAgICAuYXBwZW5kKCdnJylcblx0XHQgICAgLmF0dHIoJ3RyYW5zZm9ybScsIChkLCBpKSA9PiAndHJhbnNsYXRlKCcgKyAyOCAqIGkgKyAnLDApJyk7XG5cblx0XHRpbmdycC5zZWxlY3RBbGwoJ3JlY3QnKVxuXHRcdCAgICAuZGF0YSgoZCkgPT4gZClcblx0XHQgICAgLmVudGVyKClcblx0XHQgICAgLmFwcGVuZCgncmVjdCcpXG5cdFx0ICAgIFx0LmF0dHIoJ3gnLCAoZCwgaSxrKSA9PiAgcncvZGF0YVswXVtrXS5sZW5ndGggKiBpKVxuXHRcdCAgICAgICAgLmF0dHIoJ2ZpbGwnLCAoZCxpKSA9PiBsb29rdXBbZF0pXG5cdFx0ICAgICAgICAuYXR0cignd2lkdGgnLCAoZCxpLGspID0+ICBydy9kYXRhWzBdW2tdLmxlbmd0aClcblx0XHQgICAgICAgIC5hdHRyKCdoZWlnaHQnLCByaCk7XG5cdH0gZWxzZSB7XG5cdFx0Ly8gRm9yIGVhY2ggZ3JvdXAsIGNyZWF0ZSBhIHNldCBvZiByZWN0YW5nbGVzIGFuZCBiaW5kXG5cdFx0Ly8gdGhlbSB0byB0aGUgaW5uZXIgYXJyYXkgKHRoZSBpbm5lciBhcnJheSBpcyBhbHJlYWR5XG5cdFx0Ly8gYmluZGVkIHRvIHRoZSBncm91cClcblx0XHRncnAuc2VsZWN0QWxsKCdyZWN0Jylcblx0XHRcdC8vIC5maWx0ZXIoIChkLGkpID0+IHR5cGVvZiBkW2ldID09PSAnbnVtYmVyJylcblx0XHQgICAgLmRhdGEoKGQpID0+IGQpXG5cdFx0ICAgIC5lbnRlcigpXG5cdFx0ICAgIC5hcHBlbmQoJ3JlY3QnKVxuXHRcdCAgICAgICAgLmF0dHIoJ3gnLCAoZCwgaSkgPT4gIDI4ICogaSlcblx0XHQgICAgICAgIC5hdHRyKCdmaWxsJywgKGQsaSkgPT4gbG9va3VwW2RdKVxuXHRcdCAgICAgICAgLmF0dHIoJ3dpZHRoJywgcncpXG5cdFx0ICAgICAgICAuYXR0cignaGVpZ2h0JywgcmgpO1xuXHR9XG5cblx0Ly9Nb2R1bG8gMTAgdGlja3Ncblx0Z3JwLnNlbGVjdEFsbCgnbGluZScpXG5cdCAgICAuZGF0YSgoZCkgPT4ge1xuXHQgICAgXHRsZXQgdG1wID0gTWF0aC50cnVuYyhkLmxlbmd0aCAvIDEwKTtcblx0ICAgIFx0bGV0IG91dCA9IG5ldyBBcnJheSh0bXArMSkuZmlsbCgwKTtcblx0ICAgIFx0cmV0dXJuIG91dDtcblx0ICAgIH0pXG5cdCAgICAuZW50ZXIoKS5hcHBlbmQoJ2xpbmUnKVxuICBcdFx0XHQuYXR0cigneDEnLCAgKGQsIGkpID0+IDI4MCAqIGkrMSlcbiAgXHRcdFx0LmF0dHIoJ3kxJywgMjApXG4gIFx0XHRcdC5hdHRyKCd4MicsIChkLCBpKSA9PiAyODAgKiBpKzEpXG4gIFx0XHRcdC5hdHRyKCd5MicsNDApXG4gIFx0XHRcdC5zdHlsZSgnc3Ryb2tlJywgJ2JsYWNrJylcbiAgXHRcdFx0LnN0eWxlKCdzdHJva2Utd2lkdGgnLCcycHgnKTtcblxuICBcdC8vIFRleHRcbiAgXHRncnAuc2VsZWN0QWxsKCd0ZXh0Jylcblx0ICAgIC5kYXRhKChkKSA9PiB7XG5cdCAgICBcdGxldCB0bXAgPSBNYXRoLnRydW5jKGQubGVuZ3RoIC8gMTApO1xuXHQgICAgXHRsZXQgb3V0ID0gbmV3IEFycmF5KHRtcCsxKS5maWxsKDApO1xuXHQgICAgXHRyZXR1cm4gb3V0O1xuXHQgICAgfSlcblx0ICAgIC5lbnRlcigpLmFwcGVuZCgndGV4dCcpXG5cdCAgICAvLy5maWx0ZXIoKGQsaSkgPT4gaSUxMD09PTApXG5cdCAgICBcdC5hdHRyKCd4JywgKGQsIGkpID0+IHsgcmV0dXJuIDI4MCAqIGkrNTsgfSlcblx0ICAgIFx0LmF0dHIoJ3knLCAnMzgnKVxuXHQgICAgXHQuYXR0cignZm9udC1mYW1pbHknLCAnc2Fucy1zZXJpZicpXG5cdCAgICBcdC50ZXh0KCAoZCwgaSxrKSA9PiBrKjQwK2kqMTArMSk7XG59O1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gVmlzdWFsIEQzSlMgRW5kXG5cbi8vIFVzZXIgSW50ZXJhY3Rpb25zXG4vLyByZWFkcyBQYXJhbWV0ZXIgVG9uIFphaGwgZm9yIHJvdyBvbmVcbmNvbnN0IHJlYWRJbnB1dCA9IChyb3cpID0+IHtcblx0Ly8gRWxlbWVudCBJRCBvZiBCdXR0b25zXG5cdGxldCBpZHMgPSBbMSwyLDNdLm1hcCgoaSkgPT4gJyNidG4tcm93Jytyb3crJy0nK2kpO1xuXHRsZXQgb3V0ID0gW107XG5cdGxldCBlbHZhbCx2YWw7XG5cdGlkcy5mb3JFYWNoKChlbCkgPT4ge1xuXHRcdGVsdmFsID0gJChlbClcblx0XHRcdC5wYXJlbnQoKVxuXHRcdFx0LnBhcmVudCgpXG5cdFx0XHQuY2hpbGRyZW4oJ2lucHV0JylbMF07XG5cdFx0dmFsID0gZWx2YWwgIT09ICd1bmRlZmluZWQnID8gZWx2YWwudmFsdWUgOiAwO1xuXHRcdG91dC5wdXNoKHZhbCk7XG5cdH0pO1xuXHRyZXR1cm4gb3V0O1xufTtcblxuLy8gU3VtIGFsbCByb3dzIHRvZ2V0aGVyXG4vLyBSZWR1Y2UgZGF0YSBmcm9tIDMgYXJyYXlzIHRvIG9uZSBBcnJheVxuY29uc3QgcmVkdWNlM2RhdGEgPSAoYXJyQixhcnJHLGFyclIpID0+IHtcblx0bGV0IG91dCA9IFtdO1xuXHRsZXQgb3V0ZXIgPSBbXTtcblx0b3V0ZXIucHVzaChvdXQpO1xuXHRsZXQgdG1wLHM7XG5cdGZvcihsZXQgaT0wOyBpPGFyckIubGVuZ3RoOyBpKyspe1xuXHRcdHRtcCA9IFtdO1xuXHRcdHRtcC5wdXNoKGFyckJbaV0pO1xuXHRcdHRtcC5wdXNoKGFyckdbaV09PT0wID8gMCA6IGFyckdbaV0gKyAzKTtcblx0XHR0bXAucHVzaChhcnJSW2ldPT09MCA/IDAgOiBhcnJSW2ldICsgNik7XG5cdFx0cyA9IG5ldyBTZXQodG1wKTtcblx0XHRpZiAocy5zaXplID4gMSAmJiBzLmhhcygwKSl7XG5cdFx0XHRzLmRlbGV0ZSgwKTtcblx0XHR9XG5cdFx0b3V0LnB1c2goQXJyYXkuZnJvbShzKSk7XG5cdH1cblx0cmV0dXJuIG91dGVyO1xufTtcblxuLy8gY2FsY3VsYXRlIGEgbnVtYmVyYXJyYXlcbi8vIFJlZHJhdyBHYW1lXG5jb25zdCByZWRyYXcgPSAoaW5wc3RyYXJyKSA9PiB7XG5cdGxldCBpbnAgPSBbXTtcblx0Ly8gcGFyc2UgaW5wdXRcblx0Zm9yIChsZXQgaSA9IDA7IGkgPCBpbnBzdHJhcnIubGVuZ3RoOyBpKyspe1xuXHRcdGlucC5wdXNoKHBhcnNlSW50KGlucHN0cmFycltpXSkpO1xuXHR9O1xuXG4gICAgLy8gaW5pdCB2YWx1ZXNcblx0bGV0IHQgPSAxLCAvLyBjb3V0IHZhbHVlXG5cdFx0ZGF0YSA9IFtdLFxuXHRcdGNvbCxcblx0XHRuZXh0RXZlbnQsXG5cdFx0dG1wID0gMDtcblxuXHQvLyBkZXRlcm1pbmUgdGhlIHN0YXJ0IHZhbHVlO1xuXHRmb3IgKGxldCBpID0gMDsgaSA8IGlucC5sZW5ndGg7IGkrKyl7XG5cdFx0Y29sID0gaTtcblx0XHRuZXh0RXZlbnQgPSBpbnBbY29sXTtcblx0XHRpZiAobmV4dEV2ZW50ID4gMCl7XG5cdFx0XHRicmVhaztcblx0XHR9XG5cdH1cblx0Zm9yIChsZXQgayA9IDA7IGsgPCByb3dOOyBrICs9IDEpIHtcblx0XHRsZXQgcm93ID0gW107XG5cdFx0ZGF0YS5wdXNoKHJvdyk7XG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBjb2xOOyBpICs9MSl7XG5cdFx0XHRpZiAodCA9PT0gIG5leHRFdmVudCl7XG5cdFx0XHRcdC8vIGp1bXAgb3ZlciAwIGNvbG9yIGVudHJpZXNcblx0XHRcdFx0dG1wID0gY29sKzE7IC8vIGJsYWNrIGhhcyBpbmRleCAwXG5cdFx0XHRcdC8vIGlmIHNvbWV0aGluZyBpcyB6ZXJvIGdvIGZ1cnRoZXJcblx0XHRcdFx0d2hpbGUgKGlucFsoY29sKzEpJWlucC5sZW5ndGhdIDwgMSl7XG5cdFx0XHRcdFx0Y29sID0gKGNvbCsxKSVpbnAubGVuZ3RoO1xuXHRcdFx0XHR9XG5cdFx0XHRcdG5leHRFdmVudCArPSBpbnBbKGNvbCsxKSVpbnAubGVuZ3RoXTtcblx0XHRcdFx0Y29sID0gKGNvbCsxKSVpbnAubGVuZ3RoOyAvLyBuZXh0IGNvbG9yXG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0bXAgPSAwO1xuXHRcdFx0fVxuXHRcdFx0Ly8ganVzdCBhcnJheVxuXHRcdFx0cm93LnB1c2godG1wKTtcblx0XHRcdC8vcm93LnB1c2goW3QsIHRtcF0pO1xuXHRcdFx0dCA9IHQgKyAxO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gZGF0YTtcbn07XG5cbi8vSGlnaGxpZ2h0IEVsZW1lbnQgd2hlbiBwbGF5ZWRcbmNvbnN0IGhpZ2hsaWdodEVsICA9IChlbCxjb2wsdGltZSxob3ZlcikgPT57XG4gICAkKGVsKS5hdHRyKCBcImZpbGxcIiwgaG92ZXIpO1xuICAgc2V0VGltZW91dCgoKSA9PiB7JChlbCkuYXR0ciggXCJmaWxsXCIsIGNvbCk7fSx0aW1lKjEwMDApO1xufTtcblxuLy9SZWFjdCBvbiBjaGFuZ2Ugb2YgaW5wdXQgbnVtYmVyXG4vL2NhbGN1bGF0ZSBhbmQgcmVkcmF3IHJvdywgY2FsY3VsYXRlIGRhdGEgZm9yIGFsbCByb3dzIGFuZFxuLy9hcHBseSByZWR1Y2VkYXRhXG4vLyBUTyBETyBQZXJmb3JtYW5jZSBPcHRpbWF6YXRpb25cbmNvbnN0IHJlZ2lzdGVySW5wdXRPbkNoYW5nZSA9IChyb3csc3ZnLGxvb2t1cCkgPT4ge1xuXHRsZXQgaWRzID0gWzEsMiwzXS5tYXAoKGkpID0+ICcjYnRuLXJvdycrcm93KyctJytpKTtcblx0aWRzLmZvckVhY2goKGVsKSA9PiB7XG5cdFx0JChlbClcblx0XHRcdC5wYXJlbnQoKVxuXHRcdFx0LnBhcmVudCgpXG5cdFx0XHQuY2hpbGRyZW4oJ2lucHV0LmZvcm0tY29udHJvbCcpXG5cdFx0XHQuY2hhbmdlKCgpID0+IHtcblx0XHRcdFx0bGV0IG5ld2RhdGEgPSByZWRyYXcocmVhZElucHV0KHJvdykpO1xuXHRcdFx0XHR1cGRhdGVHcmFwaChuZXdkYXRhLHN2Zyxsb29rdXAsZmFsc2UpO1xuXHRcdFx0XHRsZXQgbXlkYXRhID0gcmVkcmF3KHJlYWRJbnB1dCgxKSk7XG5cdFx0XHRcdGxldCBteWRhdGFHcmVlbiA9IHJlZHJhdyhyZWFkSW5wdXQoMikpO1xuXHRcdFx0XHRsZXQgbXlkYXRhUmVkID0gcmVkcmF3KHJlYWRJbnB1dCgzKSk7XG5cdFx0XHRcdGxldCBuZXdkYXRhMiA9IHJlZHVjZTNkYXRhKG15ZGF0YVswXSxteWRhdGFHcmVlblswXSxteWRhdGFSZWRbMF0pO1xuXHRcdFx0XHR1cGRhdGVHcmFwaChuZXdkYXRhMixzdmdMaXN0WzNdLFxuXHRcdFx0XHRcdFswLDEsMiwzLDQsNSw2LDcsOCw5XS5tYXAoKGkpID0+IHRvbmVzW2ldLmNvbG9yKSx0cnVlKTtcblx0XHRcdH0pO1xuXHR9KTtcbn07XG5cbi8vIFJlZ2lzdHJhdGlvbiBvZiBjb3VudCBCdXR0b25cbmNvbnN0IHJlZ2lzdGVyQnV0dG9uID0gKHJvdykgPT4ge1xuXHRsZXQgaWRzID0gWzEsMiwzXS5tYXAoKGkpID0+ICcjYnRuLXJvdycrcm93KyctJytpKTtcblx0aWRzLmZvckVhY2goKGVsKSA9PiB7XG5cdFx0JChlbCkucGFyZW50KClcblx0XHRcdC5jaGlsZHJlbigndWwuZHJvcGRvd24tbWVudScpXG5cdFx0XHQub24oJ2NsaWNrJywgKGUpID0+IHtcblx0XHRcdFx0bGV0IGlucEVsID0gZS50YXJnZXQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5jaGlsZHJlblsxXTtcblx0XHRcdFx0aW5wRWwuc2V0QXR0cmlidXRlKCd2YWx1ZScsZS50YXJnZXQudGV4dCk7XG5cdFx0XHRcdCQoaW5wRWwpLnZhbChlLnRhcmdldC50ZXh0KTtcblx0XHRcdFx0Ly8gdHJpZ2dlciB0byByZWFjdCBvbiBudW1iZXIgY2hhbmdlXG5cdFx0XHRcdCQoaW5wRWwpLnRyaWdnZXIoalF1ZXJ5LkV2ZW50KCdjaGFuZ2UnKSk7XG5cdFx0XHR9KTtcblxuXHR9KTtcbn07XG5cbi8vIFJlZ2lzdGVyIFRvbiBidXR0b25cbmNvbnN0IHJlZ2lzdGVyVG9uQnV0dG9uID0gKHJvdykgPT4ge1xuXHRsZXQgaWRzID0gWzEsMiwzXS5tYXAoKGkpID0+ICcjYnRuLXJvdycrcm93KyctJytpKyctdG9uJyk7XG5cdGlkcy5mb3JFYWNoKChlbCkgPT4ge1xuXHRcdCQoZWwpXG5cdFx0XHQucGFyZW50KClcblx0XHRcdC5jaGlsZHJlbigndWwuZHJvcGRvd24tbWVudScpXG5cdFx0XHQub24oJ2NsaWNrJywgKGUpID0+IHtcblx0XHRcdFx0Ly8gaW5kZXggaGF2ZSB0byBzdXJ2aXZlIDopXG5cdFx0XHQgICAgbGV0IG5yID0gcGFyc2VJbnQoZS50YXJnZXQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LmdldEF0dHJpYnV0ZSgnbnInKSk7XG5cdFx0XHRcdHRvbmVzW25yXS5pbnN0cnVtZW50ID0gZS50YXJnZXQudGV4dDtcblx0XHRcdFx0dXBkYXRlSW5wdXQodG9uZXMsbnIpO1xuXHRcdH0pO1xuXHR9KTtcblxufTtcbi8vUmVnaXN0ZXIgZmlyc3QgQmxhY2sgQnV0dG9uXG5jb25zdCByZWdpc3RlckJsYWNrVG9uQnV0dG9uID0gKCkgPT4ge1xuICAgICQoJyNidG4tcm93MC0wLXRvbicpXG5cdFx0LnBhcmVudCgpXG5cdFx0LmNoaWxkcmVuKCd1bC5kcm9wZG93bi1tZW51Jylcblx0XHQub24oJ2NsaWNrJywgKGUpID0+IHtcblx0XHRcdHRvbmVzWzBdLmluc3RydW1lbnQgPSBlLnRhcmdldC50ZXh0O1xuXHRcdFx0dXBkYXRlSW5wdXQodG9uZXMsMCk7XG5cdFx0fSk7XG59O1xuLy8gUmVnaXN0ZXIgVm9sdW1lbiBidXR0b25cbmNvbnN0IHJlZ2lzdGVyVm9sdW1lQnV0dG9uID0gKHJvdykgPT4ge1xuXHRsZXQgaWRzID0gWzEsMiwzXS5tYXAoKGkpID0+ICcjYnRuLXJvdycrcm93KyctJytpKyctdm9sdW1lJyk7XG5cdGlkcy5mb3JFYWNoKChlbCkgPT4ge1xuXHRcdCQoZWwpXG5cdFx0XHQucGFyZW50KClcblx0XHRcdC5jaGlsZHJlbigndWwuZHJvcGRvd24tbWVudScpXG5cdFx0XHQub24oJ2NsaWNrJywgKGUpID0+IHtcblx0XHRcdFx0bGV0IG5yID1wYXJzZUludChlLnRhcmdldC5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQuZ2V0QXR0cmlidXRlKCducicpKTtcblx0XHRcdFx0dG9uZXNbbnJdLnZvbCA9IGUudGFyZ2V0LnRleHQ7XG5cdFx0XHRcdHRvbmVzW25yXS5nYWluID0gcGFyc2VJbnQoZS50YXJnZXQudGV4dCkqMS4wLzEwMDtcblx0XHRcdFx0dXBkYXRlSW5wdXQodG9uZXMsbnIpO1xuXHRcdH0pO1xuXHR9KTtcbn07XG5cbi8vIFJlZ2lzdGVyIEZpcnN0IEdyYXkgQnV0dG9uXG5jb25zdCByZWdpc3RlckJsYWNrVm9sdW1lQnV0dG9uID0gKCkgPT4ge1xuXHQkKCcjYnRuLXJvdzAtMC12b2x1bWUnKVxuXHRcdC5wYXJlbnQoKVxuXHRcdC5jaGlsZHJlbigndWwuZHJvcGRvd24tbWVudScpXG5cdFx0Lm9uKCdjbGljaycsIChlKSA9PiB7XG5cdFx0XHR0b25lc1swXS52b2wgPSBlLnRhcmdldC50ZXh0O1xuXHRcdFx0dG9uZXNbMF0uZ2FpbiA9IHBhcnNlSW50KGUudGFyZ2V0LnRleHQpKjEuMC8xMDA7XG5cdFx0XHR1cGRhdGVJbnB1dCh0b25lcywwKTtcblx0XHR9KTtcbn07XG5cbi8vIEhlbHBlcmNsYXNzIEFkZCBvciB1cGRhdGUgYSBUZXh0IGluIGEgYnV0dG9uXG5jb25zdCBjaGFuZ2VUZXh0SW5MYXN0U3BhbiA9IChzRWwsdHh0KSA9PiB7XG5cdGlmIChzRWwuY2hpbGRyZW4oKS5sZW5ndGggPCAyKSB7XG5cdFx0XHRsZXQgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG5cdFx0XHRlbC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0eHQpKTtcblx0XHRcdHNFbC5hcHBlbmQoZWwpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRzRWwuY2hpbGRyZW4oKS5sYXN0KCkudGV4dCh0eHQpO1xuXHRcdH1cbn07XG5cbi8vIHVwZGF0ZSB2aWV3IGlmIGJ1dHRvbiBtb2RlbCBjaGFuZ2VkXG5jb25zdCB1cGRhdGVJbnB1dCA9IChvYmosbnIpID0+IHtcblx0Ly9sZXQgaWVsID0gJCgnIycrb2JqW25yXS5pZCkuY2hpbGRyZW4oJ2lucHV0Jyk7XG5cdGxldCByb3ducixpZDtcblx0aWYgKG5yPDEpe1xuXHRcdHJvd25yID0gMDtcblx0XHRpZCA9IG5yO1xuXHR9IGVsc2Uge1xuXHRcdHJvd25yID0gTWF0aC50cnVuYygobnItMSkvMykgKyAxO1xuXHRcdGlkID0gKG5yLTEpJTMrMTtcblx0fVxuXG5cdGxldCBidG4gPSAkKCcjJysnYnRuLXJvdycrcm93bnIrJy0nK2lkKyctdG9uJyk7XG5cdGxldCB0eHQgPSAnICcrb2JqW25yXS5pbnN0cnVtZW50O1xuXHRjaGFuZ2VUZXh0SW5MYXN0U3BhbihidG4sdHh0KTtcblxuXHRidG4gPSAkKCcjJysnYnRuLXJvdycrcm93bnIrJy0nK2lkKyctdm9sdW1lJyk7XG5cdHR4dCA9ICcgJytvYmpbbnJdLnZvbDtcblx0Y2hhbmdlVGV4dEluTGFzdFNwYW4oYnRuLHR4dCk7XG5cdC8vIH1cbn07XG5cbi8vIHVwZGF0ZSBhbGwgQnV0dG9uIHZpZXdzXG5jb25zdCBzeW5jRm9ybURpc3BsYXkgPSAob2JqKSA9PiB7XG5cdGZvciAobGV0IGkgPSAwOyBpIDwgb2JqLmxlbmd0aDsgaSsrKXtcblx0XHR1cGRhdGVJbnB1dChvYmosaSk7XG5cdH1cbn07XG5cbi8vIFJlZ2lzdGVyIFBsYXkgQnV0dG9uXG5jb25zdCByZWdpc3RlclBsYXlCdXR0b24gPSAoKSA9PiB7XG5cdCQoJyNwbGF5bXVzaWNidG4nKS5vbignY2xpY2snLCAoZSkgPT4ge1xuXHRcdHJ1blNlcSA9IHRydWU7XG5cdFx0cGxheU11c2ljKCk7XG5cdH0pO1xufTtcblxuLy8gUmVnaXN0ZXIgU3RvcCBCdXR0b25cbmNvbnN0IHJlZ2lzdGVyU3RvcEJ1dHRvbiA9ICgpID0+IHtcblx0JCgnI3N0b3BtdXNpY2J0bicpLm9uKCdjbGljaycsIChlKSA9PiB7XG5cdFx0cnVuU2VxID0gZmFsc2U7XG5cdH0pO1xufTtcblxuLy8gUmVnaXN0ZXIgYWxsIFNjcmVlblBsdXNCdHRuc1xuY29uc3QgcmVnaXN0ZXJTY3JlZW5QbHVzQnR0biA9ICgpID0+IHtcblxuXHRsZXQgaWRzID0gWzEsMiwzXS5tYXAoKGkpID0+ICcjYnRuLXJvdycraSsnLTItYWRkJyk7XG5cdGlkcy5mb3JFYWNoKChlbCkgPT4ge1xuXHRcdCQoZWwpLm9uKCdjbGljaycsIChlKSA9PiB7XG5cdFx0XHRsZXQgbnI7XG5cdFx0XHRsZXQgayA9IDI7XG5cdFx0XHRsZXQgdGEgPSBlLnRhcmdldC5nZXRBdHRyaWJ1dGUoJ2FjdGlvbicpO1xuXHRcdFx0aWYgKHR5cGVvZiB0YSA9PT0gJ3VuZGVmaW5lZCcgfHwgdGEgPT09IG51bGwpe1xuXHRcdFx0XHR0YSA9IGUudGFyZ2V0LnBhcmVudEVsZW1lbnQuZ2V0QXR0cmlidXRlKCdhY3Rpb24nKTtcblx0XHRcdH1cblxuXHRcdFx0bGV0IHRtcCA9IHRhLnNwbGl0KCcnKTtcblx0XHRcdG5yID0gKHBhcnNlSW50KHRtcFsxXSktMSkqMytrO1xuXHRcdFx0aWYgKHRtcFswXSA9PT0gJysnKXtcblx0XHRcdFx0dG9uZXNbbnJdLnZpc2libGUgPSB0cnVlO1xuXHRcdFx0XHQkKCcjJyt0b25lc1tucl0uaWQpLnNob3coKTtcblx0XHRcdH1cblx0XHRcdGlmICh0bXBbMF0gPT09ICctJyl7XG5cdFx0XHRcdHRvbmVzW25yXS52aXNpYmxlID0gZmFsc2U7XG5cdFx0XHRcdCQoJyMnK3RvbmVzW25yXS5pZCkuaGlkZSgpO1xuXHRcdFx0fVxuXHRcdFx0dXBkYXRlU2NyZWVuUGx1c0VsZW1lbnQoKTtcblxuXHRcdH0pO1xuXHR9KTtcblxuXHRpZHMgPSBbMSwyLDNdLm1hcCgoaSkgPT4gJyNidG4tcm93JytpKyctMy1hZGQnKTtcblx0aWRzLmZvckVhY2goKGVsKSA9PiB7XG5cdFx0JChlbCkub24oJ2NsaWNrJywgKGUpID0+IHtcblx0XHRcdGxldCBucjtcblx0XHRcdGxldCBrID0gMztcblx0XHRcdGxldCB0YSA9IGUudGFyZ2V0LmdldEF0dHJpYnV0ZSgnYWN0aW9uJyk7XG5cdFx0XHRpZiAodHlwZW9mIHRhID09PSAndW5kZWZpbmVkJyB8fCB0YSA9PT0gbnVsbCl7XG5cdFx0XHRcdHRhID0gZS50YXJnZXQucGFyZW50RWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2FjdGlvbicpO1xuXHRcdFx0fVxuXHRcdFx0bGV0IHRtcCA9IHRhLnNwbGl0KCcnKTtcblx0XHRcdG5yID0gKHBhcnNlSW50KHRtcFsxXSktMSkqMytrO1xuXHRcdFx0aWYgKHRtcFswXSA9PT0gJysnKXtcblx0XHRcdFx0dG9uZXNbbnJdLnZpc2libGUgPSB0cnVlO1xuXHRcdFx0XHQkKCcjJyt0b25lc1tucl0uaWQpLnNob3coKTtcblx0XHRcdH1cblx0XHRcdGlmICh0bXBbMF0gPT09ICctJyl7XG5cdFx0XHRcdHRvbmVzW25yXS52aXNpYmxlID0gZmFsc2U7XG5cdFx0XHRcdCQoJyMnK3RvbmVzW25yXS5pZCkuaGlkZSgpO1xuXHRcdFx0fVxuXHRcdFx0dXBkYXRlU2NyZWVuUGx1c0VsZW1lbnQoKTtcblx0XHR9KTtcblx0fSk7XG59O1xuXG5cblxuY29uc3QgcmVnaXN0ZXJTY3JlZW5Sb3dQbHVzQnR0biA9ICgpID0+IHtcblx0WydhZGRyb3cyJywnYWRkcm93MyddLmZvckVhY2goKHMpID0+e1xuXHRcdCQoJyMnK3MpLm9uKCdjbGljaycsIChlKSA9PiB7XG5cdFx0XHRsZXQgdGEgPSAkKGUudGFyZ2V0KS5jaGlsZHJlbignZGl2Jyk7XG5cdFx0XHRsZXQgYWN0O1xuXHRcdFx0aWYgKHRhLmxlbmd0aCA+IDApe1xuXHRcdFx0XHRhY3QgPSB0YVswXS5nZXRBdHRyaWJ1dGUoJ2FjdGlvbicpO1xuXHRcdFx0fWVsc2V7XG5cdFx0XHRcdGFjdCA9IGUudGFyZ2V0LnBhcmVudEVsZW1lbnQuZ2V0QXR0cmlidXRlKCdhY3Rpb24nKTtcblx0XHRcdH1cblx0XHRcdFxuXHRcdFx0bGV0IG5yID0gKHMuc3BsaXQoJycpKVs2XTtcblx0XHRcdGlmIChhY3Q9PT0ncGx1cycpe1xuXHRcdFx0XHRzY3JlZW5WaWV3W25yXS52aXNpYmxlID0gdHJ1ZTtcblx0XHRcdFx0c2NyZWVuVmlld1tucl0uYWRkcm93ID0gZmFsc2U7XG5cdFx0XHRcdHNjcmVlblZpZXdbbnJdLnJlZHJvdyA9IHRydWU7XG5cdFx0XHRcdGlmIChuciA9PT0gJzMnKXtcblx0XHRcdFx0XHRzY3JlZW5WaWV3WycyJ10ucmVkcm93ID0gZmFsc2U7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKG5yID09PSAnMicpe1xuXHRcdFx0XHRcdHNjcmVlblZpZXdbJzMnXS5hZGRyb3cgPSB0cnVlO1xuXHRcdFx0XHR9XG5cblx0XHRcdH1cblx0XHRcdGlmIChhY3Q9PT0nbWludXMnKXtcblx0XHRcdFx0c2NyZWVuVmlld1tucl0udmlzaWJsZSA9IGZhbHNlO1xuXHRcdFx0XHRzY3JlZW5WaWV3W25yXS5hZGRyb3cgPSB0cnVlO1xuXHRcdFx0XHRzY3JlZW5WaWV3W25yXS5yZWRyb3cgPSBmYWxzZTtcblx0XHRcdFx0aWYgKG5yID09PSAnMicpe1xuXHRcdFx0XHRcdHNjcmVlblZpZXdbJzMnXS5hZGRyb3cgPSBmYWxzZTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAobnIgPT09ICczJyl7XG5cdFx0XHRcdFx0c2NyZWVuVmlld1snMiddLnJlZHJvdyA9IHRydWU7XG5cdFx0XHRcdH1cblxuXHRcdFx0fVxuXHRcdFx0dXBkYXRlU2NyZWVuKCk7XG5cdFx0XHR1cGRhdGVSb3dCdXR0b25zKCk7XG5cdFx0fSk7XG5cdH0pO1xufTtcblxuLy8gU291bmRcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmNvbnN0IHBsYXlTb3VuZCA9IChzdGFydFRpbWUsIHBpdGNoTnIsIGR1cmF0aW9uLCBnYWluT2xkKSA9PiB7XG5cdC8vbGV0IHN0YXJ0VGltZSA9IGF1ZGlvQ29udGV4dC5jdXJyZW50VGltZSArIGRlbGF5O1xuICBcdGxldCBlbmRUaW1lID0gc3RhcnRUaW1lICsgZHVyYXRpb247XG4gIFx0Ly9sZXQgcGl0Y2ggPSB0b25lc1twaXRjaE5yXS5pbnN0cnVtZW50O1xuICBcdGxldCBnYWluID0gdG9uZXNbcGl0Y2hOcl0uZ2FpbjtcblxuICBcdGxldCBvdXRnYWluID0gYXVkaW9Db250ZXh0LmNyZWF0ZUdhaW4oKTtcbiAgXHRvdXRnYWluLmdhaW4udmFsdWUgPSBnYWluO1xuICBcdG91dGdhaW4uY29ubmVjdChhdWRpb0NvbnRleHQuZGVzdGluYXRpb24pO1xuXG4gIFx0bGV0IGVudmVsb3BlID0gYXVkaW9Db250ZXh0LmNyZWF0ZUdhaW4oKTtcbiAgXHRlbnZlbG9wZS5jb25uZWN0KG91dGdhaW4pO1xuICBcdGVudmVsb3BlLmdhaW4udmFsdWUgPSAwO1xuXG4gIFx0ZW52ZWxvcGUuZ2Fpbi5zZXRUYXJnZXRBdFRpbWUoMSwgc3RhcnRUaW1lLCBlbnZlbG9wZVN0YXJ0RW5kVGltZVswXSk7XG4gIFx0ZW52ZWxvcGUuZ2Fpbi5zZXRUYXJnZXRBdFRpbWUoMCwgZW5kVGltZSwgZW52ZWxvcGVTdGFydEVuZFRpbWVbMV0pO1xuXG4gIFx0bGV0IG9zY2lsbGF0b3IgPSBhdWRpb0NvbnRleHQuY3JlYXRlT3NjaWxsYXRvcigpO1xuICBcdG9zY2lsbGF0b3IuY29ubmVjdChlbnZlbG9wZSk7XG5cbiAgXHRvc2NpbGxhdG9yLnR5cGUgPSBvc2NpbGxhdG9yVHlwZTtcbiAgXHRvc2NpbGxhdG9yLmRldHVuZS52YWx1ZSA9IG5vdGVzW3RvbmVzW3BpdGNoTnJdLmluc3RydW1lbnRdLmRldHVuZTtcbiAgXHRvc2NpbGxhdG9yLmZyZXF1ZW5jeS52YWx1ZSA9IDI0MDtcblxuXHRsZXQgdmlicmF0byA9IGF1ZGlvQ29udGV4dC5jcmVhdGVHYWluKCk7XG5cdHZpYnJhdG8uZ2Fpbi52YWx1ZSA9IHZpYnJhdG9nYWluO1xuXHR2aWJyYXRvLmNvbm5lY3Qob3NjaWxsYXRvci5kZXR1bmUpO1xuXG5cdGxldCBsZm8gPSBhdWRpb0NvbnRleHQuY3JlYXRlT3NjaWxsYXRvcigpO1xuXHRsZm8uY29ubmVjdCh2aWJyYXRvKTtcblx0bGZvLmZyZXF1ZW5jeS52YWx1ZSA9bGZvZnJlcTtcblxuXHRvc2NpbGxhdG9yLnN0YXJ0KHN0YXJ0VGltZSk7XG4gIFx0bGZvLnN0YXJ0KHN0YXJ0VGltZSk7XG4gIFx0b3NjaWxsYXRvci5zdG9wKGVuZFRpbWUgKzIgKTtcbiAgXHRsZm8uc3RvcChlbmRUaW1lICsyKTtcblxufTtcblxuLy8vIFBsYXkgTG9vcFxuY29uc3QgcnVuU2VxdWVuY2VycyA9ICgpID0+IHtcblx0aWYgKCFydW5TZXEgfHwgc291bmRRdWV1ZS5sZW5ndGggPT09IDApe2NvbnNvbGUubG9nKFwic3RvcFwiKTtyZXR1cm47fVxuXHRsZXQgY3QgPSBhdWRpb0NvbnRleHQuY3VycmVudFRpbWU7XG5cdHdoaWxlIChzb3VuZFF1ZXVlLmxlbmd0aD4wICYmIHNvdW5kUXVldWVbMF1bMF08IGN0KzAuMTUpe1xuXHRcdC8vY29uc29sZS5sb2coJ2N0OicrY3QrJ3BsYW5lZCB0aW1lOicrc291bmRRdWV1ZVswXVswXSk7XG5cdFx0bGV0IGl0ZW0gPSBzb3VuZFF1ZXVlLnNwbGljZSgwLDEpO1xuXHRcdC8vIHBsYXlzb3VuZCAoc3RhcnR0aW1lLCBwaXRjaCwgZHVyYXRpb24sICAgICAgICAgICAgIGdhaWluKVxuXHRcdC8vcGxheVNvdW5kKGl0ZW1bMF1bMF0sc291bmRzW2l0ZW1bMF1bMV1dWzBdLGl0ZW1bMF1bMl0sdG9uZXNbaXRlbVswXVsxXV0uZ2Fpbik7XG5cblx0XHRwbGF5U291bmQoaXRlbVswXVswXSxpdGVtWzBdWzFdLGl0ZW1bMF1bMl0sdG9uZXNbaXRlbVswXVsxXV0uZ2Fpbik7XG5cdFx0Ly8gZWxlbWVudCAgICAgICAgICAgICAgY29sb3IgICAgICAgZHVyYXRpb24gICAgICAgICAgICAgICAgIGhvdmVyY29sb3Jcblx0XHRoaWdobGlnaHRFbChpdGVtWzBdWzNdLHRvbmVzW2l0ZW1bMF1bMV1dLmNvbG9yLGl0ZW1bMF1bMl0sdG9uZXNbaXRlbVswXVsxXV0uaG92ZXIpO1xuXHR9XG5cdHNldFRpbWVvdXQocnVuU2VxdWVuY2Vycyw5MCk7XG59XG5cbi8vLyBJbXBvcnRhbnQgU291bmQgVmFyaWFibGVzICEhIVxubGV0IHJ1blNlcSA9IHRydWU7XG5sZXQgc291bmRRdWV1ZSA9IFtdO1xudmFyIGF1ZGlvQ29udGV4dCA9IG51bGw7XG5cbnRyeSB7XG4gICB3aW5kb3cuQXVkaW9Db250ZXh0ID0gd2luZG93LkF1ZGlvQ29udGV4dHx8d2luZG93LndlYmtpdEF1ZGlvQ29udGV4dDtcbiAgIHZhciBhdWRpb0NvbnRleHQgPSBuZXcgQXVkaW9Db250ZXh0KCk7XG59IGNhdGNoIChlKSB7XG4gICAgY29uc29sZS5sb2coXCJObyBXZWIgQXVkaW8gQVBJIHN1cHBvcnRcIik7XG59XG4vLyBUT0RPIEZlZWRiYWNrIGlmIGl0IGlzIG5vdCB3b3JraW5nIHdpdGggdGhlIHVzZWQgZGV2aWNlXG5cbi8vSU9TIFN0YXJ0IElPU0hBQ0tcbiQoJ2JvZHknKS5vbigndG91Y2hlbmQnLCAoZSkgPT4ge1xuXHQvL2FsZXJ0KCdzdGFydCBzb3VuZFxuXHQvLyBjcmVhdGUgZW1wdHkgYnVmZmVyXG5cdGxldCBidWZmZXIgPSBhdWRpb0NvbnRleHQuY3JlYXRlQnVmZmVyKDEsIDEsIDIyMDUwKTtcblx0bGV0IHNvdXJjZSA9IGF1ZGlvQ29udGV4dC5jcmVhdGVCdWZmZXJTb3VyY2UoKTtcblx0c291cmNlLmJ1ZmZlciA9IGJ1ZmZlcjtcblxuXHQvLyBjb25uZWN0IHRvIG91dHB1dCAoeW91ciBzcGVha2Vycylcblx0c291cmNlLmNvbm5lY3QoYXVkaW9Db250ZXh0LmRlc3RpbmF0aW9uKTtcblxuXHQvLyBwbGF5IHRoZSBmaWxlXG5cdGlmICh0eXBlb2Ygc291cmNlLm5vdGVPbiAhPT0gJ3VuZGVmaW5lZCcpe1xuXHRcdHNvdXJjZS5ub3RlT24oMCk7XG5cdH1cblx0bGV0IHNyYyA9IG51bGw7XG5cdHNyYyA9IGF1ZGlvQ29udGV4dC5jcmVhdGVPc2NpbGxhdG9yKCk7XG5cdHNyYy50eXBlID0gJ3NxdWFyZSc7XG5cdHNyYy5mcmVxdWVuY3kudmFsdWUgPSA0NDA7XG5cdHNyYy5jb25uZWN0KGF1ZGlvQ29udGV4dC5kZXN0aW5hdGlvbik7XG5cdGxldCBjdCA9IGF1ZGlvQ29udGV4dC5jdXJyZW50VGltZTtcblx0c3JjLnN0YXJ0KGN0KzAuMDUpO1xuXHRzcmMuc3RvcChjdCswLjA2KTtcblx0Ly8gRXZlbnQgb25saWUgb25jZVxuXHQkKCdib2R5JykudW5iaW5kKCAndG91Y2hlbmQnKTtcbn0pO1xuLy9JT1MgRU5EXG5cbi8vLyBNYWluIFNvdW5kIFBsYXkgTWV0aG9kIEZpbGwgdGhlIHF1ZXVlIGFuZCB0aW1lIHRoZSB2aXN1YWxcbmNvbnN0IHBsYXlNdXNpYyA9ICgpID0+IHtcblx0Ly8gZmlsbCBzb3VuZFF1ZXVlXG5cdGxldCBqO1xuXHRsZXQgcmVjdGFyciA9IGQzLnNlbGVjdCgnI2NoYXJ0LXN1bScpLnNlbGVjdCgnZycpLnNlbGVjdEFsbCgnZycpLmRhdGEoKTtcblx0bGV0IGVsYXJyID0gZDMuc2VsZWN0KCcjY2hhcnQtc3VtJykuc2VsZWN0KCdnJykuc2VsZWN0QWxsKCdnJylbMF07XG4gICAgbGV0IHN0YXJ0VGltZSA9IGF1ZGlvQ29udGV4dC5jdXJyZW50VGltZTtcbiAgICAvL2NvbnNvbGUubG9nKCdTdGFydCcrc3RhcnRUaW1lKTtcbiAgICBzb3VuZFF1ZXVlID1bXTtcblx0Zm9yIChsZXQgaT0wOyBpIDwgcmVjdGFyci5sZW5ndGg7IGkrKykge1xuXHRcdGxldCB2ID0gcmVjdGFycltpXTtcblx0XHRcdGZvciAoaj0wO2o8di5sZW5ndGg7aisrKXtcblx0XHRcdFx0Ly9wbGF5U291bmQoaSxzb3VuZHNbdl1bMF0sc291bmRzW3ZdWzFdLHNvdW5kc1t2XVsyXSk7XG5cdFx0XHRcdC8vYWxlcnQoaSk7XG5cdFx0XHRcdGxldCB0bXAgPSBbXTtcblx0XHRcdFx0dG1wLnB1c2goaSpzb3VuZFNwZWVkK3N0YXJ0VGltZStqKjAuMDAwMSk7XG5cdFx0XHRcdHRtcC5wdXNoKHZbal0pO1xuXHRcdFx0XHR0bXAucHVzaCh0b25lZHVyYXRpb24pO1xuXHRcdFx0XHR0bXAucHVzaChkMy5zZWxlY3QoZWxhcnJbaV0pLnNlbGVjdEFsbCgncmVjdCcpWzBdW2pdKTtcblx0XHRcdFx0c291bmRRdWV1ZS5wdXNoKHRtcCk7XG5cdFx0XHR9XG5cdH1cblx0Ly9jb25zb2xlLmxvZygnc3RhcnRzZXF1ZW5jZXInK2F1ZGlvQ29udGV4dC5jdXJyZW50VGltZSk7XG4gICAgcnVuU2VxdWVuY2VycygpO1xufTtcbi8vIHNvdW5kIGNvbnN0YW50c1xubGV0IHNvdW5kU3BlZWQgPSAwLjU7XG5sZXQgdG9uZWR1cmF0aW9uID0gMC4zO1xubGV0IHZpYnJhdG9nYWluID0gMC4zO1xubGV0IGVudmVsb3BlU3RhcnRFbmRUaW1lID0gWzAuMDEsMC4xXTtcbmxldCBsZm9mcmVxID0gNjsgIC8vNVxubGV0IG9zY2lsbGF0b3JUeXBlID0gJ3Nhd3Rvb3RoJzsgLy8nc2luZSc7IC8vICdzYXd0b290aCdcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFNvdW5kIEVuZFxuXG5cblxuLy8gU2NyZWVuIEludGVyYWN0aW9uIGFkZCB1bmQgcmVtb3ZlIG1udWVzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5jb25zdCBuck9mQWN0aXZlQnR0bkdyb3VwID0gKG5yKSA9PiB7XG5cdGxldCBhcnIgPSBbMSwyLDNdLm1hcCgoaSkgPT4gKG5yLTEpKjMraSk7XG5cdGxldCBiYXJyID0gYXJyLm1hcCgoaSkgPT4gdG9uZXNbaV0udmlzaWJsZSlcblx0bGV0IHRhcnIgPSBiYXJyLmZpbHRlcigoaSkgPT4gaSA9PT0gdHJ1ZSlcblx0cmV0dXJuIHRhcnIubGVuZ3RoO1xufTtcbmNvbnN0IGNoYW5nZVNjcmVlbmJ0dG4gPSAoaWQsaHRtbCxhY3QpID0+IHtcblx0JChpZCkuYXR0cignYWN0aW9uJyxhY3QpLmNoaWxkcmVuKCkucmVwbGFjZVdpdGgoaHRtbCk7XG59O1xuXG5jb25zdCBoaWRlQW5kc2V0Um93WmVybyA9IChyb3cpID0+IHtcblx0bGV0IGVsLGlucEVsO1xuXHRmb3IobGV0IGkgPSBjb25mW3Jvdy0xXVswXTsgaSA8IGNvbmZbcm93LTFdWzFdOyBpKyspe1xuXHRcdGVsPSQoJyMnK3RvbmVzW2ldLmlkKTtcblx0XHRlbC5oaWRlKCk7XG5cdFx0Ly8gaGlkZSBhbGwgKyAtIHNpZ25zXG5cdFx0WzIsM10uZm9yRWFjaCgoaSkgPT4geyQoJyNidG4tcm93Jytyb3crJy0nK2krJy1hZGQnKS5oaWRlKCk7fSk7XG5cdFx0XHRpZiAodHlwZW9mIGVsLmNoaWxkcmVuKCdpbnB1dCcpWzBdICE9PSAndW5kZWZpbmVkJyl7XG5cdFx0XHRcdGlucEVsID0gZWwuY2hpbGRyZW4oJ2lucHV0JylbMF07XG5cdFx0XHRcdGlucEVsLnZhbHVlPTA7XG5cdFx0XHRcdCQoaW5wRWwpLnRyaWdnZXIoalF1ZXJ5LkV2ZW50KCdjaGFuZ2UnKSk7XG5cdFx0fVxuXHR9XG59O1xuXG5jb25zdCBzaG93Um93ID0gKHJvdykgPT4ge1xuXHQkKCcjYnRuLXJvdycrcm93KyctMS1hZGQnKS5zaG93KCk7XG5cdGxldCBpID0gY29uZltyb3ctMV1bMF07XG5cdCQoJyMnK3RvbmVzW2ldLmlkKS5zaG93KCk7XG59O1xuXG5jb25zdCB1cGRhdGVSb3dCdXR0b25zID0gKCkgPT4ge1xuXHRbJzInLCczJ10uZm9yRWFjaCgocm93KSA9PiB7XG5cdFx0aWYgKHNjcmVlblZpZXdbcm93XS5hZGRyb3cpe1xuXHRcdFx0JCgnIycrc2NyZWVuVmlld1tyb3ddLmNoYW5nZXJvd2lkKS5jaGlsZHJlbignZGl2JykucmVwbGFjZVdpdGgoIHNjcmVlblZpZXcuYXJjaGlsZCApO1xuXHRcdFx0JCgnIycrc2NyZWVuVmlld1tyb3ddLmNoYW5nZXJvd2lkKS5zaG93KCk7XG5cdFx0fVxuXHRcdGlmIChzY3JlZW5WaWV3W3Jvd10ucmVkcm93KXtcblx0XHRcdCQoJyMnK3NjcmVlblZpZXdbcm93XS5jaGFuZ2Vyb3dpZCkuY2hpbGRyZW4oJ2RpdicpLnJlcGxhY2VXaXRoKCBzY3JlZW5WaWV3Lm1pbnJvd2NoaWxkICk7XG5cdFx0XHQkKCcjJytzY3JlZW5WaWV3W3Jvd10uY2hhbmdlcm93aWQpLnNob3coKTtcblx0XHR9XG5cdFx0aWYoIXNjcmVlblZpZXdbcm93XS5yZWRyb3cgJiYgIXNjcmVlblZpZXdbcm93XS5hZGRyb3cpe1xuXHRcdFx0JCgnIycrc2NyZWVuVmlld1tyb3ddLmNoYW5nZXJvd2lkKS5oaWRlKCk7XG5cdFx0fVxuXHR9KTtcbn07XG5cbmNvbnN0IHVwZGF0ZVNjcmVlbiA9ICgpID0+IHtcblx0bGV0IHMgPSAnJztcblx0WycyJywnMyddLmZvckVhY2goKHJvdykgPT4ge1xuXHRcdHMgPSAnIycrc2NyZWVuVmlld1tyb3ddLmdyYXBoO1xuXHRcdGlmIChzY3JlZW5WaWV3W3Jvd10udmlzaWJsZSl7XG5cdFx0XHQkKHMpLnNob3coKTtcblx0XHRcdHNob3dSb3cocGFyc2VJbnQocm93KSk7XG5cdFx0XHR1cGRhdGVTY3JlZW5QbHVzRWxlbWVudCgpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQkKHMpLmhpZGUoKTtcblx0XHRcdGhpZGVBbmRzZXRSb3daZXJvKHBhcnNlSW50KHJvdykpO1xuXHRcdH1cblx0fSk7XG59O1xuXG4vLyB0aHJlZSBwb3NzaWJsZSBzdGF0ZXNcbmNvbnN0IHVwZGF0ZVNjcmVlblBsdXNFbGVtZW50ID0gKCkgPT4ge1xuXHRsZXQgbnIsZWwsaW5wRWw7XG5cdFsxLDIsM10uZm9yRWFjaCgoaSkgPT4ge1xuXHRcdGlmIChzY3JlZW5WaWV3W2ldLnZpc2libGUpe1xuXHRcdFx0bnIgPSBuck9mQWN0aXZlQnR0bkdyb3VwKGkpO1xuXHRcdFx0c3dpdGNoKG5yKXtcblx0XHRcdFx0Y2FzZSAxOlxuXHRcdFx0XHRcdGNoYW5nZVNjcmVlbmJ0dG4oJyNidG4tcm93JytpKyctMi1hZGQnLHNjcmVlblZpZXcuYWRkYnR0biwnKycraSk7XG5cdFx0XHRcdFx0JCgnI2J0bi1yb3cnK2krJy0yLWFkZCcpLnNob3coKTtcblx0XHRcdFx0XHQkKCcjYnRuLXJvdycraSsnLTMtYWRkJykuaGlkZSgpO1xuXHRcdFx0XHRcdGVsPSQoJyMnK3RvbmVzW2kqM10uaWQpO1xuXHRcdFx0XHRcdGlmICh0eXBlb2YgZWwuY2hpbGRyZW4oJ2lucHV0JylbMF0gIT09ICd1bmRlZmluZWQnKXtcblx0XHRcdFx0XHRcdGlucEVsID0gZWwuY2hpbGRyZW4oJ2lucHV0JylbMF07XG5cdFx0XHRcdFx0XHRpbnBFbC52YWx1ZT0wO1xuXHRcdFx0XHRcdFx0JChpbnBFbCkudHJpZ2dlcihqUXVlcnkuRXZlbnQoJ2NoYW5nZScpKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWw9JCgnIycrdG9uZXNbaSozLTFdLmlkKTtcblx0XHRcdFx0XHRpZiAodHlwZW9mIGVsLmNoaWxkcmVuKCdpbnB1dCcpWzBdICE9PSAndW5kZWZpbmVkJyl7XG5cdFx0XHRcdFx0XHRpbnBFbCA9IGVsLmNoaWxkcmVuKCdpbnB1dCcpWzBdO1xuXHRcdFx0XHRcdFx0aW5wRWwudmFsdWU9MDtcblx0XHRcdFx0XHRcdCQoaW5wRWwpLnRyaWdnZXIoalF1ZXJ5LkV2ZW50KCdjaGFuZ2UnKSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIDI6XG5cdFx0XHRcdFx0Y2hhbmdlU2NyZWVuYnR0bignI2J0bi1yb3cnK2krJy0yLWFkZCcsc2NyZWVuVmlldy5taW5idHRuLCctJytpKTtcblx0XHRcdFx0XHQkKCcjYnRuLXJvdycraSsnLTItYWRkJykuc2hvdygpO1xuXHRcdFx0XHRcdGNoYW5nZVNjcmVlbmJ0dG4oJyNidG4tcm93JytpKyctMy1hZGQnLHNjcmVlblZpZXcuYWRkYnR0biwnKycraSk7XG5cdFx0XHRcdFx0JCgnI2J0bi1yb3cnK2krJy0zLWFkZCcpLnNob3coKTtcblx0XHRcdFx0XHRlbD0kKCcjJyt0b25lc1tpKjNdLmlkKTtcblx0XHRcdFx0XHRpZiAodHlwZW9mIGVsLmNoaWxkcmVuKCdpbnB1dCcpWzBdICE9PSAndW5kZWZpbmVkJyl7XG5cdFx0XHRcdFx0XHRpbnBFbCA9IGVsLmNoaWxkcmVuKCdpbnB1dCcpWzBdO1xuXHRcdFx0XHRcdFx0aW5wRWwudmFsdWU9MDtcblx0XHRcdFx0XHRcdCQoaW5wRWwpLnRyaWdnZXIoalF1ZXJ5LkV2ZW50KCdjaGFuZ2UnKSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIDM6XG5cdFx0XHRcdFx0JCgnI2J0bi1yb3cnK2krJy0yLWFkZCcpLmhpZGUoKTtcblx0XHRcdFx0XHRjaGFuZ2VTY3JlZW5idHRuKCcjYnRuLXJvdycraSsnLTMtYWRkJyxzY3JlZW5WaWV3Lm1pbmJ0dG4sJy0nK2kpO1xuXHRcdFx0XHRcdCQoJyNidG4tcm93JytpKyctMy1hZGQnKS5zaG93KCk7XG5cdFx0XHRcdFx0YnJlYWtcblx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdH1cblx0XHR9XG5cdH0pO1xufTtcbmNvbnN0IGRpc3BOYXZFbGVtZW50cyA9IChvYmopID0+IHtcblx0b2JqLm1hcCgobykgPT4ge1xuXHRcdGlmIChvLnZpc2libGUpe1xuXHRcdFx0JCgnIycrby5pZCkuc2hvdygpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRsZXQgZWw9JCgnIycrby5pZCk7XG5cdFx0XHRlbC5oaWRlKCk7XG5cdFx0XHQvLyBUT0RPIHJlc2V0IElOUFVUXG5cdFx0XHRpZiAodHlwZW9mIGVsLmNoaWxkcmVuKCdpbnB1dCcpWzBdICE9PSAndW5kZWZpbmVkJyl7XG5cdFx0XHRcdGVsLmNoaWxkcmVuKCdpbnB1dCcpWzBdLnZhbHVlPTA7XG5cdFx0XHR9XG5cdFx0XHQvL2NvbnNvbGUubG9nKGVsLmNoaWxkcmVuKCdpbnB1dCcpWzBdLnZhbHVlKTtcblx0XHR9XG5cdH0pO1xufTtcblxuLy8gSW5pdCBTY3JlZW5cbmNvbnN0IGluaXRkM2pzID0gKGVsSWQpID0+IHtcblx0Y29uc3Qgd2lkdGggPSAxMjgwLFxuICAgIGhlaWdodCA9IDQ1O1xuICAgIGxldCBzcl92aWV3cG9ydCA9ICcwIDAgJysod2lkdGgrNzApKycgJytoZWlnaHQ7XG4gICAgY29uc3QgZGl2ID0gZDMuc2VsZWN0KGVsSWQpLFxuXHRzdmcgPSBkaXYuYXBwZW5kKCdzdmcnKVxuICAgICAgICAuYXR0cignd2lkdGgnLCB3aWR0aClcbiAgICAgICAgLmF0dHIoJ2hlaWdodCcsIGhlaWdodClcbiAgICAgICAgLmF0dHIoJ3ZpZXdCb3gnLCBzcl92aWV3cG9ydClcbiAgICAgICAgLmF0dHIoJ3ByZXNlcnZlQXNwZWN0UmF0aW8nLCAneE1pZFlNaWQgbWVldCcpO1xuICAgIHJldHVybiBzdmc7XG59O1xuLy8gTWFpblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIGNvbmZpZ3VyZSBkaXNwbGF5XG4gICAgZGlzcE5hdkVsZW1lbnRzKHRvbmVzKTtcbiAgICBzeW5jRm9ybURpc3BsYXkodG9uZXMpO1xuICAgIHVwZGF0ZVNjcmVlblBsdXNFbGVtZW50KCk7XG5cbiAgICAvLyBiaW5kIGRhdGEgYW5kIHJlbmRlciBkM2pzXG4gICAgbGV0IGNvbmYgPSBbWzEsNF0sWzQsN10sWzcsMTBdLFsxLDEwXV07XG4gICAgbGV0IHN2Z0xpc3QgPSBbXTtcbiAgICBsZXQgbXlkYXRhTGlzdCA9IFtdO1xuICAgIGxldCBzdmcgPSBudWxsO1xuICAgIGxldCBhcnIgPSBbXTtcbiAgICBsZXQgbG9va3VwID0gbnVsbDtcbiAgICBsZXQgbXlkYXRhID0gbnVsbDtcbiAgICBsZXQgaSxqO1xuICAgIGxldCB0bXB3ID0gJCh3aW5kb3cpLndpZHRoKCk7XG5cbiAgICBmb3IgKGkgPSAxOyBpPDU7IGkrKyl7XG4gICAgXHRzdmcgPSBpbml0ZDNqcygnIycrc2NyZWVuVmlld1tgJHtpfWBdLmdyYXBoKTtcbiAgICBcdHN2Zy5hdHRyKCd3aWR0aCcsIHRtcHcpO1xuICAgIFx0c3ZnTGlzdC5wdXNoKHN2Zyk7XG4gICAgXHRhcnIgPSBbMF07XG4gICAgXHRmb3IgKGogb2YgcmFuZ2UoY29uZltpLTFdWzBdLGNvbmZbaS0xXVsxXSkpe1xuICAgIFx0XHRhcnIucHVzaChqKTtcbiAgICBcdH1cbiAgICBcdGxvb2t1cCA9IGFyci5tYXAoKGkpID0+IHRvbmVzW2ldLmNvbG9yKTtcbiAgICBcdGlmIChpIDwgNCl7XG4gICAgXHRcdG15ZGF0YSA9IHJlZHJhdyhyZWFkSW5wdXQoaSkpO1xuICAgIFx0XHRteWRhdGFMaXN0LnB1c2gobXlkYXRhKTtcbiAgICBcdFx0cmVnaXN0ZXJJbnB1dE9uQ2hhbmdlKGksc3ZnLGxvb2t1cCk7XG4gICAgXHRcdHJlbmRlckdyYXBoKG15ZGF0YSxzdmcsbG9va3VwLGZhbHNlKTtcblxuICAgIFx0fSBlbHNlIHtcbiAgICBcdFx0bXlkYXRhID0gcmVkdWNlM2RhdGEobXlkYXRhTGlzdFswXVswXSxteWRhdGFMaXN0WzFdWzBdLG15ZGF0YUxpc3RbMl1bMF0pO1xuICAgIFx0XHRyZW5kZXJHcmFwaChteWRhdGEsc3ZnLGxvb2t1cCx0cnVlKTtcbiAgICBcdH1cbiAgICB9XG5cdC8vIHJlc3BvbnNpdmUgY2hhbmdlXG4gICAgZDMuc2VsZWN0KHdpbmRvdylcbiAgICBcdC5vbigncmVzaXplJywgKCkgPT4ge1xuXHRcdCAgICBsZXQgd2luV2lkdGggPSAkKHdpbmRvdykud2lkdGgoKTtcblx0XHQgICAgZm9yKGxldCBpPTA7IGkgPCBzdmdMaXN0Lmxlbmd0aDsgaSsrKXtcblx0XHQgICAgXHRzdmdMaXN0W2ldLmF0dHIoXCJ3aWR0aFwiLCB3aW5XaWR0aCk7XG5cdFx0ICAgIH1cbiAgXHRcdH0pO1xuXG5cdC8vIFJlZ2lzdGVyIEJ1dHRvbnNcblx0Ly8gYmxhY2tidXR0b24gb25seSBvbmUgcmVnaXN0cmF0aW9uXG5cdHJlZ2lzdGVyQmxhY2tWb2x1bWVCdXR0b24oKTtcblx0cmVnaXN0ZXJCbGFja1RvbkJ1dHRvbigpO1xuXG5cdC8vIFJlZ2lzdGVyIDMgcm93cyBWIEJ1dHRvblxuXHRbMSwyLDNdLmZvckVhY2goKGkpID0+IHJlZ2lzdGVyQnV0dG9uKGkpKTtcblx0WzEsMiwzXS5mb3JFYWNoKChpKSA9PiByZWdpc3RlclRvbkJ1dHRvbihpKSk7XG5cdFsxLDIsM10uZm9yRWFjaCgoaSkgPT4gcmVnaXN0ZXJWb2x1bWVCdXR0b24oaSkpO1xuXG5cdHJlZ2lzdGVyU2NyZWVuUGx1c0J0dG4oKTtcblx0cmVnaXN0ZXJTY3JlZW5Sb3dQbHVzQnR0bigpO1xuXHRyZWdpc3RlclBsYXlCdXR0b24oKTtcblx0cmVnaXN0ZXJTdG9wQnV0dG9uKCk7XG5cdHVwZGF0ZVNjcmVlbigpO1xuXHR1cGRhdGVSb3dCdXR0b25zKCk7XG59KTtcbiJdfQ==

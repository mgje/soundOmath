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
		var interval = arguments.length <= 2 || arguments[2] === undefined ? 1 : arguments[2];

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
		var elval = undefined,
		    val = undefined;
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
		var tmp = undefined,
		    s = undefined;
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
		    col = undefined,
		    nextEvent = undefined,
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
		var rownr = undefined,
		    id = undefined;
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
				var nr = undefined;
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
				var nr = undefined;
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
				var act = ta[0].getAttribute('action');
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
		var j = undefined;
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
		var el = undefined,
		    inpEl = undefined;
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
		var nr = undefined,
		    el = undefined,
		    inpEl = undefined;
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
	var i = undefined,
	    j = undefined;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvc2NyaXB0cy9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQSxFQUFFLFFBQUYsRUFBWSxLQUFaLENBQWtCLFlBQVU7Ozs7QUFJNUIsS0FBSSxRQUFRLENBQUM7QUFDWixRQUFLLENBQUw7QUFDQSxVQUFPLEdBQVA7QUFDQSxTQUFNLEtBQU47QUFDRyxXQUFRLFNBQVI7QUFDSCxXQUFRLFNBQVI7QUFDQSxnQkFBYSxJQUFiO0FBQ0EsUUFBSyxXQUFMO0FBQ0EsYUFBVSxJQUFWO0VBUlcsRUFVWjtBQUNDLFFBQUssQ0FBTDtBQUNBLFVBQU8sR0FBUDtBQUNBLFNBQU0sS0FBTjtBQUNBLFdBQVEsU0FBUjtBQUNBLFdBQVEsU0FBUjtBQUNBLGdCQUFhLElBQWI7QUFDQSxRQUFLLFdBQUw7QUFDQSxhQUFVLElBQVY7RUFsQlcsRUFvQlo7QUFDQyxRQUFLLENBQUw7QUFDQSxVQUFPLEdBQVA7QUFDQSxTQUFNLElBQU47QUFDQSxXQUFRLFNBQVI7QUFDQSxXQUFRLFNBQVI7QUFDQSxnQkFBYSxJQUFiO0FBQ0EsUUFBSyxXQUFMO0FBQ0EsYUFBVSxLQUFWO0VBNUJXLEVBOEJaO0FBQ0MsUUFBSyxDQUFMO0FBQ0EsVUFBTyxHQUFQO0FBQ0EsU0FBTSxJQUFOO0FBQ0EsV0FBUSxTQUFSO0FBQ0EsV0FBUSxTQUFSO0FBQ0EsZ0JBQWEsSUFBYjtBQUNBLFFBQUssV0FBTDtBQUNBLGFBQVUsS0FBVjtFQXRDVyxFQXlDWjtBQUNDLFFBQUssQ0FBTDtBQUNBLFVBQU8sR0FBUDtBQUNBLFNBQU0sS0FBTjtBQUNBLFdBQVEsU0FBUjtBQUNBLFdBQVEsU0FBUjtBQUNBLGdCQUFhLElBQWI7QUFDQSxRQUFLLFdBQUw7QUFDQSxhQUFVLElBQVY7RUFqRFcsRUFtRFo7QUFDQyxRQUFLLENBQUw7QUFDQSxVQUFPLEdBQVA7QUFDQSxTQUFNLElBQU47QUFDQSxXQUFRLFNBQVI7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LENBQWxCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XG4vLyBNb2RlbFxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gU291bmQgY29uc3RhbnN0cyBwcmVzZXRzXG5sZXQgdG9uZXMgPSBbe1xuXHQnbnInOjAsXG5cdCdnYWluJzowLjIsXG5cdCd2b2wnOicyMCUnLFxuICAgICdjb2xvcic6JyM3NTc1NzUnLFxuXHQnaG92ZXInOicjMDAwMDAwJyxcblx0J2luc3RydW1lbnQnOidEMycsXG5cdCdpZCc6J2lnLXJvdzEtMCcsXG5cdCd2aXNpYmxlJzp0cnVlXG59LFxue1xuXHQnbnInOjEsXG5cdCdnYWluJzowLjgsXG5cdCd2b2wnOicyMCUnLFxuXHQnY29sb3InOicjMjk2RUFBJyxcblx0J2hvdmVyJzonIzA5NEU4QScsXG5cdCdpbnN0cnVtZW50JzonQTQnLFxuXHQnaWQnOidpZy1yb3cxLTEnLFxuXHQndmlzaWJsZSc6dHJ1ZVxufSxcbntcblx0J25yJzoyLFxuXHQnZ2Fpbic6MC4wLFxuXHQndm9sJzonMCUnLFxuXHQnY29sb3InOicjNTQ5MUI1Jyxcblx0J2hvdmVyJzonIzM0NjE3NScsXG5cdCdpbnN0cnVtZW50JzonRjMnLFxuXHQnaWQnOidpZy1yb3cxLTInLFxuXHQndmlzaWJsZSc6ZmFsc2Vcbn0sXG57XG5cdCducic6Myxcblx0J2dhaW4nOjAuMCxcblx0J3ZvbCc6JzAlJyxcblx0J2NvbG9yJzonIzc5QkVGQScsXG5cdCdob3Zlcic6JyM1OTlFQkEnLFxuXHQnaW5zdHJ1bWVudCc6J0czJyxcblx0J2lkJzonaWctcm93MS0zJyxcblx0J3Zpc2libGUnOmZhbHNlXG59LFxuXG57XG5cdCducic6NCxcblx0J2dhaW4nOjAuNSxcblx0J3ZvbCc6JzQwJScsXG5cdCdjb2xvcic6JyM0QkE4NEInLFxuXHQnaG92ZXInOicjMkI4ODJCJyxcblx0J2luc3RydW1lbnQnOidENCcsXG5cdCdpZCc6J2lnLXJvdzItMScsXG5cdCd2aXNpYmxlJzp0cnVlXG59LFxue1xuXHQnbnInOjUsXG5cdCdnYWluJzowLjAsXG5cdCd2b2wnOicwJScsXG5cdCdjb2xvcic6JyM1NDcyNDknLFxuXHQnaG92ZXInOicjMjQ1MjE5Jyxcblx0J2luc3RydW1lbnQnOidCNCcsXG5cdCdpZCc6J2lnLXJvdzItMicsXG5cdCd2aXNpYmxlJzpmYWxzZVxufSxcbntcblx0J25yJzo2LFxuXHQnZ2Fpbic6MC4wLFxuXHQndm9sJzonMCUnLFxuXHQnY29sb3InOicjMUY2MjQxJyxcblx0J2hvdmVyJzonIzFGNjI0MScsXG5cdCdpbnN0cnVtZW50JzonQzQnLFxuXHQnaWQnOidpZy1yb3cyLTMnLFxuXHQndmlzaWJsZSc6ZmFsc2Vcbn0sXG57XG5cdCducic6Nyxcblx0J2dhaW4nOjAuMyxcblx0J3ZvbCc6JzgwJScsXG5cdCdjb2xvcic6JyNEQjM4MzMnLFxuXHQnaG92ZXInOicjQUIxODEzJyxcblx0J2luc3RydW1lbnQnOidHNCcsXG5cdCdpZCc6J2lnLXJvdzMtMScsXG5cdCd2aXNpYmxlJzp0cnVlXG59LFxue1xuXHQnbnInOjgsXG5cdCdnYWluJzowLjAsXG5cdCd2b2wnOicwJScsXG5cdCdjb2xvcic6JyNCMzBCMEInLFxuXHQnaG92ZXInOicjNTMwQjBCJyxcblx0J2luc3RydW1lbnQnOidFNCcsXG5cdCdpZCc6J2lnLXJvdzMtMicsXG5cdCd2aXNpYmxlJzpmYWxzZVxufSxcbntcblx0J25yJzo5LFxuXHQnZ2Fpbic6MC4wLFxuXHQndm9sJzonMCUnLFxuXHQnY29sb3InOicjQTExMjNGJyxcblx0J2hvdmVyJzonIzUxMDIxRicsXG5cdCdpbnN0cnVtZW50JzonRjQnLFxuXHQnaWQnOidpZy1yb3czLTMnLFxuXHQndmlzaWJsZSc6ZmFsc2Vcbn1dO1xuXG4vLyBzb3VuZHNcbmxldCBub3RlcyA9IHtcblx0J0QzJzoge1xuXHRcdCdmcmVxJzogNDQwLFxuXHRcdCdkZXR1bmUnOiAtNzAwXG5cdH0sXG5cdCdFMyc6IHtcblx0XHQnZnJlcSc6IDQ0MCxcblx0XHQnZGV0dW5lJzogLTUwMFxuXHR9LCBcblx0J0YzJzoge1xuXHRcdCdmcmVxJzogNDQwLFxuXHRcdCdkZXR1bmUnOiAtNDAwXG5cdH0sXG5cdCdHMyc6IHtcblx0XHQnZnJlcSc6IDQ0MCxcblx0XHQnZGV0dW5lJzogLTIwMFxuXHR9LFxuXHQnQTQnOiB7XG5cdFx0J2ZyZXEnOiA0NDAsXG5cdFx0J2RldHVuZSc6IDBcblx0fSxcblx0J0I0Jzoge1xuXHRcdCdmcmVxJzogNDQwLFxuXHRcdCdkZXR1bmUnOiAyMDBcblx0fSxcblx0J0M0Jzoge1xuXHRcdCdmcmVxJzogNDQwLFxuXHRcdCdkZXR1bmUnOiAzMDBcblx0fSxcblx0J0Q0Jzoge1xuXHRcdCdmcmVxJzogNDQwLFxuXHRcdCdkZXR1bmUnOiA1MDBcblx0fSxcblx0J0U0Jzoge1xuXHRcdCdmcmVxJzogNDQwLFxuXHRcdCdkZXR1bmUnOiA3MDBcblx0fSxcblx0J0Y0Jzoge1xuXHRcdCdmcmVxJzogNDQwLFxuXHRcdCdkZXR1bmUnOiA4MDBcblx0fSxcblx0J0c0Jzoge1xuXHRcdCdmcmVxJzogNDQwLFxuXHRcdCdkZXR1bmUnOiAxMDAwXG5cdH1cbn07XG5cbmxldCBzY3JlZW5WaWV3ID0ge1xuXHQnMScgOiB7XG5cdFx0J3Zpc2libGUnIFx0OiB0cnVlLFxuXHRcdCdncmFwaCdcdFx0OiAnY2hhcnQnLFxuXHRcdCdkYXRhJ1x0XHQ6IHRydWVcblxuXHR9LFxuXHQnMidcdDoge1xuXHRcdCd2aXNpYmxlJyAgXHQ6IHRydWUsXG5cdFx0J2dyYXBoJ1x0XHQ6ICdjaGFydC0yJyxcblx0XHQnYWRkcm93J1x0OiBmYWxzZSxcblx0XHQncmVkcm93J1x0OiB0cnVlLFxuXHRcdCdkYXRhJ1x0XHQ6IHRydWUsXG5cdFx0J2NoYW5nZXJvd2lkJyA6ICdhZGRyb3cyJ1xuXHR9LCBcblx0JzMnXHQ6IHtcblx0XHQndmlzaWJsZScgIFx0OiBmYWxzZSxcblx0XHQnZ3JhcGgnXHRcdDogJ2NoYXJ0LTMnLFxuXHRcdCdhZGRyb3cnXHQ6IHRydWUsXG5cdFx0J3JlZHJvdydcdDogZmFsc2UsXG5cdFx0J2RhdGEnXHRcdDogdHJ1ZSxcblx0XHQnY2hhbmdlcm93aWQnIDogJ2FkZHJvdzMnXG5cdH0sXG5cdCc0J1x0OiB7XG5cdFx0J3Zpc2libGUnICBcdDogdHJ1ZSxcblx0XHQnZ3JhcGgnXHRcdDogJ2NoYXJ0LXN1bScsXG5cdFx0J2RhdGEnXHRcdDogdHJ1ZVxuXHR9LFxuXHQnYXJjaGlsZCcgXHRcdDogJzxkaXYgYWN0aW9uPVwicGx1c1wiPjxpIGNsYXNzPVwiZmEgZmEtcGx1cy1zcXVhcmVcIj48L2k+PHNwYW4+VG9uLVphaGxlbnJlaWhlPC9zcGFuPjwvZGl2PicsXG5cdCdtaW5yb3djaGlsZCcgXHQ6ICc8ZGl2IGFjdGlvbj1cIm1pbnVzXCI+PGkgY2xhc3M9XCJmYSBmYS1taW51cy1zcXVhcmVcIj48L2k+PHNwYW4+VG9uLVphaGxlbnJlaWhlPC9zcGFuPjwvZGl2PicsIFxuXHQnYWRkYnR0bidcdFx0OiAnPHNwYW4gY2xhc3M9XCJnbHlwaGljb24gZ2x5cGhpY29uLXBsdXNcIj48L3NwYW4+Jyxcblx0J21pbmJ0dG4nXHRcdDogJzxzcGFuIGNsYXNzPVwiZ2x5cGhpY29uIGdseXBoaWNvbi1taW51c1wiPjwvc3Bhbj4nXG59O1xuXG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIE1vZGVsIEVuZFxuXG5cdGNvbnN0IHJhbmdlID0gKGJlZ2luLCBlbmQsIGludGVydmFsID0gMSkgPT4ge1xuXHRcdGxldCBvdXQgPSBbXTtcblx0XHRmb3IgKGxldCBpID0gYmVnaW47IGkgPCBlbmQ7IGkgKz0gaW50ZXJ2YWwpIHtcbiAgICAgICAgIFx0b3V0LnB1c2goaSk7XG4gICAgIFx0fVxuICAgICBcdHJldHVybiBvdXQ7XG5cdH07XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFZpc3VhbCBEM0pTIFN0YXJ0XG5cbi8vIENvbnN0YW50cyBmb3IgRDNKU1xuY29uc3QgcncgPSAyMCwgLy8gcmVjdCB3aWR0aFxucmggPSAyMCwgLy8gcmVjdCBoZWlnaHRcbnJvd04gPTEsIC8vIG51bWJlciBvZiByb3dzXG5jb2xOID00ODsgLy8gbnVtYmVyIG9mIGNvbHVtbnNcblxuLy8gTWFpbiB2aXN1YWwgRDMgdXBkYXRlIGZ1bmN0aW9uXG5jb25zdCB1cGRhdGVHcmFwaCA9IChkYXRhLHN2Zyxsb29rdXAsY2hlY2tzdW0pID0+IHtcblx0Ly8gZHJhdyBzdW1hdGlvbiByb3dcblx0aWYgKGNoZWNrc3VtKXtcblx0XHRsZXQgZ3JwID0gc3ZnLnNlbGVjdEFsbCgnc3ZnIGcnKVxuXHQgICAgLmRhdGEoZGF0YSk7XG5cblx0ICAgIGxldCBpbm5lcmdycCA9IGdycC5zZWxlY3RBbGwoJ2cnKVxuXHQgICAgLmRhdGEoKGQpID0+IGQpO1xuXG5cdCAgICAvLyBjYXNlIDMgLT4gMiAtPiAxIHJlbW92ZSBnXG5cdCAgICBpbm5lcmdycFxuXHQgICAgLmV4aXQoKVxuXHQgICAgLnJlbW92ZSgpO1xuXHQgICAgXG5cdCAgICBpbm5lcmdycFxuXHQgICAgLmVudGVyKClcblx0XHQuYXBwZW5kKCdnJylcblx0XHQuYXR0cigndHJhbnNmb3JtJywgKGQsIGkpID0+ICd0cmFuc2xhdGUoJyArIDI4ICogaSArICcsMCknKTtcblx0XHRcblx0XHQvLyBzZWxlY3QgcmVjdHNcblx0XHRsZXQgcmVjdHM9aW5uZXJncnAuc2VsZWN0QWxsKCdyZWN0Jylcblx0XHQuZGF0YSgoZCkgPT4gZCk7XG5cdFx0XG5cdFx0Ly8gY2FzZSAzIC0+IDIgLT4gMSByZW1vdmUgcmVjdHNcblx0XHRyZWN0cy5leGl0KClcblx0XHQucmVtb3ZlKCk7XG5cblx0XHQvL3VwZGF0ZSBjb2xvciBwb3Mgd2lkdGhcblx0XHRyZWN0cy5hdHRyKCdmaWxsJywgKGQsaSkgPT4gbG9va3VwW2RdKVxuXHRcdC5hdHRyKCd4JywgKGQsIGksaykgPT4gIHJ3L2RhdGFbMF1ba10ubGVuZ3RoICogaSlcblx0XHQuYXR0cignd2lkdGgnLCAoZCxpLGspID0+ICBydy9kYXRhWzBdW2tdLmxlbmd0aClcblx0XHQuZW50ZXIoKVxuXHRcdC5hcHBlbmQoJ3JlY3QnKVxuXHRcdC8vYWRkIGNvbG9yIHBvcyB3aWR0aCBoaWdodFxuXHRcdC5hdHRyKCdmaWxsJywgKGQsaSkgPT4gbG9va3VwW2RdKVxuXHRcdC5hdHRyKCd4JywgKGQsIGksaykgPT4gIHJ3L2RhdGFbMF1ba10ubGVuZ3RoICogaSlcblx0XHQuYXR0cignd2lkdGgnLCAoZCxpLGspID0+ICBydy9kYXRhWzBdW2tdLmxlbmd0aClcblx0XHQuYXR0cignaGVpZ2h0JywgcmgpO1xuXG5cdC8vIGRyYXcgYSBzaW5nbGUgcm93XHRcblx0fSBlbHNlIHtcblx0XHRzdmcuc2VsZWN0QWxsKCdzdmcgZyByZWN0Jylcblx0XHQuZGF0YShkYXRhWzBdKVxuXHRcdC8vIHVwZGF0ZSBjb2xvclxuXHRcdC5hdHRyKCdmaWxsJywgKGQsaSkgPT4gbG9va3VwW2RdKVxuXHRcdC5lbnRlcigpXG5cdFx0LmFwcGVuZCgncmVjdCcpXG5cdCAgICAuYXR0cigneCcsIChkLCBpKSA9PiAgMjggKiBpKVxuXHQgICAgLmF0dHIoJ3dpZHRoJywgcncpXG5cdCAgICAuYXR0cignaGVpZ2h0JywgcmgpO1xuXHQgICAgLy8ucmVtb3ZlKCk7XG5cdH1cbn07XG5cbmNvbnN0IHJlbmRlckdyYXBoID0gKGRhdGEsc3ZnLGxvb2t1cCxjaGVja3N1bSkgPT4ge1xuXHQvLyBDcmVhdGUgYSBncm91cCBmb3IgZWFjaCByb3cgaW4gdGhlIGRhdGEgbWF0cml4IGFuZFxuXHQvLyB0cmFuc2xhdGUgdGhlIGdyb3VwIHZlcnRpY2FsbHlcblx0bGV0IGdycCA9IHN2Zy5zZWxlY3RBbGwoJ3N2ZyBnJylcblx0ICAgIC5kYXRhKGRhdGEpXG5cdCAgICAuZW50ZXIoKVxuXHQgICAgLmFwcGVuZCgnZycpXG5cdCAgICAuYXR0cigndHJhbnNmb3JtJywgKGQsIGkpID0+ICd0cmFuc2xhdGUoMCwgJyArIDU0ICogaSArICcpJyk7ICBcblxuXHRpZiAoY2hlY2tzdW0pe1xuXHRcdC8vaW5uZXIgc3RydWN0dXJlXG5cdFx0bGV0IGluZ3JwID0gZ3JwLnNlbGVjdEFsbCgnZycpXG5cdFx0ICAgIC5kYXRhKChkKSA9PiBkKVxuXHRcdCAgICAuZW50ZXIoKVxuXHRcdCAgICAuYXBwZW5kKCdnJylcblx0XHQgICAgLmF0dHIoJ3RyYW5zZm9ybScsIChkLCBpKSA9PiAndHJhbnNsYXRlKCcgKyAyOCAqIGkgKyAnLDApJyk7XG5cblx0XHRpbmdycC5zZWxlY3RBbGwoJ3JlY3QnKVxuXHRcdCAgICAuZGF0YSgoZCkgPT4gZClcblx0XHQgICAgLmVudGVyKClcblx0XHQgICAgLmFwcGVuZCgncmVjdCcpXG5cdFx0ICAgIFx0LmF0dHIoJ3gnLCAoZCwgaSxrKSA9PiAgcncvZGF0YVswXVtrXS5sZW5ndGggKiBpKVxuXHRcdCAgICAgICAgLmF0dHIoJ2ZpbGwnLCAoZCxpKSA9PiBsb29rdXBbZF0pXG5cdFx0ICAgICAgICAuYXR0cignd2lkdGgnLCAoZCxpLGspID0+ICBydy9kYXRhWzBdW2tdLmxlbmd0aClcblx0XHQgICAgICAgIC5hdHRyKCdoZWlnaHQnLCByaCk7ICBcblx0fSBlbHNlIHtcblx0XHQvLyBGb3IgZWFjaCBncm91cCwgY3JlYXRlIGEgc2V0IG9mIHJlY3RhbmdsZXMgYW5kIGJpbmQgXG5cdFx0Ly8gdGhlbSB0byB0aGUgaW5uZXIgYXJyYXkgKHRoZSBpbm5lciBhcnJheSBpcyBhbHJlYWR5XG5cdFx0Ly8gYmluZGVkIHRvIHRoZSBncm91cClcblx0XHRncnAuc2VsZWN0QWxsKCdyZWN0Jylcblx0XHRcdC8vIC5maWx0ZXIoIChkLGkpID0+IHR5cGVvZiBkW2ldID09PSAnbnVtYmVyJylcblx0XHQgICAgLmRhdGEoKGQpID0+IGQpXG5cdFx0ICAgIC5lbnRlcigpXG5cdFx0ICAgIC5hcHBlbmQoJ3JlY3QnKVxuXHRcdCAgICAgICAgLmF0dHIoJ3gnLCAoZCwgaSkgPT4gIDI4ICogaSlcblx0XHQgICAgICAgIC5hdHRyKCdmaWxsJywgKGQsaSkgPT4gbG9va3VwW2RdKVxuXHRcdCAgICAgICAgLmF0dHIoJ3dpZHRoJywgcncpXG5cdFx0ICAgICAgICAuYXR0cignaGVpZ2h0JywgcmgpOyAgICAgXG5cdH1cblxuXHQvL01vZHVsbyAxMCB0aWNrcyAgICAgICAgXG5cdGdycC5zZWxlY3RBbGwoJ2xpbmUnKVxuXHQgICAgLmRhdGEoKGQpID0+IHtcblx0ICAgIFx0bGV0IHRtcCA9IE1hdGgudHJ1bmMoZC5sZW5ndGggLyAxMCk7XG5cdCAgICBcdGxldCBvdXQgPSBuZXcgQXJyYXkodG1wKzEpLmZpbGwoMCk7XG5cdCAgICBcdHJldHVybiBvdXQ7XG5cdCAgICB9KVxuXHQgICAgLmVudGVyKCkuYXBwZW5kKCdsaW5lJylcbiAgXHRcdFx0LmF0dHIoJ3gxJywgIChkLCBpKSA9PiAyODAgKiBpKzEpXG4gIFx0XHRcdC5hdHRyKCd5MScsIDIwKVxuICBcdFx0XHQuYXR0cigneDInLCAoZCwgaSkgPT4gMjgwICogaSsxKVxuICBcdFx0XHQuYXR0cigneTInLDQwKVxuICBcdFx0XHQuc3R5bGUoJ3N0cm9rZScsICdibGFjaycpXG4gIFx0XHRcdC5zdHlsZSgnc3Ryb2tlLXdpZHRoJywnMnB4Jyk7XG4gIFxuICBcdC8vIFRleHQgXG4gIFx0Z3JwLnNlbGVjdEFsbCgndGV4dCcpXG5cdCAgICAuZGF0YSgoZCkgPT4ge1xuXHQgICAgXHRsZXQgdG1wID0gTWF0aC50cnVuYyhkLmxlbmd0aCAvIDEwKTtcblx0ICAgIFx0bGV0IG91dCA9IG5ldyBBcnJheSh0bXArMSkuZmlsbCgwKTtcblx0ICAgIFx0cmV0dXJuIG91dDtcblx0ICAgIH0pXG5cdCAgICAuZW50ZXIoKS5hcHBlbmQoJ3RleHQnKVxuXHQgICAgLy8uZmlsdGVyKChkLGkpID0+IGklMTA9PT0wKVxuXHQgICAgXHQuYXR0cigneCcsIChkLCBpKSA9PiB7IHJldHVybiAyODAgKiBpKzU7IH0pXG5cdCAgICBcdC5hdHRyKCd5JywgJzM4JykgIFxuXHQgICAgXHQuYXR0cignZm9udC1mYW1pbHknLCAnc2Fucy1zZXJpZicpIFxuXHQgICAgXHQudGV4dCggKGQsIGksaykgPT4gayo0MCtpKjEwKzEpO1xufTtcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFZpc3VhbCBEM0pTIEVuZFxuXG4vLyBVc2VyIEludGVyYWN0aW9uc1xuLy8gcmVhZHMgUGFyYW1ldGVyIFRvbiBaYWhsIGZvciByb3cgb25lXG5jb25zdCByZWFkSW5wdXQgPSAocm93KSA9PiB7XG5cdC8vIEVsZW1lbnQgSUQgb2YgQnV0dG9uc1xuXHRsZXQgaWRzID0gWzEsMiwzXS5tYXAoKGkpID0+ICcjYnRuLXJvdycrcm93KyctJytpKTtcblx0bGV0IG91dCA9IFtdO1xuXHRsZXQgZWx2YWwsdmFsO1xuXHRpZHMuZm9yRWFjaCgoZWwpID0+IHtcblx0XHRlbHZhbCA9ICQoZWwpXG5cdFx0XHQucGFyZW50KClcblx0XHRcdC5wYXJlbnQoKVxuXHRcdFx0LmNoaWxkcmVuKCdpbnB1dCcpWzBdO1xuXHRcdHZhbCA9IGVsdmFsICE9PSAndW5kZWZpbmVkJyA/IGVsdmFsLnZhbHVlIDogMDtcblx0XHRvdXQucHVzaCh2YWwpO1xuXHR9KTtcblx0cmV0dXJuIG91dDtcbn07XG5cbi8vIFN1bSBhbGwgcm93cyB0b2dldGhlclxuLy8gUmVkdWNlIGRhdGEgZnJvbSAzIGFycmF5cyB0byBvbmUgQXJyYXlcbmNvbnN0IHJlZHVjZTNkYXRhID0gKGFyckIsYXJyRyxhcnJSKSA9PiB7XG5cdGxldCBvdXQgPSBbXTtcblx0bGV0IG91dGVyID0gW107XG5cdG91dGVyLnB1c2gob3V0KTtcblx0bGV0IHRtcCxzO1xuXHRmb3IobGV0IGk9MDsgaTxhcnJCLmxlbmd0aDsgaSsrKXtcblx0XHR0bXAgPSBbXTtcblx0XHR0bXAucHVzaChhcnJCW2ldKTtcblx0XHR0bXAucHVzaChhcnJHW2ldPT09MCA/IDAgOiBhcnJHW2ldICsgMyk7XG5cdFx0dG1wLnB1c2goYXJyUltpXT09PTAgPyAwIDogYXJyUltpXSArIDYpO1xuXHRcdHMgPSBuZXcgU2V0KHRtcCk7XG5cdFx0aWYgKHMuc2l6ZSA+IDEgJiYgcy5oYXMoMCkpe1xuXHRcdFx0cy5kZWxldGUoMCk7XG5cdFx0fVxuXHRcdG91dC5wdXNoKEFycmF5LmZyb20ocykpO1xuXHR9XG5cdHJldHVybiBvdXRlcjtcbn07XG5cbi8vIGNhbGN1bGF0ZSBhIG51bWJlcmFycmF5XG4vLyBSZWRyYXcgR2FtZVxuY29uc3QgcmVkcmF3ID0gKGlucHN0cmFycikgPT4ge1xuXHRsZXQgaW5wID0gW107XG5cdC8vIHBhcnNlIGlucHV0XG5cdGZvciAobGV0IGkgPSAwOyBpIDwgaW5wc3RyYXJyLmxlbmd0aDsgaSsrKXtcblx0XHRpbnAucHVzaChwYXJzZUludChpbnBzdHJhcnJbaV0pKTtcblx0fTtcblxuICAgIC8vIGluaXQgdmFsdWVzXG5cdGxldCB0ID0gMSwgLy8gY291dCB2YWx1ZVxuXHRcdGRhdGEgPSBbXSxcblx0XHRjb2wsXG5cdFx0bmV4dEV2ZW50LFxuXHRcdHRtcCA9IDA7XG5cblx0Ly8gZGV0ZXJtaW5lIHRoZSBzdGFydCB2YWx1ZTtcblx0Zm9yIChsZXQgaSA9IDA7IGkgPCBpbnAubGVuZ3RoOyBpKyspe1xuXHRcdGNvbCA9IGk7XG5cdFx0bmV4dEV2ZW50ID0gaW5wW2NvbF07XG5cdFx0aWYgKG5leHRFdmVudCA+IDApe1xuXHRcdFx0YnJlYWs7XG5cdFx0fVxuXHR9XG5cdGZvciAobGV0IGsgPSAwOyBrIDwgcm93TjsgayArPSAxKSB7XG5cdFx0bGV0IHJvdyA9IFtdO1xuXHRcdGRhdGEucHVzaChyb3cpO1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgY29sTjsgaSArPTEpe1xuXHRcdFx0aWYgKHQgPT09ICBuZXh0RXZlbnQpe1xuXHRcdFx0XHQvLyBqdW1wIG92ZXIgMCBjb2xvciBlbnRyaWVzXG5cdFx0XHRcdHRtcCA9IGNvbCsxOyAvLyBibGFjayBoYXMgaW5kZXggMFxuXHRcdFx0XHQvLyBpZiBzb21ldGhpbmcgaXMgemVybyBnbyBmdXJ0aGVyXG5cdFx0XHRcdHdoaWxlIChpbnBbKGNvbCsxKSVpbnAubGVuZ3RoXSA8IDEpe1xuXHRcdFx0XHRcdGNvbCA9IChjb2wrMSklaW5wLmxlbmd0aDtcblx0XHRcdFx0fVxuXHRcdFx0XHRuZXh0RXZlbnQgKz0gaW5wWyhjb2wrMSklaW5wLmxlbmd0aF07XG5cdFx0XHRcdGNvbCA9IChjb2wrMSklaW5wLmxlbmd0aDsgLy8gbmV4dCBjb2xvclxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dG1wID0gMDtcblx0XHRcdH1cblx0XHRcdC8vIGp1c3QgYXJyYXlcblx0XHRcdHJvdy5wdXNoKHRtcCk7XG5cdFx0XHQvL3Jvdy5wdXNoKFt0LCB0bXBdKTtcblx0XHRcdHQgPSB0ICsgMTtcblx0XHR9XG5cdH1cblx0cmV0dXJuIGRhdGE7XG59O1xuXG4vL0hpZ2hsaWdodCBFbGVtZW50IHdoZW4gcGxheWVkXG5jb25zdCBoaWdobGlnaHRFbCAgPSAoZWwsY29sLHRpbWUsaG92ZXIpID0+e1xuICAgJChlbCkuYXR0ciggXCJmaWxsXCIsIGhvdmVyKTtcbiAgIHNldFRpbWVvdXQoKCkgPT4geyQoZWwpLmF0dHIoIFwiZmlsbFwiLCBjb2wpO30sdGltZSoxMDAwKTtcbn07XG5cbi8vUmVhY3Qgb24gY2hhbmdlIG9mIGlucHV0IG51bWJlclxuLy9jYWxjdWxhdGUgYW5kIHJlZHJhdyByb3csIGNhbGN1bGF0ZSBkYXRhIGZvciBhbGwgcm93cyBhbmRcbi8vYXBwbHkgcmVkdWNlZGF0YVxuLy8gVE8gRE8gUGVyZm9ybWFuY2UgT3B0aW1hemF0aW9uXG5jb25zdCByZWdpc3RlcklucHV0T25DaGFuZ2UgPSAocm93LHN2Zyxsb29rdXApID0+IHtcblx0bGV0IGlkcyA9IFsxLDIsM10ubWFwKChpKSA9PiAnI2J0bi1yb3cnK3JvdysnLScraSk7XG5cdGlkcy5mb3JFYWNoKChlbCkgPT4ge1xuXHRcdCQoZWwpXG5cdFx0XHQucGFyZW50KClcblx0XHRcdC5wYXJlbnQoKVxuXHRcdFx0LmNoaWxkcmVuKCdpbnB1dC5mb3JtLWNvbnRyb2wnKVxuXHRcdFx0LmNoYW5nZSgoKSA9PiB7XG5cdFx0XHRcdGxldCBuZXdkYXRhID0gcmVkcmF3KHJlYWRJbnB1dChyb3cpKTtcblx0XHRcdFx0dXBkYXRlR3JhcGgobmV3ZGF0YSxzdmcsbG9va3VwLGZhbHNlKTtcblx0XHRcdFx0bGV0IG15ZGF0YSA9IHJlZHJhdyhyZWFkSW5wdXQoMSkpO1xuXHRcdFx0XHRsZXQgbXlkYXRhR3JlZW4gPSByZWRyYXcocmVhZElucHV0KDIpKTtcblx0XHRcdFx0bGV0IG15ZGF0YVJlZCA9IHJlZHJhdyhyZWFkSW5wdXQoMykpO1xuXHRcdFx0XHRsZXQgbmV3ZGF0YTIgPSByZWR1Y2UzZGF0YShteWRhdGFbMF0sbXlkYXRhR3JlZW5bMF0sbXlkYXRhUmVkWzBdKTtcblx0XHRcdFx0dXBkYXRlR3JhcGgobmV3ZGF0YTIsc3ZnTGlzdFszXSxcblx0XHRcdFx0XHRbMCwxLDIsMyw0LDUsNiw3LDgsOV0ubWFwKChpKSA9PiB0b25lc1tpXS5jb2xvciksdHJ1ZSk7XG5cdFx0XHR9KTtcblx0fSk7XG59O1xuXG4vLyBSZWdpc3RyYXRpb24gb2YgY291bnQgQnV0dG9uXG5jb25zdCByZWdpc3RlckJ1dHRvbiA9IChyb3cpID0+IHtcblx0bGV0IGlkcyA9IFsxLDIsM10ubWFwKChpKSA9PiAnI2J0bi1yb3cnK3JvdysnLScraSk7XG5cdGlkcy5mb3JFYWNoKChlbCkgPT4ge1xuXHRcdCQoZWwpLnBhcmVudCgpXG5cdFx0XHQuY2hpbGRyZW4oJ3VsLmRyb3Bkb3duLW1lbnUnKVxuXHRcdFx0Lm9uKCdjbGljaycsIChlKSA9PiB7XG5cdFx0XHRcdGxldCBpbnBFbCA9IGUudGFyZ2V0LnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQuY2hpbGRyZW5bMV07XG5cdFx0XHRcdGlucEVsLnNldEF0dHJpYnV0ZSgndmFsdWUnLGUudGFyZ2V0LnRleHQpO1xuXHRcdFx0XHQkKGlucEVsKS52YWwoZS50YXJnZXQudGV4dCk7XG5cdFx0XHRcdC8vIHRyaWdnZXIgdG8gcmVhY3Qgb24gbnVtYmVyIGNoYW5nZVxuXHRcdFx0XHQkKGlucEVsKS50cmlnZ2VyKGpRdWVyeS5FdmVudCgnY2hhbmdlJykpO1xuXHRcdFx0fSk7XHRcblxuXHR9KTtcbn07XG5cbi8vIFJlZ2lzdGVyIFRvbiBidXR0b25cbmNvbnN0IHJlZ2lzdGVyVG9uQnV0dG9uID0gKHJvdykgPT4ge1xuXHRsZXQgaWRzID0gWzEsMiwzXS5tYXAoKGkpID0+ICcjYnRuLXJvdycrcm93KyctJytpKyctdG9uJyk7XG5cdGlkcy5mb3JFYWNoKChlbCkgPT4ge1xuXHRcdCQoZWwpXG5cdFx0XHQucGFyZW50KClcblx0XHRcdC5jaGlsZHJlbigndWwuZHJvcGRvd24tbWVudScpXG5cdFx0XHQub24oJ2NsaWNrJywgKGUpID0+IHtcblx0XHRcdFx0Ly8gaW5kZXggaGF2ZSB0byBzdXJ2aXZlIDopXG5cdFx0XHQgICAgbGV0IG5yID0gcGFyc2VJbnQoZS50YXJnZXQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LmdldEF0dHJpYnV0ZSgnbnInKSk7XG5cdFx0XHRcdHRvbmVzW25yXS5pbnN0cnVtZW50ID0gZS50YXJnZXQudGV4dDtcblx0XHRcdFx0dXBkYXRlSW5wdXQodG9uZXMsbnIpO1xuXHRcdH0pO1x0XG5cdH0pO1xuXG59O1xuLy9SZWdpc3RlciBmaXJzdCBCbGFjayBCdXR0b25cbmNvbnN0IHJlZ2lzdGVyQmxhY2tUb25CdXR0b24gPSAoKSA9PiB7XG4gICAgJCgnI2J0bi1yb3cwLTAtdG9uJylcblx0XHQucGFyZW50KClcblx0XHQuY2hpbGRyZW4oJ3VsLmRyb3Bkb3duLW1lbnUnKVxuXHRcdC5vbignY2xpY2snLCAoZSkgPT4ge1xuXHRcdFx0dG9uZXNbMF0uaW5zdHJ1bWVudCA9IGUudGFyZ2V0LnRleHQ7XG5cdFx0XHR1cGRhdGVJbnB1dCh0b25lcywwKTtcblx0XHR9KTtcdFxufTtcbi8vIFJlZ2lzdGVyIFZvbHVtZW4gYnV0dG9uXG5jb25zdCByZWdpc3RlclZvbHVtZUJ1dHRvbiA9IChyb3cpID0+IHtcblx0bGV0IGlkcyA9IFsxLDIsM10ubWFwKChpKSA9PiAnI2J0bi1yb3cnK3JvdysnLScraSsnLXZvbHVtZScpO1xuXHRpZHMuZm9yRWFjaCgoZWwpID0+IHtcblx0XHQkKGVsKVxuXHRcdFx0LnBhcmVudCgpXG5cdFx0XHQuY2hpbGRyZW4oJ3VsLmRyb3Bkb3duLW1lbnUnKVxuXHRcdFx0Lm9uKCdjbGljaycsIChlKSA9PiB7XG5cdFx0XHRcdGxldCBuciA9cGFyc2VJbnQoZS50YXJnZXQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LmdldEF0dHJpYnV0ZSgnbnInKSk7XG5cdFx0XHRcdHRvbmVzW25yXS52b2wgPSBlLnRhcmdldC50ZXh0O1xuXHRcdFx0XHR0b25lc1tucl0uZ2FpbiA9IHBhcnNlSW50KGUudGFyZ2V0LnRleHQpKjEuMC8xMDA7XG5cdFx0XHRcdHVwZGF0ZUlucHV0KHRvbmVzLG5yKTtcblx0XHR9KTtcdFxuXHR9KTtcbn07XG5cbi8vIFJlZ2lzdGVyIEZpcnN0IEdyYXkgQnV0dG9uXG5jb25zdCByZWdpc3RlckJsYWNrVm9sdW1lQnV0dG9uID0gKCkgPT4ge1xuXHQkKCcjYnRuLXJvdzAtMC12b2x1bWUnKVxuXHRcdC5wYXJlbnQoKVxuXHRcdC5jaGlsZHJlbigndWwuZHJvcGRvd24tbWVudScpXG5cdFx0Lm9uKCdjbGljaycsIChlKSA9PiB7XG5cdFx0XHR0b25lc1swXS52b2wgPSBlLnRhcmdldC50ZXh0O1xuXHRcdFx0dG9uZXNbMF0uZ2FpbiA9IHBhcnNlSW50KGUudGFyZ2V0LnRleHQpKjEuMC8xMDA7XG5cdFx0XHR1cGRhdGVJbnB1dCh0b25lcywwKTtcblx0XHR9KTtcdFxufTtcblxuLy8gSGVscGVyY2xhc3MgQWRkIG9yIHVwZGF0ZSBhIFRleHQgaW4gYSBidXR0b25cbmNvbnN0IGNoYW5nZVRleHRJbkxhc3RTcGFuID0gKHNFbCx0eHQpID0+IHtcblx0aWYgKHNFbC5jaGlsZHJlbigpLmxlbmd0aCA8IDIpIHtcblx0XHRcdGxldCBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcblx0XHRcdGVsLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHR4dCkpO1xuXHRcdFx0c0VsLmFwcGVuZChlbCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHNFbC5jaGlsZHJlbigpLmxhc3QoKS50ZXh0KHR4dCk7XG5cdFx0fVxufTtcblxuLy8gdXBkYXRlIHZpZXcgaWYgYnV0dG9uIG1vZGVsIGNoYW5nZWRcbmNvbnN0IHVwZGF0ZUlucHV0ID0gKG9iaixucikgPT4ge1xuXHQvL2xldCBpZWwgPSAkKCcjJytvYmpbbnJdLmlkKS5jaGlsZHJlbignaW5wdXQnKTtcblx0bGV0IHJvd25yLGlkO1xuXHRpZiAobnI8MSl7XG5cdFx0cm93bnIgPSAwO1xuXHRcdGlkID0gbnI7XG5cdH0gZWxzZSB7XG5cdFx0cm93bnIgPSBNYXRoLnRydW5jKChuci0xKS8zKSArIDE7XG5cdFx0aWQgPSAobnItMSklMysxO1xuXHR9XG5cblx0bGV0IGJ0biA9ICQoJyMnKydidG4tcm93Jytyb3ducisnLScraWQrJy10b24nKTtcblx0bGV0IHR4dCA9ICcgJytvYmpbbnJdLmluc3RydW1lbnQ7XG5cdGNoYW5nZVRleHRJbkxhc3RTcGFuKGJ0bix0eHQpO1xuXG5cdGJ0biA9ICQoJyMnKydidG4tcm93Jytyb3ducisnLScraWQrJy12b2x1bWUnKTtcblx0dHh0ID0gJyAnK29ialtucl0udm9sO1xuXHRjaGFuZ2VUZXh0SW5MYXN0U3BhbihidG4sdHh0KTtcblx0Ly8gfVxufTtcblxuLy8gdXBkYXRlIGFsbCBCdXR0b24gdmlld3NcbmNvbnN0IHN5bmNGb3JtRGlzcGxheSA9IChvYmopID0+IHtcblx0Zm9yIChsZXQgaSA9IDA7IGkgPCBvYmoubGVuZ3RoOyBpKyspe1xuXHRcdHVwZGF0ZUlucHV0KG9iaixpKTtcblx0fVxufTtcblxuLy8gUmVnaXN0ZXIgUGxheSBCdXR0b25cbmNvbnN0IHJlZ2lzdGVyUGxheUJ1dHRvbiA9ICgpID0+IHtcblx0JCgnI3BsYXltdXNpY2J0bicpLm9uKCdjbGljaycsIChlKSA9PiB7XG5cdFx0cnVuU2VxID0gdHJ1ZTtcblx0XHRwbGF5TXVzaWMoKTtcblx0fSk7XG59O1xuXG4vLyBSZWdpc3RlciBTdG9wIEJ1dHRvblxuY29uc3QgcmVnaXN0ZXJTdG9wQnV0dG9uID0gKCkgPT4ge1xuXHQkKCcjc3RvcG11c2ljYnRuJykub24oJ2NsaWNrJywgKGUpID0+IHtcblx0XHRydW5TZXEgPSBmYWxzZTtcblx0fSk7XG59O1xuXG4vLyBSZWdpc3RlciBhbGwgU2NyZWVuUGx1c0J0dG5zXG5jb25zdCByZWdpc3RlclNjcmVlblBsdXNCdHRuID0gKCkgPT4ge1xuXHRcblx0bGV0IGlkcyA9IFsxLDIsM10ubWFwKChpKSA9PiAnI2J0bi1yb3cnK2krJy0yLWFkZCcpO1xuXHRpZHMuZm9yRWFjaCgoZWwpID0+IHtcblx0XHQkKGVsKS5vbignY2xpY2snLCAoZSkgPT4ge1xuXHRcdFx0bGV0IG5yO1xuXHRcdFx0bGV0IGsgPSAyO1xuXHRcdFx0bGV0IHRhID0gZS50YXJnZXQuZ2V0QXR0cmlidXRlKCdhY3Rpb24nKTtcblx0XHRcdGlmICh0eXBlb2YgdGEgPT09ICd1bmRlZmluZWQnIHx8IHRhID09PSBudWxsKXtcblx0XHRcdFx0dGEgPSBlLnRhcmdldC5wYXJlbnRFbGVtZW50LmdldEF0dHJpYnV0ZSgnYWN0aW9uJyk7XG5cdFx0XHR9XG5cblx0XHRcdGxldCB0bXAgPSB0YS5zcGxpdCgnJyk7XG5cdFx0XHRuciA9IChwYXJzZUludCh0bXBbMV0pLTEpKjMraztcblx0XHRcdGlmICh0bXBbMF0gPT09ICcrJyl7XG5cdFx0XHRcdHRvbmVzW25yXS52aXNpYmxlID0gdHJ1ZTtcblx0XHRcdFx0JCgnIycrdG9uZXNbbnJdLmlkKS5zaG93KCk7XG5cdFx0XHR9XG5cdFx0XHRpZiAodG1wWzBdID09PSAnLScpe1xuXHRcdFx0XHR0b25lc1tucl0udmlzaWJsZSA9IGZhbHNlO1xuXHRcdFx0XHQkKCcjJyt0b25lc1tucl0uaWQpLmhpZGUoKTtcblx0XHRcdH1cblx0XHRcdHVwZGF0ZVNjcmVlblBsdXNFbGVtZW50KCk7XG5cdFx0XHRcblx0XHR9KTtcblx0fSk7XG5cblx0aWRzID0gWzEsMiwzXS5tYXAoKGkpID0+ICcjYnRuLXJvdycraSsnLTMtYWRkJyk7XG5cdGlkcy5mb3JFYWNoKChlbCkgPT4ge1xuXHRcdCQoZWwpLm9uKCdjbGljaycsIChlKSA9PiB7XG5cdFx0XHRsZXQgbnI7XG5cdFx0XHRsZXQgayA9IDM7XG5cdFx0XHRsZXQgdGEgPSBlLnRhcmdldC5nZXRBdHRyaWJ1dGUoJ2FjdGlvbicpO1xuXHRcdFx0aWYgKHR5cGVvZiB0YSA9PT0gJ3VuZGVmaW5lZCcgfHwgdGEgPT09IG51bGwpe1xuXHRcdFx0XHR0YSA9IGUudGFyZ2V0LnBhcmVudEVsZW1lbnQuZ2V0QXR0cmlidXRlKCdhY3Rpb24nKTtcblx0XHRcdH1cblx0XHRcdGxldCB0bXAgPSB0YS5zcGxpdCgnJyk7XG5cdFx0XHRuciA9IChwYXJzZUludCh0bXBbMV0pLTEpKjMraztcblx0XHRcdGlmICh0bXBbMF0gPT09ICcrJyl7XG5cdFx0XHRcdHRvbmVzW25yXS52aXNpYmxlID0gdHJ1ZTtcblx0XHRcdFx0JCgnIycrdG9uZXNbbnJdLmlkKS5zaG93KCk7XG5cdFx0XHR9XG5cdFx0XHRpZiAodG1wWzBdID09PSAnLScpe1xuXHRcdFx0XHR0b25lc1tucl0udmlzaWJsZSA9IGZhbHNlO1xuXHRcdFx0XHQkKCcjJyt0b25lc1tucl0uaWQpLmhpZGUoKTtcblx0XHRcdH1cblx0XHRcdHVwZGF0ZVNjcmVlblBsdXNFbGVtZW50KCk7XG5cdFx0fSk7XG5cdH0pO1xufTtcblxuXG5cbmNvbnN0IHJlZ2lzdGVyU2NyZWVuUm93UGx1c0J0dG4gPSAoKSA9PiB7XG5cdFsnYWRkcm93MicsJ2FkZHJvdzMnXS5mb3JFYWNoKChzKSA9Pntcblx0XHQkKCcjJytzKS5vbignY2xpY2snLCAoZSkgPT4ge1xuXHRcdFx0bGV0IHRhID0gJChlLnRhcmdldCkuY2hpbGRyZW4oJ2RpdicpO1xuXHRcdFx0bGV0IGFjdCA9IHRhWzBdLmdldEF0dHJpYnV0ZSgnYWN0aW9uJyk7XG5cdFx0XHRsZXQgbnIgPSAocy5zcGxpdCgnJykpWzZdO1xuXHRcdFx0aWYgKGFjdD09PSdwbHVzJyl7XG5cdFx0XHRcdHNjcmVlblZpZXdbbnJdLnZpc2libGUgPSB0cnVlO1xuXHRcdFx0XHRzY3JlZW5WaWV3W25yXS5hZGRyb3cgPSBmYWxzZTtcblx0XHRcdFx0c2NyZWVuVmlld1tucl0ucmVkcm93ID0gdHJ1ZTtcblx0XHRcdFx0aWYgKG5yID09PSAnMycpe1xuXHRcdFx0XHRcdHNjcmVlblZpZXdbJzInXS5yZWRyb3cgPSBmYWxzZTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAobnIgPT09ICcyJyl7XG5cdFx0XHRcdFx0c2NyZWVuVmlld1snMyddLmFkZHJvdyA9IHRydWU7XG5cdFx0XHRcdH1cblxuXHRcdFx0fVxuXHRcdFx0aWYgKGFjdD09PSdtaW51cycpe1xuXHRcdFx0XHRzY3JlZW5WaWV3W25yXS52aXNpYmxlID0gZmFsc2U7XG5cdFx0XHRcdHNjcmVlblZpZXdbbnJdLmFkZHJvdyA9IHRydWU7XG5cdFx0XHRcdHNjcmVlblZpZXdbbnJdLnJlZHJvdyA9IGZhbHNlO1xuXHRcdFx0XHRpZiAobnIgPT09ICcyJyl7XG5cdFx0XHRcdFx0c2NyZWVuVmlld1snMyddLmFkZHJvdyA9IGZhbHNlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChuciA9PT0gJzMnKXtcblx0XHRcdFx0XHRzY3JlZW5WaWV3WycyJ10ucmVkcm93ID0gdHJ1ZTtcblx0XHRcdFx0fVxuXG5cdFx0XHR9XG5cdFx0XHR1cGRhdGVTY3JlZW4oKTtcblx0XHRcdHVwZGF0ZVJvd0J1dHRvbnMoKTtcblx0XHR9KTtcblx0fSk7XG59O1xuXG4vLyBTb3VuZCBcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmNvbnN0IHBsYXlTb3VuZCA9IChzdGFydFRpbWUsIHBpdGNoTnIsIGR1cmF0aW9uLCBnYWluT2xkKSA9PiB7XG5cdC8vbGV0IHN0YXJ0VGltZSA9IGF1ZGlvQ29udGV4dC5jdXJyZW50VGltZSArIGRlbGF5O1xuICBcdGxldCBlbmRUaW1lID0gc3RhcnRUaW1lICsgZHVyYXRpb247XG4gIFx0Ly9sZXQgcGl0Y2ggPSB0b25lc1twaXRjaE5yXS5pbnN0cnVtZW50OyBcbiAgXHRsZXQgZ2FpbiA9IHRvbmVzW3BpdGNoTnJdLmdhaW47XG5cbiAgXHRsZXQgb3V0Z2FpbiA9IGF1ZGlvQ29udGV4dC5jcmVhdGVHYWluKCk7XG4gIFx0b3V0Z2Fpbi5nYWluLnZhbHVlID0gZ2FpbjtcbiAgXHRvdXRnYWluLmNvbm5lY3QoYXVkaW9Db250ZXh0LmRlc3RpbmF0aW9uKTsgXHRcblxuICBcdGxldCBlbnZlbG9wZSA9IGF1ZGlvQ29udGV4dC5jcmVhdGVHYWluKCk7XG4gIFx0ZW52ZWxvcGUuY29ubmVjdChvdXRnYWluKTtcbiAgXHRlbnZlbG9wZS5nYWluLnZhbHVlID0gMDtcbiAgXHRcbiAgXHRlbnZlbG9wZS5nYWluLnNldFRhcmdldEF0VGltZSgxLCBzdGFydFRpbWUsIGVudmVsb3BlU3RhcnRFbmRUaW1lWzBdKTtcbiAgXHRlbnZlbG9wZS5nYWluLnNldFRhcmdldEF0VGltZSgwLCBlbmRUaW1lLCBlbnZlbG9wZVN0YXJ0RW5kVGltZVsxXSk7XG5cbiAgXHRsZXQgb3NjaWxsYXRvciA9IGF1ZGlvQ29udGV4dC5jcmVhdGVPc2NpbGxhdG9yKCk7XG4gIFx0b3NjaWxsYXRvci5jb25uZWN0KGVudmVsb3BlKTtcblxuICBcdG9zY2lsbGF0b3IudHlwZSA9IG9zY2lsbGF0b3JUeXBlO1xuICBcdG9zY2lsbGF0b3IuZGV0dW5lLnZhbHVlID0gbm90ZXNbdG9uZXNbcGl0Y2hOcl0uaW5zdHJ1bWVudF0uZGV0dW5lO1xuICBcdG9zY2lsbGF0b3IuZnJlcXVlbmN5LnZhbHVlID0gMjQwO1xuXG5cdGxldCB2aWJyYXRvID0gYXVkaW9Db250ZXh0LmNyZWF0ZUdhaW4oKTtcblx0dmlicmF0by5nYWluLnZhbHVlID0gdmlicmF0b2dhaW47XG5cdHZpYnJhdG8uY29ubmVjdChvc2NpbGxhdG9yLmRldHVuZSk7XG5cblx0bGV0IGxmbyA9IGF1ZGlvQ29udGV4dC5jcmVhdGVPc2NpbGxhdG9yKCk7XG5cdGxmby5jb25uZWN0KHZpYnJhdG8pO1xuXHRsZm8uZnJlcXVlbmN5LnZhbHVlID1sZm9mcmVxOyBcblxuXHRvc2NpbGxhdG9yLnN0YXJ0KHN0YXJ0VGltZSk7XG4gIFx0bGZvLnN0YXJ0KHN0YXJ0VGltZSk7XG4gIFx0b3NjaWxsYXRvci5zdG9wKGVuZFRpbWUgKzIgKTtcbiAgXHRsZm8uc3RvcChlbmRUaW1lICsyKTtcblxufTtcblxuLy8vIFBsYXkgTG9vcFxuY29uc3QgcnVuU2VxdWVuY2VycyA9ICgpID0+IHtcblx0aWYgKCFydW5TZXEgfHwgc291bmRRdWV1ZS5sZW5ndGggPT09IDApe2NvbnNvbGUubG9nKFwic3RvcFwiKTtyZXR1cm47fVxuXHRsZXQgY3QgPSBhdWRpb0NvbnRleHQuY3VycmVudFRpbWU7XG5cdHdoaWxlIChzb3VuZFF1ZXVlLmxlbmd0aD4wICYmIHNvdW5kUXVldWVbMF1bMF08IGN0KzAuMTUpe1xuXHRcdC8vY29uc29sZS5sb2coJ2N0OicrY3QrJ3BsYW5lZCB0aW1lOicrc291bmRRdWV1ZVswXVswXSk7XG5cdFx0bGV0IGl0ZW0gPSBzb3VuZFF1ZXVlLnNwbGljZSgwLDEpO1xuXHRcdC8vIHBsYXlzb3VuZCAoc3RhcnR0aW1lLCBwaXRjaCwgZHVyYXRpb24sICAgICAgICAgICAgIGdhaWluKVxuXHRcdC8vcGxheVNvdW5kKGl0ZW1bMF1bMF0sc291bmRzW2l0ZW1bMF1bMV1dWzBdLGl0ZW1bMF1bMl0sdG9uZXNbaXRlbVswXVsxXV0uZ2Fpbik7XHRcdFxuXHRcblx0XHRwbGF5U291bmQoaXRlbVswXVswXSxpdGVtWzBdWzFdLGl0ZW1bMF1bMl0sdG9uZXNbaXRlbVswXVsxXV0uZ2Fpbik7XHRcdFxuXHRcdC8vIGVsZW1lbnQgICAgICAgICAgICAgIGNvbG9yICAgICAgIGR1cmF0aW9uICAgICAgICAgICAgICAgICBob3ZlcmNvbG9yXG5cdFx0aGlnaGxpZ2h0RWwoaXRlbVswXVszXSx0b25lc1tpdGVtWzBdWzFdXS5jb2xvcixpdGVtWzBdWzJdLHRvbmVzW2l0ZW1bMF1bMV1dLmhvdmVyKTtcblx0fVxuXHRzZXRUaW1lb3V0KHJ1blNlcXVlbmNlcnMsOTApO1xufVxuXG4vLy8gSW1wb3J0YW50IFNvdW5kIFZhcmlhYmxlcyAhISFcbmxldCBydW5TZXEgPSB0cnVlO1xubGV0IHNvdW5kUXVldWUgPSBbXTtcbnZhciBhdWRpb0NvbnRleHQgPSBudWxsO1xuXG50cnkge1xuICAgd2luZG93LkF1ZGlvQ29udGV4dCA9IHdpbmRvdy5BdWRpb0NvbnRleHR8fHdpbmRvdy53ZWJraXRBdWRpb0NvbnRleHQ7XG4gICB2YXIgYXVkaW9Db250ZXh0ID0gbmV3IEF1ZGlvQ29udGV4dCgpO1xufSBjYXRjaCAoZSkge1xuICAgIGNvbnNvbGUubG9nKFwiTm8gV2ViIEF1ZGlvIEFQSSBzdXBwb3J0XCIpO1xufVxuLy8gVE9ETyBGZWVkYmFjayBpZiBpdCBpcyBub3Qgd29ya2luZyB3aXRoIHRoZSB1c2VkIGRldmljZVxuXG4vL0lPUyBTdGFydCBJT1NIQUNLXG4kKCdib2R5Jykub24oJ3RvdWNoZW5kJywgKGUpID0+IHtcblx0Ly9hbGVydCgnc3RhcnQgc291bmRcblx0Ly8gY3JlYXRlIGVtcHR5IGJ1ZmZlclxuXHRsZXQgYnVmZmVyID0gYXVkaW9Db250ZXh0LmNyZWF0ZUJ1ZmZlcigxLCAxLCAyMjA1MCk7XG5cdGxldCBzb3VyY2UgPSBhdWRpb0NvbnRleHQuY3JlYXRlQnVmZmVyU291cmNlKCk7XG5cdHNvdXJjZS5idWZmZXIgPSBidWZmZXI7XG5cblx0Ly8gY29ubmVjdCB0byBvdXRwdXQgKHlvdXIgc3BlYWtlcnMpXG5cdHNvdXJjZS5jb25uZWN0KGF1ZGlvQ29udGV4dC5kZXN0aW5hdGlvbik7XG5cblx0Ly8gcGxheSB0aGUgZmlsZVxuXHRpZiAodHlwZW9mIHNvdXJjZS5ub3RlT24gIT09ICd1bmRlZmluZWQnKXtcblx0XHRzb3VyY2Uubm90ZU9uKDApO1xuXHR9XG5cdGxldCBzcmMgPSBudWxsO1xuXHRzcmMgPSBhdWRpb0NvbnRleHQuY3JlYXRlT3NjaWxsYXRvcigpO1xuXHRzcmMudHlwZSA9ICdzcXVhcmUnO1xuXHRzcmMuZnJlcXVlbmN5LnZhbHVlID0gNDQwO1xuXHRzcmMuY29ubmVjdChhdWRpb0NvbnRleHQuZGVzdGluYXRpb24pO1xuXHRsZXQgY3QgPSBhdWRpb0NvbnRleHQuY3VycmVudFRpbWU7XG5cdHNyYy5zdGFydChjdCswLjA1KTtcblx0c3JjLnN0b3AoY3QrMC4wNik7XG5cdC8vIEV2ZW50IG9ubGllIG9uY2Vcblx0JCgnYm9keScpLnVuYmluZCggJ3RvdWNoZW5kJyk7XG59KTtcbi8vSU9TIEVORFxuXG4vLy8gTWFpbiBTb3VuZCBQbGF5IE1ldGhvZCBGaWxsIHRoZSBxdWV1ZSBhbmQgdGltZSB0aGUgdmlzdWFsXG5jb25zdCBwbGF5TXVzaWMgPSAoKSA9PiB7XG5cdC8vIGZpbGwgc291bmRRdWV1ZVx0XG5cdGxldCBqO1xuXHRsZXQgcmVjdGFyciA9IGQzLnNlbGVjdCgnI2NoYXJ0LXN1bScpLnNlbGVjdCgnZycpLnNlbGVjdEFsbCgnZycpLmRhdGEoKTtcblx0bGV0IGVsYXJyID0gZDMuc2VsZWN0KCcjY2hhcnQtc3VtJykuc2VsZWN0KCdnJykuc2VsZWN0QWxsKCdnJylbMF07XG4gICAgbGV0IHN0YXJ0VGltZSA9IGF1ZGlvQ29udGV4dC5jdXJyZW50VGltZTtcbiAgICAvL2NvbnNvbGUubG9nKCdTdGFydCcrc3RhcnRUaW1lKTtcbiAgICBzb3VuZFF1ZXVlID1bXTtcblx0Zm9yIChsZXQgaT0wOyBpIDwgcmVjdGFyci5sZW5ndGg7IGkrKykge1xuXHRcdGxldCB2ID0gcmVjdGFycltpXTtcblx0XHRcdGZvciAoaj0wO2o8di5sZW5ndGg7aisrKXtcblx0XHRcdFx0Ly9wbGF5U291bmQoaSxzb3VuZHNbdl1bMF0sc291bmRzW3ZdWzFdLHNvdW5kc1t2XVsyXSk7XG5cdFx0XHRcdC8vYWxlcnQoaSk7XG5cdFx0XHRcdGxldCB0bXAgPSBbXTtcblx0XHRcdFx0dG1wLnB1c2goaSpzb3VuZFNwZWVkK3N0YXJ0VGltZStqKjAuMDAwMSk7XG5cdFx0XHRcdHRtcC5wdXNoKHZbal0pO1xuXHRcdFx0XHR0bXAucHVzaCh0b25lZHVyYXRpb24pO1xuXHRcdFx0XHR0bXAucHVzaChkMy5zZWxlY3QoZWxhcnJbaV0pLnNlbGVjdEFsbCgncmVjdCcpWzBdW2pdKTtcblx0XHRcdFx0c291bmRRdWV1ZS5wdXNoKHRtcCk7XG5cdFx0XHR9XG5cdH1cblx0Ly9jb25zb2xlLmxvZygnc3RhcnRzZXF1ZW5jZXInK2F1ZGlvQ29udGV4dC5jdXJyZW50VGltZSk7XG4gICAgcnVuU2VxdWVuY2VycygpO1xufTtcbi8vIHNvdW5kIGNvbnN0YW50c1xubGV0IHNvdW5kU3BlZWQgPSAwLjU7XG5sZXQgdG9uZWR1cmF0aW9uID0gMC4zO1xubGV0IHZpYnJhdG9nYWluID0gMC4zO1xubGV0IGVudmVsb3BlU3RhcnRFbmRUaW1lID0gWzAuMDEsMC4xXTtcbmxldCBsZm9mcmVxID0gNjsgIC8vNVxubGV0IG9zY2lsbGF0b3JUeXBlID0gJ3Nhd3Rvb3RoJzsgLy8nc2luZSc7IC8vICdzYXd0b290aCdcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFNvdW5kIEVuZCBcblxuXG5cbi8vIFNjcmVlbiBJbnRlcmFjdGlvbiBhZGQgdW5kIHJlbW92ZSBtbnVlc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuY29uc3QgbnJPZkFjdGl2ZUJ0dG5Hcm91cCA9IChucikgPT4ge1xuXHRsZXQgYXJyID0gWzEsMiwzXS5tYXAoKGkpID0+IChuci0xKSozK2kpO1xuXHRsZXQgYmFyciA9IGFyci5tYXAoKGkpID0+IHRvbmVzW2ldLnZpc2libGUpXG5cdGxldCB0YXJyID0gYmFyci5maWx0ZXIoKGkpID0+IGkgPT09IHRydWUpXG5cdHJldHVybiB0YXJyLmxlbmd0aDtcbn07XG5jb25zdCBjaGFuZ2VTY3JlZW5idHRuID0gKGlkLGh0bWwsYWN0KSA9PiB7XG5cdCQoaWQpLmF0dHIoJ2FjdGlvbicsYWN0KS5jaGlsZHJlbigpLnJlcGxhY2VXaXRoKGh0bWwpO1xufTtcblxuY29uc3QgaGlkZUFuZHNldFJvd1plcm8gPSAocm93KSA9PiB7XG5cdGxldCBlbCxpbnBFbDtcblx0Zm9yKGxldCBpID0gY29uZltyb3ctMV1bMF07IGkgPCBjb25mW3Jvdy0xXVsxXTsgaSsrKXtcblx0XHRlbD0kKCcjJyt0b25lc1tpXS5pZCk7XG5cdFx0ZWwuaGlkZSgpO1xuXHRcdC8vIGhpZGUgYWxsICsgLSBzaWduc1xuXHRcdFsyLDNdLmZvckVhY2goKGkpID0+IHskKCcjYnRuLXJvdycrcm93KyctJytpKyctYWRkJykuaGlkZSgpO30pO1xuXHRcdFx0aWYgKHR5cGVvZiBlbC5jaGlsZHJlbignaW5wdXQnKVswXSAhPT0gJ3VuZGVmaW5lZCcpe1xuXHRcdFx0XHRpbnBFbCA9IGVsLmNoaWxkcmVuKCdpbnB1dCcpWzBdO1xuXHRcdFx0XHRpbnBFbC52YWx1ZT0wO1xuXHRcdFx0XHQkKGlucEVsKS50cmlnZ2VyKGpRdWVyeS5FdmVudCgnY2hhbmdlJykpO1xuXHRcdH1cblx0fVxufTtcblxuY29uc3Qgc2hvd1JvdyA9IChyb3cpID0+IHtcblx0JCgnI2J0bi1yb3cnK3JvdysnLTEtYWRkJykuc2hvdygpO1xuXHRsZXQgaSA9IGNvbmZbcm93LTFdWzBdO1xuXHQkKCcjJyt0b25lc1tpXS5pZCkuc2hvdygpO1xufTtcblxuY29uc3QgdXBkYXRlUm93QnV0dG9ucyA9ICgpID0+IHtcblx0WycyJywnMyddLmZvckVhY2goKHJvdykgPT4ge1xuXHRcdGlmIChzY3JlZW5WaWV3W3Jvd10uYWRkcm93KXtcblx0XHRcdCQoJyMnK3NjcmVlblZpZXdbcm93XS5jaGFuZ2Vyb3dpZCkuY2hpbGRyZW4oJ2RpdicpLnJlcGxhY2VXaXRoKCBzY3JlZW5WaWV3LmFyY2hpbGQgKTtcblx0XHRcdCQoJyMnK3NjcmVlblZpZXdbcm93XS5jaGFuZ2Vyb3dpZCkuc2hvdygpO1xuXHRcdH1cblx0XHRpZiAoc2NyZWVuVmlld1tyb3ddLnJlZHJvdyl7XG5cdFx0XHQkKCcjJytzY3JlZW5WaWV3W3Jvd10uY2hhbmdlcm93aWQpLmNoaWxkcmVuKCdkaXYnKS5yZXBsYWNlV2l0aCggc2NyZWVuVmlldy5taW5yb3djaGlsZCApO1xuXHRcdFx0JCgnIycrc2NyZWVuVmlld1tyb3ddLmNoYW5nZXJvd2lkKS5zaG93KCk7XG5cdFx0fVxuXHRcdGlmKCFzY3JlZW5WaWV3W3Jvd10ucmVkcm93ICYmICFzY3JlZW5WaWV3W3Jvd10uYWRkcm93KXtcblx0XHRcdCQoJyMnK3NjcmVlblZpZXdbcm93XS5jaGFuZ2Vyb3dpZCkuaGlkZSgpO1xuXHRcdH1cblx0fSk7XG59O1xuXG5jb25zdCB1cGRhdGVTY3JlZW4gPSAoKSA9PiB7XG5cdGxldCBzID0gJyc7XG5cdFsnMicsJzMnXS5mb3JFYWNoKChyb3cpID0+IHtcblx0XHRzID0gJyMnK3NjcmVlblZpZXdbcm93XS5ncmFwaDtcblx0XHRpZiAoc2NyZWVuVmlld1tyb3ddLnZpc2libGUpe1xuXHRcdFx0JChzKS5zaG93KCk7XG5cdFx0XHRzaG93Um93KHBhcnNlSW50KHJvdykpO1xuXHRcdFx0dXBkYXRlU2NyZWVuUGx1c0VsZW1lbnQoKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0JChzKS5oaWRlKCk7XG5cdFx0XHRoaWRlQW5kc2V0Um93WmVybyhwYXJzZUludChyb3cpKTtcblx0XHR9XG5cdH0pO1xufTtcblxuLy8gdGhyZWUgcG9zc2libGUgc3RhdGVzXG5jb25zdCB1cGRhdGVTY3JlZW5QbHVzRWxlbWVudCA9ICgpID0+IHtcblx0bGV0IG5yLGVsLGlucEVsO1xuXHRbMSwyLDNdLmZvckVhY2goKGkpID0+IHtcblx0XHRpZiAoc2NyZWVuVmlld1tpXS52aXNpYmxlKXtcblx0XHRcdG5yID0gbnJPZkFjdGl2ZUJ0dG5Hcm91cChpKTtcblx0XHRcdHN3aXRjaChucil7XG5cdFx0XHRcdGNhc2UgMTpcblx0XHRcdFx0XHRjaGFuZ2VTY3JlZW5idHRuKCcjYnRuLXJvdycraSsnLTItYWRkJyxzY3JlZW5WaWV3LmFkZGJ0dG4sJysnK2kpO1xuXHRcdFx0XHRcdCQoJyNidG4tcm93JytpKyctMi1hZGQnKS5zaG93KCk7XG5cdFx0XHRcdFx0JCgnI2J0bi1yb3cnK2krJy0zLWFkZCcpLmhpZGUoKTtcblx0XHRcdFx0XHRlbD0kKCcjJyt0b25lc1tpKjNdLmlkKTtcblx0XHRcdFx0XHRpZiAodHlwZW9mIGVsLmNoaWxkcmVuKCdpbnB1dCcpWzBdICE9PSAndW5kZWZpbmVkJyl7XG5cdFx0XHRcdFx0XHRpbnBFbCA9IGVsLmNoaWxkcmVuKCdpbnB1dCcpWzBdO1xuXHRcdFx0XHRcdFx0aW5wRWwudmFsdWU9MDtcblx0XHRcdFx0XHRcdCQoaW5wRWwpLnRyaWdnZXIoalF1ZXJ5LkV2ZW50KCdjaGFuZ2UnKSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsPSQoJyMnK3RvbmVzW2kqMy0xXS5pZCk7XG5cdFx0XHRcdFx0aWYgKHR5cGVvZiBlbC5jaGlsZHJlbignaW5wdXQnKVswXSAhPT0gJ3VuZGVmaW5lZCcpe1xuXHRcdFx0XHRcdFx0aW5wRWwgPSBlbC5jaGlsZHJlbignaW5wdXQnKVswXTtcblx0XHRcdFx0XHRcdGlucEVsLnZhbHVlPTA7XG5cdFx0XHRcdFx0XHQkKGlucEVsKS50cmlnZ2VyKGpRdWVyeS5FdmVudCgnY2hhbmdlJykpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSAyOlxuXHRcdFx0XHRcdGNoYW5nZVNjcmVlbmJ0dG4oJyNidG4tcm93JytpKyctMi1hZGQnLHNjcmVlblZpZXcubWluYnR0biwnLScraSk7XG5cdFx0XHRcdFx0JCgnI2J0bi1yb3cnK2krJy0yLWFkZCcpLnNob3coKTtcblx0XHRcdFx0XHRjaGFuZ2VTY3JlZW5idHRuKCcjYnRuLXJvdycraSsnLTMtYWRkJyxzY3JlZW5WaWV3LmFkZGJ0dG4sJysnK2kpO1xuXHRcdFx0XHRcdCQoJyNidG4tcm93JytpKyctMy1hZGQnKS5zaG93KCk7XG5cdFx0XHRcdFx0ZWw9JCgnIycrdG9uZXNbaSozXS5pZCk7XG5cdFx0XHRcdFx0aWYgKHR5cGVvZiBlbC5jaGlsZHJlbignaW5wdXQnKVswXSAhPT0gJ3VuZGVmaW5lZCcpe1xuXHRcdFx0XHRcdFx0aW5wRWwgPSBlbC5jaGlsZHJlbignaW5wdXQnKVswXTtcblx0XHRcdFx0XHRcdGlucEVsLnZhbHVlPTA7XG5cdFx0XHRcdFx0XHQkKGlucEVsKS50cmlnZ2VyKGpRdWVyeS5FdmVudCgnY2hhbmdlJykpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSAzOlxuXHRcdFx0XHRcdCQoJyNidG4tcm93JytpKyctMi1hZGQnKS5oaWRlKCk7IFxuXHRcdFx0XHRcdGNoYW5nZVNjcmVlbmJ0dG4oJyNidG4tcm93JytpKyctMy1hZGQnLHNjcmVlblZpZXcubWluYnR0biwnLScraSk7XG5cdFx0XHRcdFx0JCgnI2J0bi1yb3cnK2krJy0zLWFkZCcpLnNob3coKTtcblx0XHRcdFx0XHRicmVha1xuXHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG59O1xuY29uc3QgZGlzcE5hdkVsZW1lbnRzID0gKG9iaikgPT4ge1xuXHRvYmoubWFwKChvKSA9PiB7XG5cdFx0aWYgKG8udmlzaWJsZSl7XG5cdFx0XHQkKCcjJytvLmlkKS5zaG93KCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGxldCBlbD0kKCcjJytvLmlkKTtcblx0XHRcdGVsLmhpZGUoKTtcblx0XHRcdC8vIFRPRE8gcmVzZXQgSU5QVVRcblx0XHRcdGlmICh0eXBlb2YgZWwuY2hpbGRyZW4oJ2lucHV0JylbMF0gIT09ICd1bmRlZmluZWQnKXtcblx0XHRcdFx0ZWwuY2hpbGRyZW4oJ2lucHV0JylbMF0udmFsdWU9MDtcblx0XHRcdH1cblx0XHRcdC8vY29uc29sZS5sb2coZWwuY2hpbGRyZW4oJ2lucHV0JylbMF0udmFsdWUpO1xuXHRcdH1cblx0fSk7XG59O1xuXG4vLyBJbml0IFNjcmVlblxuY29uc3QgaW5pdGQzanMgPSAoZWxJZCkgPT4ge1xuXHRjb25zdCB3aWR0aCA9IDEyODAsXG4gICAgaGVpZ2h0ID0gNDU7XG4gICAgbGV0IHNyX3ZpZXdwb3J0ID0gJzAgMCAnKyh3aWR0aCs3MCkrJyAnK2hlaWdodDtcbiAgICBjb25zdCBkaXYgPSBkMy5zZWxlY3QoZWxJZCksXG5cdHN2ZyA9IGRpdi5hcHBlbmQoJ3N2ZycpXG4gICAgICAgIC5hdHRyKCd3aWR0aCcsIHdpZHRoKVxuICAgICAgICAuYXR0cignaGVpZ2h0JywgaGVpZ2h0KVxuICAgICAgICAuYXR0cigndmlld0JveCcsIHNyX3ZpZXdwb3J0KVxuICAgICAgICAuYXR0cigncHJlc2VydmVBc3BlY3RSYXRpbycsICd4TWlkWU1pZCBtZWV0Jyk7XG4gICAgcmV0dXJuIHN2Zztcbn07XG4vLyBNYWluIFxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAgIFxuICAgIC8vIGNvbmZpZ3VyZSBkaXNwbGF5XG4gICAgZGlzcE5hdkVsZW1lbnRzKHRvbmVzKTtcbiAgICBzeW5jRm9ybURpc3BsYXkodG9uZXMpO1xuICAgIHVwZGF0ZVNjcmVlblBsdXNFbGVtZW50KCk7XG5cbiAgICAvLyBiaW5kIGRhdGEgYW5kIHJlbmRlciBkM2pzXG4gICAgbGV0IGNvbmYgPSBbWzEsNF0sWzQsN10sWzcsMTBdLFsxLDEwXV07XG4gICAgbGV0IHN2Z0xpc3QgPSBbXTtcbiAgICBsZXQgbXlkYXRhTGlzdCA9IFtdO1xuICAgIGxldCBzdmcgPSBudWxsO1xuICAgIGxldCBhcnIgPSBbXTtcbiAgICBsZXQgbG9va3VwID0gbnVsbDtcbiAgICBsZXQgbXlkYXRhID0gbnVsbDtcbiAgICBsZXQgaSxqO1xuICAgIGxldCB0bXB3ID0gJCh3aW5kb3cpLndpZHRoKCk7XG5cbiAgICBmb3IgKGkgPSAxOyBpPDU7IGkrKyl7XG4gICAgXHRzdmcgPSBpbml0ZDNqcygnIycrc2NyZWVuVmlld1tgJHtpfWBdLmdyYXBoKTtcbiAgICBcdHN2Zy5hdHRyKCd3aWR0aCcsIHRtcHcpO1xuICAgIFx0c3ZnTGlzdC5wdXNoKHN2Zyk7XG4gICAgXHRhcnIgPSBbMF07XG4gICAgXHRmb3IgKGogb2YgcmFuZ2UoY29uZltpLTFdWzBdLGNvbmZbaS0xXVsxXSkpe1xuICAgIFx0XHRhcnIucHVzaChqKTtcbiAgICBcdH1cbiAgICBcdGxvb2t1cCA9IGFyci5tYXAoKGkpID0+IHRvbmVzW2ldLmNvbG9yKTtcbiAgICBcdGlmIChpIDwgNCl7XG4gICAgXHRcdG15ZGF0YSA9IHJlZHJhdyhyZWFkSW5wdXQoaSkpO1xuICAgIFx0XHRteWRhdGFMaXN0LnB1c2gobXlkYXRhKTtcbiAgICBcdFx0cmVnaXN0ZXJJbnB1dE9uQ2hhbmdlKGksc3ZnLGxvb2t1cCk7XG4gICAgXHRcdHJlbmRlckdyYXBoKG15ZGF0YSxzdmcsbG9va3VwLGZhbHNlKTtcblxuICAgIFx0fSBlbHNlIHtcbiAgICBcdFx0bXlkYXRhID0gcmVkdWNlM2RhdGEobXlkYXRhTGlzdFswXVswXSxteWRhdGFMaXN0WzFdWzBdLG15ZGF0YUxpc3RbMl1bMF0pO1xuICAgIFx0XHRyZW5kZXJHcmFwaChteWRhdGEsc3ZnLGxvb2t1cCx0cnVlKTtcbiAgICBcdH1cbiAgICB9XG5cdC8vIHJlc3BvbnNpdmUgY2hhbmdlXG4gICAgZDMuc2VsZWN0KHdpbmRvdylcbiAgICBcdC5vbigncmVzaXplJywgKCkgPT4ge1xuXHRcdCAgICBsZXQgd2luV2lkdGggPSAkKHdpbmRvdykud2lkdGgoKTtcblx0XHQgICAgZm9yKGxldCBpPTA7IGkgPCBzdmdMaXN0Lmxlbmd0aDsgaSsrKXtcblx0XHQgICAgXHRzdmdMaXN0W2ldLmF0dHIoXCJ3aWR0aFwiLCB3aW5XaWR0aCk7XG5cdFx0ICAgIH1cbiAgXHRcdH0pO1xuXG5cdC8vIFJlZ2lzdGVyIEJ1dHRvbnNcblx0Ly8gYmxhY2tidXR0b24gb25seSBvbmUgcmVnaXN0cmF0aW9uXG5cdHJlZ2lzdGVyQmxhY2tWb2x1bWVCdXR0b24oKTtcblx0cmVnaXN0ZXJCbGFja1RvbkJ1dHRvbigpO1xuXG5cdC8vIFJlZ2lzdGVyIDMgcm93cyBWIEJ1dHRvblxuXHRbMSwyLDNdLmZvckVhY2goKGkpID0+IHJlZ2lzdGVyQnV0dG9uKGkpKTtcblx0WzEsMiwzXS5mb3JFYWNoKChpKSA9PiByZWdpc3RlclRvbkJ1dHRvbihpKSk7XG5cdFsxLDIsM10uZm9yRWFjaCgoaSkgPT4gcmVnaXN0ZXJWb2x1bWVCdXR0b24oaSkpO1xuXG5cdHJlZ2lzdGVyU2NyZWVuUGx1c0J0dG4oKTtcblx0cmVnaXN0ZXJTY3JlZW5Sb3dQbHVzQnR0bigpO1xuXHRyZWdpc3RlclBsYXlCdXR0b24oKTtcblx0cmVnaXN0ZXJTdG9wQnV0dG9uKCk7XG5cdHVwZGF0ZVNjcmVlbigpO1xuXHR1cGRhdGVSb3dCdXR0b25zKCk7XG59KTtcblxuXG5cbiJdfQ==

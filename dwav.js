// dwav.js
// js audio library, based on dynamic wav generation
// (c) 2011 colin kuebler

var waves = {
	sine: function (i){ return Math.sin( Math.PI * 2 * i ); },
	square: function (i){ return (i-Math.floor(i)) < 0.5 ? 1 : -1; },
	saw_ascending: function (i){ return (i-Math.floor(i))*2-1; },
	saw_descending: function (i){ return 1-((i-Math.floor(i))*2); },
	quarter: function (i){ return ( Math.sin( Math.PI * 2 * i ) +
									Math.sin( Math.PI * 4 * i ) +
									Math.sin( Math.PI * 8 * i ) +
									Math.sin( Math.PI * 16 * i ) ) / 4; },
	weird: function (i){ return ( Math.sin( Math.PI * 2 * i ) +
									Math.sin( Math.PI * 4 * i ) +
									Math.sin( Math.PI * 64 * i ) +
									Math.sin( Math.PI * 9 * i ) ) / 4; },
	warble: function (i){ return Math.sin( Math.PI * 2 * ( i + Math.sin(i) ) ); },
	warble_sq: function (i){ return Math.sin( Math.PI * 2 *
						( i + 2*Math.sin(i + Math.sin(i*2)) ) ); }
};

var envelopes = {
	none: function(i){ return 1; },
	sine: function(i){ return Math.sin( Math.PI * i ); },
	cosine: function (i){ return Math.cos( Math.PI * 0.5 * i ); },
	tangent: function (i){ return Math.tan( Math.PI * 0.3 * i ); }
};

var notenames = {
	'Ab': -1, 'A': 0, 'A#': 1, 'Bb': 1, 'B': 2, 'C': 3, 'C#': 4, 'Db': 4, 'D': 5, 'D#': 6, 'Eb': 6, 'E': 7, 'F': 8, 'F#': 9, 'Gb': 9, 'G': 10, 'G#': 11
};

function ntof(note, octave) {
	return 440 * Math.pow(2, octave - 4 + note / 12);
};

function Sound( wave, envelope, seconds, frequency, volume, sampleRate ){
	this.freq = frequency;
	// generate the player
	// based on code by sk89q
	var player = (function(){
		
		var volume = volume || 32767 / 2;
		var sampleRate = sampleRate || Math.round(frequency * 10);
		
		// generate the waveform
		var data = [];
		for (var i = 0; i < sampleRate * seconds; i++) {
			var v = volume *
				wave( (i / sampleRate) * frequency ) *
				envelope( i / (sampleRate * seconds) );
			data.push(packShort(v));
		}
		
		// generate the wav file
		var wav = [
			"RIFF",
			packLong(2 * data.length + 52 ), // Length
			"WAVE",
			"fmt ", // Sub-chunk identifier
			packLong(16), // Chunk length
			packShort(1), // Audio format (1 is linear quantization)
			packShort(1), //number of channels
			packLong(sampleRate),
			packLong(sampleRate * 2), // Byte rate
			packShort(2),
			packShort(16),
			"data", // Sub-chunk identifier
			packLong(2 * data.length), // Chunk length
			data.join('')
		].join('');
		
		// generate the audio element
		var dataURI = "data:audio/wav;base64," + escape(btoa(wav));
		player = document.createElement("audio");
		player.setAttribute("src", dataURI);
		return player;
	})();
	
	// public function to play the generated sound
	this.play = function(){
		player.play();
	};
};

// Base 64 encoding function, for browsers that do not support btoa()
// by Tyler Akins (http://rumkin.com), available in the public domain
if (!window.btoa) {
	function btoa(input) {
		var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

		var output = "";
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;

		do {
			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);

			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;

			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}

			output +=
				keyStr.charAt(enc1) + keyStr.charAt(enc2) +
				keyStr.charAt(enc3) + keyStr.charAt(enc4);
		} while (i < input.length);

		return output;
	}
};

// packs a value into a short (2-bytes) or a long (4-bytes)
function packShort(arg) {
	return String.fromCharCode(arg & 255, (arg >> 8) & 255);
};

function packLong(arg) {
	return String.fromCharCode(arg & 255, (arg >> 8) & 255,
			(arg >> 16) & 255, (arg >> 24) & 255);
};

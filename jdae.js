// jdae.js
// javascript dynamic audio engine
// (c) 2011 colin kuebler

function $(e){ return document.getElementById(e); };

// f major pentatonic
scale = ['F','G','A','C','D','F','G','A'];
octaves = [4, 4, 5, 5, 5, 5, 5, 6];
wave = waves.warble;
envelope = envelopes.cosine;

window.onload = function(){
	for( var i = 0; i < 8; i++ )
		scale[i] = notenames[scale[i]];
	updateFreqs();
	function playsound(i,b){ if(b) sounds[i].play(); };
	lb = new LEDBoard( $('board'), 16, 8, playsound );
};

sounds = [];
function updateInstrument(){
	for( var i = 0; i < 8; i++ )
		sounds[i] = new Sound( wave, envelope, 0.2, freqs[i]);
};

freqs = [];
function updateFreqs(){
	for( var i = 0; i < 8; i++ )
		freqs[i] = ntof(scale[7-i],octaves[7-i]);
	updateInstrument();
};

function changeOctave( amount ){
	for( var j = 0; j < 8; j++ )
		octaves[j] += amount;
	updateFreqs();
};

function changeScale( amount ){
	for( var g = 0; g < 8; g++ )
		scale[g] += amount;
	updateFreqs();
};

play = false;
window.onkeydown = function(e){
	e = e || window.event;
	if( e.keyCode === 32 ){
		//spacebar
		if( play )
			lb.pause();
		else
			lb.play();
		play = !play;
	} else if( e.keyCode >= 49 && 57 >= e.keyCode ){
		//number keys 1-9
		key = e.keyCode - 48;
		switch(key){
			case 1: wave = waves.sine; break;
			case 2: wave = waves.square; break;
			case 3: wave = waves.weird; break;
			case 4: wave = waves.warble; break;
			case 5: wave = waves.warble_sq; break;
			case 6: envelope = envelopes.none; break;
			case 7: envelope = envelopes.sine; break;
			case 8: envelope = envelopes.cosine; break;
			case 9: envelope = envelopes.tangent; break;
		}
		updateInstrument();
	} else if( e.keyCode === 37 ){
		//left
		changeScale(-1);
	} else if( e.keyCode === 38 ){
		//up
		changeOctave(1);
	} else if( e.keyCode === 39 ){
		//right
		changeScale(1);
	} else if( e.keyCode === 40 ){
		//down
		changeOctave(-1);
	} else if( e.keyCode === 189 ){
		//-
		lb.changeTempo(20);
	} else if( e.keyCode === 187 ){
		//+
		lb.changeTempo(-20);
	} else if( e.keyCode === 8 ){
		//backspace
		lb.clear();
	}
};

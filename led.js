// led.js
// part of led experiment
// (c) 2011 colin kuebler

function LEDBoard(parent,cols,rows,onbar){
	// generate the board
	var spans = "";
	for( var i = 0; i < rows*cols; i++ ){
		spans += "<div class='led'></div>";
	}
	parent.innerHTML = spans;
	var leds = parent.getElementsByTagName("div");
	// setup led properties
	for( var i = 0; i < leds.length; i++ ){
		leds[i].src = 0;
		leds[i].dst = 0;
		leds[i].wave = 0;
		leds[i].onmousedown = function(){ this.dst = 1-this.dst; this.wave = 255; };
		leds[i].onmouseover = function(){ this.src = 1; };
	}
	// setup wavemap
	var wavemap = new Array(2);
	var current = 0;
	for( var i = 0; i < 2; i++ ){
		wavemap[i] = new Array(rows+2);
		for( var j = 0; j < rows+2; j++ ){
			wavemap[i][j] = new Array(cols+2);
			for( var k = 0; k < cols+2; k++ ){
				wavemap[i][j][k] = 0.0;
			}
		}
	}
	// animation tick
	this.animate = function(){
		// update wavemap
		var i = 0;
		for( var j = 1; j < rows+1; j++ ){
			for( var k = 1; k < cols+1; k++ ){
				// import recent changes
				wavemap[current][j][k] = leds[i].wave;
				i++;
			}
		}
		i = 0;
		for( var j = 1; j < rows+1; j++ ){
			for( var k = 1; k < cols+1; k++ ){
				// wave dynamics
				wavemap[1-current][j][k] =
					(	wavemap[current][j-1][k] +
						wavemap[current][j+1][k] +
						wavemap[current][j][k-1] +
						wavemap[current][j][k+1] ) / 2.0
					- wavemap[1-current][j][k];
				// dampen
				wavemap[1-current][j][k] *= (15.0/16.0);
				// inform led of update
				leds[i].wave = wavemap[1-current][j][k];
				i++;
			}
		}
		// flip wavemaps
		current = 1-current;
		for( i = 0; i < leds.length; i++ ){
			var l = Math.max(
				Math.round(
					(leds[i].src += (leds[i].dst-leds[i].src)*0.5)
					* 200 + 25 ),
				Math.round(leds[i].wave)
					);
			//var l = Math.round( leds[i].wave );
			leds[i].style.background = "rgb("+l+","+l+","+l+")";
		}
	};
	// start animating
	setInterval(this.animate,100);
	// scrolling bar
	var bar_pos = -1;
	var playtimer;
	var tempo = 400;
	var step = function(){
		bar_pos = (bar_pos + 1) % cols;
		var row = 0;
		for( var i = bar_pos; i < leds.length; i += cols, row++ ){
			leds[i].src = 1;
			onbar( row, leds[i].dst === 1 );
		}
		playtimer = setTimeout(step,tempo);
	};
	this.play = function(){
		step();
	};
	this.pause = function(){
		clearTimeout(playtimer);
	};
	this.changeTempo = function(newtempo){
		tempo += newtempo;
	};
	//
	this.clear = function(){
		for( var i = 0; i < leds.length; i++ ) leds[i].dst = 0;
	};
	
};


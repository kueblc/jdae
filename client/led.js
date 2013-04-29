// led.js
// part of led experiment
// (c) 2011 colin kuebler

function Wavemap( cols, rows, dampen ){
	var self = this;
	dampen = dampen || (15.0/16.0)
	
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
	
	self.step = function(){
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
				wavemap[1-current][j][k] *= dampen;
			}
		}
		// flip wavemaps
		current = 1-current;
	};
	
	self.get = function( k, j ){
		return wavemap[current][j+1][k+1];
	};
	
	self.set = function( k, j, v ){
		wavemap[current][j+1][k+1] = v;
	};
	
	return self;
};

var LED_ID = 0;
function LED( x, y, callback ){
	var self = document.createElement('div');
	self.className = 'led';
	
	self.src = 0;
	self.dst = 0;
	self.x = x; self.y = y;
	self.index = LED_ID++;
	
	self.set = function( value ){
		self.dst = value;
	};
	
	self.onmousedown = function(){
		callback( self );
	};
	
	self.onmouseover = function(){
		self.src = 1;
	};
	
	self.step = function(){
		self.src += (self.dst-self.src) * 0.5;
	};
	
	return self;
};

function LEDBoard( parent, cols, rows, onbar ){
	// set up PS
	var ps = PS( 'default', // XXX roomId
		function onconnect(){ },
		function onreceive( data ){
			// modify led board state
			var led = leds[ data.i ];
			led.set( data.v );
			wavemap.set( led.x, led.y, 1 );
		},
		function ondisconnect(){
			alert( "DISCONNECTED!\nReload to attempt reconnect" );
		} );
	
	// setup the wavemap
	var wavemap = new Wavemap( cols, rows );
	
	var ledCb = function( led ){
		ps.send( { i: led.index, v: 1 - led.dst } );
	};
	
	// generate the board
	var leds = [];
	for( var y = 0, i = 0; y < rows; y++ ){
		for( var x = 0; x < cols; x++, i++ ){
			var led = new LED( x, y, ledCb );
			leds.push( led );
			parent.appendChild( led );
		}
	}
	
	// animation tick
	this.step = function(){
		wavemap.step();
		for( i = 0; i < leds.length; i++ ){
			var led = leds[i];
			led.step();
			led.style.opacity = 0.2 + Math.max(
				led.src,
				wavemap.get( led.x, led.y )
			);
		}
	};
	
	// start animating
	setInterval(this.step,100);
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


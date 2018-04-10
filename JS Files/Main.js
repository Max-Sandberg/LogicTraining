var SC; // Scale
var cvs1, ctx1, cvs2, ctx2;
var circuits;
var gates = Object.freeze({"blank":0, "and":1, "nand":2, "or":3, "nor":4, "xor":5, "xnor":6, "bulb":7});
var allowedGates;
var enableGateChanges;
var draggedGate = 0;
var selectedGate = null;
var drawDraggedIntervalId, updateSelectedIntervalId, drawIntervalId, updateIntervalId, gateChangeIntervalId, menuHoverIntervalId;
var mousex, mousey;
var frameNo = 0;
var moves = 0;
var pause = false;
var scrollSpeed;
var level, levelIdx;
var currentScreen, screens = Object.freeze({"menu":0, "game":1});

function startGame(){
	createCanvases();
	document.body.onresize = handleResize;
	loadFontAwesome(drawMenu, 200);
}

function startLevel(lvlIdx) {
	currentScreen = screens.game;

	// Check for a bug where the canvas size is bigger than the window size.
	if (cvs1.width != window.innerWidth){
		handleResize();
	}

	// Assign event handlers.
	cvs2.onmousedown = handleMouseDown;
	cvs2.onmouseup = handleMouseUp;
	cvs2.onmousemove = handleMouseMove;

	levelIdx = lvlIdx;
	level = levels[levelIdx];
	circuits = level.circuits;
	enableGateChanges = level.enableGateChanges;
	allowedGates = level.allowedGates;

	ctx1.clearRect(0, 0, cvs1.width, cvs1.height);
	drawMenuBar();
	prepareCircuits();
	findLevelPar();
	moves = 0;
	drawMoves();
	ctx1.lineWidth = 2;
	ctx1.strokeStyle = "#000000";
	ctx1.strokeRect(1, (SC*6), cvs1.width-2, cvs1.height-(SC*6)-1);
	pause = false;
	drawIntervalId = setInterval(drawGameArea, 1000/60, ctx1);
	updateIntervalId = setInterval(updateGameArea, 200);
	if (enableGateChanges && !level.introduceGateChanges){
		gateChangeIntervalId = setInterval(changeLockedGates, 20000);
	}

	// Assign hotkeys.
	document.onkeypress = function (e) {
		// e = e || window.event;
		// // Find which key was pressed. Use either which or keyCode, depending on browser support.
		// var key = event.which || event.keyCode;
		if (e.key == " "){
			// If key was space, pause the game - comment as appropriate.
			pause = !pause;
		} else {
			// If the key was a number, find which gate that number corresponds to.
			var gate = parseInt(e.key);
			if (gate > 0 && gate < 7){
				if (allowedGates.indexOf(gate) != -1){
					// If that gate is allowed to be used, set it as the dragged gate and start the necessary intervals.
					draggedGate = gate;
					if (drawDraggedIntervalId == undefined && updateSelectedIntervalId == undefined){
						drawDraggedIntervalId = setInterval(drawDraggedGate, 1000/60);
						updateSelectedIntervalId = setInterval(updateSelectedGate, 50);
					}
				}
			}
		}
	};

	// If this level introduces new gates, show the intro dialogue for those gates.
	if (level.newGates){
		pause = true;
		introduceGates(allowedGates[0]);
	} else if (level.introduceGateChanges){
		// Level 7 introduces gate changes, which is done by the introduceGates function, but with parameter 7.
		pause = true;
		introduceGates(7);
	}
}

// Waits for font awesome to load before continuing. This code is not mine - taken from https://stackoverflow.com/questions/35570801/how-to-draw-font-awesome-icons-onto-html-canvas
function loadFontAwesome(callback,failAfterMS){
	var c=document.createElement("canvas");
	var cctx=c.getContext("2d");
	var ccw,cch;
	var fontsize=36;
	var testCharacter='\uF047';
	ccw=c.width=fontsize*1.5;
	cch=c.height=fontsize*1.5;
	cctx.font=fontsize+'px fontawesome';
	cctx.textAlign='center';
	cctx.textBaseline='middle';
	var startCount=pixcount();
	var t1=performance.now();
	var failtime=t1+failAfterMS;

	requestAnimationFrame(fontOnload);

	function fontOnload(time){
		var currentCount=pixcount();
		if(time>failtime){
			callback();
		}else if(currentCount==startCount){
			requestAnimationFrame(fontOnload);
		}else{
			callback();
		}
	}

	function pixcount(){
		cctx.clearRect(0,0,ccw,cch);
		cctx.fillText(testCharacter,ccw/2,cch/2);
		var data=cctx.getImageData(0,0,ccw,cch).data;
		var count=0;
		for(var i=3;i<data.length;i+=4){
			if(data[i]>10){count++;}
		}
		return(count);
	}
}

// Create the canvases that the game will be drawn to.
function createCanvases(){
	// Create the main canvas.
	cvs1 = document.createElement("canvas");
	ctx1 = cvs1.getContext("2d");
	cvs1.width = window.innerWidth;
	cvs1.height = window.innerHeight;
	cvs1.style.position = "absolute";
	cvs1.style.left = 0;
	cvs1.style.top = 0;
	cvs1.style.zIndex = 0;
	cvs1.style.backgroundColor = "#D8F3E6";
	cvs1.style.border = "0px solid #D3D3D3";
	document.getElementById("container").appendChild(cvs1);

	// Create the layer 2 canvas - things on this canvas are drawn in front of canvas 1.
	cvs2 = document.createElement("canvas");
	ctx2 = cvs2.getContext("2d");
	cvs2.width = window.innerWidth;
	cvs2.height = window.innerHeight;
	cvs2.style.position = "absolute";
	cvs2.style.left = 0;
	cvs2.style.top = 0;
	cvs2.style.zIndex = 1;
	document.getElementById("container").appendChild(cvs2);
	cvs2.onmousemove = handleMouseMove;

	// Calculate the scale to use for the UI and the scroll speed based on the window size.
	SC = Math.round(Math.min(cvs1.height/48, cvs1.width/96));
	SC = Math.min(SC, 22);
	scrollSpeed = cvs1.width / 1200;
}

// Handles the window being resized.
function handleResize(){
	// Don't resize if we're mid-level. That breaks things. Just deal with the size problem, and resize when we get back to the menu.
	if (currentScreen != screens.game){
		// Resize the canvases.
		cvs1.width = window.innerWidth;
		cvs1.height = window.innerHeight;
		cvs2.width = window.innerWidth;
		cvs2.height = window.innerHeight;

		// Calculate the scale to use for the UI based on the window size.
		SC = Math.round(Math.min(cvs1.height/48, cvs1.width/96));
		SC = Math.min(SC, 22);
		scrollSpeed = cvs1.width / 1000;

		// Redraw menu.
		drawMenu()
	}
}

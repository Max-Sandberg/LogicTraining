var SC; // Scale
var cvs1, ctx1, cvs2, ctx2;
var circuits
var gatesEnum = Object.freeze({"blank":0, "and":1, "nand":2, "or":3, "nor":4, "xor":5, "xnor":6, "bulb":7, "star":8});
var allowedGates;
var enableGateChanges;
var draggedGate = 0;
var selectedGate = null;
var starsGained = 0;
var drawDraggedIntervalId, updateSelectedIntervalId, drawIntervalId, updateIntervalId, gateChangeIntervalId, menuHoverIntervalId;
var mousex, mousey;
var frameNo = 0;
var moves = 0;
var pause = false;

function startGame(level) {
	// Check for a bug where the canvas size is bigger than the window size.
	if (cvs1.width != window.innerWidth){
		document.body.removeChild(document.body.children[2]);
		document.body.removeChild(document.body.children[1]);
		createCanvases();
	}

	// Assign event handlers.
	cvs2.onmousedown = handleMouseDown;
	cvs2.onmouseup = handleMouseUp;
	cvs2.onmousemove = handleMouseMove;

	circuits = levels[level].circuits;
	enableGateChanges = levels[level].enableGateChanges;
	allowedGates = levels[level].allowedGates;

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
	drawIntervalId = setInterval(drawGameArea, 10, ctx1);
	updateIntervalId = setInterval(updateGameArea, 50);
	if (enableGateChanges && selectedLevel != 7){
		gateChangeIntervalId = setInterval(changeLockedGates, 20000);
	}

	// Assign hotkeys.
	document.onkeypress = function (e) {
		e = e || window.event;
		// Find which key was pressed. Use either which or keyCode, depending on browser support.
		var key = event.which || event.keyCode;
		if (String.fromCharCode(key) == " "){
			// If key was space, pause the game - comment as appropriate.
			pause = !pause;
		} else {
			// If the key was a number, find which gate that number corresponds to.
			var gate = parseInt(String.fromCharCode(key));
			if (gate > 0 && gate < 7){
				if (allowedGates.includes(gate)){
					// If that gate is allowed to be used, set it as the dragged gate and start the necessary intervals.
					draggedGate = gate;
					if (drawDraggedIntervalId == undefined && updateSelectedIntervalId == undefined){
						drawDraggedIntervalId = setInterval(drawDraggedGate, 10);
						updateSelectedIntervalId = setInterval(updateSelectedGate, 50);
					}
				}
			}
		}
	};

	// If this level introduces new gates, show the intro dialogue for those gates.
	if (levels[level].newGates){
		pause = true;
		introduceGates(allowedGates[0]);
	} else if (level == 7){
		// Level 7 introduces gate changes, which is done by the introduceGates function, but with parameter 7.
		pause = true;
		introduceGates(7);
	}
}

// Waits for font awesome to load before continuing. This code is not mine - taken from https://stackoverflow.com/questions/35570801/how-to-draw-font-awesome-icons-onto-html-canvas
function loadFontAwesome(callback,failAfterMS,arg){
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
			callback(arg);
		}else if(currentCount==startCount){
			requestAnimationFrame(fontOnload);
		}else{
			callback(arg);
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
function createCanvases(menu){
	// Create the main canvas.
	cvs1 = document.createElement("canvas");
	ctx1 = cvs1.getContext("2d");
	cvs1.width = window.innerWidth;
	cvs1.height = window.innerHeight;
	cvs1.style = "position: absolute; left: 0; top: 0; z-index: 0; background-color: #d8f3e6; border:0px solid #d3d3d3;";
	document.body.insertBefore(cvs1, document.body.childNodes[0]);

	// Create the layer 2 canvas - things on this canvas are drawn in front of canvas 1.
	cvs2 = document.createElement("canvas");
	ctx2 = cvs2.getContext("2d");
	cvs2.width = window.innerWidth;
	cvs2.height = window.innerHeight;
	cvs2.style = "position: absolute; left: 0; top: 0; z-index: 1;";
	document.body.insertBefore(cvs2, document.body.childNodes[0]);

	// Calculate the scale to use for the UI based on the screen size.
	SC = Math.round((cvs1.height/50)/5) * 5;

	// If menu is true (only used in the index.html start function), draw the menu.
	if (menu){
		drawMenu(ctx1);
	}
}

var SC; // Scale
var cvs1, ctx1, cvs2, ctx2;
var circuits
var gatesEnum = Object.freeze({"blank":0, "and":1, "nand":2, "or":3, "nor":4, "xor":5, "xnor":6, "bulb":7, "star":8});
var allowedGates;
var enableGateChanges;
var draggedGate = 0;
var selectedGate = null;
var starsGained = 0;
var drawDraggedIntervalId, updateSelectedIntervalId, drawIntervalId, updateIntervalId, gateChangeIntervalId;
var mousex, mousey;
var frameNo = 0;
var pause = false;

function startGame(level) {
	// Assign event handlers.
	cvs2.onmousedown = handleMouseDown;
	cvs2.onmouseup = handleMouseUp;
	cvs2.onmousemove = handleMouseMove;

	circuits = levels[level].circuits;
	enableGateChanges = levels[level].enableGateChanges;
	allowedGates = levels[level].allowedGates;

	drawMenuBar();
	prepareCircuits();
	drawIntervalId = setInterval(drawGameArea, 10, ctx1);
	updateIntervalId = setInterval(updateGameArea, 50);
	if (enableGateChanges){
		gateChangeIntervalId = setInterval(changeLockedGates, 10000);
	}

	document.onkeypress = function (e) {
		e = e || window.event;
		pause = !pause;
	};
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

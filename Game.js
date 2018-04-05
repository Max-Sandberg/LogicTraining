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
var scrollSpeed;

function startGame(){
	createCanvases();
	document.body.onresize = handleResize;
	loadFontAwesome(drawMenu, 200);
}

function startLevel(level) {
	// Check for a bug where the canvas size is bigger than the window size.
	if (cvs1.width != window.innerWidth){
		handleResize();
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
	drawIntervalId = setInterval(drawGameArea, 1000/60, ctx1);
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
						drawDraggedIntervalId = setInterval(drawDraggedGate, 1000/60);
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
	SC = Math.round(Math.min(cvs1.height/48, cvs1.width/96));
	SC = Math.min(SC, 22);

	// Calculate the scoll speed based on the screen size.
	//scrollSpeed = cvs1.width / 1800;
	scrollSpeed = 2;
}

// Handles the window being resized.
function handleResize(){
	// Temporarily store all the existing canvas event handlers.
	var tempMouseDown = cvs2.onmousedown,
		tempMouseUp = cvs2.onmouseup,
		tempMouseMove = cvs2.onmousemove;
	// Remove the current canvases, and use createCanvases to create new ones of the correct size, and recalculate SC.
	document.body.removeChild(document.body.children[1]);
	document.body.removeChild(document.body.children[0]);
	createCanvases();
	// Restore the old event handlers.
	cvs2.onmousedown = tempMouseDown;
	cvs2.onmouseup = tempMouseUp;
	cvs2.onmousemove = tempMouseMove;
	// Redraw the game or menu.
	if (selectedLevel != -1){
		drawMenuBar();
		drawGameArea(ctx1);
	} else {
		drawMenu();
	}
}
var selectedLevel = -1;

function drawMenu(){
	// Clear the area.
	ctx1.clearRect(0, 0, cvs1.width, cvs1.height);

	// Draw dark green background
	ctx1.fillStyle = "#184e32";
	ctx1.beginPath();
	ctx1.rect(0, 0, cvs1.width, cvs1.height);
	ctx1.fill();
	ctx1.stroke();
	ctx1.closePath();

	// Draw title
	ctx1.font = (3.4*SC) + "pt Impact";
	ctx1.textAlign = "center";
	ctx1.fillStyle = "#FFFFFF";
	ctx1.fillText("Logic Training", (cvs1.width/2) + 2, (cvs1.height/2) - (6*SC) + 2);
	ctx1.fillStyle = "#000000";
	ctx1.fillText("Logic Training", (cvs1.width/2), (cvs1.height/2) - (6*SC));

	drawLevels(ctx1);

	cvs2.onmousedown = handleMenuMouseDown;
	cvs2.onmousemove = handleMenuMouseMove;
}

// Draws the icons for each level.
function drawLevels(ctx){
	var startx, width, x, y, selected;
	y = Math.round((cvs1.height/2) - (2*SC));
	width = (levels.length*6*SC) + ((levels.length-1)*3*SC);
	startx = Math.round((cvs1.width/2) - (width/2));

	for (var i = 0; i < levels.length; i++){
		selected = (levels[i].unlocked && selectedLevel == i);

		// Draw rectangle around the level.
		x = startx + (i*9*SC);
		ctx.fillStyle = (selected) ? "#7D9C8D" : "#5D8370";
		ctx.lineWidth = (selected) ? 3 : 1;
		ctx.strokeStyle = "#000000";
		ctx.fillRect(x+0.5, y+0.5, 6*SC, 6*SC);
		ctx.strokeRect(x+0.5, y+0.5, 6*SC, 6*SC);
		ctx.lineWidth = 1;

		if (i == 0){
			// Draw the tutorial button
			ctx.font = SC + "pt Impact";
			ctx.textAlign = "center";
			ctx.fillStyle = "#000000";
			ctx.fillText("TUTORIAL", x+(3*SC), y+(3*SC)+(0.4*SC));
			ctx.textAlign = "left";
		} else {
			// Write the "LEVEL" text.
			ctx1.textAlign = "center";
			ctx.font = (0.8*SC) + "pt Impact";
			ctx.fillStyle = "#000000";
			ctx.fillText("LEVEL", x+(3*SC), y+(1.5*SC));

			// Draw the level number.
			ctx.font = (2*SC) + "pt Impact";
			ctx.fillStyle = "#000000";
			ctx.fillText(i, x+(3*SC), y+(4.2*SC));

			// Draw the stars, filling in the ones which have been earned.
			ctx.font = (0.8*SC) + "pt FontAwesome";
			for (var j = 0; j < 3; j++){
				if (j < levels[i].starsGained){
					ctx.fillStyle = "#ffff00";
					ctx.fillText("\uF005", x+(1.6*SC)+(j*1.4*SC), y+(5.5*SC));
				}
				ctx.strokeStyle = "#000000";
				ctx.strokeText("\uF005", x+(1.6*SC)+(j*1.4*SC), y+(5.5*SC));
			}

			if (!levels[i].unlocked){
				// Draw transparent grey box.
				ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
				ctx.fillRect(x, y, 6*SC, 6*SC);

				// Draw lock icon.
				ctx.font = 1.5*SC + "px FontAwesome";
				ctx.fillStyle = "#262626";
				ctx.fillText("\uf023", x+8, y+(1.5*SC)+2);
				ctx.font = 1.5*SC + "px FontAwesome";
				ctx.fillStyle = "#f2f2f2";
				ctx.fillText("\uf023", x+6, y+(1.5*SC));
			}
		}
	}
}

function handleMenuMouseMove(){
	mousex = event.clientX;
	mousey = event.clientY;

	var lvl = getSelectedLevel();
	if (lvl != selectedLevel){
		selectedLevel = lvl;
		drawMenu();
	}
}

function handleMenuMouseDown(){
	// If the level is unlocked, start the level the user clicked on.
	if (selectedLevel == 0){
		startTutorial();
	} else if (selectedLevel != -1 && levels[selectedLevel].unlocked){
		startLevel(selectedLevel);
	}
}

// Find which level icon the mouse is hovering over, if any.
function getSelectedLevel(){
	if ((mousey > (cvs1.height/2)-(2*SC)) && (mousey < (cvs1.height/2)+(4*SC))){
		// In y range of levels
			var width = (levels.length*6*SC) + ((levels.length-1)*3*SC),
			startx = Math.round((cvs1.width/2)-(width/2));
		for (var i = 0; i < levels.length; i++){
			if ((mousex > startx+(i*9*SC)) && (mousex < startx+(i*9*SC)+(6*SC))){
				// In x range of a level
				return i;
			}
		}
	}

	return -1;
}
// Updates the game area. This function is called on an interval.
function updateGameArea() {
	// Start/stop animations if the circuit is on/off the screen.
	for (var i = 0; i < circuits.length; i++){
		if ((circuits[i].startx < cvs1.width) && (circuits[i].endx > 0)){
			// If on-screen
			if (circuits[i].animated == false){
				startWireAnimations(circuits[i]);
			}
		} else {
			// If off-screen
			if (circuits[i].animated == true){
				stopWireAnimations(circuits[i]);
			}
		}
	}

	checkWinOrLose();
}

// Checks if the game has been won or lost based on the state of the bulbs.
function checkWinOrLose(){
	var allBulbsLit = true,
		gameState;

	// Goes through every gate in all circuits. If any are unlit bulbs, set allBulbsLit to false. If any are unlit bulbs that have reached the edge of the screen, gameState is set to "lost".
	for (var i = 0; i < circuits.length; i++){
		for (var j = 0; j < circuits[i].gateSections.length; j++){
			var gateSection = circuits[i].gateSections[j];
			for (var k = 0; k < gateSection.length; k++){
				var gate = gateSection[k];
				if ((gate.type == gatesEnum.bulb) && (gate.outputVal != 1)){
					allBulbsLit = false;
					gameState = (circuits[i].startx + gate.xOffset < 0) ? "lost" : gameState;
				}
			}
		}
	}

	// If all bulbs are lit, gameState is set to "won".
	gameState = (allBulbsLit && !pause) ? "won" : gameState;

	// If the game is won or lost, stop the game and display the relevant message.
	if (gameState == "won" || gameState == "lost"){
		drawGameArea(ctx1);

		if (selectedLevel != 0 || gameState == "lost"){
			clearIntervals();
			won = (gameState == "won");
			showEndScreen();
		} else {
			pause = true;
			handleTestCircuit(won);
		}
	}
}

function clearIntervals(){
	// Cancel all the intervals and handlers
	clearInterval(updateSelectedIntervalId);
	clearInterval(drawDraggedIntervalId);
	clearInterval(drawIntervalId);
	clearInterval(updateIntervalId);
	clearInterval(gateChangeIntervalId);
	clearInterval(menuHoverIntervalId);
	updateSelectedIntervalId = undefined;
	drawDraggedIntervalId = undefined;
	drawIntervalId = undefined;
	updateIntervalId = undefined;
	gateChangeIntervalId = undefined;
	menuHoverIntervalId = undefined;
	cvs2.onmousedown = undefined;
	cvs2.onmouseup = undefined;
	cvs2.onmousemove = undefined;
	document.onkeypress = undefined;
}

function resetGameState(){
	starsGained = 0;
	frameNo = 0;
	draggedGate = 0;
	moves = 0;
	won = undefined;
	selectedGate = null;
	ctx1.clearRect(0, 0, cvs1.width, cvs1.height);
	ctx2.clearRect(0, 0, cvs1.width, cvs1.height);
	ctx1.textAlign = "left";
}

function updateSelectedGate(){
	var oldGate = selectedGate,
		newGate = getSelectedGate(mousex, mousey, 12);

	// If the mouse is no longer over the previously selected gate, make that gate visible again.
	if ((oldGate != null) && (newGate == null)){
		oldGate.invis = false;
		selectedGate = null;
	}
	// If the mouse isn't currently over a non-fixed gate, draw at the mouse position. Otherwise, draw in the gate, and set that gate to be invisible.
	else if ((oldGate == null) && (newGate != null)){
		newGate.invis = true;
	}

	selectedGate = newGate;
}

function changeLockedGates(){
	// Available gates will always consist of a single gate/!gate pair (e.g. AND/NAND, OR/NOR, XOR/XNOR) so that there is always a possible gate for every desired gate output, plus one other random gate.
	var gate1, gate2, gate3 = -1;

	// Choose a gate/!gate pair.
	gate1 = (Math.floor(Math.random()*3) * 2) + 1; // 1, 3 or 5.
	gate2 = gate1 + 1;
	// Choose another random gate.
	while ((gate3 == gate1) || (gate3 == gate2) || (gate3 == -1) || (gate3 == allowedGates[2])){
		gate3 = Math.floor(Math.random()*6) + 1;
	}

	var frame = -1,
	 	xOffset = Math.round(cvs1.width / 2) + (26*SC),
		yOffset = SC,
		opacity,
		id = setInterval(animateCountdown, 20);

	function animateCountdown(){
		frame++;
		if (won == undefined){
			// Fill over whatever is already there.
			ctx1.fillStyle = "#2a8958";
			ctx1.fillRect(xOffset-(4*SC), yOffset, (8*SC), (4*SC));

			if (frame != 150){
				// Draw the number.
				ctx1.textAlign = "center";
				opacity = 1-(frame%50)/50;
				ctx1.font = "italic " + (2*SC) + "pt Impact";
				ctx1.fillStyle = "rgba(180, 214, 197, " + opacity + ")";
				ctx1.fillText(3-Math.floor(frame/50), xOffset+2, yOffset+(3*SC)+2);
				ctx1.fillStyle = "rgba(17, 55, 35, " + opacity + ")";
				ctx1.fillText(3-Math.floor(frame/50), xOffset, yOffset+(3*SC));
				ctx1.textAlign = "left";
			}
		}
		if (frame == 150){
			// Update the allowed gates and redraw the menu bar, then display the "Gate change!" animation.
			clearInterval(id);
			if (won == undefined){
				allowedGates = [gate1, gate2, gate3];
				drawMenuBar();
			}
			frame = -1;
			id = setInterval(animateGateChange, 20);
		}
	}

	function animateGateChange(){
		frame++;
		if (won == undefined){
			// Fill over whatever is already there.
			ctx1.fillStyle = "#2a8958";
			ctx1.fillRect(xOffset-(10*SC), yOffset, (20*SC), (4*SC));

			if (frame != 75){
				// Draw "GATE CHANGE!".
				ctx1.textAlign = "center";
				opacity = (frame < 50) ? 1 : (75-frame)/25;
				ctx1.font = "italic " + (2*SC) + "pt Impact";
				ctx1.fillStyle = "rgba(180, 214, 197, " + opacity + ")";
				ctx1.fillText("GATE CHANGE!", xOffset+2, yOffset + (3*SC) + 2);
				ctx1.fillStyle = "rgba(17, 55, 35, " + opacity + ")";
				ctx1.fillText("GATE CHANGE!", xOffset, yOffset + (3*SC));
				ctx1.textAlign = "left";
			}
		}
		if (frame == 75){
			clearInterval(id);
		}
	}
}

function findLevelPar(){
	var lvl = levels[selectedLevel],
		circuits = lvl.circuits;

	lvl.par = 0;

	for (var i = 0; i < circuits.length; i++){
		for (var j = 0; j < circuits[i].gateSections.length; j++){
			for (var k = 0; k < circuits[i].gateSections[j].length; k++){
				if (!circuits[i].gateSections[j][k].fixed){
					lvl.par++;
				}
			}
		}
	}
}
// Draws the menu bar at the top of the screen.
function drawMenuBar(){
	// Clear the menu area.
	ctx1.clearRect(0, 0, cvs1.width, (6*SC));

	// Draw outer box.
	ctx1.beginPath();
	ctx1.lineWidth = 2;
	ctx1.strokeStyle = "#000000";
	ctx1.fillStyle="#2a8958";
	ctx1.rect(1, 1, cvs1.width-2, (SC*6)-1);
	ctx1.fill();
	ctx1.stroke();
	ctx1.closePath();

	// Draw box for each gate.
	var x = Math.round((cvs1.width / 2) - (14.5*SC));
	var y = SC;
	ctx1.beginPath();
	ctx1.lineWidth = 2;
	ctx1.fillStyle = "#d8f3e6";
	ctx1.rect(x, y, 4*SC, 4*SC);
	ctx1.rect(x+(5*SC), y, 4*SC, 4*SC);
	ctx1.rect(x+(10*SC), y, 4*SC, 4*SC);
	ctx1.rect(x+(15*SC), y, 4*SC, 4*SC);
	ctx1.rect(x+(20*SC), y, 4*SC, 4*SC);
	ctx1.rect(x+(25*SC), y, 4*SC, 4*SC);
	ctx1.fill();
	ctx1.stroke();
	ctx1.closePath();

	// Draw all the gates.
	drawAND(x, y, 0, 0, 0, ctx1);
	drawNAND(x+(5*SC), y, 0, 0, 0, ctx1);
	drawOR(x+(10*SC), y, 0, 0, 0, ctx1);
	drawNOR(x+(15*SC), y, 0, 0, 0, ctx1);
	drawXOR(x+(20*SC), y, 0, 0, 0, ctx1);
	drawXNOR(x+(25*SC), y, 0, 0, 0, ctx1);

	// Draw the hotkey numbers.
	for (var i = 0; i < 6; i++){
		ctx1.font = "8pt Arial";
		ctx1.fillStyle = "#000000";
		ctx1.fillText(i+1, x+(i*5*SC)+(4*SC)-10, y+(4*SC)-4);
	}

	// Draw a partially transparent grey box and a lock symbol on any locked gates.
	ctx1.save();
	ctx1.textAlign = "center";
	for (var i = 1; i < 7; i++){
		if (!allowedGates.includes(i)){
			// Draw transparent grey box.
			var startx = x+((i-1)*5*SC);
			ctx1.fillStyle = "rgba(0, 0, 0, 0.4)";
			ctx1.fillRect(startx, y, 4*SC, 4*SC);

			// Draw lock icon.
			ctx1.font = 2*SC + "px FontAwesome";
			ctx1.fillStyle = "#000000";
			ctx1.fillText("\uf023", startx+(2*SC)+3, y+(2.7*SC)+3);
			ctx1.font = 2*SC + "px FontAwesome";
			ctx1.fillStyle = "#ffffff";
			ctx1.fillText("\uf023", startx+(2*SC), y+(2.7*SC));
		}
	}
	ctx1.restore();

	// Function to draw the menu button.
	function drawMenuButton(colour){
		ctx1.save();
		// Draw over whatever is already here.
		ctx1.font = (SC+2) + "pt Impact";
		menuButtonWidth = ctx1.measureText("MENU").width;
		ctx1.fillStyle = "#2A8958";
		ctx1.fillRect((0.5*SC)-3, (0.5*SC)-4, menuButtonWidth+6, SC+8);
		// Draw the MENU text in the given colour.
		ctx1.textAlign = "left";
		ctx1.fillStyle = colour;
		ctx1.fillText("MENU", 0.5*SC, (1.5*SC)+2);
		ctx1.restore();
	}
	var menuButtonWidth;
	drawMenuButton("rgba(0, 0, 0, 0.5)");

	// If there isn't already an interval checking if the mouse is hovering over the menu, create one.
	if (menuHoverIntervalId == undefined){
		var highlightMenu = false,
			btnStartX = 0.5*SC,
			btnEndX = (0.5*SC)+menuButtonWidth,
			btnStartY = (0.5*SC)-2,
			btnEndY = 1.5*SC+2;

		// Function to check if the mouse is hovering over the menu button.
		function checkMenuHover(){
			return (mousex > btnStartX && mousex < btnEndX && mousey > btnStartY && mousey < btnEndY);
		}
		var onBtn = checkMenuHover();

		// Function to check the menu button is in the correct state, to be called on an interval.
		function updateMenuButton(){
			// Clear this interval if we go back to the menu.
			if (selectedLevel == -1){
				clearInterval(menuHoverIntervalId);
				menuHoverIntervalId = undefined;
			} else {
				mouseOverBtn = checkMenuHover();
				if (!highlightMenu && mouseOverBtn){
					// If the mouse is over the button and it isn't highlighted, highlight it.
					highlightMenu = true;
					drawMenuButton("rgba(0, 0, 0, 1)");
					cvs2.onmousedown = handleMenuButtonClick;
				}
				else if (highlightMenu && !mouseOverBtn){
					// If the mouse isn't over the button and it's still highlighted, unhighlight it.
					highlightMenu = false;
					drawMenuButton("rgba(0, 0, 0, 0.5)");
					cvs2.onmousedown = handleMouseDown;
				}
			}
		}

		// Function to stop the game and return to the menu.
		function handleMenuButtonClick(){
			clearIntervals();
			resetGameState();
			selectedLevel = -1;
			drawMenu();
		}

		menuHoverIntervalId = setInterval(updateMenuButton, 80);
	}
}

// Draws and moves all the circuits.
function drawGameArea(ctx){
	// Increase frameNo, and clear the game area.
	if (!pause) { frameNo++; }
	clearGameArea();

	// Move and draw the circuits.
	for (var i = 0; i < circuits.length; i++){
		if (!pause){
			// Normal circuits move 1 pixel, star circuits move two pixels.
			if (circuits[i].type == gatesEnum.star && circuits[i].startx < cvs1.width){
				circuits[i].startx -= 1.6 * scrollSpeed;
			} else {
				circuits[i].startx -= scrollSpeed;
			}
		}
		drawCircuit(circuits[i], ctx);
	}

	// Draw box around game area.
	ctx1.lineWidth = 1;
	ctx1.strokeStyle = "#000000";
	ctx1.beginPath();
	ctx1.moveTo(1, (SC*6)+1);
	ctx1.lineTo(1, cvs1.height-1);
	ctx1.moveTo(cvs1.width-1, (SC*6)+1);
	ctx1.lineTo(cvs1.width-1, cvs1.height-1);
	ctx1.stroke();
	ctx1.closePath();
}

// Draws the whole circuit.
function drawCircuit(circuit, ctx) {
	if (circuit.startx < cvs1.width && circuit.endx > 0){
		drawGates(circuit, ctx);
		drawWires(circuit, ctx);
		drawAnimations(circuit, ctx);
	}
}

// Draws all the lightning animations on the live wires.
function drawAnimations(circuit, ctx){
	for (var i = 0; i < circuit.wireSections.length; i++){
		var section = circuit.wireSections[i];
		for (var j = 0; j < section.length; j++){
			var group = section[j];
			for (var k = 0; k < group.wires.length; k++){
				var wire = group.wires[k];
				if (typeof(wire.animations) != "undefined"){
					for (var l = 0; l < wire.animations.length; l++){
						var bolt = wire.animations[l];
						drawBolt(bolt, circuit.startx, circuit.starty, ctx);
					}
				}
			}
		}
	}
}

function drawBolt(bolt, xOffset, yOffset, ctx){
	ctx.strokeStyle = "#00bfff";
	ctx.lineWidth = 1;
	ctx.beginPath();
	for (var i = 0; i < bolt.length; i++){
		ctx.moveTo(bolt[i].x1 + xOffset, bolt[i].y1 + yOffset);
		ctx.lineTo(bolt[i].x2 + xOffset, bolt[i].y2 + yOffset);
	}
	ctx.stroke();
	ctx.closePath();
}

function drawMoves(){
	ctx1.strokeStyle = "#000000";
	ctx1.fillStyle = "#2a8958";
	ctx1.lineWidth = 2;
	ctx1.beginPath();
	ctx1.moveTo((cvs1.width/2)-80, cvs1.height-2);
	ctx1.lineTo((cvs1.width/2)-50, cvs1.height-60);
	ctx1.lineTo((cvs1.width/2)+50, cvs1.height-60);
	ctx1.lineTo((cvs1.width/2)+80, cvs1.height-2);
	ctx1.fill();
	ctx1.stroke();
	ctx1.closePath();

	ctx1.textAlign = "center";
	ctx1.font = "18pt Impact";
	ctx1.fillStyle = "#000000";
	ctx1.fillText("MOVES: " + moves, cvs1.width/2, cvs1.height-30);
	ctx1.fillStyle = (moves > levels[selectedLevel].par) ? "#B4301F" : "#C4EDD8";
	ctx1.font = "12pt Tahoma";
	ctx1.fontWeight = "bold"
	ctx1.fillText("(PAR: " + levels[selectedLevel].par + ")", cvs1.width/2, cvs1.height-10);
	ctx1.fontWeight = "normal"
	ctx1.textAlign = "left";
}

// Clears the game area of all drawings
function clearGameArea(){
	for (var i = 0; i < circuits.length; i++){
		var startx = Math.max(circuits[i].startx, 1),
			endx = Math.min(circuits[i].endx, cvs1.width-1),
			starty = circuits[i].starty;
		if (startx < cvs1.width && endx > 1){
			ctx1.clearRect(startx, starty+(3*SC), endx-startx, (16*SC));
		}
	}
}
// Updates the values in a circuit after a particular gate has changed.
function updateCircuitValues(gateIdx){
	var gateSections = circuits[gateIdx[0]].gateSections,
		section = gateSections[gateIdx[1]],
		gate, oldOutput, newOutput, changed = false;

	// Recalculate all the gates in the section that changed, keeping track of whether any outputs changed.
	for (var i = 0; i < section.length; i++){
		gate = section[i];
		oldOutput = gate.outputVal;
		newOutput = updateGateOutput([gateIdx[0], gateIdx[1], i]);
		if (newOutput != oldOutput) { changed = true; }
	}

	// If the output of the updated gate changed, update all future gates too.
	if (changed){
		for (var i = gateIdx[1] + 1; i < gateSections.length; i++){
			for (var j = 0; j < gateSections[i].length; j++){
				updateGateOutput([gateIdx[0],i,j]);
			}
		}
	}
}

// Recalculates the output of a particular gate
function updateGateOutput(gateIdx){
	var circuit = circuits[gateIdx[0]],
		gate = circuit.gateSections[gateIdx[1]][gateIdx[2]],
		input1 = gate.inputs[0].val,
		input2 = (gate.inputs.length > 1) ? gate.inputs[1].val : undefined,
		oldOutput = gate.outputVal,
		newOutput;

	// If the gate is empty, or either input is inactive, the output is inactive.
	if (input1 == -1 || input2 == -1 || gate.type == 0){
		newOutput = -1;
	} else {
		switch (gate.type){
			case gatesEnum.and:
				newOutput = (input1 && input2) ? 1 : 0;
				break;
			case gatesEnum.nand:
				newOutput = !(input1 && input2) ? 1 : 0;
				break;
			case gatesEnum.or:
				newOutput = (input1 || input2) ? 1 : 0;
				break;
			case gatesEnum.nor:
				newOutput = !(input1 || input2) ? 1 : 0;
				break;
			case gatesEnum.xor:
				newOutput = ((input1 || input2) && !(input1 && input2)) ? 1 : 0;
				break;
			case gatesEnum.xnor:
				newOutput = !((input1 || input2) && !(input1 && input2)) ? 1 : 0;
				break;
			case gatesEnum.bulb:
			case gatesEnum.star:
				newOutput = (input1 == 1) ? 1 : 0;
				break;
		}
	}

	// Update the wire section, and the input values of all the gates this one connects to.
	if (oldOutput != newOutput){
		gate.outputVal = newOutput;
		if (gate.type != gatesEnum.bulb && gate.type != gatesEnum.star){
			// If there is a wire group coming out of this gate, update it's value, and enable/disable animations.
			var wireGroup = circuit.wireSections[gateIdx[1]+1][gateIdx[2]];
			wireGroup.live = newOutput;
			for (var i = 0; i < wireGroup.wires.length; i++){
				var wire = wireGroup.wires[i];
				wire.animations = [];
				wire.live = newOutput;
				if (newOutput == 1){
					wire.animationId = setWireInterval(wire, circuit);
				} else {
					clearInterval(wire.animationId);
					wire.animationId = undefined;
				}
			}
			// Update the inputs of all gates this one connects to.
			for (var i = 0; i < gate.nextGates.length; i++){
				var nextGate = getGate(gate.nextGates[i].gateIdx),
					nextGateInputs = gate.nextGates[i].inputs;
				for (var j = 0; j < nextGateInputs.length; j++){
					nextGate.inputs[nextGateInputs[j]].val = newOutput;
				}
			}
		} else if (gate.type == gatesEnum.star){
			if (newOutput == 1){
				starsGained++;
			} else if (oldOutput == 1){
				starsGained--;
			}
		}
	}

	return gate.outputVal;
}

// Takes an x and y coordinate and looks to see if that point is within the boundaries of one of the gates in the circuits. If it is, that gate index is returned.
function getSelectedGate(x, y, tol){
	if (y > 6*SC){
		// In y range of the whole circuit
		for (var i = 0; i < circuits.length; i++){
			if ((x > circuits[i].startx) && (x < circuits[i].endx)){
				// In x range of the whole circuit
				var circuit = circuits[i];
				for (var j = 0; j < circuit.gateSections.length; j++){
					var section = circuit.gateSections[j];
					if ((x > circuit.startx + section[0].xOffset - tol) && (x < circuit.startx + section[0].xOffset + (4*SC) + tol)){
						// In x range of gate section
						for (var k = 0; k < section.length; k++){
							var gate = section[k];
							if (!gate.fixed && (y > circuit.starty + gate.yOffset - tol) && (y < circuit.starty + gate.yOffset + (4*SC) + tol)){
								// In x and y range of gate
								return gate;
							}
						}
					}
				}
			}
		}
	}
	return null;
}

// Get the gate object for a given gate index.
function getGate(gateIdx){
	return circuits[gateIdx[0]].gateSections[gateIdx[1]][gateIdx[2]];
}

// Finds all the live wires and starts their animation interval
function startWireAnimations(circuit){
	for (var i = 0; i < circuit.wireSections.length; i++){
		var section = circuit.wireSections[i];
		for (var j = 0; j < section.length; j++){
			var group = section[j];
			for (var k = 0; k < group.wires.length; k++){
				var wire = group.wires[k];
				wire.animations = [];
				if (((typeof(group.live) != "undefined") && (group.live == 1)) || (typeof(wire.live) != "undefined") && (wire.live == 1)){
					wire.animationId = setWireInterval(wire, circuit);
				}
			}
		}
	}
	circuit.animated = true;
}

// Finds all the live wires and stops their animation interval
function stopWireAnimations(circuit){
	for (var i = 0; i < circuit.wireSections.length; i++){
		var section = circuit.wireSections[i];
		for (var j = 0; j < section.length; j++){
			var group = section[j];
			for (var k = 0; k < group.wires.length; k++){
				var wire = group.wires[k];
				clearInterval(wire.animationId);
				wire.animationId = undefined;
				wire.animations = [];
			}
		}
	}
	circuit.animated = false;
}

function setWireInterval(wire, circuit){
	// Do the first animation immediately, then start a timer to do it repeatedly.
	drawWireAnimation(wire, circuit);
	var length = Math.abs(wire.x1 - wire.x2) + Math.abs(wire.y1 - wire.y2);
	var interval = 50000 / length;
	return setInterval(drawWireAnimation, interval, wire, circuit);
}
// Prepares a circuit for drawing, by finding the positions of it's gates and wires.
function prepareCircuits(){
	for (var i = 0; i < circuits.length; i++){
		findGatePositions(i);
	}

	for (var i = 0; i < circuits.length; i++){
		findCircuitPosition(i);
		findWirePositions(circuits[i]);
		updateCircuitValues([i, 0, 0]);
		stopWireAnimations(circuits[i]);
	}
}

function findCircuitPosition(idx){
	var y, vertGap,
		circuit = circuits[idx],
		horzGap = 18*SC;

	// Calculate the x position.
	circuit.startx = (idx == 0) ? cvs1.width + 50 :
	 				 (circuits[idx-1].type != gatesEnum.star) ? circuits[idx-1].endx + horzGap :
					 circuits[idx-2].endx + horzGap;
	circuit.endx = circuit.startx + circuit.width;
	delete circuit.width;

	var isStar = (circuit.type == gatesEnum.star),
		oneBeforeStar = false,
		twoBeforeStar = false,
		afterStar = false;
	if (idx+1 < circuits.length){
		oneBeforeStar = (circuits[idx+1].type == gatesEnum.star);
	}
	if (idx+2 < circuits.length){
		twoBeforeStar = (circuits[idx+2].type == gatesEnum.star);
	}
	if (idx != 0){
		afterStar = (circuits[idx-1].type == gatesEnum.star);
	}

	var gameAreaHeight = cvs1.height - (6*SC) - 60;
	if (twoBeforeStar){
		do {
			y = Math.round((0.25+(0.5*Math.round(Math.random())))*gameAreaHeight)-(4*SC);
			vertGap = (idx != 0) ? Math.abs(circuits[idx-1].starty - y) : 1000;
		}
		while (vertGap < 6*SC);
	}
	else if (oneBeforeStar && idx != 0){
		y = circuits[idx-1].starty;
	}
	else if ((oneBeforeStar && idx == 0) || isStar){
		do {
			y = Math.round((0.25+(0.5*Math.round(Math.random())))*gameAreaHeight)-(4*SC);
		}
		while (isStar && y == circuits[idx-1].starty);
	}
	else {
		do {
			y = Math.round((0.25+(0.5*Math.random()))*gameAreaHeight)-(4*SC);
			vertGap = (idx != 0) ? Math.abs(circuits[idx-1].starty - y) : 1000;
		}
		while ((afterStar && vertGap < 15*SC) || (!afterStar && vertGap < 8*SC));
	}

	circuit.starty = y;
}

// Finds the x and y positions of every gate in the circuit, and the total width of the circuit.
function findGatePositions(circuitIdx){
	var circuit = circuits[circuitIdx],
		cols = circuit.gateSections;
	for (var i = 0; i < cols.length; i++){
		for (var j = 0; j < cols[i].length; j++){
			var gate = cols[i][j];
			gate.xOffset = (4*SC) + (i*8*SC);
			gate.yOffset = (cols[i].length == 3) ? (j*8*SC) :
						   (cols[i].length == 2) ? (j*8*SC) + (4*SC) :
						   (cols[i].length == 1) ? (8*SC) : 0;

			// While we're here, create/tweak some other properties needed for each gate.
			gate.type = (gate.fixed) ? gate.type : gatesEnum.blank;
			gate.invis = false;
			gate.outputVal = -1;
			for (var k = 0; k < gate.nextGates.length; k++){
				if (gate.nextGates[k].gateIdx.length < 3){
					gate.nextGates[k].gateIdx.unshift(circuitIdx);
				}
			}
			for (var k = 0; k < gate.inputs.length; k++){
				if (gate.inputs[k].type == "gate"){
					gate.inputs[k].val = -1;
				}
			}
			gate.idx = [circuitIdx, i, j];
			if (gate.type == gatesEnum.star || gate.type == gatesEnum.bulb){
				circuit.type = gate.type;
			}
		}
	}
	circuit.width = cols.length * 8 * SC;
}

// Finds the x and y positions of every wire in the circuit, and organises them into groups based on which gate output they originate from.
function findWirePositions(circuit){
	var wireSections = [],
		gateSections = circuit.gateSections;

	// For each gate section...
	for (var i = 0; i < gateSections.length-1; i++){
		// Initialise some basic variables.
		var wireSection = [],
			firstWireCol = [],
			wireCols = [],
			signalGroup = {},
			xOffset = gateSections[i][0].xOffset;

		for (var j = 0; j < gateSections[i].length; j++){
			// Create a new group for each gate in this section.
			var gate = gateSections[i][j],
				group = {};
			group.outputGate = [i, j];
			group.live = gate.outputVal;
			group.wires = [];
			wireSection.push(group);
		}

		// Create a new group in this section for any signals.
		signalGroup.signals = [];
		signalGroup.wires = [];
		if (i != gateSections.length-1){
			for (var j = 0; j < gateSections[i+1].length; j++){
				var gate = gateSections[i+1][j];
				for (var k = 0; k < gate.inputs.length; k++){
					if (gate.inputs[k].type == "signal"){
						// Fill in the y positions of the signal and wire. The x position is based on how many columns of vertical wires are in this section, which we don't know yet. This is assigned later.
						var inputY = gate.yOffset + (1*SC) + (k*2*SC),
							signal = {},
							wire = {};

						signal.y = inputY+10;
						signal.val = gate.inputs[k].val;
						signalGroup.signals.push(signal);

						wire.y1 = inputY;
						wire.y2 = inputY;
						wire.x2 = xOffset + (8*SC);
						wire.live = gate.inputs[k].val;

						signalGroup.wires.push(wire);
					}
				}
			}
		}

		// Find all the vertical wires for each gate's wire group. The wireCol arrays are shared between all groups in this wire section, as the total amount of verticals affects the size of the horizontal gap between wires. They will later be split into groups based on the gate they originate from.
		for (var j = 0; j < gateSections[i].length; j++){
			var gate = gateSections[i][j],
				outputY = gate.yOffset + (2*SC),
				inputsY = [];
			// For each gate this output leads to...
			for (var k = 0; k < gate.nextGates.length; k++){
				var nextGate = getGate(gate.nextGates[k].gateIdx),
					nextGateInputs = gate.nextGates[k].inputs;
				// For each input in this gate that this output leads to (usually 1, but could be 2)...
				for (var l = 0; l < nextGateInputs.length; l++){
					if (nextGate.inputs.length != 1){
						// For each input this output leads to, we will need a vertical wire leading to that input's y position.
						var wire = {};
						wire.y2 = nextGate.yOffset + (nextGateInputs[l]*2*SC) + SC;
						wire.gate = j;

						// Checks if there is already a wire in the first column from this group.
						var firstColFree = true,
							firstColIdx;
						for (var m = 0; m < firstWireCol.length; m++){
							if (firstWireCol[m].gate == wire.gate){
								firstColFree = false;
								firstColIdx = m;
							}
						}

						// Finds the length of this wire, and compares it to the length of any wires already in the first column
						var similarLength;
						if (!firstColFree){
							similarLength = (((Math.abs(wire.y2 - outputY)) - (Math.abs(firstWireCol[firstColIdx].y2 - outputY))) < 5);
						}

						// If there is no wire from this group in the first column for this section, or if the gate this wire leads to is the same height as the gate we're starting from, use the first column. Else, create a new column for this wire.
						if (firstColFree || (gate.yOffset == nextGate.yOffset) || similarLength == true){
							firstWireCol.push(wire);
						} else {
							wireCols.push([wire]);
						}
					}
				}
			}
		}

		// Figure out the horizontal gap between vertical wires based on how many vertical wires there are, and if there are signals in this section.
		if (firstWireCol.length > 0){
			wireCols.unshift(firstWireCol);
		}
		var hasSignals = (signalGroup.signals.length > 0);
		var gap = (4*SC) / (wireCols.length+1);

		// Add horizontal wire leading out of gate to each group
		for (var j = 0; j < gateSections[i].length; j++){
			var gate = gateSections[i][j];
			var wire = {};
			wire.x1 = gate.xOffset + (4*SC);
			wire.y1 = gate.yOffset + (2*SC);
			wire.x2 = gate.xOffset + (4*SC) + gap;
			wire.y2 = gate.yOffset + (2*SC);
			wireSection[j].wires.push(wire);
		}

		// Now that we have decided the order in which the vertical wires will go in and the gap between them, calculate their exact positions.
		for (var j = 0; j < wireCols.length; j++){
			for (var k = 0; k < wireCols[j].length; k++){
				var wire = wireCols[j][k];
				// Add a gap between each group of verticals when assigning x position.
				wire.x1 = xOffset + (4*SC) + ((j+1)*gap);
				wire.x2 = xOffset + (4*SC) + ((j+1)*gap);

				// If first column in this section, y1 is the output of the gate. Else, y1 is the y2 of the previous vertical wire in this group.
				if (j == 0){
					wire.y1 = gateSections[i][wire.gate].yOffset + (2*SC);
				} else {
					var y1 = -1,
						count = 1;
					// Go back through previous wire columns in this section until we find a wire in this group.
					while (y1 == -1){
						if ((j-count) >= 0){
							for (var l = 0; l < wireCols[j-count].length; l++){
								if (wireCols[j-count][l].gate == wire.gate){
									y1 = wireCols[j-count][l].y2;
								}
							}
						} else {
							y1 = gateSections[i][wire.gate].yOffset + (2*SC);
						}
						count++;
					}
					wire.y1 = y1;
				}

				// Add this vertical wire to it's corresponding group.
				wireSection[wire.gate].wires.push(wire);

				// Create a horizontal wire leading from this wire's y2 (which is the height of one of the inputs this group must lead to) to the next gate, and add it to this wire's group.
				var hrzWire = {};
				hrzWire.x1 = wireCols[j][k].x1;
				hrzWire.y1 = wireCols[j][k].y2;
				hrzWire.x2 = xOffset + (8*SC);
				hrzWire.y2 = wireCols[j][k].y2;
				wireSection[wireCols[j][k].gate].wires.push(hrzWire);
			}
		}

		// Fill in the x positions of the wires and signals in the signalGroup.
		if (hasSignals){
			for (var j = 0; j < signalGroup.signals.length; j++){
				signalGroup.signals[j].x = xOffset+(8*SC)-gap-6;
				signalGroup.wires[j].x1 = xOffset+(8*SC)-gap+12;
			}
			wireSection.push(signalGroup);
		}

		// Push this section of wires to the circuit's wireSections.
		wireSections.push(wireSection);
	}

	// Remove leftover gate properties on wires.
	for (var i = 0; i < wireSections.length; i++){
		for (var j = 0; j < wireSections[i].length; j++){
			for (var k = 0; k < wireSections[i][j].wires.length; k++){
				if (typeof(wireSections[i][j].wires[k].gate) != "undefined"){
					delete wireSections[i][j].wires[k].gate;
				}
			}
		}
	}

	// Create the starting wire column (signals only) and add to the start of this circuit.
	var firstSection = [{signals : [], wires : []}];
	for (var i = 0; i < gateSections[0].length; i++){
		var gate = gateSections[0][i];
		for (var j = 0; j < 2; j++){
			var inputY = gate.yOffset + (1*SC) + (j*2*SC),
				signal = {},
				wire = {};

			signal.x = (2*SC)-6;
			signal.y = inputY+10;
			signal.val = gate.inputs[j].val;
			firstSection[0].signals.push(signal);

			wire.y1 = inputY;
			wire.x1 = (2*SC)+12;
			wire.y2 = inputY;
			wire.x2 = 4*SC;
			wire.live = gate.inputs[j].val;
			firstSection[0].wires.push(wire);
		}
	}
	wireSections.unshift(firstSection);

	// Assign the wireSections found to the circuit.
	circuit.wireSections = wireSections;
}
/*
For each output in previous gates column {
	- Find each input it goes to in the next gates column
	- Calculate which one is the closest distance in terms of height
	- Add the line to that input to verticals[0] (if two of same distance, add both)
	- Push the lines to any other inputs to verticals
}

For each item in verticals[0] {
	- Draw horizontal line from prev gate output to x: startx+((i+1)*((4*SC)/(verticals.length+1)))
	- Draw the vertical at that x
	- Draw horizontal line from there to next gate input
}

For all other items in verticals {
	- Draw the vertical at x: startx+((i+1)*((4*SC)/(verticals.length+1)))
	- Draw horizontal line from there to next gate input
}
*/

// Draws all the wire sections of a circuit.
function drawWires(circuit, ctx){
	var startx = circuit.startx;
	var starty = circuit.starty;
	for (var i = 0; i < circuit.wireSections.length; i++){
		var section = circuit.wireSections[i];
		for (var j = 0; j < section.length; j++){
			var group = section[j];
			if (typeof(group.signals) == "undefined"){
				// Draw non-signal groups.
				var live = group.live;
				for (var k = 0; k < group.wires.length; k++){
					var wire = group.wires[k];
					drawWire(
						wire.x1+startx,
						wire.y1+starty,
						wire.x2+startx,
						wire.y2+starty,
						live,
						ctx
					);
				}
			} else {
				// Draw signal group.
				for (var k = 0; k < group.wires.length; k++){
					var wire = group.wires[k];
					drawWire(
						wire.x1+startx,
						wire.y1+starty,
						wire.x2+startx,
						wire.y2+starty,
						wire.live,
						ctx
					);
					var sig = group.signals[k];
					drawSignal(sig.x+startx, sig.y+starty, sig.val, ctx);
				}
			}
		}
	}
}

// Draws a single wire between two points.
function drawWire(x1, y1, x2, y2, live, ctx){
	ctx.beginPath();
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y2);
	switch (live){
		case -1:
			ctx.strokeStyle="#666666";
			ctx.lineWidth = 1;
			break;
		case 0:
			ctx.strokeStyle="#000000";
			ctx.lineWidth = 2;
			break;
		case 1:
			ctx.strokeStyle="#00bfff";
			ctx.lineWidth = 3;
			break;
	}
	ctx.stroke();
	ctx.strokeStyle="#000000";
	ctx.lineWidth = 1;
	ctx.closePath();
}

// Draws an input signal.
function drawSignal(x, y, sig, ctx){
	ctx.font = "26px Arial";
	ctx.fillStyle = "#000000";
	ctx.fillText(sig, x, y);
}

// Draws a lightning bolt for half a second at a random point along the wire.
function drawWireAnimation(wire, circuit){
	var xOffset, yOffset;
	if (wire.x1 == wire.x2){
		xOffset = wire.x1;
		yOffset = Math.min(wire.y1, wire.y2) + Math.round((Math.random()*Math.abs(wire.y1 - wire.y2)));
	}
	else {
		xOffset = Math.min(wire.x1, wire.x2) + Math.round((Math.random()*Math.abs(wire.x1 - wire.x2)));
		yOffset = wire.y1;
	}

	// Direction variable: 0 = up, 1 = down, 2 = left, 3 = right.
	var direction = Math.round(Math.random());
	direction = (wire.x1 == wire.x2) ? direction + 2 : direction;
	var line1 = {}, line2 = {}, line3 = {};

	if (direction == 0){
		line1.x2 = xOffset - 2;
		line1.y2 = yOffset - 2;
		line2.x2 = xOffset + 2;
		line2.y2 = yOffset - 6;
		line3.x2 = xOffset;
		line3.y2 = yOffset - 8;
	} else if (direction == 1){
		line1.x2 = xOffset + 2;
		line1.y2 = yOffset + 2;
		line2.x2 = xOffset - 2;
		line2.y2 = yOffset + 6;
		line3.x2 = xOffset;
		line3.y2 = yOffset + 8;
	} else if (direction == 2){
		line1.x2 = xOffset - 2;
		line1.y2 = yOffset - 2;
		line2.x2 = xOffset - 6;
		line2.y2 = yOffset + 2;
		line3.x2 = xOffset - 8;
		line3.y2 = yOffset;
	} else if (direction == 3){
		line1.x2 = xOffset + 2;
		line1.y2 = yOffset + 2;
		line2.x2 = xOffset + 6;
		line2.y2 = yOffset - 2;
		line3.x2 = xOffset + 8;
		line3.y2 = yOffset;
	}
	line1.x1 = xOffset;
	line1.y1 = yOffset;
	line2.x1 = line1.x2;
	line2.y1 = line1.y2;
	line3.x1 = line2.x2;
	line3.y1 = line2.y2;

	var lightning = [line1, line2, line3];

	setTimeout(startAnimation, Math.random()*1500)

	function startAnimation(){
		// Check the wire is live again, just in case it changed since the timeout delay.
		if (wire.live == 1){
			wire.animations.push(lightning);
			setTimeout(stopAnimation, 150);
		}
	}

	function stopAnimation(){
		for (var i = 0; i < wire.animations.length; i++){
			if ((wire.animations[i][0].x1 == xOffset) && (wire.animations[i][0].y1 == yOffset)){
				wire.animations.splice(i, 1);
			}
		}
	}
}
// Draws all the gate sections of a circuit.
function drawGates(circuit, ctx){
	for (var i = 0; i < circuit.gateSections.length; i++){
		var section = circuit.gateSections[i];
		for (var j = 0; j < section.length; j++){
			var gate = section[j],
				type = (gate.invis) ? 0 : gate.type;
			drawGate(
				circuit.startx+gate.xOffset,
				circuit.starty+gate.yOffset,
				type,
				gate.inputs,
				gate.outputVal,
				gate.fixed,
				ctx
			);
		}
	}
}

// Draws a logic gate with a dotted line box around it.
function drawGate(x, y, type, inputs, output, fixed, ctx) {
	// Draw the box around the gate.
	if (fixed == 1){
		drawFixedBox(x, y, ctx);
	} else if (fixed == 0) {
		drawDottedBox(x, y, ctx);
	}

	// Get the inputs.
	var input1, input2;
	input1 = inputs[0].val;
	if (inputs.length > 1){
		input2 = inputs[1].val;
	}

	// Draw the actual gate inside the box.
	switch (type){
		case gatesEnum.and:
			drawAND(x, y, input1, input2, output, ctx);
			break;
		case gatesEnum.nand:
			drawNAND(x, y, input1, input2, output, ctx);
			break;
		case gatesEnum.or:
			drawOR(x, y, input1, input2, output, ctx);
			break;
		case gatesEnum.nor:
			drawNOR(x, y, input1, input2, output, ctx);
			break;
		case gatesEnum.xor:
			drawXOR(x, y, input1, input2, output, ctx);
			break;
		case gatesEnum.xnor:
			drawXNOR(x, y, input1, input2, output, ctx);
			break;
		case gatesEnum.bulb:
			drawBulb(x, y, input1, ctx);
			break;
		case gatesEnum.star:
			drawStar(x, y, input1, ctx);
			break;
	}
}

function drawFixedBox(x, y, ctx){
	ctx.strokeStyle = "#666666";
	ctx.fillStyle = "#DADADA";
	ctx.lineWidth = 1;
	ctx.fillRect(x+0.5, y+0.5, 4*SC, 4*SC);
	ctx.strokeRect(x+0.5, y+0.5, 4*SC, 4*SC);
	ctx.strokeStyle = "#000000";
}

function drawDottedBox(x, y, ctx){
	ctx.strokeStyle = "#000000";
	ctx.setLineDash([5, 3]);
	ctx.lineWidth = 1;
	ctx.strokeRect(x+0.5, y+0.5, 4*SC, 4*SC);
	ctx.setLineDash([]);
}

// Draws the currently selected gate at the position of the mouse cursor, or snapped to a nearby gate.
function drawDraggedGate(){
	var x, y;

	if (selectedGate == null){
		x = mousex;
		y = mousey;
	} else {
		x = circuits[selectedGate.idx[0]].startx + selectedGate.xOffset + (2*SC);
		y = circuits[selectedGate.idx[0]].starty + selectedGate.yOffset + (2*SC);
	}

	// Clear the canvas and draw the correct gate.
	ctx2.clearRect(0, 0, cvs2.width, cvs2.height);
	switch(draggedGate){
		case gatesEnum.and:
			drawAND(x-(2*SC), y-(2*SC), 0, 0, 0, ctx2);
			break;
		case gatesEnum.nand:
			drawNAND(x-(2*SC), y-(2*SC), 0, 0, 0, ctx2);
			break;
		case gatesEnum.or:
			drawOR(x-(2*SC), y-(2*SC), 0, 0, 0, ctx2);
			break;
		case gatesEnum.nor:
			drawNOR(x-(2*SC), y-(2*SC), 0, 0, 0, ctx2);
			break;
		case gatesEnum.xor:
			drawXOR(x-(2*SC), y-(2*SC), 0, 0, 0, ctx2);
			break;
		case gatesEnum.xnor:
			drawXNOR(x-(2*SC), y-(2*SC), 0, 0, 0, ctx2);
			break;
	}
}

//#region - Functions to draw the specific gates.
function drawAND(x, y, input1, input2, output, ctx){
	drawWire(x, y+SC, x+(0.6*SC), y+SC, input1, ctx);
	drawWire(x, y+(3*SC), x+(0.6*SC), y+(3*SC), input2, ctx);
	drawWire(x+(3.5*SC), y+(2*SC), x+(4*SC), y+(2*SC), output, ctx);

	ctx.lineWidth = 1.5;
	ctx.fillStyle = "#ffffff";

	ctx.beginPath();
	ctx.moveTo(x+(0.6*SC), y+(0.4*SC));
	ctx.lineTo(x+(1.6*SC), y+(0.4*SC));
	ctx.bezierCurveTo(x+(4.1*SC), y+(0.4*SC), x+(4.1*SC), y+(3.6*SC), x+(1.6*SC), y+(3.6*SC));
	ctx.lineTo(x+(0.6*SC), y+(3.6*SC));
	ctx.lineTo(x+(0.6*SC), y+(0.4*SC));
	ctx.fill();
	ctx.stroke();
	ctx.closePath();
}

function drawNAND(x, y, input1, input2, output, ctx){
	drawWire(x, y+SC, x+(0.6*SC), y+SC, input1, ctx);
	drawWire(x, y+(3*SC), x+(0.6*SC), y+(3*SC), input2, ctx);
	drawWire(x+(3.75*SC), y+(2*SC), x+(4*SC), y+(2*SC), output, ctx);

	ctx.lineWidth = 1.5;
	ctx.fillStyle = "#ffffff";

	ctx.beginPath();
	ctx.moveTo(x+(0.6*SC), y+(0.4*SC));
	ctx.lineTo(x+(1.4*SC), y+(0.4*SC));
	ctx.bezierCurveTo(x+(3.9*SC), y+(0.4*SC), x+(3.9*SC), y+(3.6*SC), x+(1.4*SC), y+(3.6*SC));
	ctx.lineTo(x+(0.6*SC), y+(3.6*SC));
	ctx.lineTo(x+(0.6*SC), y+(0.4*SC));
	ctx.fill();
	ctx.stroke();
	ctx.closePath();

	ctx.beginPath();
	ctx.arc(x+(3.5*SC), y+(2*SC), 0.25*SC, 0, 2*Math.PI);
	ctx.fill();
	ctx.stroke();
	ctx.closePath();
}

function drawOR(x, y, input1, input2, output, ctx){
	drawWire(x, y+SC, x+(0.8*SC), y+SC, input1, ctx);
	drawWire(x, y+(3*SC), x+(0.8*SC), y+(3*SC), input2, ctx);
	drawWire(x+(3.5*SC), y+(2*SC), x+(4*SC), y+(2*SC), output, ctx);

	ctx.lineWidth = 1.5;
	ctx.fillStyle = "#ffffff";

	ctx.beginPath();
	ctx.moveTo(x+(0.4*SC), y+(0.4*SC));
	ctx.quadraticCurveTo(x+(3*SC), y+(0.4*SC), x+(3.5*SC), y+(2*SC));
	ctx.quadraticCurveTo(x+(3*SC), y+(3.6*SC), x+(0.4*SC), y+(3.6*SC));
	ctx.bezierCurveTo(x+(1.2*SC), y+(3*SC), x+(1.2*SC), y+(1*SC), x+(0.4*SC), y+(0.4*SC));
	ctx.fill();
	ctx.stroke();
	ctx.closePath();
}

function drawNOR(x, y, input1, input2, output, ctx){
	drawWire(x, y+SC, x+(0.8*SC), y+SC, input1, ctx);
	drawWire(x, y+(3*SC), x+(0.8*SC), y+(3*SC), input2, ctx);
	drawWire(x+(3.75*SC), y+(2*SC), x+(4*SC), y+(2*SC), output, ctx);

	ctx.lineWidth = 1.5;
	ctx.fillStyle = "#ffffff";

	ctx.beginPath();
	ctx.moveTo(x+(0.4*SC), y+(0.4*SC));
	ctx.quadraticCurveTo(x+(2.75*SC), y+(0.4*SC), x+(3.25*SC), y+(2*SC));
	ctx.quadraticCurveTo(x+(2.75*SC), y+(3.6*SC), x+(0.4*SC), y+(3.6*SC));
	ctx.bezierCurveTo(x+(1.2*SC), y+(3*SC), x+(1.2*SC), y+(1*SC), x+(0.4*SC), y+(0.4*SC));
	ctx.fill();
	ctx.stroke();
	ctx.closePath();

	ctx.beginPath();
	ctx.arc(x+(3.5*SC), y+(2*SC), 0.25*SC, 0, 2*Math.PI);
	ctx.fill();
	ctx.stroke();
	ctx.closePath();
}

function drawXOR(x, y, input1, input2, output, ctx){
	drawWire(x, y+SC, x+(0.7*SC), y+SC, input1, ctx);
	drawWire(x, y+(3*SC), x+(0.7*SC), y+(3*SC), input2, ctx);
	drawWire(x+(3.5*SC), y+(2*SC), x+(4*SC), y+(2*SC), output, ctx);

	ctx.lineWidth = 1.5;
	ctx.fillStyle = "#ffffff";

	ctx.beginPath();
	ctx.moveTo(x+(0.6*SC), y+(0.4*SC));
	ctx.quadraticCurveTo(x+(3*SC), y+(0.4*SC), x+(3.5*SC), y+(2*SC));
	ctx.quadraticCurveTo(x+(3*SC), y+(3.6*SC), x+(0.6*SC), y+(3.6*SC));
	ctx.bezierCurveTo(x+(1.4*SC), y+(3*SC), x+(1.4*SC), y+(1*SC), x+(0.6*SC), y+(0.4*SC));
	ctx.fill();
	ctx.stroke();
	ctx.closePath();

	ctx.beginPath();
	ctx.moveTo(x+(0.3*SC), y+(0.4*SC));
	ctx.bezierCurveTo(x+(1.1*SC), y+(1*SC), x+(1.1*SC), y+(3*SC), x+(0.3*SC), y+(3.6*SC));
	ctx.stroke();
	ctx.closePath();
}

function drawXNOR(x, y, input1, input2, output, ctx){
	drawWire(x, y+SC, x+(0.7*SC), y+SC, input1, ctx);
	drawWire(x, y+(3*SC), x+(0.7*SC), y+(3*SC), input2, ctx);
	drawWire(x+(3.75*SC), y+(2*SC), x+(4*SC), y+(2*SC), output, ctx);

	ctx.lineWidth = 1.5;
	ctx.fillStyle = "#ffffff";

	ctx.beginPath();
	ctx.moveTo(x+(0.6*SC), y+(0.4*SC));
	ctx.quadraticCurveTo(x+(2.75*SC), y+(0.4*SC), x+(3.25*SC), y+(2*SC));
	ctx.quadraticCurveTo(x+(2.75*SC), y+(3.6*SC), x+(0.6*SC), y+(3.6*SC));
	ctx.bezierCurveTo(x+(1.4*SC), y+(3*SC), x+(1.4*SC), y+(1*SC), x+(0.6*SC), y+(0.4*SC));
	ctx.fill();
	ctx.stroke();
	ctx.closePath();

	ctx.beginPath();
	ctx.moveTo(x+(0.3*SC), y+(0.4*SC));
	ctx.bezierCurveTo(x+(1.1*SC), y+(1*SC), x+(1.1*SC), y+(3*SC), x+(0.3*SC), y+(3.6*SC));
	ctx.stroke();
	ctx.closePath();

	ctx.beginPath();
	ctx.arc(x+(3.5*SC), y+(2*SC), 0.25*SC, 0, 2*Math.PI);
	ctx.fill();
	ctx.stroke();
	ctx.closePath();
}

function drawBulb(x, y, live, ctx){
	ctx.lineWidth = 2;
	ctx.fillStyle = (live == 1) ? "#ffff00" : "#ffffff";

	ctx.beginPath();
	ctx.moveTo(x+(1.5*SC), y+(2.9*SC));
	ctx.bezierCurveTo(x+(1.5*SC), y+(2.3*SC), x+(1*SC), y+(2.3*SC), x+(1*SC), y+(1.6*SC));
	ctx.arc(x+(2*SC), y+(1.6*SC), 1*SC, Math.PI, 0);
	ctx.bezierCurveTo(x+(3*SC), y+(2.3*SC), x+(2.5*SC), y+(2.3*SC), x+(2.5*SC), y+(2.9*SC));
	ctx.fill();
	ctx.stroke();
	ctx.closePath();

	ctx.beginPath();
	ctx.lineWidth = 4;
	ctx.fillStyle = "#cccccc";
	ctx.rect(x+(1.4*SC)+1, y+(2.9*SC)+1, (1.2*SC)-2, (0.5*SC)-2);
	ctx.stroke();
	ctx.fill();
	ctx.lineWidth = 2;
	ctx.fillStyle = "#000000";
	ctx.closePath();

	if (live == 1){
		ctx.beginPath();
		ctx.lineWidth = 4;
		ctx.strokeStyle = "#ffff00";

		// Right side lines
		ctx.moveTo(x+(3.1*SC), y+(1*SC));
		ctx.lineTo(x+(3.6*SC), y+(0.8*SC));
		ctx.moveTo(x+(3.2*SC), y+(1.75*SC));
		ctx.lineTo(x+(3.7*SC), y+(1.75*SC));
		ctx.moveTo(x+(3.1*SC), y+(2.5*SC));
		ctx.lineTo(x+(3.6*SC), y+(2.7*SC));

		// Left side lines
		ctx.moveTo(x+(0.9*SC), y+(1*SC));
		ctx.lineTo(x+(0.4*SC), y+(0.8*SC));
		ctx.moveTo(x+(0.8*SC), y+(1.75*SC));
		ctx.lineTo(x+(0.3*SC), y+(1.75*SC));
		ctx.moveTo(x+(0.9*SC), y+(2.5*SC));
		ctx.lineTo(x+(0.4*SC), y+(2.7*SC));

		ctx.stroke();
		ctx.lineWidth = 1;
		ctx.strokeStyle = "#000000";
		ctx.closePath();
	}
}

function drawStar(x, y, live, ctx){
	ctx.font = 3*SC + "px FontAwesome";
	// if (live == 1){
	// 	ctx.fillStyle = "#ffff00";
	// 	ctx.fillText("\uF005", x+(0.65*SC), y+(3.1*SC));
	// 	ctx.fillStyle = "black";
	// }
	ctx.lineWidth = 2;
	ctx.fillStyle = (live == 1) ? "#FFFF00" : "#FFFFFF";
	ctx.fillText("\uF005", x+(0.65*SC), y+(3.1*SC));
	ctx.strokeText("\uF005", x+(0.65*SC), y+(3.1*SC));
	//ctx.font = "26px Arial";
	ctx.lineWidth = 1;
}
//#endregion
// Checks if the user clicked on a gate in the menu bar, and if so, set draggedGate to that gate.
function handleMouseDown(){
	updateSelectedGate();

	if (draggedGate != 0){
		// Player is already holding a gate without holding the mouse down, i.e. they used a hotkey.
		handleMouseUp();
	} else {
		// See if the mouse position is in the boundaries of one of the gates in the menu bar.
		if ((mousey > SC) && (mousey < (5*SC))){
			var startX = (cvs1.width/2) - (14.5*SC);
			for (var i = 1; i < 7; i++){
				if (allowedGates.includes(i) && (mousex > startX+((i-1)*5*SC)) && (mousex < startX+((i-1)*5*SC)+(4*SC))){
					// Sets draggedGate to the selected gate, and puts drawDraggedGate on an interval, so that it can be redrawn to snap to nearby gates even if the mouse doesn't move.
					draggedGate = i;
					drawDraggedIntervalId = setInterval(drawDraggedGate, 1000/60);
					updateSelectedIntervalId = setInterval(updateSelectedGate, 50);
				}
			}
		} else {
			var gate = getSelectedGate(mousex, mousey, 0);
			if (gate != null){
				// If the user clicked and dragged a non-fixed gate in the circuit, remove that gate from the circuit.
				draggedGate = gate.type;
				gate.type = 0;
				updateCircuitValues(gate.idx);
				drawDraggedIntervalId = setInterval(drawDraggedGate, 1000/60);
				updateSelectedIntervalId = setInterval(updateSelectedGate, 50);
			}
		}
	}
}

// Checks if the user is currently dragging a gate, and if they released the mouse over a non-fixed gate in a circuit. If so, update that gate's type and update the circuit's values.
function handleMouseUp(){
	if (draggedGate != 0){
		var gate = getSelectedGate(mousex, mousey, 12),
			chosenGate = draggedGate;

		clearInterval(updateSelectedIntervalId);
		clearInterval(drawDraggedIntervalId);
		updateSelectedIntervalId = undefined;
		drawDraggedIntervalId = undefined;
		draggedGate = 0;
		ctx2.clearRect(0, 0, cvs2.width, cvs2.height);

		if (gate != null){
			gate.invis = false;
			if (gate.type != chosenGate){
				moves++;
				drawMoves();
				gate.type = chosenGate;
				updateCircuitValues(gate.idx);
			}
		}
	}
	selectedGate = null;
}

function handleMouseMove(){
	mousex = event.clientX;
	mousey = event.clientY;
}
var won, btn;
var selectedButton = null;

function showEndScreen(){
	// Give an extra star if they completed the level in less moves than the par.
	if (won && moves <= levels[selectedLevel].par){
		starsGained++;
	}

	// Animation to slowly fade the screen.
	var frame = -1;
	var id = setInterval(fadeScreen, 1000/60);

	function fadeScreen(){
		frame++;
		if (frame < 40){
			ctx2.clearRect(0, 0, cvs1.width, cvs1.height);
			ctx2.fillStyle = "rgba(0, 0, 0, " + ((frame/40)*0.8) + ")";
			ctx2.fillRect(0, 0, cvs1.width, cvs1.height);
		} else if (frame == 40){
			ctx2.clearRect(0, 0, cvs1.width, cvs1.height);
			ctx1.fillStyle = "rgba(0, 0, 0, " + ((frame/40)*0.8) + ")";
			ctx1.fillRect(0, 0, cvs1.width, cvs1.height);
		} else if (frame > 80){
			clearInterval(id);
			frame = -1;
			id = setInterval(slideEndMessage, 1000/60);
		}
	}

	var width = won ? 360 : 300;
		height = won ? 260 : 200,
		x = (cvs1.width/2) - (width/2);
		y = -height;
	var starX, starY, size;
	function slideEndMessage(){
		frame++;
		y = (frame/50) * ((cvs1.height/2)+(height/2)) - height;
		ctx2.clearRect(0, 0, cvs1.width, cvs1.height);
		if (frame < 50){
			drawEndMessage(x, y, ctx2);
		} else if (frame == 50){
			drawEndMessage(x, y, ctx1);
			clearInterval(id);
			if (won){
				frame = -1;
				starX = x+0.3*width;
				starY = y+128;
				ctx2.fillStyle = "#FFFF00";
				ctx2.strokeStyle = "#000000";
				ctx2.lineWidth = 1.5;
				if (starsGained > 0){
					id = setInterval(animateStars, 1000/60);
				} else {
					cvs2.onmousedown = handleEndScreenMouseDown;
					cvs2.onmousemove = handleEndScreenMouseMove;
				}
			} else {
				cvs2.onmousedown = handleEndScreenMouseDown;
				cvs2.onmousemove = handleEndScreenMouseMove;
			}
		}
	}

	function animateStars(){
		frame++;
		if (frame == 25 || frame == 50 || frame == 75){
			if (starsGained > frame/25){
				// ctx2.fillStyle = "#184e32";
				// ctx2.fillRect()
				starX += 0.2*width;
			} else {
				cvs2.onmousedown = handleEndScreenMouseDown;
				cvs2.onmousemove = handleEndScreenMouseMove;
				clearInterval(id);
			}
		}
		size = (((frame % 25)+1)/25) * 40;
		ctx2.font = size + "pt FontAwesome";
		ctx2.fillStyle = "#FFFF00";
		ctx2.fillText("\uF005", starX, starY+(size/2));
		if (size == 40){
			ctx2.strokeStyle = "#000000";
			ctx2.strokeText("\uF005", starX, starY+(size/2));
		}
	}
}

function drawEndMessage(x, y, ctx){
	var width = won ? 360 : 300;
		height = won ? 260 : 200;

	// Draw the box.
	ctx.lineWidth = 2;
	ctx.fillStyle = "#184e32";
	ctx.beginPath();
	ctx.rect(Math.round(x), Math.round(y), width, height);
	ctx.fill();
	ctx.stroke();
	ctx.closePath();

	// Write the win or lose message.
	var text = won ? "LEVEL COMPLETE" : "GAME OVER";
	ctx.textAlign = "center";
	ctx.font = "30pt Impact";
	ctx.fillStyle = "#FFFFFF";
	ctx.fillText(text, x+(width/2)+1, y+71);
	ctx.fillStyle = "#000000";
	ctx.fillText(text, x+(width/2), y+70);

	// If the game was won, draw the number of stars earned (empty for now).
	if (won){
		ctx.save();
		ctx.textAlign = "center";
		ctx.lineWidth = 1.5;
		ctx.font = "40pt FontAwesome"
		for (var i = 0; i < 3; i++){
			ctx.strokeText("\uF005", x+(0.3*width)+(i*0.2*width), y+148);
		}
		ctx.restore();
	}

	// Draw the retry and menu buttons.
	xOffset = won ? 75.5 : 45.5;
	yOffset = won ? 180.5 : 120.5;
	drawButton("RETRY", x+xOffset, y+yOffset, false, ctx);
	drawButton("MENU", x+xOffset+130, y+yOffset, false, ctx);
}

function drawButton(text, x, y, selected, ctx){
	// Draw a flat green box over whatever was here before.
	ctx.beginPath();
	ctx.fillStyle = "#184E32";
	ctx.fillRect(x-4, y-4, 88, 48);

	// Draw the retry or menu button.
	ctx.fillStyle = selected ? "#7D9C8D" : "#5D8370";
	ctx.lineWidth = selected ? 3 : 1;
	ctx.rect(Math.floor(x)+0.5, Math.floor(y)+0.5, 80, 40);
	ctx.fill();
	ctx.stroke();
	ctx.fillStyle = "#000000";
	ctx.font = "20pt Impact";
	ctx.fillText(text, x+40, y+30);
	ctx.closePath();
}

function handleEndScreenMouseMove(){
	mousex = event.clientX-8;
	mousey = event.clientY-8;

	var newBtn = getSelectedButton();
	if (newBtn != selectedButton){
		var btnX = (newBtn == "RETRY" || selectedButton == "RETRY") ? (cvs1.width/2)-105 : (cvs1.width/2)+25,
			btnY = won ? (cvs1.height/2)+50 : (cvs1.height/2)+20,
			text = (newBtn == null) ? selectedButton : newBtn;
		drawButton(text, btnX, btnY, (newBtn != null), ctx1);
		selectedButton = newBtn;
	}
}

function handleEndScreenMouseDown(){
	if (selectedButton != null){
		if (won){
			if (selectedLevel < levels.length-1){
				levels[selectedLevel+1].unlocked = true;
			}
			if (levels[selectedLevel].starsGained < starsGained){
				levels[selectedLevel].starsGained = starsGained;
			}
		}

		resetGameState();

		if (selectedButton == "RETRY"){
			selectedButton = null;
			cvs2.onmousedown = undefined;
			cvs2.onmousemove = undefined;
			if (selectedLevel == 0){
				startTutorial();
			} else {
				startLevel(selectedLevel);
			}
		} else {
			selectedButton = null;
			selectedLevel = -1;
			cvs2.onmousedown = handleMenuMouseDown;
			cvs2.onmousemove = handleMenuMouseMove;
			drawMenu();
		}
	}
}

function getSelectedButton(){
	var btnX = (cvs1.width/2)-114;
		btnY = won ? (cvs1.height/2)+50 : (cvs1.height/2)+20;

	for (var i = 0; i < 2; i++){
		btnX += (i * 130);
		if ((mousex > btnX) && (mousex < btnX+80) && (mousey > btnY) && (mousey < btnY+40)){
			return (i == 0) ? "RETRY" : "MENU";
		}
	}
	return null;
}
var tutDialogues = [
	{
		idx : 0,
		topText : "Welcome to Logic Training! This tutorial will teach you what logic gates are and how to play the game.",
		botText : "This is an empty circuit. The lines either side of the box are wires, each of which has a voltage. The blue wires have voltage 1, and the black wires have voltage 0.",
		drawDiagram : function(x, y){
			drawSignal(x+2, y+SC+9, 0, ctx1);
			drawSignal(x+2, y+(3*SC)+9, 1, ctx1);
			drawDottedBox(x+(2*SC), y, ctx1);
			drawWire(x+14, y+SC, x+(2*SC), y+SC, 0, ctx1);
			drawWire(x+14, y+(3*SC), x+(2*SC), y+(3*SC), 1, ctx1);
			drawWire(x+(6*SC), y+(2*SC), x+(8*SC), y+(2*SC), -1, ctx1);
		},
		getDiagramWidth : function () { return (8*SC); },
		getDiagramHeight : function () { return (4*SC); }
	},
	{
		idx : 1,
		topText : "So we have two 0 or 1 inputs. To get an output, complete the circuit by dragging a logic gate from the top of the screen into the empty box.",
		botText : "This is what a circuit with a logic gate in looks like. The output will be either 0 or 1, depending on what the inputs are, and which logic gate we used.",
		drawDiagram : function(x, y){
			drawSignal(x+2, y+SC+9, 0, ctx1);
			drawSignal(x+2, y+(3*SC)+9, 1, ctx1);
			drawDottedBox(x+(2*SC), y, ctx1);
			drawWire(x+14, y+SC, x+(2*SC), y+SC, 0, ctx1);
			drawWire(x+14, y+(3*SC), x+(2*SC), y+(3*SC), 1, ctx1);
			drawOR(x+(2*SC), y, 0, 1, 1, ctx1);
			drawWire(x+(6*SC), y+(2*SC), x+(8*SC), y+(2*SC), 1, ctx1);
		},
		getDiagramWidth : function () { return (8*SC); },
		getDiagramHeight : function () { return (4*SC); }
	},
	{
		idx : 2,
		topText : "This circuit has a lightbulb at the end of it. To turn the lightbulb on, the wire leading into it must be a 1.",
		botText : "In each level, circuits will slide across the screen to the left. You need to light the bulbs before they reach the edge of the screen, or else it's game over! Do this by dragging gates into the circuits. Lets give it a go.",
		drawDiagram : function(x, y){
			drawSignal(x+2, y+SC+9, 0, ctx1);
			drawSignal(x+2, y+(3*SC)+9, 1, ctx1);
			drawDottedBox(x+(2*SC), y, ctx1);
			drawWire(x+14, y+SC, x+(2*SC), y+SC, 0, ctx1);
			drawWire(x+14, y+(3*SC), x+(2*SC), y+(3*SC), 1, ctx1);
			drawOR(x+(2*SC), y, 0, 1, 1, ctx1);
			drawWire(x+(6*SC), y+(2*SC), x+(10*SC), y+(2*SC), 1, ctx1);
			drawFixedBox(x+(10*SC), y, ctx1);
			drawBulb(x+(10*SC), y, 1, ctx1);
		},
		getDiagramWidth : function () { return (14*SC); },
		getDiagramHeight : function () { return (4*SC); }
	},
	{
		idx : 3,
		text : "Drag this gate into the circuit!"
	},
	{
		idx : 4,
		topText : "Nice one! Sometimes the circuits will have fixed gates in them. These gates can't be changed.",
		botText : "You'll have to decide what output you want the gate to have, and figure out what the inputs should be in order to get that output!",
		drawDiagram : function(x, y){
			drawSignal(x+2, y+SC+9, 0, ctx1);
			drawWire(x+14, y+SC, x+(2*SC), y+SC, 0, ctx1);
			drawSignal(x+2, y+(3*SC)+9, 1, ctx1);
			drawWire(x+14, y+(3*SC), x+(2*SC), y+(3*SC), 1, ctx1);
			drawDottedBox(x+(2*SC), y, ctx1);
			drawWire(x+(6*SC), y+(2*SC), x+(7.2*SC), y+(2*SC), -1, ctx1);
			drawWire(x+(7.2*SC), y+(2*SC), x+(7.2*SC), y+(1*SC), -1, ctx1);
			drawWire(x+(7.2*SC), y+(1*SC), x+(10*SC), y+(1*SC), -1, ctx1);
			drawSignal(x+(8*SC), y+(3*SC)+9, 1, ctx1);
			drawWire(x+(8*SC)+12, y+(3*SC), x+(10*SC), y+(3*SC), 1, ctx1);
			drawFixedBox(x+(10*SC), y, ctx1);
			drawAND(x+(10*SC), y, -1, 1, -1, ctx1);
			drawWire(x+(14*SC), y+(2*SC), x+(18*SC), y+(2*SC), -1, ctx1);
			drawFixedBox(x+(18*SC), y, ctx1);
			drawBulb(x+(18*SC), y, -1, ctx1);
		},
		getDiagramWidth : function () { return (22*SC); },
		getDiagramHeight : function () { return (4*SC); }
	},
	{
		idx : 5,
		topText : "Some circuits end in a star rather than a lightbulb. Lighting a star works the same way as lighting a bulb, we just make the input wire a 1.",
		botText : "Each level has 2 star circuits. You won't lose if you don't complete these, but you'll earn a star for that level if you do. They're a bit quicker than the other circuits though, so you'll have to be fast!",
		drawDiagram : function(x, y){
			drawSignal(x+2, y+SC+9, 0, ctx1);
			drawSignal(x+2, y+(3*SC)+9, 1, ctx1);
			drawDottedBox(x+(2*SC), y, ctx1);
			drawWire(x+14, y+SC, x+(2*SC), y+SC, 0, ctx1);
			drawWire(x+14, y+(3*SC), x+(2*SC), y+(3*SC), 1, ctx1);
			drawOR(x+(2*SC), y, 0, 1, 1, ctx1);
			drawWire(x+(6*SC), y+(2*SC), x+(10*SC), y+(2*SC), 1, ctx1);
			drawFixedBox(x+(10*SC), y, ctx1);
			ctx1.textAlign = "left";
			drawStar(x+(10*SC), y, 1, ctx1);
		},
		getDiagramWidth : function () { return (14*SC); },
		getDiagramHeight : function () { return (4*SC); }
	},
	{
		idx : 6,
		text : "One more thing. Each level has a third star, which you get for completing the level in the minimum number of moves. This means completing every circuit first try! You can see the number of moves you've made (and the par for the level) at the bottom of the screen."
	},
	{
		idx : 7,
		text : "Thats it for the tutorial. You're now ready for level 1, where you'll learn about the AND and NAND gates!"
	}
]

function startTutorial(){
	startLevel(0);
	pause = true;
	displayTutorialDialogue(0);
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight, noPrint) {
	var words = text.split(" "),
		line = "",
		lineCount = 1;


	for (var i = 0; i < words.length; i++) {
		var testLine = line + words[i] + " ",
			metrics = ctx.measureText(testLine),
			testWidth = metrics.width;
		if (testWidth > maxWidth && i > 0) {
		  	if (!noPrint) { ctx.fillText(line, x, y); }
		  	line = words[i] + " ";
		  	y += lineHeight;
			lineCount++;
		}
		else {
	  		line = testLine;
		}
	}
	if (!noPrint) { ctx.fillText(line, x, y); }
	return lineCount * lineHeight;
}

function displayTutorialDialogue(dlgIdx){
	var dlg = tutDialogues[dlgIdx];

	// Calculate the height the dialogue box should be.
	var topTextHeight, botTextHeight, textHeight, boxHeight,
		boxWidth = (dlg.getDiagramWidth == undefined) ? 500 : Math.max(dlg.getDiagramWidth() + 80, 500);
	ctx1.font = "14pt Arial";
	if (dlg.text == undefined){
		topTextHeight = wrapText(ctx1, dlg.topText, 0, 0, (0.95*boxWidth), 24, true);
		botTextHeight = wrapText(ctx1, dlg.botText, 0, 0, (0.95*boxWidth), 24, true);
		boxHeight = 15 + topTextHeight + 35 + dlg.getDiagramHeight() + 25 + botTextHeight + 68;
	} else {
		textHeight = wrapText(ctx1, dlg.text, 0, 0, 480, 24, true);
		boxHeight = 15 + textHeight + 58;
	}

	var startx = Math.round((cvs1.width/2) - (boxWidth/2)),
		starty = Math.round((cvs1.height/2) - (boxHeight/2));

	// Draw the rectangle.
	ctx1.beginPath();
	ctx1.lineWidth = 1;
	ctx1.fillStyle = "#2a8958";
	ctx1.rect(startx+0.5, starty+0.5, boxWidth, boxHeight);
	ctx1.fill();
	ctx1.stroke();
	ctx1.closePath();

	// Write the tutorial messages.
	ctx1.font = "14pt Arial";
	ctx1.fillStyle = "#000000";
	ctx1.textAlign = "center";
	if (dlg.text == undefined){
		wrapText(ctx1, dlg.topText, cvs1.width/2, starty+39, 0.95*boxWidth, 24);
		wrapText(ctx1, dlg.botText, cvs1.width/2, starty+30+topTextHeight+35+dlg.getDiagramHeight()+25+24, 0.95*boxWidth, 24);
	} else {
		wrapText(ctx1, dlg.text, cvs1.width/2, starty+39, 0.95*boxWidth, 24);
	}

	// Draw the diagram if there is one.
	if (dlg.drawDiagram != undefined){
		var dgrmX = Math.round(startx+(boxWidth/2)-(dlg.getDiagramWidth()/2)),
			dgrmY = Math.round(starty+20+topTextHeight+35+4);
		ctx1.clearRect(dgrmX-20, dgrmY-20, dlg.getDiagramWidth()+40, dlg.getDiagramHeight()+40);
		ctx1.strokeStyle = "#000000";
		ctx1.lineWidth = 1;
		ctx1.strokeRect(dgrmX-20.5, dgrmY-20.5, dlg.getDiagramWidth()+40, dlg.getDiagramHeight()+40);
		dlg.drawDiagram(dgrmX, dgrmY);
	}

	// Draw the continue button.
	var highlight = false,
		btnX = startx+boxWidth-104,
		btnY = starty+boxHeight-34;
	ctx1.font = "18pt Impact";
	ctx1.textAlign = "left";
	ctx1.fillStyle = "rgba(0, 0, 0, 0.6)";
	ctx1.fillText("CONTINUE", btnX, btnY+20);

	// The interval to control highlighting the continue button when the mouse hovers over it.
	var btnHoverIntervalId = setInterval(function(){
		// Clear this interval if we go back to the menu.
		if (selectedLevel == -1){
			clearInterval(btnHoverIntervalId);
			btnHoverIntervalId = undefined;
		}

		// If the mouse is over the button, and it isn't already highlighted.
		if ((mousex > btnX-4 && mousex < btnX+98  && mousey > btnY-2 && mousey < btnY+24) && !highlight){
			highlight = true;
			ctx1.fillStyle="#2a8958";
			ctx1.fillRect(btnX, btnY-2, 94, 24);
			ctx1.fillStyle = "rgba(0, 0, 0, 1)";
			ctx1.font = "18pt Impact";
			ctx1.fillText("CONTINUE", btnX, btnY+20);
			// If the mouse is hovering over the button, change the mousedown handler to go to the next message.
			cvs2.onmousedown = function(){
				ctx1.clearRect(startx-3, starty-3, boxWidth+6, boxHeight+6);
				clearInterval(btnHoverIntervalId);
				btnHoverIntervalId = undefined;
				if (dlgIdx+1 < tutDialogues.length){
					cvs2.onmousedown = handleMouseDown;
					if (dlgIdx+1 != 3){
						displayTutorialDialogue(dlgIdx+1);
					} else {
						startTestCircuit();
					}
				} else {
					// End the tutorial
					clearIntervals();
					resetGameState();
					selectedLevel = -1;
					levels[1].unlocked = true;
					drawMenu();
				}
			}
		}
		// If the mouse isn't over the button, but it is still highlighted.
		else if (!(mousex > btnX-4 && mousex < btnX+98  && mousey > btnY-2 && mousey < btnY+24) && highlight){
			highlight = false;
			ctx1.fillStyle="#2a8958";
			ctx1.fillRect(btnX, btnY-2, 94, 24);
			ctx1.fillStyle = "rgba(0, 0, 0, 0.6)";
			ctx1.font = "18pt Impact";
			ctx1.fillText("CONTINUE", btnX, btnY+20);
			cvs2.onmousedown = handleMouseDown;
		}
	}, 50);

	ctx1.textAlign = "left";
}

// Scroll a single test circuit across the screen, and show prompts for the player.
function startTestCircuit(){
	dlg = tutDialogues[3];
	// Calculate where the dialogue box should be.
	ctx1.font = "14pt Arial";
	textWidth = ctx1.measureText(dlg.text).width;
	boxWidth = textWidth + 40;
	var startx = Math.floor((cvs1.width/2) - (2.5*SC) - (boxWidth/2)),
		starty = Math.floor((6*SC) + 40);

	// Draw the dialogue box.
	ctx1.beginPath();
	ctx1.lineWidth = 1;
	ctx1.fillStyle = "#2a8958";
	ctx1.rect(startx+0.5, starty+0.5, boxWidth, 34);
	ctx1.fill();
	ctx1.stroke();
	ctx1.closePath();

	// Draw the text in the dialogue box.
	ctx1.fillStyle = "#000000";
	ctx1.textAlign = "left";
	ctx1.fillText(dlg.text, startx + 20, starty + 24);

	// Draw an arrow pointing to the OR gate in the menu bar.
	var x = Math.floor((cvs1.width/2) - (2.5*SC))+0.5,
		y = Math.floor(5.3*SC)+0.5;
	ctx1.fillStyle = "#ff0000";
	ctx1.beginPath();
	ctx1.moveTo(x, y);
	ctx1.lineTo(x-20, y+20);
	ctx1.lineTo(x-8, y+20);
	ctx1.lineTo(x-8, Math.floor(5.6*SC)+40.5);
	ctx1.lineTo(x+8, Math.floor(5.6*SC)+40.5);
	ctx1.lineTo(x+8, y+20);
	ctx1.lineTo(x+20, y+20);
	ctx1.lineTo(x,y);
	ctx1.fill();
	ctx1.stroke();

	// Start moving the circuit
	var gameAreaHeight = cvs1.height - (6*SC) - 60;
	circuits[0].starty = Math.round((0.5*gameAreaHeight)-(4*SC));
	pause = false;
}

// Function to be called when the test circuit is complete - calls the next dialogue rather than ending the level.
function handleTestCircuit(){
	ctx1.clearRect((cvs1.width/2)-200, 6*SC, 400, 100);
	drawMenuBar();
	displayTutorialDialogue(4);
}

// Displays dialogues to introduce and explain any of the 3 gate pairs.
function introduceGates(gate){
	// The explanations of the different gates.
	var gateExplanations = [,
		"The AND gate only outputs 1 if both of the inputs are 1. If any of the inputs are 0, the output is 0.",
		"The NAND gate does the exact opposite of the AND gate. If any of the inputs are 0, the output is 1.",
		"The OR gate outputs 1 if either of the inputs are 1. It only outputs 0 if both inputs are 0.",
		"The NOR gate does the exact opposite of the OR gate. It only outputs 1 if both inputs are 0.",
		"The XOR gate only outputs 1 if both the inputs are different. If they are both 0 or both 1, the output is 0.",
		"The XNOR gate does the exact opposite of the XOR gate. It outputs 1 if both inputs are the same.",
		"This level adds a new mechanic: Gate changes. The gates you are allowed to use will periodically change, so you'll have to adapt to use what you've got. Good luck!"
	];

	// Calculate box size and position.
	ctx1.font = "14pt Arial";
	var width = (gate != 7) ? 500 : 550,
		textHeight = wrapText(ctx1, gateExplanations[gate], 500, 500, 0.9*width, 26, true),
		height = (gate != 7) ? 346+textHeight : 146+textHeight,
		startx = Math.round((cvs1.width/2)-(width/2)),
		starty = Math.round((cvs1.height/2)-(height/2));

	// Draw the rectangle.
	ctx1.fillStyle = "#2a8958";
	ctx1.lineWidth = 2;
	ctx1.fillRect(startx, starty, width, height);
	ctx1.strokeRect(startx, starty, width, height);

	// Draw the title.
	var name = Object.keys(gatesEnum)[gate].toUpperCase(),
		text = (gate != 7) ? "New gate: " + name : "New mechanic: GATE CHANGES";
	ctx1.font = "30pt Impact";
	ctx1.textAlign = "center";
	ctx1.fillStyle = "#FFFFFF";
	ctx1.fillText(text, (cvs1.width/2)+1, starty+63);
	ctx1.fillStyle = "#000000";
	ctx1.fillText(text, (cvs1.width/2), starty+62);

	if (gate != 7){
		// Draw the gate icon.
		var iconx = Math.round(startx + 100) + 0.5,
			icony = Math.round(starty + 130) + 0.5;
		ctx1.lineWidth = 1;
		ctx1.clearRect(iconx, icony, 4*SC, 4*SC);
		ctx1.strokeRect(iconx, icony, 4*SC, 4*SC);
		drawGate(iconx, icony, gate, [{val:0}, {val:0}], 0, -1, ctx1);
		ctx1.font = "12pt Arial";
		ctx1.fillStyle = "#000000";
		ctx1.fillText("Icon", iconx+(2*SC), icony+(4*SC)+22);

		// Draw the truth table
		var tablex =  Math.round(startx + width - 260)+0.5,
			tabley = Math.round(starty + 130 + (2*SC) - 73)+0.5;
		drawTruthTable(tablex, tabley, gate);
		ctx1.font = "12pt Arial";
		ctx1.fillText("Truth Table", tablex+80, tabley+168);
	}

	// Write the explanation of how the gate works.
	ctx1.font = "14pt Arial";
	ctx1.fillStyle = "#000000";
	ctx1.textAlign = "center";
	wrapText(ctx1, gateExplanations[gate], cvs1.width/2, starty+height-textHeight-36, 0.9*width, 26)

	// Draw the continue button.
	var highlight = false,
		btnX = startx+width-106,
		btnY = starty+height-34;
	ctx1.font = "18pt Impact";
	ctx1.textAlign = "left";
	ctx1.fillStyle = "rgba(0, 0, 0, 0.6)";
	ctx1.fillText("CONTINUE", btnX, btnY+20);

	// The interval to control highlighting the continue button when the mouse hovers over it.
	var btnHoverIntervalId = setInterval(function(){
		// Clear this interval if we go back to the menu.
		if (selectedLevel == -1){
			clearInterval(btnHoverIntervalId);
			btnHoverIntervalId = undefined;
		}

		// If the mouse is over the button, and it isn't already highlighted.
		if ((mousex > btnX-4 && mousex < btnX+98  && mousey > btnY-2 && mousey < btnY+24) && !highlight){
			highlight = true;
			ctx1.fillStyle="#2a8958";
			ctx1.fillRect(btnX, btnY-2, 94, 24);
			ctx1.fillStyle = "rgba(0, 0, 0, 1)";
			ctx1.font = "18pt Impact";
			ctx1.fillText("CONTINUE", btnX, btnY+20);
			// If the mouse is hovering over the button, change the mousedown handler to go to the next message.
			cvs2.onmousedown = function(){
				ctx1.clearRect(startx-3, starty-3, width+6, height+6);
				clearInterval(btnHoverIntervalId);
				btnHoverIntervalId = undefined;
				// Display the next gate introduction, or start the game
				if (gate % 2 == 1 && gate != 7){
					introduceGates(gate+1);
				} else {
					cvs2.onmousedown = handleMouseDown;
					pause = false;
					if (gate == 7){
						gateChangeIntervalId = setInterval(changeLockedGates, 20000);
					}
				}
			}
		}
		// If the mouse isn't over the button, but it is still highlighted.
		else if (!(mousex > btnX-4 && mousex < btnX+98  && mousey > btnY-2 && mousey < btnY+24) && highlight){
			highlight = false;
			ctx1.fillStyle="#2a8958";
			ctx1.fillRect(btnX, btnY-2, 94, 24);
			ctx1.fillStyle = "rgba(0, 0, 0, 0.6)";
			ctx1.font = "18pt Impact";
			ctx1.fillText("CONTINUE", btnX, btnY+20);
			cvs2.onmousedown = handleMouseDown;
		}
	}, 50);
}

function drawTruthTable(x, y, gate){
	// Clear a rectangle.
	ctx1.lineWidth = 1;
	ctx1.clearRect(x, y, 160, 146);
	ctx1.strokeRect(x, y, 160, 146);

	// Draw the separating lines.
	ctx1.beginPath();
	ctx1.moveTo(x, y+30);
	ctx1.lineTo(x+160, y+30);
	ctx1.moveTo(x+80, y);
	ctx1.lineTo(x+80, y+146);
	ctx1.stroke();
	ctx1.closePath();

	// Draw the inputs and outputs text.
	ctx1.font = "14pt Arial";
	ctx1.textAlign = "center";
	ctx1.fillStyle = "#000000";
	ctx1.fillText("Inputs", x+40, y+22);
	ctx1.fillText("Output", x+120, y+22);

	// Fill in the inputs.
	ctx1.fillText("1     1", x+40, y+54);
	ctx1.fillText("1     0", x+40, y+81);
	ctx1.fillText("0     1", x+40, y+108);
	ctx1.fillText("0     0", x+40, y+135);

	// Fill in the outputs.
	var output1 = (gate == gatesEnum.and || gate == gatesEnum.or || gate == gatesEnum.xnor) ? 1 : 0,
		output2 = (gate == gatesEnum.or || gate == gatesEnum.nand || gate == gatesEnum.xor) ? 1 : 0,
		output3 = (gate == gatesEnum.nand || gate == gatesEnum.nor || gate == gatesEnum.xnor) ? 1 : 0;
	ctx1.fillText(output1, x+120, y+54);
	ctx1.fillText(output2, x+120, y+81);
	ctx1.fillText(output2, x+120, y+108);
	ctx1.fillText(output3, x+120, y+135);
}

function introduceGateChanges(){

}
// Contains all the information about the levels: Whether it is unlocked or not; how many stars have been earned for that level; which gates are allowed; whether gate changes are enabled; whether the level introduces new gates; and most importantly, the layout of every circuit in each level.
var levels = [
	//#region Level 0 - Tutorial
	{
		unlocked : true,
		allowedGates : [3],
		newGates : false,
		enableGateChanges : false,
		circuits: [
			//#region Circuit 1 - Difficulty 1
			{
				gateSections : [
					[{
						inputs : [{
							type : "signal",
							val : 1
						}, {
							type : "signal",
							val : 1
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [0, 0],
						}],
						type : gatesEnum.bulb,
						fixed : true,
						nextGates : []
					}]
				]
			}
			//#endregion
		]
	},
	//#endregion

	//#region Level 1 - AND/NAND, Easy
	{
		unlocked : true, //Change me back!
		starsGained : 0,
		allowedGates : [1, 2],
		newGates : true,
		enableGateChanges : false,
		circuits : [
			//#region Circuit 1 - 1 Gate
			{
				gateSections : [
					[{
						inputs : [{
							type : "signal",
							val : 1
						}, {
							type : "signal",
							val : 1
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [0, 0],
						}],
						type : gatesEnum.bulb,
						fixed : true,
						nextGates : []
					}]
				]
			},
			//#endregion
			//#region Circuit 2 - 1 Gate
			{
				gateSections : [
					[{
						inputs : [{
							type : "signal",
							val : 0
						}, {
							type : "signal",
							val : 0
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [0, 0],
						}],
						type : gatesEnum.bulb,
						fixed : true,
						nextGates : []
					}]
				]
			},
			//#endregion
			//#region Circuit 3 - 1 Gate
			{
				gateSections : [
					[{
						inputs : [{
							type : "signal",
							val : 0
						}, {
							type : "signal",
							val : 1
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [0, 0],
						}],
						type : gatesEnum.bulb,
						fixed : true,
						nextGates : []
					}]
				]
			},
			//#endregion
			//#region Circuit 4 - 1 Gate, Star
			{
				gateSections : [
					[{
						inputs : [{
							type : "signal",
							val : 1
						}, {
							type : "signal",
							val : 1
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [0, 0],
						}],
						type : gatesEnum.star,
						fixed : true,
						nextGates : []
					}]
				]
			},
			//#endregion
			//#region Circuit 5 - 2 Gates
			{
				gateSections : [
					[{
						inputs : [{
							type : "signal",
							val : 0
						}, {
							type : "signal",
							val : 0
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [0, 0],
						}, {
							type : "signal",
							val : 1
						}],
						type : gatesEnum.and,
						fixed : true,
						nextGates : [{
							gateIdx : [2, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [1, 0],
						}],
						type : gatesEnum.bulb,
						fixed : true,
						nextGates : []
					}]
				]
			},
			//#endregion
			//#region Circuit 6 - 2 Gates
			{
				gateSections : [
					[{
						inputs : [{
							type : "signal",
							val : 1
						}, {
							type : "signal",
							val : 1
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [0, 0],
						}, {
							type : "signal",
							val : 0
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [2, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [1, 0],
						}],
						type : gatesEnum.bulb,
						fixed : true,
						nextGates : []
					}]
				]
			},
			//#endregion
			//#region Circuit 7 - 1 Gate
			{
				gateSections : [
					[{
						inputs : [{
							type : "signal",
							val : 0
						}, {
							type : "signal",
							val : 0
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [0, 0],
						}],
						type : gatesEnum.bulb,
						fixed : true,
						nextGates : []
					}]
				]
			},
			//#endregion
			//#region Circuit 8 - 2 Gates, Star
			{
				gateSections : [
					[{
						inputs : [{
							type : "signal",
							val : 1
						}, {
							type : "signal",
							val : 0
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [0, 0],
						}, {
							type : "signal",
							val : 1
						}],
						type : gatesEnum.and,
						fixed : true,
						nextGates : [{
							gateIdx : [2, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [1, 0],
						}],
						type : gatesEnum.star,
						fixed : true,
						nextGates : []
					}]
				]
			},
			//#endregion
			//#region Circuit 9 - 1 Gate
			{
				gateSections : [
					[{
						inputs : [{
							type : "signal",
							val : 1
						}, {
							type : "signal",
							val : 0
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [0, 0],
						}],
						type : gatesEnum.bulb,
						fixed : true,
						nextGates : []
					}]
				]
			},
			//#endregion
			//#region Circuit 10 - 2 Gates
			{
				gateSections : [
					[{
						inputs : [{
							type : "signal",
							val : 1
						}, {
							type : "signal",
							val : 0
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [0, 0],
						}, {
							type : "signal",
							val : 1
						}],
						type : gatesEnum.nand,
						fixed : true,
						nextGates : [{
							gateIdx : [2, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [1, 0],
						}],
						type : gatesEnum.bulb,
						fixed : true,
						nextGates : []
					}]
				]
			},
			//#endregion
		]
	},
	//#endregion

	//#region Level 2 - AND/NAND, Medium
	{
		unlocked : true, //Change me back!
		starsGained : 0,
		allowedGates : [1, 2],
		newGates : false,
		enableGateChanges : false,
		circuits : [
			//#region Circuit 1 - 2 Gates
			{
				gateSections : [
					[{
						inputs : [{
							type : "signal",
							val : 0
						}, {
							type : "signal",
							val : 0
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [0, 0],
						}, {
							type : "signal",
							val : 1
						}],
						type : gatesEnum.and,
						fixed : true,
						nextGates : [{
							gateIdx : [2, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [1, 0],
						}],
						type : gatesEnum.bulb,
						fixed : true,
						nextGates : []
					}]
				]
			},
			//#endregion
			//#region Circuit 2 - 3 Gates
			{
				gateSections : [
					[{
						inputs : [{
							type : "signal",
							val : 1
						}, {
							type : "signal",
							val : 1
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [0]
						}]
					}, {
						inputs : [{
							type : "signal",
							val : 0
						}, {
							type : "signal",
							val : 0
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [1]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [0, 0],
						}, {
							type : "gate",
							gate : [0, 1],
						}],
						type : gatesEnum.and,
						fixed : true,
						nextGates : [{
							gateIdx : [2, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [1, 0],
						}],
						type : gatesEnum.bulb,
						fixed : true,
						nextGates : []
					}]
				]
			},
			//#endregion
			//#region Circuit 3 - 2 Gates
			{
				gateSections : [
					[{
						inputs : [{
							type : "signal",
							val : 1
						}, {
							type : "signal",
							val : 1
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [0, 0],
						}, {
							type : "signal",
							val : 0
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [2, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [1, 0],
						}],
						type : gatesEnum.bulb,
						fixed : true,
						nextGates : []
					}]
				]
			},
			//#endregion
			//#region Circuit 4 - 1 Gate, Star
			{
				gateSections : [
					[{
						inputs : [{
							type : "signal",
							val : 1
						}, {
							type : "signal",
							val : 1
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [0, 0],
						}],
						type : gatesEnum.star,
						fixed : true,
						nextGates : []
					}]
				]
			},
			//#endregion
			//#region Circuit 5 - 3 Gates
			{
				gateSections : [
					[{
						inputs : [{
							type : "signal",
							val : 0
						}, {
							type : "signal",
							val : 1
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [0]
						}]
					}, {
						inputs : [{
							type : "signal",
							val : 0
						}, {
							type : "signal",
							val : 1
						}],
						type : gatesEnum.nand,
						fixed : true,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [1]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [0, 0],
						}, {
							type : "gate",
							gate : [0, 1],
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [2, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [1, 0],
						}],
						type : gatesEnum.bulb,
						fixed : true,
						nextGates : []
					}]
				]
			},
			//#endregion
			//#region Circuit 6 - 2 Gates
			{
				gateSections : [
					[{
						inputs : [{
							type : "signal",
							val : 1
						}, {
							type : "signal",
							val : 0
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [0, 0],
						}, {
							type : "signal",
							val : 1
						}],
						type : gatesEnum.and,
						fixed : true,
						nextGates : [{
							gateIdx : [2, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [1, 0],
						}],
						type : gatesEnum.bulb,
						fixed : true,
						nextGates : []
					}]
				]
			},
			//#endregion
			//#region Circuit 7 - 3 Gates
			{
				gateSections : [
					[{
						inputs : [{
							type : "signal",
							val : 0
						}, {
							type : "signal",
							val : 0
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [0]
						}]
					}, {
						inputs : [{
							type : "signal",
							val : 1
						}, {
							type : "signal",
							val : 0
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [1]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [0, 0],
						}, {
							type : "gate",
							gate : [0, 1],
						}],
						type : gatesEnum.nand,
						fixed : true,
						nextGates : [{
							gateIdx : [2, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [1, 0],
						}],
						type : gatesEnum.bulb,
						fixed : true,
						nextGates : []
					}]
				]
			},
			//#endregion
			//#region Circuit 8 - 2 Gates, Star
			{
				gateSections : [
					[{
						inputs : [{
							type : "signal",
							val : 1
						}, {
							type : "signal",
							val : 0
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [0, 0],
						}, {
							type : "signal",
							val : 1
						}],
						type : gatesEnum.nand,
						fixed : true,
						nextGates : [{
							gateIdx : [2, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [1, 0],
						}],
						type : gatesEnum.star,
						fixed : true,
						nextGates : []
					}]
				]
			},
			//#endregion
			//#region Circuit 9 - 3 Gates
			{
				gateSections : [
					[{
						inputs : [{
							type : "signal",
							val : 1
						}, {
							type : "signal",
							val : 1
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [0]
						}]
					}, {
						inputs : [{
							type : "signal",
							val : 1
						}, {
							type : "signal",
							val : 1
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [1]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [0, 0],
						}, {
							type : "gate",
							gate : [0, 1],
						}],
						type : gatesEnum.and,
						fixed : true,
						nextGates : [{
							gateIdx : [2, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [1, 0],
						}],
						type : gatesEnum.bulb,
						fixed : true,
						nextGates : []
					}]
				]
			},
			//#endregion
			//#region Circuit 10 - 4 Gates
			{
				gateSections : [
					[{
						inputs : [{
							type : "signal",
							val : 0
						}, {
							type : "signal",
							val : 1
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [1]
						}, {
							gateIdx : [1, 1],
							inputs : [0]
						}]
					}],
					[{
						inputs : [{
							type : "signal",
							val : 1
						}, {
							type : "gate",
							gate : [0, 1]
						}],
						type : gatesEnum.nand,
						fixed : true,
						nextGates : [{
							gateIdx : [2, 0],
							inputs : [0]
						}]
					}, {
						inputs : [{
							type : "gate",
							gate : [0, 0]
						}, {
							type : "signal",
							val : 0
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [2, 0],
							inputs : [1]
						}]
					}],
					[{
						inputs : [{
							type : "gate",
							gate : [1, 0]
						}, {
							type : "gate",
							gate : [1, 1]
						}],
						type : gatesEnum.and,
						fixed : true,
						nextGates : [{
							gateIdx : [3, 0],
							inputs : [0]
						}]
					}],
					[{
						inputs : [{
							type : "gate",
							gate : [2, 0]
						}],
						type : gatesEnum.bulb,
						fixed : true,
						nextGates : []
					}]
				]
			}
			//#endregion
		]
	},
	//#endregion

	//#region Level 3 - OR/NOR, Easy
	{
		unlocked : true, //Change me back!
		starsGained : 0,
		allowedGates : [3,4],
		newGates : true,
		enableGateChanges : false,
		circuits : [
			//#region Circuit 1 - 1 Gate
			{
				gateSections : [
					[{
						inputs : [{
							type : "signal",
							val : 0
						}, {
							type : "signal",
							val : 1
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [0, 0],
						}],
						type : gatesEnum.bulb,
						fixed : true,
						nextGates : []
					}]
				]
			},
			//#endregion
			//#region Circuit 2 - 1 Gate
			{
				gateSections : [
					[{
						inputs : [{
							type : "signal",
							val : 0
						}, {
							type : "signal",
							val : 0
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [0, 0],
						}],
						type : gatesEnum.bulb,
						fixed : true,
						nextGates : []
					}]
				]
			},
			//#endregion
			//#region Circuit 3 - 1 Gate
			{
				gateSections : [
					[{
						inputs : [{
							type : "signal",
							val : 1
						}, {
							type : "signal",
							val : 1
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [0, 0],
						}],
						type : gatesEnum.bulb,
						fixed : true,
						nextGates : []
					}]
				]
			},
			//#endregion
			//#region Circuit 4 - 1 Gate, Star
			{
				gateSections : [
					[{
						inputs : [{
							type : "signal",
							val : 1
						}, {
							type : "signal",
							val : 0
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [0, 0],
						}],
						type : gatesEnum.star,
						fixed : true,
						nextGates : []
					}]
				]
			},
			//#endregion
			//#region Circuit 5 - 2 Gates
			{
				gateSections : [
					[{
						inputs : [{
							type : "signal",
							val : 0
						}, {
							type : "signal",
							val : 0
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [0, 0],
						}, {
							type : "signal",
							val : 0
						}],
						type : gatesEnum.or,
						fixed : true,
						nextGates : [{
							gateIdx : [2, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [1, 0],
						}],
						type : gatesEnum.bulb,
						fixed : true,
						nextGates : []
					}]
				]
			},
			//#endregion
			//#region Circuit 6 - 2 Gates
			{
				gateSections : [
					[{
						inputs : [{
							type : "signal",
							val : 1
						}, {
							type : "signal",
							val : 1
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [0, 0],
						}, {
							type : "signal",
							val : 0
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [2, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [1, 0],
						}],
						type : gatesEnum.bulb,
						fixed : true,
						nextGates : []
					}]
				]
			},
			//#endregion
			//#region Circuit 7 - 1 Gate
			{
				gateSections : [
					[{
						inputs : [{
							type : "signal",
							val : 0
						}, {
							type : "signal",
							val : 0
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [0, 0],
						}],
						type : gatesEnum.bulb,
						fixed : true,
						nextGates : []
					}]
				]
			},
			//#endregion
			//#region Circuit 8 - 2 Gates, Star
			{
				gateSections : [
					[{
						inputs : [{
							type : "signal",
							val : 0
						}, {
							type : "signal",
							val : 0
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [0, 0],
						}, {
							type : "signal",
							val : 0
						}],
						type : gatesEnum.nor,
						fixed : true,
						nextGates : [{
							gateIdx : [2, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [1, 0],
						}],
						type : gatesEnum.star,
						fixed : true,
						nextGates : []
					}]
				]
			},
			//#endregion
			//#region Circuit 9 - 1 Gate
			{
				gateSections : [
					[{
						inputs : [{
							type : "signal",
							val : 1
						}, {
							type : "signal",
							val : 1
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [0, 0],
						}],
						type : gatesEnum.bulb,
						fixed : true,
						nextGates : []
					}]
				]
			},
			//#endregion
			//#region Circuit 10 - 2 Gates
			{
				gateSections : [
					[{
						inputs : [{
							type : "signal",
							val : 1
						}, {
							type : "signal",
							val : 1
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [0, 0],
						}, {
							type : "signal",
							val : 0
						}],
						type : gatesEnum.nor,
						fixed : true,
						nextGates : [{
							gateIdx : [2, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [1, 0],
						}],
						type : gatesEnum.bulb,
						fixed : true,
						nextGates : []
					}]
				]
			},
			//#endregion
		]
	},
	//#endregion

	//#region Level 4 - OR/NOR, Medium
	{
		unlocked : true, //Change me back!
		starsGained : 0,
		allowedGates : [3,4],
		enableGateChanges : false,
		circuits : [
			//#region Circuit 1 - 2 Gates
			{
				gateSections : [
					[{
						inputs : [{
							type : "signal",
							val : 1
						}, {
							type : "signal",
							val : 0
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [0, 0],
						}, {
							type : "signal",
							val : 0
						}],
						type : gatesEnum.or,
						fixed : true,
						nextGates : [{
							gateIdx : [2, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [1, 0],
						}],
						type : gatesEnum.bulb,
						fixed : true,
						nextGates : []
					}]
				]
			},
			//#endregion
			//#region Circuit 2 - 3 Gates
			{
				gateSections : [
					[{
						inputs : [{
							type : "signal",
							val : 1
						}, {
							type : "signal",
							val : 1
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [0]
						}]
					}, {
						inputs : [{
							type : "signal",
							val : 0
						}, {
							type : "signal",
							val : 0
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [1]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [0, 0],
						}, {
							type : "gate",
							gate : [0, 1],
						}],
						type : gatesEnum.or,
						fixed : true,
						nextGates : [{
							gateIdx : [2, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [1, 0],
						}],
						type : gatesEnum.bulb,
						fixed : true,
						nextGates : []
					}]
				]
			},
			//#endregion
			//#region Circuit 3 - 2 Gates
			{
				gateSections : [
					[{
						inputs : [{
							type : "signal",
							val : 1
						}, {
							type : "signal",
							val : 1
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [0, 0],
						}, {
							type : "signal",
							val : 0
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [2, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [1, 0],
						}],
						type : gatesEnum.bulb,
						fixed : true,
						nextGates : []
					}]
				]
			},
			//#endregion
			//#region Circuit 4 - 1 Gate, Star
			{
				gateSections : [
					[{
						inputs : [{
							type : "signal",
							val : 1
						}, {
							type : "signal",
							val : 1
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [0, 0],
						}],
						type : gatesEnum.star,
						fixed : true,
						nextGates : []
					}]
				]
			},
			//#endregion
			//#region Circuit 5 - 3 Gates
			{
				gateSections : [
					[{
						inputs : [{
							type : "signal",
							val : 0
						}, {
							type : "signal",
							val : 1
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [0]
						}]
					}, {
						inputs : [{
							type : "signal",
							val : 0
						}, {
							type : "signal",
							val : 0
						}],
						type : gatesEnum.or,
						fixed : true,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [1]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [0, 0],
						}, {
							type : "gate",
							gate : [0, 1],
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [2, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [1, 0],
						}],
						type : gatesEnum.bulb,
						fixed : true,
						nextGates : []
					}]
				]
			},
			//#endregion
			//#region Circuit 6 - 2 Gates
			{
				gateSections : [
					[{
						inputs : [{
							type : "signal",
							val : 1
						}, {
							type : "signal",
							val : 0
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [0, 0],
						}, {
							type : "signal",
							val : 0
						}],
						type : gatesEnum.nor,
						fixed : true,
						nextGates : [{
							gateIdx : [2, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [1, 0],
						}],
						type : gatesEnum.bulb,
						fixed : true,
						nextGates : []
					}]
				]
			},
			//#endregion
			//#region Circuit 7 - 3 Gates
			{
				gateSections : [
					[{
						inputs : [{
							type : "signal",
							val : 0
						}, {
							type : "signal",
							val : 0
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [0]
						}]
					}, {
						inputs : [{
							type : "signal",
							val : 1
						}, {
							type : "signal",
							val : 0
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [1]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [0, 0],
						}, {
							type : "gate",
							gate : [0, 1],
						}],
						type : gatesEnum.nor,
						fixed : true,
						nextGates : [{
							gateIdx : [2, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [1, 0],
						}],
						type : gatesEnum.bulb,
						fixed : true,
						nextGates : []
					}]
				]
			},
			//#endregion
			//#region Circuit 8 - 2 Gates, Star
			{
				gateSections : [
					[{
						inputs : [{
							type : "signal",
							val : 1
						}, {
							type : "signal",
							val : 1
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [0, 0],
						}, {
							type : "signal",
							val : 0
						}],
						type : gatesEnum.nor,
						fixed : true,
						nextGates : [{
							gateIdx : [2, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [1, 0],
						}],
						type : gatesEnum.star,
						fixed : true,
						nextGates : []
					}]
				]
			},
			//#endregion
			//#region Circuit 9 - 3 Gates
			{
				gateSections : [
					[{
						inputs : [{
							type : "signal",
							val : 0
						}, {
							type : "signal",
							val : 1
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [0]
						}]
					}, {
						inputs : [{
							type : "signal",
							val : 0
						}, {
							type : "signal",
							val : 0
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [1]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [0, 0],
						}, {
							type : "gate",
							gate : [0, 1],
						}],
						type : gatesEnum.nor,
						fixed : true,
						nextGates : [{
							gateIdx : [2, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [1, 0],
						}],
						type : gatesEnum.bulb,
						fixed : true,
						nextGates : []
					}]
				]
			},
			//#endregion
			//#region Circuit 10 - 4 Gates
			{
				gateSections : [
					[{
						inputs : [{
							type : "signal",
							val : 0
						}, {
							type : "signal",
							val : 0
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [1]
						}, {
							gateIdx : [1, 1],
							inputs : [0]
						}]
					}],
					[{
						inputs : [{
							type : "signal",
							val : 0
						}, {
							type : "gate",
							gate : [0, 1]
						}],
						type : gatesEnum.or,
						fixed : true,
						nextGates : [{
							gateIdx : [2, 0],
							inputs : [0]
						}]
					}, {
						inputs : [{
							type : "gate",
							gate : [0, 0]
						}, {
							type : "signal",
							val : 1
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [2, 0],
							inputs : [1]
						}]
					}],
					[{
						inputs : [{
							type : "gate",
							gate : [1, 0]
						}, {
							type : "gate",
							gate : [1, 1]
						}],
						type : gatesEnum.nor,
						fixed : true,
						nextGates : [{
							gateIdx : [3, 0],
							inputs : [0]
						}]
					}],
					[{
						inputs : [{
							type : "gate",
							gate : [2, 0]
						}],
						type : gatesEnum.bulb,
						fixed : true,
						nextGates : []
					}]
				]
			}
			//#endregion
		]
	},
	//#endregion

	//#region Level 5 - XOR/XNOR, Easy
	{
		unlocked : true, //Change me back!
		starsGained : 0,
		allowedGates : [5,6],
		newGates : true,
		enableGateChanges : false,
		circuits : [
			//#region Circuit 1 - 1 Gate
			{
				gateSections : [
					[{
						inputs : [{
							type : "signal",
							val : 0
						}, {
							type : "signal",
							val : 1
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [0, 0],
						}],
						type : gatesEnum.bulb,
						fixed : true,
						nextGates : []
					}]
				]
			},
			//#endregion
			//#region Circuit 2 - 1 Gate
			{
				gateSections : [
					[{
						inputs : [{
							type : "signal",
							val : 0
						}, {
							type : "signal",
							val : 0
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [0, 0],
						}],
						type : gatesEnum.bulb,
						fixed : true,
						nextGates : []
					}]
				]
			},
			//#endregion
			//#region Circuit 3 - 1 Gate
			{
				gateSections : [
					[{
						inputs : [{
							type : "signal",
							val : 1
						}, {
							type : "signal",
							val : 1
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [0, 0],
						}],
						type : gatesEnum.bulb,
						fixed : true,
						nextGates : []
					}]
				]
			},
			//#endregion
			//#region Circuit 4 - 1 Gate, Star
			{
				gateSections : [
					[{
						inputs : [{
							type : "signal",
							val : 1
						}, {
							type : "signal",
							val : 0
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [0, 0],
						}],
						type : gatesEnum.star,
						fixed : true,
						nextGates : []
					}]
				]
			},
			//#endregion
			//#region Circuit 5 - 2 Gates
			{
				gateSections : [
					[{
						inputs : [{
							type : "signal",
							val : 0
						}, {
							type : "signal",
							val : 0
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [0, 0],
						}, {
							type : "signal",
							val : 0
						}],
						type : gatesEnum.xor,
						fixed : true,
						nextGates : [{
							gateIdx : [2, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [1, 0],
						}],
						type : gatesEnum.bulb,
						fixed : true,
						nextGates : []
					}]
				]
			},
			//#endregion
			//#region Circuit 6 - 2 Gates
			{
				gateSections : [
					[{
						inputs : [{
							type : "signal",
							val : 1
						}, {
							type : "signal",
							val : 1
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [0, 0],
						}, {
							type : "signal",
							val : 0
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [2, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [1, 0],
						}],
						type : gatesEnum.bulb,
						fixed : true,
						nextGates : []
					}]
				]
			},
			//#endregion
			//#region Circuit 7 - 1 Gate
			{
				gateSections : [
					[{
						inputs : [{
							type : "signal",
							val : 0
						}, {
							type : "signal",
							val : 0
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [0, 0],
						}],
						type : gatesEnum.bulb,
						fixed : true,
						nextGates : []
					}]
				]
			},
			//#endregion
			//#region Circuit 8 - 2 Gates, Star
			{
				gateSections : [
					[{
						inputs : [{
							type : "signal",
							val : 0
						}, {
							type : "signal",
							val : 0
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [0, 0],
						}, {
							type : "signal",
							val : 1
						}],
						type : gatesEnum.xnor,
						fixed : true,
						nextGates : [{
							gateIdx : [2, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [1, 0],
						}],
						type : gatesEnum.star,
						fixed : true,
						nextGates : []
					}]
				]
			},
			//#endregion
			//#region Circuit 9 - 1 Gate
			{
				gateSections : [
					[{
						inputs : [{
							type : "signal",
							val : 1
						}, {
							type : "signal",
							val : 0
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [0, 0],
						}],
						type : gatesEnum.bulb,
						fixed : true,
						nextGates : []
					}]
				]
			},
			//#endregion
			//#region Circuit 10 - 2 Gates
			{
				gateSections : [
					[{
						inputs : [{
							type : "signal",
							val : 1
						}, {
							type : "signal",
							val : 1
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [0, 0],
						}, {
							type : "signal",
							val : 1
						}],
						type : gatesEnum.xor,
						fixed : true,
						nextGates : [{
							gateIdx : [2, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [1, 0],
						}],
						type : gatesEnum.bulb,
						fixed : true,
						nextGates : []
					}]
				]
			},
			//#endregion
		]
	},
	//#endregion

	//#region Level 6 - XOR/XNOR, Medium
	{
		unlocked : true, //Change me back!
		starsGained : 0,
		allowedGates : [5,6],
		newGates : false,
		enableGateChanges : false,
		circuits : [
			//#region Circuit 1 - 2 Gates
			{
				gateSections : [
					[{
						inputs : [{
							type : "signal",
							val : 1
						}, {
							type : "signal",
							val : 0
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [0, 0],
						}, {
							type : "signal",
							val : 0
						}],
						type : gatesEnum.xor,
						fixed : true,
						nextGates : [{
							gateIdx : [2, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [1, 0],
						}],
						type : gatesEnum.bulb,
						fixed : true,
						nextGates : []
					}]
				]
			},
			//#endregion
			//#region Circuit 2 - 3 Gates
			{
				gateSections : [
					[{
						inputs : [{
							type : "signal",
							val : 1
						}, {
							type : "signal",
							val : 1
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [0]
						}]
					}, {
						inputs : [{
							type : "signal",
							val : 0
						}, {
							type : "signal",
							val : 0
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [1]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [0, 0],
						}, {
							type : "gate",
							gate : [0, 1],
						}],
						type : gatesEnum.xor,
						fixed : true,
						nextGates : [{
							gateIdx : [2, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [1, 0],
						}],
						type : gatesEnum.bulb,
						fixed : true,
						nextGates : []
					}]
				]
			},
			//#endregion
			//#region Circuit 3 - 2 Gates
			{
				gateSections : [
					[{
						inputs : [{
							type : "signal",
							val : 1
						}, {
							type : "signal",
							val : 1
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [0, 0],
						}, {
							type : "signal",
							val : 1
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [2, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [1, 0],
						}],
						type : gatesEnum.bulb,
						fixed : true,
						nextGates : []
					}]
				]
			},
			//#endregion
			//#region Circuit 4 - 1 Gate, Star
			{
				gateSections : [
					[{
						inputs : [{
							type : "signal",
							val : 1
						}, {
							type : "signal",
							val : 1
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [0, 0],
						}],
						type : gatesEnum.star,
						fixed : true,
						nextGates : []
					}]
				]
			},
			//#endregion
			//#region Circuit 5 - 3 Gates
			{
				gateSections : [
					[{
						inputs : [{
							type : "signal",
							val : 0
						}, {
							type : "signal",
							val : 1
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [0]
						}]
					}, {
						inputs : [{
							type : "signal",
							val : 0
						}, {
							type : "signal",
							val : 0
						}],
						type : gatesEnum.xnor,
						fixed : true,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [1]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [0, 0],
						}, {
							type : "gate",
							gate : [0, 1],
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [2, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [1, 0],
						}],
						type : gatesEnum.bulb,
						fixed : true,
						nextGates : []
					}]
				]
			},
			//#endregion
			//#region Circuit 6 - 2 Gates
			{
				gateSections : [
					[{
						inputs : [{
							type : "signal",
							val : 1
						}, {
							type : "signal",
							val : 0
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [0, 0],
						}, {
							type : "signal",
							val : 0
						}],
						type : gatesEnum.xnor,
						fixed : true,
						nextGates : [{
							gateIdx : [2, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [1, 0],
						}],
						type : gatesEnum.bulb,
						fixed : true,
						nextGates : []
					}]
				]
			},
			//#endregion
			//#region Circuit 7 - 3 Gates
			{
				gateSections : [
					[{
						inputs : [{
							type : "signal",
							val : 0
						}, {
							type : "signal",
							val : 0
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [0]
						}]
					}, {
						inputs : [{
							type : "signal",
							val : 1
						}, {
							type : "signal",
							val : 0
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [1]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [0, 0],
						}, {
							type : "gate",
							gate : [0, 1],
						}],
						type : gatesEnum.xnor,
						fixed : true,
						nextGates : [{
							gateIdx : [2, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [1, 0],
						}],
						type : gatesEnum.bulb,
						fixed : true,
						nextGates : []
					}]
				]
			},
			//#endregion
			//#region Circuit 8 - 2 Gates, Star
			{
				gateSections : [
					[{
						inputs : [{
							type : "signal",
							val : 0
						}, {
							type : "signal",
							val : 0
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [0, 0],
						}, {
							type : "signal",
							val : 0
						}],
						type : gatesEnum.xor,
						fixed : true,
						nextGates : [{
							gateIdx : [2, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [1, 0],
						}],
						type : gatesEnum.star,
						fixed : true,
						nextGates : []
					}]
				]
			},
			//#endregion
			//#region Circuit 9 - 3 Gates
			{
				gateSections : [
					[{
						inputs : [{
							type : "signal",
							val : 0
						}, {
							type : "signal",
							val : 1
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [0]
						}]
					}, {
						inputs : [{
							type : "signal",
							val : 1
						}, {
							type : "signal",
							val : 0
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [1]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [0, 0],
						}, {
							type : "gate",
							gate : [0, 1],
						}],
						type : gatesEnum.xor,
						fixed : true,
						nextGates : [{
							gateIdx : [2, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [1, 0],
						}],
						type : gatesEnum.bulb,
						fixed : true,
						nextGates : []
					}]
				]
			},
			//#endregion
			//#region Circuit 10 - 4 Gates
			{
				gateSections : [
					[{
						inputs : [{
							type : "signal",
							val : 0
						}, {
							type : "signal",
							val : 0
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [1]
						}, {
							gateIdx : [1, 1],
							inputs : [0]
						}]
					}],
					[{
						inputs : [{
							type : "signal",
							val : 0
						}, {
							type : "gate",
							gate : [0, 1]
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [2, 0],
							inputs : [0]
						}]
					}, {
						inputs : [{
							type : "gate",
							gate : [0, 0]
						}, {
							type : "signal",
							val : 1
						}],
						type : gatesEnum.xor,
						fixed : true,
						nextGates : [{
							gateIdx : [2, 0],
							inputs : [1]
						}]
					}],
					[{
						inputs : [{
							type : "gate",
							gate : [1, 0]
						}, {
							type : "gate",
							gate : [1, 1]
						}],
						type : gatesEnum.and,
						fixed : true,
						nextGates : [{
							gateIdx : [3, 0],
							inputs : [0]
						}]
					}],
					[{
						inputs : [{
							type : "gate",
							gate : [2, 0]
						}],
						type : gatesEnum.bulb,
						fixed : true,
						nextGates : []
					}]
				]
			}
			//#endregion
		]
	},
	//#endregion

	//#region Level 7 - All gates, Medium, Gate changes
	{
		unlocked : true, //Change me back!
		starsGained : 0,
		allowedGates : [1,2,3],
		newGates : false,
		enableGateChanges : true,
		circuits : [
			//#region Circuit 1 - 2 Gates
			{
				gateSections : [
					[{
						inputs : [{
							type : "signal",
							val : 1
						}, {
							type : "signal",
							val : 0
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [0, 0],
						}, {
							type : "signal",
							val : 1
						}],
						type : gatesEnum.and,
						fixed : true,
						nextGates : [{
							gateIdx : [2, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [1, 0],
						}],
						type : gatesEnum.bulb,
						fixed : true,
						nextGates : []
					}]
				]
			},
			//#endregion
			//#region Circuit 2 - 3 Gates
			{
				gateSections : [
					[{
						inputs : [{
							type : "signal",
							val : 1
						}, {
							type : "signal",
							val : 1
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [0]
						}]
					}, {
						inputs : [{
							type : "signal",
							val : 0
						}, {
							type : "signal",
							val : 0
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [1]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [0, 0],
						}, {
							type : "gate",
							gate : [0, 1],
						}],
						type : gatesEnum.nor,
						fixed : true,
						nextGates : [{
							gateIdx : [2, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [1, 0],
						}],
						type : gatesEnum.bulb,
						fixed : true,
						nextGates : []
					}]
				]
			},
			//#endregion
			//#region Circuit 3 - 2 Gates
			{
				gateSections : [
					[{
						inputs : [{
							type : "signal",
							val : 1
						}, {
							type : "signal",
							val : 0
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [0, 0],
						}, {
							type : "signal",
							val : 0
						}],
						type : gatesEnum.xnor,
						fixed : true,
						nextGates : [{
							gateIdx : [2, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [1, 0],
						}],
						type : gatesEnum.bulb,
						fixed : true,
						nextGates : []
					}]
				]
			},
			//#endregion
			//#region Circuit 4 - 1 Gate, Star
			{
				gateSections : [
					[{
						inputs : [{
							type : "signal",
							val : 1
						}, {
							type : "signal",
							val : 1
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [0, 0],
						}],
						type : gatesEnum.star,
						fixed : true,
						nextGates : []
					}]
				]
			},
			//#endregion
			//#region Circuit 5 - 3 Gates
			{
				gateSections : [
					[{
						inputs : [{
							type : "signal",
							val : 0
						}, {
							type : "signal",
							val : 1
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [0]
						}]
					}, {
						inputs : [{
							type : "signal",
							val : 0
						}, {
							type : "signal",
							val : 0
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [1]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [0, 0],
						}, {
							type : "gate",
							gate : [0, 1],
						}],
						type : gatesEnum.and,
						fixed : true,
						nextGates : [{
							gateIdx : [2, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [1, 0],
						}],
						type : gatesEnum.bulb,
						fixed : true,
						nextGates : []
					}]
				]
			},
			//#endregion
			//#region Circuit 6 - 2 Gates
			{
				gateSections : [
					[{
						inputs : [{
							type : "signal",
							val : 1
						}, {
							type : "signal",
							val : 0
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [0, 0],
						}, {
							type : "signal",
							val : 0
						}],
						type : gatesEnum.nor,
						fixed : true,
						nextGates : [{
							gateIdx : [2, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [1, 0],
						}],
						type : gatesEnum.bulb,
						fixed : true,
						nextGates : []
					}]
				]
			},
			//#endregion
			//#region Circuit 7 - 3 Gates
			{
				gateSections : [
					[{
						inputs : [{
							type : "signal",
							val : 0
						}, {
							type : "signal",
							val : 0
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [0]
						}]
					}, {
						inputs : [{
							type : "signal",
							val : 1
						}, {
							type : "signal",
							val : 0
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [1]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [0, 0],
						}, {
							type : "gate",
							gate : [0, 1],
						}],
						type : gatesEnum.xnor,
						fixed : true,
						nextGates : [{
							gateIdx : [2, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [1, 0],
						}],
						type : gatesEnum.bulb,
						fixed : true,
						nextGates : []
					}]
				]
			},
			//#endregion
			//#region Circuit 8 - 2 Gates, Star
			{
				gateSections : [
					[{
						inputs : [{
							type : "signal",
							val : 1
						}, {
							type : "signal",
							val : 0
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [0, 0],
						}, {
							type : "signal",
							val : 1
						}],
						type : gatesEnum.nand,
						fixed : true,
						nextGates : [{
							gateIdx : [2, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [1, 0],
						}],
						type : gatesEnum.star,
						fixed : true,
						nextGates : []
					}]
				]
			},
			//#endregion
			//#region Circuit 9 - 3 Gates
			{
				gateSections : [
					[{
						inputs : [{
							type : "signal",
							val : 0
						}, {
							type : "signal",
							val : 1
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [0]
						}]
					}, {
						inputs : [{
							type : "signal",
							val : 1
						}, {
							type : "signal",
							val : 0
						}],
						type : gatesEnum.or,
						fixed : true,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [1]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [0, 0],
						}, {
							type : "gate",
							gate : [0, 1],
						}],
						type : gatesEnum.nand,
						fixed : true,
						nextGates : [{
							gateIdx : [2, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [1, 0],
						}],
						type : gatesEnum.bulb,
						fixed : true,
						nextGates : []
					}]
				]
			},
			//#endregion
			//#region Circuit 10 - 4 Gates
			{
				gateSections : [
					[{
						inputs : [{
							type : "signal",
							val : 0
						}, {
							type : "signal",
							val : 0
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [1]
						}, {
							gateIdx : [1, 1],
							inputs : [0]
						}]
					}],
					[{
						inputs : [{
							type : "signal",
							val : 0
						}, {
							type : "gate",
							gate : [0, 1]
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [2, 0],
							inputs : [0]
						}]
					}, {
						inputs : [{
							type : "gate",
							gate : [0, 0]
						}, {
							type : "signal",
							val : 1
						}],
						type : gatesEnum.nand,
						fixed : true,
						nextGates : [{
							gateIdx : [2, 0],
							inputs : [1]
						}]
					}],
					[{
						inputs : [{
							type : "gate",
							gate : [1, 0]
						}, {
							type : "gate",
							gate : [1, 1]
						}],
						type : gatesEnum.xor,
						fixed : true,
						nextGates : [{
							gateIdx : [3, 0],
							inputs : [0]
						}]
					}],
					[{
						inputs : [{
							type : "gate",
							gate : [2, 0]
						}],
						type : gatesEnum.bulb,
						fixed : true,
						nextGates : []
					}]
				]
			}
			//#endregion
		]
	},
	//#endregion

	//#region Level 8 - All gates, Hard, Gate changes
	{
		unlocked : true, //Change me back!
		starsGained : 0,
		allowedGates : [1,2,3],
		newGates : false,
		enableGateChanges : true,
		circuits : [
			//#region Circuit 1 - 3 Gates
			{
				gateSections : [
					[{
						inputs : [{
							type : "signal",
							val : 1
						}, {
							type : "signal",
							val : 1
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [0]
						}]
					}, {
						inputs : [{
							type : "signal",
							val : 0
						}, {
							type : "signal",
							val : 0
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [1]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [0, 0],
						}, {
							type : "gate",
							gate : [0, 1],
						}],
						type : gatesEnum.and,
						fixed : true,
						nextGates : [{
							gateIdx : [2, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [1, 0],
						}],
						type : gatesEnum.bulb,
						fixed : true,
						nextGates : []
					}]
				]
			},
			//#endregion
			//#region Circuit 2 - 4 Gates
			{
				gateSections : [
					[{
						inputs : [{
							type : "signal",
							val : 0
						}, {
							type : "signal",
							val : 0
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [1]
						}, {
							gateIdx : [1, 1],
							inputs : [0]
						}]
					}],
					[{
						inputs : [{
							type : "signal",
							val : 1
						}, {
							type : "gate",
							gate : [0, 1]
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [2, 0],
							inputs : [0]
						}]
					}, {
						inputs : [{
							type : "gate",
							gate : [0, 0]
						}, {
							type : "signal",
							val : 1
						}],
						type : gatesEnum.xor,
						fixed : true,
						nextGates : [{
							gateIdx : [2, 0],
							inputs : [1]
						}]
					}],
					[{
						inputs : [{
							type : "gate",
							gate : [1, 0]
						}, {
							type : "gate",
							gate : [1, 1]
						}],
						type : gatesEnum.and,
						fixed : true,
						nextGates : [{
							gateIdx : [3, 0],
							inputs : [0]
						}]
					}],
					[{
						inputs : [{
							type : "gate",
							gate : [2, 0]
						}],
						type : gatesEnum.bulb,
						fixed : true,
						nextGates : []
					}]
				]
			},
			//#endregion
			//#region Circuit 3 - 3 Gates
			{
				gateSections : [
					[{
						inputs : [{
							type : "signal",
							val : 0
						}, {
							type : "signal",
							val : 1
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [0]
						}]
					}, {
						inputs : [{
							type : "signal",
							val : 0
						}, {
							type : "signal",
							val : 0
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [1]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [0, 0],
						}, {
							type : "gate",
							gate : [0, 1],
						}],
						type : gatesEnum.nor,
						fixed : true,
						nextGates : [{
							gateIdx : [2, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [1, 0],
						}],
						type : gatesEnum.bulb,
						fixed : true,
						nextGates : []
					}]
				]
			},
			//#endregion
			//#region Circuit 4 - 2 Gates, Star
			{
				gateSections : [
					[{
						inputs : [{
							type : "signal",
							val : 0
						}, {
							type : "signal",
							val : 0
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [0, 0],
						}, {
							type : "signal",
							val : 0
						}],
						type : gatesEnum.nor,
						fixed : true,
						nextGates : [{
							gateIdx : [2, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [1, 0],
						}],
						type : gatesEnum.star,
						fixed : true,
						nextGates : []
					}]
				]
			},
			//#endregion
			//#region Circuit 5 - 4 Gates
			{
				gateSections : [
					[{
						inputs : [{
							type : "signal",
							val : 0
						}, {
							type : "signal",
							val : 0
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [1]
						}, {
							gateIdx : [1, 1],
							inputs : [0]
						}]
					}],
					[{
						inputs : [{
							type : "signal",
							val : 0
						}, {
							type : "gate",
							gate : [0, 1]
						}],
						type : gatesEnum.or,
						fixed : true,
						nextGates : [{
							gateIdx : [2, 0],
							inputs : [0]
						}]
					}, {
						inputs : [{
							type : "gate",
							gate : [0, 0]
						}, {
							type : "signal",
							val : 1
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [2, 0],
							inputs : [1]
						}]
					}],
					[{
						inputs : [{
							type : "gate",
							gate : [1, 0]
						}, {
							type : "gate",
							gate : [1, 1]
						}],
						type : gatesEnum.xnor,
						fixed : true,
						nextGates : [{
							gateIdx : [3, 0],
							inputs : [0]
						}]
					}],
					[{
						inputs : [{
							type : "gate",
							gate : [2, 0]
						}],
						type : gatesEnum.bulb,
						fixed : true,
						nextGates : []
					}]
				]
			},
			//#endregion
			//#region Circuit 6 - 3 Gates
			{
				gateSections : [
					[{
						inputs : [{
							type : "signal",
							val : 0
						}, {
							type : "signal",
							val : 1
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [0]
						}]
					}, {
						inputs : [{
							type : "signal",
							val : 0
						}, {
							type : "signal",
							val : 0
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [1]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [0, 0],
						}, {
							type : "gate",
							gate : [0, 1],
						}],
						type : gatesEnum.xnor,
						fixed : true,
						nextGates : [{
							gateIdx : [2, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [1, 0],
						}],
						type : gatesEnum.bulb,
						fixed : true,
						nextGates : []
					}]
				]
			},
			//#endregion
			//#region Circuit 7 - 4 Gates
			{
				gateSections : [
					[{
						inputs : [{
							type : "signal",
							val : 0
						}, {
							type : "signal",
							val : 1
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [1]
						}, {
							gateIdx : [1, 1],
							inputs : [0]
						}]
					}],
					[{
						inputs : [{
							type : "signal",
							val : 1
						}, {
							type : "gate",
							gate : [0, 1]
						}],
						type : gatesEnum.xor,
						fixed : true,
						nextGates : [{
							gateIdx : [2, 0],
							inputs : [0]
						}]
					}, {
						inputs : [{
							type : "gate",
							gate : [0, 0]
						}, {
							type : "signal",
							val : 1
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [2, 0],
							inputs : [1]
						}]
					}],
					[{
						inputs : [{
							type : "gate",
							gate : [1, 0]
						}, {
							type : "gate",
							gate : [1, 1]
						}],
						type : gatesEnum.nand,
						fixed : true,
						nextGates : [{
							gateIdx : [3, 0],
							inputs : [0]
						}]
					}],
					[{
						inputs : [{
							type : "gate",
							gate : [2, 0]
						}],
						type : gatesEnum.bulb,
						fixed : true,
						nextGates : []
					}]
				]
			},
			//#endregion
			//#region Circuit 8 - 3 Gates, Star
			{
				gateSections : [
					[{
						inputs : [{
							type : "signal",
							val : 1
						}, {
							type : "signal",
							val : 0
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [0]
						}]
					}, {
						inputs : [{
							type : "signal",
							val : 1
						}, {
							type : "signal",
							val : 1
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [1]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [0, 0],
						}, {
							type : "gate",
							gate : [0, 1],
						}],
						type : gatesEnum.and,
						fixed : true,
						nextGates : [{
							gateIdx : [2, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [1, 0],
						}],
						type : gatesEnum.star,
						fixed : true,
						nextGates : []
					}]
				]
			},
			//#endregion
			//#region Circuit 9 - 5 Gates
			{
				gateSections : [
					[{
						inputs : [{
							type : "signal",
							val : 0
						}, {
							type : "signal",
							val : 1
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [0]
						}, {
							gateIdx : [1, 1],
							inputs : [0]
						}]
					}, {
						inputs : [{
							type : "signal",
							val : 1
						}, {
							type : "signal",
							val : 0
						}],
						type : gatesEnum.or,
						fixed : true,
						nextGates : [{
							gateIdx : [1, 1],
							inputs : [1]
						}, {
							gateIdx : [1, 0],
							inputs : [1]
						}]
					}],
					[{
						inputs : [{
							type : "gate",
							gate : [0, 0]
						}, {
							type : "gate",
							gate : [0, 1]
						}],
						type : gatesEnum.or,
						fixed : true,
						nextGates : [{
							gateIdx : [2, 0],
							inputs : [0]
						}]
					}, {
						inputs : [{
							type : "gate",
							gate : [0, 0]
						}, {
							type : "gate",
							gate : [0, 1]
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [2, 0],
							inputs : [1]
						}]
					}],
					[{
						inputs : [{
							type : "gate",
							gate : [1, 0]
						}, {
							type : "gate",
							gate : [1, 1]
						}],
						type : gatesEnum.xnor,
						fixed : true,
						nextGates : [{
							gateIdx : [3, 0],
							inputs : [0]
						}]
					}],
					[{
						inputs : [{
							type : "gate",
							gate : [2, 0]
						}],
						type : gatesEnum.bulb,
						fixed : true,
						nextGates : []
					}]
				]
			},
			//#endregion
			//#region Circuit 10 - 5 Gates
			{
				gateSections : [
					[{
						inputs : [{
							type : "signal",
							val : 0
						}, {
							type : "signal",
							val : 0
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [1]
						}, {
							gateIdx : [1, 1],
							inputs : [0]
						}]
					}, {
						inputs : [{
							type : "signal",
							val : 1
						}, {
							type : "signal",
							val : 1
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 1],
							inputs : [1]
						}]
					}],
					[{
						inputs : [{
							type : "signal",
							val : 1
						}, {
							type : "gate",
							gate : [0, 0]
						}],
						type : gatesEnum.xnor,
						fixed : true,
						nextGates : [{
							gateIdx : [2, 0],
							inputs : [0]
						}]
					}, {
						inputs : [{
							type : "gate",
							gate : [0, 0]
						}, {
							type : "gate",
							gate : [0, 1]
						}],
						type : gatesEnum.xor,
						fixed : true,
						nextGates : [{
							gateIdx : [2, 0],
							inputs : [1]
						}]
					}],
					[{
						inputs : [{
							type : "gate",
							gate : [1, 0]
						}, {
							type : "gate",
							gate : [1, 1]
						}],
						type : gatesEnum.and,
						fixed : true,
						nextGates : [{
							gateIdx : [3, 0],
							inputs : [0]
						}]
					}],
					[{
						inputs : [{
							type : "gate",
							gate : [2, 0]
						}],
						type : gatesEnum.bulb,
						fixed : true,
						nextGates : []
					}]
				]
			}
			//#endregion
		]
	}
	//#endregion
]

var SC; // Scale
var cvs1, ctx1, cvs2, ctx2;
var circuits
var gatesEnum = Object.freeze({"blank":0, "and":1, "nand":2, "or":3, "nor":4, "xor":5, "xnor":6, "bulb":7, "star":8});
var allowedGates;
var enableGateChanges;
var draggedGate = 0;
var selectedGate = null;
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
var selectedLevel = -1;

function openMenu(){
	// Create the main canvas
	cvs1 = document.createElement("canvas");
	ctx1 = cvs1.getContext("2d");
	cvs1.width = window.innerWidth-15;
	cvs1.height = window.innerHeight-15;
	cvs1.style = "position: absolute; left: 5; top: 5; z-index: 0; background-color: #d8f3e6; border:0px solid #d3d3d3;";
	document.body.insertBefore(cvs1, document.body.childNodes[0]);

	// Create the layer 2 canvas
	cvs2 = document.createElement("canvas");
	ctx2 = cvs2.getContext("2d");
	cvs2.width = window.innerWidth-15;
	cvs2.height = window.innerHeight-15;
	cvs2.style = "position: absolute; left: 5; top: 5; z-index: 1;";
	cvs2.onmousedown = handleMenuMouseDown;
	cvs2.onmousemove = handleMenuMouseMove;
	document.body.insertBefore(cvs2, document.body.childNodes[0]);

	SC = Math.round((cvs1.height/50)/5) * 5;

	// Draw a dark green box over the whole screen
	drawMenu(ctx1);
}

function drawMenu(ctx){
	// Clear the area.
	ctx.clearRect(0, 0, cvs1.width, cvs1.height);

	// Draw dark green background
	ctx.fillStyle = "#184e32";
	ctx.beginPath();
	ctx.rect(0, 0, cvs1.width, cvs1.height);
	ctx.fill();
	ctx.stroke();
	ctx.closePath();

	// Draw title
	ctx.font = (3*SC) + "pt Impact";
	ctx.fillStyle = "#FFFFFF";
	ctx.fillText("Logic Training", (cvs1.width/2) - (11.5*SC) + 2, (cvs1.height/2) - (6*SC) + 2);
	ctx.fillStyle = "#000000";
	ctx.fillText("Logic Training", (cvs1.width/2) - (11.5*SC), (cvs1.height/2) - (6*SC));

	drawLevels(ctx);
}

// Draws the icons for each level.
function drawLevels(ctx){
	var startx, width, x, y;
	y = (cvs1.height/2) - (2*SC);
	width = (levels.length*6*SC) + ((levels.length-1)*3*SC);
	startx = Math.round((cvs1.width/2) - (width/2));

	for (var i = 0; i < levels.length; i++){
		var selected = (levels[i].unlocked && selectedLevel == i);

		// Draw rectangle around the level.
		x = startx + (i*9*SC);
		ctx.beginPath();
		ctx.fillStyle = (selected) ? "#7D9C8D" : "#5D8370";
		ctx.lineWidth = (selected) ? 3 : 1;
		ctx.strokeStyle = "#000000";
		ctx.rect(x, y, 6*SC, 6*SC);
		ctx.fill();
		ctx.stroke();
		ctx.lineWidth = 1;
		ctx.closePath();

		// Write the "LEVEL" text.
		ctx.beginPath();
		ctx.font = (0.8*SC) + "pt Impact";
		ctx.fillStyle = "#000000";
		ctx.fillText("LEVEL", x+(1.8*SC), y+(1.5*SC));
		ctx.closePath();

		// Draw the level number.
		ctx.beginPath();
		ctx.font = (2*SC) + "pt Impact";
		ctx.fillStyle = "#000000";
		ctx.fillText(i+1, x+(2.3*SC), y+(4.2*SC));
		ctx.closePath();

		// Draw the stars, filling in the ones which have been earned.
		ctx.beginPath();
		ctx.font = (0.8*SC) + "pt FontAwesome";
		for (var j = 0; j < 3; j++){
			if (j < levels[i].starsGained){
				ctx.fillStyle = "#ffff00";
				ctx.fillText("\uF005", x+(1.2*SC)+(j*25), y+(5.5*SC));
			}
			ctx.strokeStyle = "#000000";
			ctx.strokeText("\uF005", x+(1.2*SC)+(j*25), y+(5.5*SC));
		}
		ctx.closePath();

		if (!levels[i].unlocked){
			// Draw transparent grey box.
			ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
			ctx.beginPath();
			ctx.rect(x, y, 6*SC, 6*SC);
			ctx.fill();
			ctx.closePath();

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

function handleMenuMouseMove(){
	mousex = event.clientX-8;
	mousey = event.clientY-8;

	var lvl = getSelectedLevel();
	if (lvl != selectedLevel){
		selectedLevel = lvl;
		drawMenu(ctx1);
	}
}

function handleMenuMouseDown(){
	if (selectedLevel != -1){
		startGame(selectedLevel);
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
		// Cancel all the intervals and handlers
		clearInterval(updateSelectedIntervalId);
		clearInterval(drawDraggedIntervalId);
		clearInterval(drawIntervalId);
		clearInterval(updateIntervalId);
		clearInterval(gateChangeIntervalId);
		updateSelectedIntervalId = undefined;
		drawDraggedIntervalId = undefined;
		drawIntervalId = undefined;
		updateIntervalId = undefined;
		gateChangeIntervalId = undefined;
		cvs2.onmousedown = undefined;
		cvs2.onmouseup = undefined;
		cvs2.onmousemove = undefined;

		// Draw a partially transparent rectangle over the whole canvas to make it look faded out. and draw a box in the middle of the game area.
		ctx2.fillStyle = "rgba(0, 0, 0, 0.2)";
		ctx2.fillRect(0, 0, cvs2.width, cvs2.height);

		// Display the win or lose message.
		if (gameState == "lost"){
			displayLoseMessage(ctx2);
		} else {
			displayWinMessage(ctx2);
		}
	}
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

	// Update the allowed gates and redraw the menu bar.
	allowedGates = [gate1, gate2, gate3];
	drawMenuBar();

	// Display a "Gate change!" animation.
	var frame = 0,
		xOffset = Math.round(cvs1.width / 2) + (18*SC),
		yOffset = SC;
	var id = setInterval(animateGateChange, 10);

	function animateGateChange(){
		// Clear area we want to draw in.
		ctx1.clearRect(xOffset, yOffset, (16*SC), (4*SC));

		// Fill the background.
		ctx1.beginPath();
		ctx1.fillStyle = "#2a8958";
		ctx1.rect(xOffset, yOffset, (16*SC), (4*SC));
		ctx1.fill();
		ctx1.closePath();

		if (frame == 150){
			clearInterval(id);
		} else {
			ctx1.font = "italic " + (2*SC) + "pt Impact";
			ctx1.fillStyle = (frame < 100) ? "#B4D6C5" : "rgba(180, 214, 197, " + (150-frame)/50 + ")";
			ctx1.fillText("GATE CHANGE!", xOffset+2, yOffset + (3*SC) + 2);
			ctx1.fillStyle = (frame < 100) ? "#113723" : "rgba(17, 55, 35, " + (150-frame)/50 + ")";
			ctx1.fillText("GATE CHANGE!", xOffset, yOffset + (3*SC));
			frame++;
		}
	}
}
// Draws the menu bar at the top of the screen.
function drawMenuBar(){
	// Clear the menu area.
	ctx1.clearRect(1, 1, cvs1.width-2, (6*SC));

	// Draw outer box.
	ctx1.beginPath();
	ctx1.lineWidth = 2;
	ctx1.strokeStyle = "#000000";
	ctx1.fillStyle="#2a8958";
	ctx1.rect(1, 1, cvs1.width-2, (SC*6));
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

	// Draw a partially transparent grey box and a lock symbol on any locked gates.
	for (var i = 1; i < 7; i++){
		if (!allowedGates.includes(i)){
			// Draw transparent grey box.
			var startx = x+((i-1)*5*SC);
			ctx1.fillStyle = "rgba(0, 0, 0, 0.4)";
			ctx1.beginPath();
			ctx1.rect(startx, y, 4*SC, 4*SC);
			ctx1.fill();
			ctx1.closePath();

			// Draw lock icon.
			ctx1.font = 2*SC + "px FontAwesome";
			ctx1.fillStyle = "#000000";
			ctx1.fillText("\uf023", startx+(1.45*SC), y+(2.8*SC));
			ctx1.font = 2*SC + "px FontAwesome";
			ctx1.fillStyle = "#ffffff";
			ctx1.fillText("\uf023", startx+(1.3*SC), y+(2.65*SC));
		}
	}
}

// Draws and moves all the circuits.
function drawGameArea(ctx){
	// Increase frameNo, and clear the game area.
	if (!pause) { frameNo++; }
	clearGameArea();

	// Move and draw the circuits.
	for (var i = 0; i < circuits.length; i++){
		if (!pause){ circuits[i].startx--; }
		drawCircuit(circuits[i], ctx);
	}

	// Draw box around game area.
	ctx1.beginPath();
	ctx1.strokeStyle="#000000";
	ctx1.rect(1, (SC*6), cvs1.width-2, cvs1.height-(SC*6)-2);
	ctx1.stroke();
	ctx1.closePath();
}

// Display the "You Lost" message box.
function displayLoseMessage(ctx){
	// Draw the box.
	ctx.lineWidth = 1;
	ctx.fillStyle = "#eeeeee";
	var rectX = (cvs1.width/2)-100,
		rectY = ((cvs1.height-(6*SC))/2)+(6*SC)-50;
	ctx.rect(rectX, rectY, 200, 100);
	ctx.fill();
	ctx.stroke();
	ctx.fillStyle = "#000000";

	// Write the "You Lost :(" message
	ctx.font = "26px Arial";
	ctx.fillText("You lost.", rectX + 32, rectY + 60);
	ctx.font = "26px FontAwesome";
	ctx.fillText("\uf119", rectX + 148, rectY + 60);
}

function displayWinMessage(ctx){
	// Draw the box.
	ctx.lineWidth = 1;
	ctx.fillStyle = "#eeeeee";
	var rectX = (cvs1.width/2)-100,
		rectY = ((cvs1.height-(6*SC))/2)+(6*SC)-50;
	ctx.rect(rectX, rectY, 200, 100);
	ctx.fill();
	ctx.stroke();
	ctx.fillStyle = "#000000";

	// Write the "You Won! :)" message
	ctx.font = "26px Arial";
	ctx.fillText("You win!", rectX + 32, rectY + 60);
	ctx.font = "26px FontAwesome";
	ctx.fillText("\uf118", rectX + 148, rectY + 60);
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
	ctx.font = SC + "px FontAwesome";
	ctx.fillStyle = "#00bfff";
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

// Clears the game area of all drawings
function clearGameArea(){
	ctx1.clearRect(2, (SC*6), cvs1.width-4, cvs1.height-(SC*6)-2);
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
		findWirePositions(circuits[i]);
		findCircuitPosition(i);
		updateCircuitValues([i, 0, 0]);
		stopWireAnimations(circuits[i]);
	}
}

function findCircuitPosition(idx){
	var y, circuit = circuits[idx];
	circuit.startx = (idx == 0) ? cvs1.width + 50 : circuits[idx-1].endx + (8*SC);
	circuit.endx = circuit.startx + circuit.width;
	delete circuit.width;
	do {
		y = (6*SC) + Math.round((0.3+(0.4*Math.random()))*(cvs1.height-(6*SC))) - (10*SC);
	}
	while (idx != 0 && Math.abs(circuits[idx-1].starty - y) < (4*SC));
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
			gate.invis = false;
			gate.outputVal = -1;
			for (var k = 0; k < gate.nextGates.length; k++){
				gate.nextGates[k].gateIdx.unshift(circuitIdx);
			}
			for (var k = 0; k < gate.inputs.length; k++){
				if (gate.inputs[k].type == "gate"){
					gate.inputs[k].val = -1;
				}
			}
			gate.idx = [circuitIdx, i, j];
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
						var firstColFree = true;
						for (var m = 0; m < firstWireCol.length; m++){
							if (firstWireCol[m].gate == wire.gate){
								firstColFree = false;
							}
						}

						// If there is no wire from this group in the first column for this section, or if the gate this wire leads to is the same height as the gate we're starting from, use the first column. Else, create a new column for this wire.
						if (firstColFree || (gate.yOffset == nextGate.yOffset)){
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
					drawWire(wire.x1+startx, wire.y1+starty, wire.x2+startx, wire.y2+starty, live, ctx);
				}
			} else {
				// Draw signal group.
				for (var k = 0; k < group.wires.length; k++){
					var wire = group.wires[k];
					drawWire(wire.x1+startx, wire.y1+starty, wire.x2+startx, wire.y2+starty, wire.live, ctx);
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
	ctx.beginPath();
	if (fixed){
		ctx.strokeStyle = "#666666";
		ctx.lineWidth = 2;
		ctx.fillStyle = "#e6e6e6";
	} else {
		ctx.strokeStyle = "#000000";
		ctx.setLineDash([5, 3]);
	}
	ctx.rect(x, y, 4*SC, 4*SC);
	ctx.stroke();
	if (fixed){
		ctx.fill();
	}
	ctx.lineWidth = 1;
	ctx.setLineDash([]);
	ctx.strokeStyle="#000000";
	ctx.closePath();

	var input1, input2;
	input1 = inputs[0].val;
	if (inputs.length > 1){
		input2 = inputs[1].val;
	}

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
	ctx.lineWidth = 1.5;
	ctx.fillStyle = "#ffffff";

	ctx.beginPath();
	ctx.moveTo(x+(0.5*SC), y+(0.4*SC));
	ctx.lineTo(x+(1.6*SC), y+(0.4*SC));
	ctx.bezierCurveTo(x+(4.1*SC), y+(0.4*SC), x+(4.1*SC), y+(3.6*SC), x+(1.6*SC), y+(3.6*SC));
	ctx.lineTo(x+(0.5*SC), y+(3.6*SC));
	ctx.lineTo(x+(0.5*SC), y+(0.4*SC));
	ctx.fill();
	ctx.stroke();
	ctx.closePath();

	drawWire(x, y+SC, x+(0.5*SC), y+SC, input1, ctx);
	drawWire(x, y+(3*SC), x+(0.5*SC), y+(3*SC), input2, ctx);
	drawWire(x+(3.5*SC), y+(2*SC), x+(4*SC), y+(2*SC), output, ctx);
}

function drawNAND(x, y, input1, input2, output, ctx){
	ctx.lineWidth = 1.5;
	ctx.fillStyle = "#ffffff";

	ctx.beginPath();
	ctx.moveTo(x+(0.5*SC), y+(0.4*SC));
	ctx.lineTo(x+(1.4*SC), y+(0.4*SC));
	ctx.bezierCurveTo(x+(3.9*SC), y+(0.4*SC), x+(3.9*SC), y+(3.6*SC), x+(1.4*SC), y+(3.6*SC));
	ctx.lineTo(x+(0.5*SC), y+(3.6*SC));
	ctx.lineTo(x+(0.5*SC), y+(0.4*SC));
	ctx.fill();
	ctx.stroke();
	ctx.closePath();

	ctx.beginPath();
	ctx.arc(x+(3.5*SC), y+(2*SC), 0.25*SC, 0, 2*Math.PI);
	ctx.fill();
	ctx.stroke();
	ctx.closePath();

	drawWire(x, y+SC, x+(0.5*SC), y+SC, input1, ctx);
	drawWire(x, y+(3*SC), x+(0.5*SC), y+(3*SC), input2, ctx);
	drawWire(x+(3.75*SC), y+(2*SC), x+(4*SC), y+(2*SC), output, ctx);
}

function drawOR(x, y, input1, input2, output, ctx){
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

	drawWire(x, y+SC, x+(0.8*SC), y+SC, input1, ctx);
	drawWire(x, y+(3*SC), x+(0.8*SC), y+(3*SC), input2, ctx);
	drawWire(x+(3.5*SC), y+(2*SC), x+(4*SC), y+(2*SC), output, ctx);
}

function drawNOR(x, y, input1, input2, output, ctx){
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

	drawWire(x, y+SC, x+(0.8*SC), y+SC, input1, ctx);
	drawWire(x, y+(3*SC), x+(0.8*SC), y+(3*SC), input2, ctx);
	drawWire(x+(3.75*SC), y+(2*SC), x+(4*SC), y+(2*SC), output, ctx);
}

function drawXOR(x, y, input1, input2, output, ctx){
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

	drawWire(x, y+SC, x+(0.7*SC), y+SC, input1, ctx);
	drawWire(x, y+(3*SC), x+(0.7*SC), y+(3*SC), input2, ctx);
	drawWire(x+(3.5*SC), y+(2*SC), x+(4*SC), y+(2*SC), output, ctx);
}

function drawXNOR(x, y, input1, input2, output, ctx){
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

	drawWire(x, y+SC, x+(0.7*SC), y+SC, input1, ctx);
	drawWire(x, y+(3*SC), x+(0.7*SC), y+(3*SC), input2, ctx);
	drawWire(x+(3.75*SC), y+(2*SC), x+(4*SC), y+(2*SC), output, ctx);
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
	draggedGate = 0;
	updateSelectedGate();

	// See if the mouse position is in the boundaries of one of the gates in the menu bar.
	if ((mousey > SC) && (mousey < (5*SC))){
		var startX = (cvs1.width/2) - (14.5*SC);
		for (var i = 1; i < 7; i++){
			if (allowedGates.includes(i) && (mousex > startX+((i-1)*5*SC)) && (mousex < startX+((i-1)*5*SC)+(4*SC))){
				// Sets draggedGate to the selected gate, and puts drawDraggedGate on an interval, so that it can be redrawn to snap to nearby gates even if the mouse doesn't move.
				draggedGate = i;
				drawDraggedIntervalId = setInterval(drawDraggedGate, 10);
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
			drawDraggedIntervalId = setInterval(drawDraggedGate, 10);
			updateSelectedIntervalId = setInterval(updateSelectedGate, 50);
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
				gate.type = chosenGate;
				updateCircuitValues(gate.idx);
			}
		}
	}
}

function handleMouseMove(){
	mousex = event.clientX-8;
	mousey = event.clientY-8;
}
var levels = [{
	unlocked : true,
	starsGained : 3,
	allowedGates : [1, 2],
	enableGateChanges : false,
	circuits : [{
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
	}, {
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
				type : gatesEnum.star,
				fixed : true,
				nextGates : []
			}]
		]
	}, {
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
	}, {
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
	}, {
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
				type : gatesEnum.star,
				fixed : true,
				nextGates : []
			}]
		]
	}, {
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
	}, {
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
	}, {
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
				type : gatesEnum.star,
				fixed : true,
				nextGates : []
			}]
		]
	}, {
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
	}]
}, {
	unlocked : true,
	starsGained : 0,
	allowedGates : [3,4],
	enableGateChanges : false,
	circuits : [{
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
	}, {
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
				type : gatesEnum.star,
				fixed : true,
				nextGates : []
			}]
		]
	}, {
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
	}, {
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
	}, {
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
				type : gatesEnum.star,
				fixed : true,
				nextGates : []
			}]
		]
	}, {
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
	}, {
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
	}, {
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
				type : gatesEnum.nor,
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
				type : gatesEnum.star,
				fixed : true,
				nextGates : []
			}]
		]
	}, {
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
	}]
}, {
	unlocked : true,
	starsGained : 0,
	allowedGates : [1,2,4],
	enableGateChanges : true,
	circuits : [{
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
			}],
			[{
				inputs : [{
					type : "gate",
					gate : [0, 0]
				}, {
					type : "gate",
					gate : [0, 1]
				}],
				type : gatesEnum.and,
				fixed : true,
				nextGates : [{
					gateIdx : [2, 0],
					inputs : [0]
				}]
			}],
			[{
				inputs : [{
					type : "gate",
					gate : [1, 0]
				}],
				type : gatesEnum.bulb,
				fixed : true,
				nextGates : []
			}]
		]
	}, {
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
			}],
			[{
				inputs : [{
					type : "gate",
					gate : [0, 0]
				}, {
					type : "gate",
					gate : [0, 1]
				}],
				type : gatesEnum.nor,
				fixed : true,
				nextGates : [{
					gateIdx : [2, 0],
					inputs : [0]
				}]
			}],
			[{
				inputs : [{
					type : "gate",
					gate : [1, 0]
				}],
				type : gatesEnum.star,
				fixed : true,
				nextGates : []
			}]
		]
	}, {
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
			}],
			[{
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
					inputs : [0]
				}]
			}],
			[{
				inputs : [{
					type : "gate",
					gate : [1, 0]
				}],
				type : gatesEnum.bulb,
				fixed : true,
				nextGates : []
			}]
		]
	}, {
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
	}, {
		gateSections : [
			[{
				inputs : [{
					type : "signal",
					val : 0
				}, {
					type : "signal",
					val : 1
				}],
				type : gatesEnum.and,
				fixed : true,
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
					val : 0
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
				type : gatesEnum.blank,
				fixed : false,
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
				type : gatesEnum.star,
				fixed : true,
				nextGates : []
			}]
		]
	}, {
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
					val : 0
				}],
				type : gatesEnum.nor,
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
				type : gatesEnum.blank,
				fixed : false,
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
	}, {
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
	}, {
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
				type : gatesEnum.star,
				fixed : true,
				nextGates : []
			}]
		]
	}, {
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
					inputs : [0, 1]
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
				type : gatesEnum.nand,
				fixed : true,
				nextGates : [{
					gateIdx : [1, 1],
					inputs : [1]
				}]
			}],
			[{
				inputs : [{
					type : "gate",
					gate : [0, 0]
				}, {
					type : "gate",
					gate : [0, 0]
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
	}]
}]

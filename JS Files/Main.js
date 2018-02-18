var SC = 20; // Scale
var cvs1, ctx1, cvs2, ctx2;
var circuits
var gatesEnum = Object.freeze({"blank":0, "and":1, "nand":2, "or":3, "nor":4, "xor":5, "xnor":6, "bulb":7, "star":8});
var allowedGates;
var enableGateChanges;
var draggedGate = 0;
var selectedGate = null;
var drawDraggedIntervalId, updateIntervalId;
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
	updateIntervalId = setInterval(updateGameArea, 10);

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
	//
	requestAnimationFrame(fontOnload);
	//
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
	//
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
			if ((x > circuits[i].startx) && (x < circuits[i].startx+circuits[i].width)){
				// In x range of the whole circuit
				var circuit = circuits[i];
				for (var j = 0; j < circuit.gateSections.length; j++){
					var section = circuit.gateSections[j];
					if ((x > circuit.startx + section[0].xOffset - tol) && (x < circuit.startx + section[0].xOffset + (4*SC) + tol)){
						// In x range of gate section
						for (var k = 0; k < section.length; k++){
							var gate = section[k];
							if ((y > circuit.starty + gate.yOffset - tol) && (y < circuit.starty + gate.yOffset + (4*SC) + tol)){
								// In x and y range of gate
								return [i, j, k];
							}
						}
					}
				}
			}
		}
	}
	return null;
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

// Clears the game area of all drawings
function clearGameArea(){
	ctx1.clearRect(2, (SC*6), cvs1.width-4, cvs1.height-(SC*6)-2);
}

// Updates the game area. This function is called on an interval.
function updateGameArea() {
	clearGameArea();

	if (!pause) { frameNo++; }

	// Draw and move the circuits.
	for (var i = 0; i < circuits.length; i++){
		drawCircuit(circuits[i], ctx1);
		if (!pause){
			circuits[i].startx--;
			if (circuits[i].startx == cvs1.width){
				startWireAnimations(circuits[i]);
			} else if (circuits[i].startx + circuits[i].width == 0){
				stopWireAnimations(circuits[i]);
			}
		}
	}

	// Draw box around game area.
	ctx1.beginPath();
	ctx1.strokeStyle="#000000";
	ctx1.rect(1, (SC*6), cvs1.width-2, cvs1.height-(SC*6)-2);
	ctx1.stroke();
	ctx1.closePath();

	checkWinOrLose();

	if (!pause && enableGateChanges && (frameNo % 1000 == 0)){
		changeLockedGates();
	}
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
		clearInterval(drawDraggedIntervalId);
		clearInterval(updateIntervalId);
		drawDraggedIntervalId = undefined;
		updateIntervalId = undefined;
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
	drawGates(circuit, ctx);
	drawWires(circuit, ctx);
	drawAnimations(circuit, ctx);
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

// Get the gate object for a given gate index.
function getGate(gateIdx){
	return circuits[gateIdx[0]].gateSections[gateIdx[1]][gateIdx[2]];
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

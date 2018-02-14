var SC = 20; // Scale
var cvs1, ctx1, cvs2, ctx2;
var gatesEnum = Object.freeze({"blank":0, "and":1, "nand":2, "or":3, "nor":4, "xor":5, "xnor":6, "bulb":7});
var allowedGates = [gatesEnum.and, gatesEnum.or];
var draggedGate = 0;
var selectedGate = null;
var drawDraggedIntervalId, updateIntervalId;
var mousex, mousey;
var pause = false;

function startGame() {
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
	cvs2.onmousedown = handleMouseDown;
	cvs2.onmouseup = handleMouseUp;
	cvs2.onmousemove = handleMouseMove;
	document.body.insertBefore(cvs2, document.body.childNodes[0]);

	drawMenuBar();
	prepareGameArea();

	document.onkeypress = function (e) {
		e = e || window.event;
		pause = !pause;
	};
}

function start(){
	ctx.font='48px fontawesome';
	ctx.fillText('\uF064\uF065 \uF0a5',20,75);
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
		gate = getGate(gateIdx),
		oldOutput = gate.outputVal,
		newOutput = updateGateOutput(gateIdx);

	// If the output of the updated gate changed, update future gates too.
	if (oldOutput != newOutput){
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
				newOutput = (input1 == 1) ? 1 : 0;
				break;
		}
	}

	// Update the wire section, and the input values of all the gates this one connects to.
	if (oldOutput != newOutput){
		gate.outputVal = newOutput;
		if (gate.type != gatesEnum.bulb){
			// If there is a wire group coming out of this gate, update it's value, and enable/disable animations.
			var wireGroup = circuit.wireSections[gateIdx[1]+1][gateIdx[2]];
			wireGroup.live = newOutput;
			for (var i = 0; i < wireGroup.wires.length; i++){
				var wire = wireGroup.wires[i];
				wire.animations = [];
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
	if (y > 300-tol && y < 300+(20*SC)+tol){
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

function prepareGameArea(){
	// Draw box around the game area
	ctx1.beginPath();
	ctx1.strokeStyle="#000000";
	ctx1.rect(1, (SC*6), cvs1.width-2, cvs1.height-(SC*6)-2);
	ctx1.stroke();
	ctx1.closePath();

	// Find out how to draw all the circuits
	for (var i = 0; i < circuits.length; i++){
		prepareCircuit(circuits[i]);
		circuits[i].startx = (i == 0) ? cvs1.width+50 : circuits[i-1].startx + circuits[i-1].width + (8*SC);
		//circuits[i].startx = (i == 0) ? -200 : circuits[i-1].startx + circuits[i-1].width + (8*SC);
		circuits[i].starty = ((cvs1.height-(6*SC))/2)+(6*SC)-(10*SC);
	}

	updateIntervalId = setInterval(updateGameArea, 10);
}

// Clears the game area of all drawings
function clearGameArea(){
	ctx1.clearRect(2, (SC*6), cvs1.width-4, cvs1.height-(SC*6)-4);
}

// Updates the game area. This function is called on an interval.
function updateGameArea() {
	clearGameArea();

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
		// draggedGate = 0;
		// drawDraggedGate();
		clearInterval(drawDraggedIntervalId);
		clearInterval(updateIntervalId);
		drawDraggedIntervalId = undefined;
		updateIntervalId = undefined;
		cvs2.onmousedown = undefined;
		cvs2.onmouseup = undefined;
		cvs2.onmousemove = undefined;

		// Draw a partially transparent rectangle over the whole canvas to make it look faded out, and draw a box in the middle of the game area.
		ctx2.fillStyle = "rgba(0, 0, 0, 0.2)";
		ctx2.fillRect(0, 0, cvs2.width, cvs2.height);
		ctx2.lineWidth = 1;
		ctx2.fillStyle = "#eeeeee";
		var rectX = (cvs1.width/2)-100,
			rectY = ((cvs1.height-(6*SC))/2)+(6*SC)-50;
		ctx2.rect(rectX, rectY, 200, 100);
		ctx2.fill();
		ctx2.stroke();
		ctx2.fillStyle = "#000000";

		// Write the relevant message in the box.
		if (gameState == "lost"){
			ctx2.font = "26px Arial";
			ctx2.fillText("You lost...", rectX + 28, rectY + 60);
			ctx2.font = "26px FontAwesome";
			ctx2.fillText("\uf119", rectX + 152, rectY + 60);
		} else if (gameState == "won"){
			ctx2.font = "26px Arial";
			ctx2.fillText("You win!", rectX + 36, rectY + 60);
			ctx2.font = "26px FontAwesome";
			ctx2.fillText("\uf118", rectX + 146, rectY + 60);
		}
	}
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
				for (var l = 0; l < wire.animations.length; l++){
					var bolt = wire.animations[l];
					drawBolt(bolt, circuit.startx, circuit.starty, ctx);
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
// Prepares a circuit for drawing, by finding the positions of it's gates and wires.
function prepareCircuit(circuit){
	findGatePositions(circuit);
	findWirePositions(circuit);
	if (circuit.startx < cvs1.width){
		startWireAnimations(circuit);
	}
}

// Finds the x and y positions of every gate in the circuit.
function findGatePositions(circuit){
	var cols = circuit.gateSections;
	for (var i = 0; i < cols.length; i++){
		for (var j = 0; j < cols[i].length; j++){
			var gate = cols[i][j];
			gate.xOffset = (4*SC) + (i*8*SC);
			gate.yOffset = (cols[i].length == 3) ? (j*8*SC) :
						   (cols[i].length == 2) ? (j*8*SC) + (4*SC) :
						   (cols[i].length == 1) ? (8*SC) : 0;

			gate.invis = false;
		}
	}
	circuit.width = (cols.length*8*SC) + (4*SC);
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
}

// Finds all the live wires and starts their animation interval
function stopWireAnimations(circuit){
	for (var i = 0; i < circuit.wireSections.length; i++){
		var section = circuit.wireSections[i];
		for (var j = 0; j < section.length; j++){
			var group = section[j];
			for (var k = 0; k < group.wires.length; k++){
				var wire = group.wires[k];
				wire.animations = [];
			}
		}
	}
}

function setWireInterval(wire, circuit){
	var length = Math.abs(wire.x1 - wire.x2) + Math.abs(wire.y1 - wire.y2);
	var interval = 50000 / length;
	return setInterval(drawWireAnimation, interval, wire, circuit);
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
		line1.x2 = xOffset - 3;
		line1.y2 = yOffset - 3;
		line2.x2 = xOffset + 3;
		line2.y2 = yOffset - 9;
		line3.x2 = xOffset;
		line3.y2 = yOffset - 12;
	} else if (direction == 1){
		line1.x2 = xOffset + 3;
		line1.y2 = yOffset + 3;
		line2.x2 = xOffset - 3;
		line2.y2 = yOffset + 9;
		line3.x2 = xOffset;
		line3.y2 = yOffset + 12;
	} else if (direction == 2){
		line1.x2 = xOffset - 3;
		line1.y2 = yOffset - 3;
		line2.x2 = xOffset - 9;
		line2.y2 = yOffset + 3;
		line3.x2 = xOffset - 12;
		line3.y2 = yOffset;
	} else if (direction == 3){
		line1.x2 = xOffset + 3;
		line1.y2 = yOffset + 3;
		line2.x2 = xOffset + 9;
		line2.y2 = yOffset - 3;
		line3.x2 = xOffset + 12;
		line3.y2 = yOffset;
	}
	line1.x1 = xOffset;
	line1.y1 = yOffset;
	line2.x1 = line1.x2;
	line2.y1 = line1.y2;
	line3.x1 = line2.x2;
	line3.y1 = line2.y2;

	var lightning = [line1, line2, line3];

	setTimeout(startAnimation, Math.random()*500)

	function startAnimation(){
		wire.animations.push(lightning);
		setTimeout(stopAnimation, 250);
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
	}
}

// Draws the currently selected gate at the position of the mouse cursor, or snapped to a nearby gate.
function drawDraggedGate(){
	var x = mousex,
		y = mousey,
		gateIdx = getSelectedGate(x, y, SC/2);

	// If the mouse is no longer over the previously selected gate, make that gate visible again.
	if ((selectedGate != null) && (gateIdx == null)){
		circuits[selectedGate[0]].gateSections[selectedGate[1]][selectedGate[2]].invis = false;
		selectedGate = null;
	}
	// If the mouse isn't currently over a non-fixed gate, draw at the mouse position. Otherwise, draw in the gate, and set that gate to be invisible.
	else if (gateIdx != null){
		var gate = getGate(gateIdx);
		if (!gate.fixed){
			var circuit = circuits[gateIdx[0]];
			x = circuit.startx + gate.xOffset + (2*SC);
			y = circuit.starty + gate.yOffset + (2*SC);
			// If the mouse has just moved into a new gate, set that gate to invisible.
			if (selectedGate == null){
				gate.invis = true;
				selectedGate = gateIdx;
			}
		}
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
	if (live == 1){
		ctx.fillStyle = "#ffff00";
		ctx.fillText("\uF005", x+(0.65*SC), y+(3.1*SC));
		ctx.fillStyle = "black";
	}
	ctx.lineWidth = 2;
	ctx.strokeText("\uF005", x+(0.65*SC), y+(3.1*SC));
	ctx.font = "26px Arial";
	ctx.lineWidth = 1;
}
//#endregion
// Checks if the user clicked on a gate in the menu bar, and if so, set draggedGate to that gate.
function handleMouseDown(){
	draggedGate = 0;

	// See if the mouse position is in the boundaries of one of the gates in the menu bar.
	if ((mousey > SC) && (mousey < (5*SC))){
		var startX = (cvs1.width/2) - (14.5*SC);
		for (var i = 1; i < 7; i++){
			if (allowedGates.includes(i) && (mousex > startX+((i-1)*5*SC)) && (mousex < startX+((i-1)*5*SC)+(4*SC))){
				// Sets draggedGate to the selected gate, and puts drawDraggedGate on an interval, so that it can be redrawn to snap to nearby gates even if the mouse doesn't move.
				draggedGate = i;
				drawDraggedIntervalId = setInterval(drawDraggedGate, 10);
			}
		}
	} else {
		var gateIdx = getSelectedGate(mousex, mousey, 0);
		if (gateIdx != null){
			// If the user clicked and dragged a non-fixed gate in the circuit, remove that gate from the circuit.
			var gate = getGate(gateIdx);
			if (!gate.fixed){
				draggedGate = gate.type;
				gate.type = 0;
				updateCircuitValues(gateIdx);
				drawDraggedIntervalId = setInterval(drawDraggedGate, 10);
			}
		}
	}
}

// Checks if the user is currently dragging a gate, and if they released the mouse over a non-fixed gate in a circuit. If so, update that gate's type and update the circuit's values.
function handleMouseUp(){
	if (draggedGate != 0){
		var gateIdx = getSelectedGate(mousex, mousey, SC/2),
			chosenGate = draggedGate;

		clearInterval(drawDraggedIntervalId);
		drawDraggedIntervalId = undefined;
		draggedGate = 0;
		ctx2.clearRect(0, 0, cvs2.width, cvs2.height);

		if (gateIdx != null){
			var gate = getGate(gateIdx);
			if (!gate.fixed){
				gate.invis = false;
				if (gate.type != chosenGate){
					gate.type = chosenGate;
					updateCircuitValues(gateIdx);
				}
			}
		}
	}
}

function handleMouseMove(){
	mousex = event.clientX-8;
	mousey = event.clientY-8;
	if (draggedGate != 0){
		drawDraggedGate();
	}
}
var circuits = [
{
	startx : null,
	starty : null,
	gateSections : [
		[{
			inputs : [{
				type : "signal",
				val : 0
			}, {
				type : "signal",
				val : 1
			}],
			type : 0,
			outputVal : -1,
			fixed : 0,
			nextGates : [{
				gateIdx : [0, 1, 0],
				inputs : [0]
			}, {
				gateIdx : [0, 1, 1],
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
			type : 3,
			outputVal : 1,
			fixed : 1,
			nextGates : [{
				gateIdx : [0, 1, 1],
				inputs : [1]
			}, {
				gateIdx : [0, 1, 0],
				inputs : [1]
			}]
		}],
		[{
			inputs : [{
				type : "gate",
				gate : [0, 0],
				val : -1
			}, {
				type : "gate",
				gate : [0, 1],
				val : 1
			}],
			type : 3,
			outputVal : -1,
			fixed : 1,
			nextGates : [{
				gateIdx : [0, 2, 0],
				inputs : [0]
			}]
		}, {
			inputs : [{
				type : "gate",
				gate : [0, 0],
				val : -1
			}, {
				type : "gate",
				gate : [0, 1],
				val : 1
			}],
			type : 0,
			outputVal : -1,
			fixed : 0,
			nextGates : [{
				gateIdx : [0, 2, 0],
				inputs : [1]
			}]
		}],
		[{
			inputs : [{
				type : "gate",
				gate : [1, 0],
				val : -1
			}, {
				type : "gate",
				gate : [1, 1],
				val : -1
			}],
			type : 6,
			outputVal : -1,
			fixed : 1,
			nextGates : [{
				gateIdx : [0, 3, 0],
				inputs : [0]
			}]
		}],
		[{
			inputs : [{
				type : "gate",
				gate : [2, 0],
				val : -1
			}],
			type : 7,
			outputVal : 0,
			fixed : 1,
			nextGates : []
		}]
	]
},
{
	startx : null,
	starty : null,
	gateSections : [
		[{
			inputs : [{
				type : "signal",
				val : 0
			}, {
				type : "signal",
				val : 1
			}],
			type : 0,
			outputVal : -1,
			fixed : 0,
			nextGates : [{
				gateIdx : [1, 1, 0],
				inputs : [1]
			}, {
				gateIdx : [1, 1, 1],
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
			type : 0,
			outputVal : -1,
			fixed : 0,
			nextGates : [{
				gateIdx : [1, 1, 1],
				inputs : [1]
			}]
		}],
		[{
			inputs : [{
				type : "signal",
				val : 1
			}, {
				type : "gate",
				gate : [0, 0],
				val : -1
			}],
			type : 0,
			outputVal : -1,
			fixed : 0,
			nextGates : [{
				gateIdx : [1, 2, 0],
				inputs : [0]
			}]
		}, {
			inputs : [{
				type : "gate",
				gate : [0, 0],
				val : -1
			}, {
				type : "gate",
				gate : [0, 1],
				val : -1
			}],
			type : 0,
			outputVal : -1,
			fixed : 0,
			nextGates : [{
				gateIdx : [1, 2, 0],
				inputs : [1]
			}]
		}],
		[{
			inputs : [{
				type : "gate",
				gate : [1, 0],
				val : -1
			}, {
				type : "gate",
				gate : [1, 1],
				val : -1
			}],
			type : 0,
			outputVal : -1,
			fixed : 0,
			nextGates : [{
				gateIdx : [1, 3, 0],
				inputs : [0]
			}]
		}],
		[{
			inputs : [{
				type : "gate",
				gate : [2, 0],
				val : -1
			}],
			type : 7,
			outputVal : 0,
			fixed : 1,
			nextGates : []
		}]
	]
},
{
	startx : null,
	starty : null,
	gateSections : [
		[{
			inputs : [{
				type : "signal",
				val : 0
			}, {
				type : "signal",
				val : 1
			}],
			type : 0,
			outputVal : -1,
			fixed : 0,
			nextGates : [{
				gateIdx : [2, 1, 0],
				inputs : [0, 1]
			}, {
				gateIdx : [2, 1, 1],
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
			type : 2,
			outputVal : 1,
			fixed : 1,
			nextGates : [{
				gateIdx : [2, 1, 1],
				inputs : [1]
			}]
		}],
		[{
			inputs : [{
				type : "gate",
				gate : [0, 0],
				val : -1
			}, {
				type : "gate",
				gate : [0, 0],
				val : -1
			}],
			type : 5,
			outputVal : -1,
			fixed : 1,
			nextGates : [{
				gateIdx : [2, 2, 0],
				inputs : [0]
			}]
		}, {
			inputs : [{
				type : "gate",
				gate : [0, 0],
				val : -1
			}, {
				type : "gate",
				gate : [0, 1],
				val : 1
			}],
			type : 0,
			outputVal : -1,
			fixed : 0,
			nextGates : [{
				gateIdx : [2, 2, 0],
				inputs : [1]
			}]
		}],
		[{
			inputs : [{
				type : "gate",
				gate : [1, 0],
				val : -1
			}, {
				type : "gate",
				gate : [1, 1],
				val : -1
			}],
			type : 6,
			outputVal : -1,
			fixed : 1,
			nextGates : [{
				gateIdx : [2, 3, 0],
				inputs : [0]
			}]
		}],
		[{
			inputs : [{
				type : "gate",
				gate : [2, 0],
				val : -1
			}],
			type : 7,
			outputVal : 0,
			fixed : 1,
			nextGates : []
		}]
	]
}];

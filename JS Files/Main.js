var SC = 20; // Scale
var frameNo = 0;
var cvs1, ctx1, cvs2, ctx2;
var gatesEnum = Object.freeze({"blank":0, "and":1, "nand":2, "or":3, "nor":4, "xor":5, "xnor":6, "bulb":7});
var draggedGate = 0;
var selectedGate = null;
var intervalId;
var mousex, mousey;
var pause = false;

function startGame() {
	// Create the main canvas
	cvs1 = document.createElement("canvas");
	ctx1 = cvs1.getContext("2d");
	cvs1.width = window.innerWidth-15;
	cvs1.height = window.innerHeight-15;
	cvs1.style = "position: absolute; left: 5; top: 5; z-index: 0; background-color: #f1f1f1; border:0px solid #d3d3d3;";
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

	setInterval(updateGameArea, 10);
}

// Updates the values in a circuit after a particular gate has changed.
function updateCircuitValues(gateIdx){
	var gateSections = circuits[gateIdx[0]].gateSections,
		gate = gateSections[gateIdx[1]][gateIdx[2]],
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
	var gate = circuits[gateIdx[0]].gateSections[gateIdx[1]][gateIdx[2]],
		oldOutput = gate.outputVal,
		newOutput;

	// If the gate is empty, or either input is inactive, the output is inactive.
	if (gate.inputs[0].val == -1 || gate.inputs[1].val == -1 || gate.type == 0){
		newOutput = -1;
	} else {
		switch (gate.type){
			case gatesEnum.and:
				newOutput = (gate.inputs[0].val && gate.inputs[1].val) ? 1 : 0;
				break;
			case gatesEnum.nand:
				newOutput = !(gate.inputs[0].val && gate.inputs[1].val) ? 1 : 0;
				break;
			case gatesEnum.or:
				newOutput = (gate.inputs[0].val || gate.inputs[1].val) ? 1 : 0;
				break;
			case gatesEnum.nor:
				newOutput = !(gate.inputs[0].val || gate.inputs[1].val) ? 1 : 0;
				break;
			case gatesEnum.xor:
				newOutput = ((gate.inputs[0].val || gate.inputs[1].val)
								  && !(gate.inputs[0].val && gate.inputs[1].val)) ? 1 : 0;
				break;
			case gatesEnum.xnor:
				newOutput = !((gate.inputs[0].val || gate.inputs[1].val)
							  && !(gate.inputs[0].val && gate.inputs[1].val)) ? 1 : 0;
				break;
		}
	}

	if (oldOutput != newOutput){
		var circuit = circuits[gateIdx[0]],
			wireGroup = circuit.wireSections[gateIdx[1]+1][gateIdx[2]],
			gate = circuit.gateSections[gateIdx[1]][gateIdx[2]];

		gate.outputVal = newOutput;
		wireGroup.live = newOutput;

		for (var i = 0; i < gate.nextGates.length; i++){
			var nextGateIdx = gate.nextGates[i],
				nextGate = circuit.gateSections[nextGateIdx[0]][nextGateIdx[1]];
			for (var j = 0; j < gate.nextGates[i][2].length; j++){
				nextGate.inputs[gate.nextGates[i][2][j]].val = newOutput;
			}
		}
	}

	return gate.outputVal;
}

function getSelectedGate(x, y){
	if (y > 300 && y < 300 + (20*SC)){
		// In y range of circuit
		for (var i = 0; i < circuits.length; i++){
			if ((x > circuits[i].startx) && (x < circuits[i].startx+circuits[i].width)){
				// In x and y range of circuit
				var circuit = circuits[i];
				for (var j = 0; j < circuit.gateSections.length; j++){
					var section = circuit.gateSections[j];
					if ((x > circuit.startx + section[0].xOffset) && (x < circuit.startx + section[0].xOffset + (4*SC))){
						// In x range of gate section
						for (var k = 0; k < section.length; k++){
							var gate = section[k];
							if ((y > circuit.starty + gate.yOffset) && (y < circuit.starty + gate.yOffset + (4*SC))){
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

function drawMenuBar(){
	// Draw outer box
	ctx1.beginPath();
	ctx1.strokeStyle="#666666";
	ctx1.rect(1, 1, cvs1.width-2, (SC*6));
	ctx1.stroke();
	ctx1.strokeStyle="#000000";
	ctx1.closePath();

	// Draw box for each gate
	var x = (cvs1.width / 2) - (14.5*SC);
	var y = SC;
	ctx1.beginPath();
	ctx1.rect(x, y, 4*SC, 4*SC);
	ctx1.rect(x+(5*SC), y, 4*SC, 4*SC);
	ctx1.rect(x+(10*SC), y, 4*SC, 4*SC);
	ctx1.rect(x+(15*SC), y, 4*SC, 4*SC);
	ctx1.rect(x+(20*SC), y, 4*SC, 4*SC);
	ctx1.rect(x+(25*SC), y, 4*SC, 4*SC);
	ctx1.stroke();
	ctx1.closePath();

	// Draw all the gates
	drawAND(x, y, 0, 0, 0, ctx1);
	drawNAND(x+(5*SC), y, 0, 0, 0, ctx1);
	drawOR(x+(10*SC), y, 0, 0, 0, ctx1);
	drawNOR(x+(15*SC), y, 0, 0, 0, ctx1);
	drawXOR(x+(20*SC), y, 0, 0, 0, ctx1);
	drawXNOR(x+(25*SC), y, 0, 0, 0, ctx1);
}

function prepareGameArea(){
	// Draw box around the game area
	ctx1.beginPath();
	ctx1.strokeStyle="#666666";
	ctx1.rect(1, (SC*6), cvs1.width-2, cvs1.height-(SC*6)-2);
	ctx1.stroke();
	ctx1.strokeStyle="#000000";
	ctx1.closePath();

	// Find out how to draw all the circuits
	for (var i = 0; i < circuits.length; i++){
		prepareCircuit(circuits[i]);
		circuits[i].startx = (i == 0) ? cvs1.width+50 : circuits[i-1].startx + circuits[i-1].width + (8*SC);
		circuits[i].starty = 300;
	}
}

function clearGameArea(){
	ctx1.clearRect(2, (SC*6), cvs1.width-4, cvs1.height-(SC*6)-4);
}

function updateGameArea() {
	clearGameArea();

	// Draw box around the game area
	ctx1.beginPath();
	ctx1.strokeStyle="#666666";
	ctx1.rect(1, (SC*6), cvs1.width-2, cvs1.height-(SC*6)-2);
	ctx1.stroke();
	ctx1.strokeStyle="#000000";
	ctx1.closePath();

	// Increase frameNo and move circuits
	for (var i = 0; i < circuits.length; i++){
		drawCircuit(circuits[i], ctx1);
		if (!pause){
			circuits[i].startx--;
			frameNo++;
		}
	}
}

// Draws the whole circuit.
function drawCircuit(circuit, ctx) {
	drawWires(circuit, ctx);
	drawGates(circuit, ctx);
}

function everyinterval(n) {
    if ((frameNo / n) % 1 == 0) {return true;}
    return false;
}

var SC = 25; // Scale
var frameNo = 0;
var cvs1, ctx1, cvs2, ctx2;
var gatesEnum = Object.freeze({"blank":0, "and":1, "nand":2, "or":3, "nor":4, "xor":5, "xnor":6, "bulb":7});
var draggedGate = 0;
var intervalId;
var mousex, mousey;

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

	setInterval(updateGameArea, 10);
}

function handleMouseDown(){
	var y = event.clientY-5;

	if ((y > SC) && (y < (5*SC))){
		var x = event.clientX-5;
		var startX = (cvs1.width/2) - (14.5*SC);
		for (var i = 1; i < 7; i++){
			// See if the mouse position is in the boundaries of one of the gates in the menu bar.
			if ((x > startX+((i-1)*5*SC)) && (x < startX+((i-1)*5*SC)+(4*SC))){
				draggedGate = i;
			}
		}
	}

	intervalId = setInterval(drawDraggedGate, 10);
}

function handleMouseUp(){
	clearInterval(intervalId);
	intervalId = undefined;

	var gateIdx = getSelectedGate(mousex, mousey);
	if (gateIdx != null){
		var circuit = circuits[gateIdx[0]];
		var gate = circuit.gateSections[gateIdx[1]][gateIdx[2]];
		gate.type = draggedGate;
		updateCircuitValues(gateIdx);
	}

	draggedGate = 0;
	ctx2.clearRect(0, 0, cvs2.width, cvs2.height);
}

function handleMouseMove(){
	mousex = event.clientX-5;
	mousey = event.clientY-5;
	if (draggedGate != 0){
		drawDraggedGate();
	}
}

// Recalculates and updates a gate's output, and does the same for future connected gates.
function updateCircuitValues(gateIdx){
	var live = updateGateOutput(gateIdx);


}

// Recalculates the output of a particular gate
function updateGateOutput(gateIdx){
	var gate = circuits[gateIdx[0]].gateSections[gateIdx[1]][gateIdx[2]];

	switch (gate.type){
		case gatesEnum.and:
			gate.outputVal = (gate.inputs[0].val && gate.inputs[1].val);
			break;
		case gatesEnum.nand:
			gate.outputVal = !(gate.inputs[0].val && gate.inputs[1].val);
			break;
		case gatesEnum.or:
			gate.outputVal = (gate.inputs[0].val || gate.inputs[1].val);
			break;
		case gatesEnum.nor:
			gate.outputVal = !(gate.inputs[0].val || gate.inputs[1].val);
			break;
		case gatesEnum.xor:
			gate.outputVal = ((gate.inputs[0].val || gate.inputs[1].val)
							  && !(gate.inputs[0].val && gate.inputs[1].val));
			break;
		case gatesEnum.xnor:
			gate.outputVal = !((gate.inputs[0].val || gate.inputs[1].val)
						  && !(gate.inputs[0].val && gate.inputs[1].val));
			break;
	}

	var circuit = circuits[gateIdx[0]];
	var wireSection = circuit.wireSections[gateIdx[1]+1];
	var wireGroup = wireSection[gateIdx[2]];
	wireGroup.live = gate.outputVal;

	var gate = circuit.gateSections[gateIdx[1]][gateIdx[2]];
	for (var i = 0; i < gate.nextGates.length; i++){
		var nextGateIdx = gate.nextGates[i];
		var nextGate = circuit.gateSections[nextGateIdx[0]][nextGateIdx[1]];
		for (var j = 0; j < gate.nextGates[i][2].length; j++){
			nextGate.inputs[gate.nextGates[i][2][j]].val = gate.outputVal;
		}
	}

	return gate.outputVal;
}

function drawDraggedGate(){
	var x = mousex;
	var y = mousey;
	var gateIdx = getSelectedGate(x, y);

	if (gateIdx != null){
		var circuit = circuits[gateIdx[0]];
		var gate = circuit.gateSections[gateIdx[1]][gateIdx[2]];
		x = circuit.startx + gate.xOffset + (2*SC);
		y = circuit.starty + gate.yOffset + (2*SC);
	}

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
	ctx1.strokeStyle="#666666"; //hail satan?
	ctx1.rect(1, 1, cvs1.width-2, (SC*6));
	ctx1.stroke();
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
	ctx1.closePath();

	// Find out how to draw all the circuits
	for (var i = 0; i < circuits.length; i++){
		findGatePositions(circuits[i]);
		makeWires(circuits[i]);
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
	ctx1.closePath();

	// Increase frameNo and move circuits
	frameNo += 1;
	for (var i = 0; i < circuits.length; i++){
		drawCircuit(circuits[i], ctx1);
		circuits[i].startx = circuits[i].startx - 1;
	}
}

function drawWire(x1, y1, x2, y2, live, ctx){
	ctx.beginPath();
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y2);
	if (live){
		ctx.strokeStyle="#00bfff";
		ctx.lineWidth = 3;
		ctx.stroke();
		ctx.strokeStyle="#000000";
		ctx.lineWidth = 1;
	} else {
		ctx.strokeStyle="#000000";
		ctx.lineWidth = 1;
		ctx.stroke();
	}
	ctx.closePath();
}

// Draws a logic gate. Height 4, Width 6.
function drawGate(x, y, type, input1, input2, output, ctx) {
	ctx.beginPath();
	ctx.setLineDash([5, 3]);
	ctx.strokeStyle="#666666";
	ctx.rect(x, y, 4*SC, 4*SC);
	ctx.stroke();
	ctx.closePath();
	ctx.setLineDash([]);
	ctx.strokeStyle="#000000";

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
	}
}

// Draws the whole circuit.
function drawCircuit(circuit, ctx) {
	drawWires(circuit, ctx);
	drawGates(circuit, ctx);

	// for (var i = 0; i < circuit.columns.length; i++){
	// 	var column = circuit.columns[i];
	// 	if (column.type == "wires") {
	// 		drawWires(circuit, i, x, starty, ctx1);
	// 	} else if (column.type == "gates") {
	// 		var y = starty;
	// 		for (var j = 0; j < column.gates.length; j++) {
	// 			if (typeof(column.gates[j]) != "undefined"){
	// 				drawGate(x, y);
	// 			}
	// 			y += (4*SC);
	// 		}
	// 	}
	// 	//x = (column.type == "wires") ? x + (4*SC) : x + (6*SC);
	// 	x += (4*SC);
	// }
}

function everyinterval(n) {
    if ((frameNo / n) % 1 == 0) {return true;}
    return false;
}

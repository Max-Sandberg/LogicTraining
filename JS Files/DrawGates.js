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
				gate.inputs[0].val,
				gate.inputs[1].val,
				gate.outputVal,
				ctx
			);
		}
	}
}

// Draws the currently selected gate at the position of the mouse cursor, or snapped to a nearby gate.
function drawDraggedGate(){
	var x = mousex,
		y = mousey,
		gateIdx = getSelectedGate(x, y);

	// If the mouse is no longer over the previously selected gate, make that gate visible again.
	if ((selectedGate != null) && (gateIdx == null)){
		circuits[selectedGate[0]].gateSections[selectedGate[1]][selectedGate[2]].invis = false;
		selectedGate = null;
	}
	// If the mouse isn't currently over a gate, draw at the mouse position. Otherwise, draw in the gate, and set that gate to be invisible.
	else if (gateIdx != null){
		var circuit = circuits[gateIdx[0]],
			gate = circuit.gateSections[gateIdx[1]][gateIdx[2]];
		x = circuit.startx + gate.xOffset + (2*SC);
		y = circuit.starty + gate.yOffset + (2*SC);
		// If the mouse has just moved into a new gate, set that gate to invisible.
		if (selectedGate == null){
			gate.invis = true;
			selectedGate = gateIdx;
		}
	}

	// If the mouse isn't currently over a gate, draw at the mouse position. Otherwise, draw in the gate, and set that gate to be invisible.
	if (gateIdx != null){

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
	ctx.beginPath();
	ctx.setLineDash([]);
	ctx.strokeStyle="#000000";
	ctx.lineWidth = 1.5;
	ctx.moveTo(x+(1.6*SC), y+(3.6*SC));
	ctx.lineTo(x+(0.5*SC), y+(3.6*SC));
	ctx.lineTo(x+(0.5*SC), y+(0.4*SC));
	ctx.lineTo(x+(1.6*SC), y+(0.4*SC));
	ctx.stroke();
	ctx.closePath();

	ctx.beginPath();
	ctx.strokeStyle="#000000";
	ctx.lineWidth = 1.5;
	ctx.moveTo(x+(1.6*SC), y+(0.4*SC));
	ctx.bezierCurveTo(x+(4.1*SC), y+(0.4*SC), x+(4.1*SC), y+(3.6*SC), x+(1.6*SC), y+(3.6*SC));
	ctx.stroke();
	ctx.closePath();
	ctx.lineWidth = 1;

	drawWire(x, y+SC, x+(0.5*SC), y+SC, input1, ctx);
	drawWire(x, y+(3*SC), x+(0.5*SC), y+(3*SC), input2, ctx);
	drawWire(x+(3.5*SC), y+(2*SC), x+(4*SC), y+(2*SC), output, ctx);
}

function drawNAND(x, y, input1, input2, output, ctx){
	ctx.beginPath();
	ctx.setLineDash([]);
	ctx.strokeStyle="#000000";
	ctx.lineWidth = 1.5;
	ctx.moveTo(x+(1.4*SC), y+(3.6*SC));
	ctx.lineTo(x+(0.5*SC), y+(3.6*SC));
	ctx.lineTo(x+(0.5*SC), y+(0.4*SC));
	ctx.lineTo(x+(1.4*SC), y+(0.4*SC));
	ctx.stroke();
	ctx.closePath();

	ctx.beginPath();
	ctx.strokeStyle="#000000";
	ctx.lineWidth = 1.5;
	ctx.moveTo(x+(1.4*SC), y+(0.4*SC));
	ctx.bezierCurveTo(x+(3.9*SC), y+(0.4*SC), x+(3.9*SC), y+(3.6*SC), x+(1.4*SC), y+(3.6*SC));
	ctx.stroke();
	ctx.closePath();

	ctx.beginPath();
	ctx.arc(x+(3.5*SC), y+(2*SC), 0.25*SC, 0, 2*Math.PI);
	ctx.stroke();
	ctx.closePath();
	ctx.lineWidth = 1;

	drawWire(x, y+SC, x+(0.5*SC), y+SC, input1, ctx);
	drawWire(x, y+(3*SC), x+(0.5*SC), y+(3*SC), input2, ctx);
	drawWire(x+(3.75*SC), y+(2*SC), x+(4*SC), y+(2*SC), output, ctx);
}

function drawOR(x, y, input1, input2, output, ctx){
	ctx.beginPath();
	ctx.strokeStyle="#000000";
	ctx.lineWidth = 1.5;
	ctx.moveTo(x+(0.4*SC), y+(0.4*SC));
	ctx.bezierCurveTo(x+(1.2*SC), y+(1*SC), x+(1.2*SC), y+(3*SC), x+(0.4*SC), y+(3.6*SC));
	ctx.stroke();
	ctx.closePath();

	ctx.beginPath();
	ctx.strokeStyle="#000000";
	ctx.lineWidth = 1.5;
	ctx.moveTo(x+(0.4*SC), y+(0.4*SC));
	ctx.quadraticCurveTo(x+(3*SC), y+(0.4*SC), x+(3.5*SC), y+(2*SC));
	ctx.moveTo(x+(0.4*SC), y+(3.6*SC));
	ctx.quadraticCurveTo(x+(3*SC), y+(3.6*SC), x+(3.5*SC), y+(2*SC));
	ctx.stroke();
	ctx.closePath();
	ctx.lineWidth = 1;

	drawWire(x, y+SC, x+(0.8*SC), y+SC, input1, ctx);
	drawWire(x, y+(3*SC), x+(0.8*SC), y+(3*SC), input2, ctx);
	drawWire(x+(3.5*SC), y+(2*SC), x+(4*SC), y+(2*SC), output, ctx);
}

function drawNOR(x, y, input1, input2, output, ctx){
	ctx.beginPath();
	ctx.strokeStyle="#000000";
	ctx.lineWidth = 1.5;
	ctx.moveTo(x+(0.4*SC), y+(0.4*SC));
	ctx.bezierCurveTo(x+(1.2*SC), y+(1*SC), x+(1.2*SC), y+(3*SC), x+(0.4*SC), y+(3.6*SC));
	ctx.stroke();
	ctx.closePath();

	ctx.beginPath();
	ctx.strokeStyle="#000000";
	ctx.lineWidth = 1.5;
	ctx.moveTo(x+(0.4*SC), y+(0.4*SC));
	ctx.quadraticCurveTo(x+(2.75*SC), y+(0.4*SC), x+(3.25*SC), y+(2*SC));
	ctx.moveTo(x+(0.4*SC), y+(3.6*SC));
	ctx.quadraticCurveTo(x+(2.75*SC), y+(3.6*SC), x+(3.25*SC), y+(2*SC));
	ctx.stroke();
	ctx.closePath();

	ctx.beginPath();
	ctx.arc(x+(3.5*SC), y+(2*SC), 0.25*SC, 0, 2*Math.PI);
	ctx.stroke();
	ctx.closePath();
	ctx.lineWidth = 1;

	drawWire(x, y+SC, x+(0.8*SC), y+SC, input1, ctx);
	drawWire(x, y+(3*SC), x+(0.8*SC), y+(3*SC), input2, ctx);
	drawWire(x+(3.75*SC), y+(2*SC), x+(4*SC), y+(2*SC), output, ctx);
}

function drawXOR(x, y, input1, input2, output, ctx){
	ctx.beginPath();
	ctx.strokeStyle="#000000";
	ctx.lineWidth = 1.5;
	ctx.moveTo(x+(0.3*SC), y+(0.4*SC));
	ctx.bezierCurveTo(x+(1.1*SC), y+(1*SC), x+(1.1*SC), y+(3*SC), x+(0.3*SC), y+(3.6*SC));
	ctx.moveTo(x+(0.6*SC), y+(0.4*SC));
	ctx.bezierCurveTo(x+(1.4*SC), y+(1*SC), x+(1.4*SC), y+(3*SC), x+(0.6*SC), y+(3.6*SC));
	ctx.stroke();
	ctx.closePath();

	ctx.beginPath();
	ctx.strokeStyle="#000000";
	ctx.lineWidth = 1.5;
	ctx.moveTo(x+(0.6*SC), y+(0.4*SC));
	ctx.quadraticCurveTo(x+(3*SC), y+(0.4*SC), x+(3.5*SC), y+(2*SC));
	ctx.moveTo(x+(0.6*SC), y+(3.6*SC));
	ctx.quadraticCurveTo(x+(3*SC), y+(3.6*SC), x+(3.5*SC), y+(2*SC));
	ctx.stroke();
	ctx.closePath();

	drawWire(x, y+SC, x+(0.7*SC), y+SC, input1, ctx);
	drawWire(x, y+(3*SC), x+(0.7*SC), y+(3*SC), input2, ctx);
	drawWire(x+(3.5*SC), y+(2*SC), x+(4*SC), y+(2*SC), output, ctx);
}

function drawXNOR(x, y, input1, input2, output, ctx){
	ctx.beginPath();
	ctx.strokeStyle="#000000";
	ctx.lineWidth = 1.5;
	ctx.moveTo(x+(0.3*SC), y+(0.4*SC));
	ctx.bezierCurveTo(x+(1.1*SC), y+(1*SC), x+(1.1*SC), y+(3*SC), x+(0.3*SC), y+(3.6*SC));
	ctx.moveTo(x+(0.6*SC), y+(0.4*SC));
	ctx.bezierCurveTo(x+(1.4*SC), y+(1*SC), x+(1.4*SC), y+(3*SC), x+(0.6*SC), y+(3.6*SC));
	ctx.stroke();
	ctx.closePath();

	ctx.beginPath();
	ctx.strokeStyle="#000000";
	ctx.lineWidth = 1.5;
	ctx.moveTo(x+(0.6*SC), y+(0.4*SC));
	ctx.quadraticCurveTo(x+(2.75*SC), y+(0.4*SC), x+(3.25*SC), y+(2*SC));
	ctx.moveTo(x+(0.6*SC), y+(3.6*SC));
	ctx.quadraticCurveTo(x+(2.75*SC), y+(3.6*SC), x+(3.25*SC), y+(2*SC));
	ctx.stroke();
	ctx.closePath();

	ctx.beginPath();
	ctx.arc(x+(3.5*SC), y+(2*SC), 0.25*SC, 0, 2*Math.PI);
	ctx.stroke();
	ctx.closePath();
	ctx.lineWidth = 1;

	drawWire(x, y+SC, x+(0.7*SC), y+SC, input1, ctx);
	drawWire(x, y+(3*SC), x+(0.7*SC), y+(3*SC), input2, ctx);
	drawWire(x+(3.75*SC), y+(2*SC), x+(4*SC), y+(2*SC), output, ctx);
}
//#endregion

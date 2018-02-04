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

// Finds the x and y offsets of every gate in the circuit.
function findGatePositions(circuit){
	var cols = circuit.gateSections;
	for (var i = 0; i < cols.length; i++){
		for (var j = 0; j < cols[i].length; j++){
			cols[i][j].xOffset = (4*SC) + (i*8*SC);
			cols[i][j].yOffset = (cols[i].length == 3) ? (j*8*SC) :
								 (cols[i].length == 2) ? (j*8*SC) + (4*SC) :
								 (cols[i].length == 1) ? (8*SC) : 0;
		}
	}
}

// Add a wireSections property to the circuit object, which details the positions of each wire and which gate output they originate from.
function makeWires(circuit){
	var wireSections = [];
	var gateSections = circuit.gateSections;
	// For each gate section...
	for (var i = 0; i < gateSections.length; i++){
		// Initialise some basic variables
		var wireSection = [];
		var xOffset = gateSections[i][0].xOffset;
		var firstWireCol = [];
		var wireCols = [];
		var lastWireCol = [];

		for (var j = 0; j < gateSections[i].length; j++){
			// Create a new group for each gate in this section.
			var gate = gateSections[i][j];
			var group = {};
			group.outputGate = [i, j];
			group.live = gate.outputVal;
			group.wires = [];
			wireSection.push(group);
		}

		// Create a new group in this section for all signals (these go in their own column at the end of the section).
		var signalGroup = {};
		signalGroup.signals = [];
		signalGroup.wires = [];
		if (i != gateSections.length-1){
			for (var j = 0; j < gateSections[i+1].length; j++){
				var gate = gateSections[i+1][j];
				for (var k = 0; k < gate.inputs.length; k++){
					if (gate.inputs[k].type == "signal"){
						var inputY = gate.yOffset + (1*SC) + (k*2*SC);
						var signal = {};
						signal.y = inputY+10;
						signal.val = gate.inputs[k].val;
						signalGroup.signals.push(signal);

						var wire = {};
						wire.y1 = inputY;
						wire.y2 = inputY;
						wire.x2 = xOffset + (8*SC);
						wire.live = gate.inputs[k].val;
						signalGroup.wires.push(wire);
					}
				}
			}
		}

		// Find all the vertical wires for each gate's wire group.
		for (var j = 0; j < gateSections[i].length; j++){
			var gate = gateSections[i][j];
			var outputY = gate.yOffset + (2*SC);
			var inputsY = [];
			// For each gate input this output leads to
			for (var k = 0; k < gate.nextGates.length; k++){
				// Figure out all the y coordinates we need to go to, and if that should be the first column or not
				var nextGate = gateSections[gate.nextGates[k][0]][gate.nextGates[k][1]];
				for (var l = 0; l < gate.nextGates[k][2].length; l++){
					var wire = {};
					wire.y2 = nextGate.yOffset + (gate.nextGates[k][2][l]*2*SC) + SC;
					wire.gate = j;

					// Checks if there is already a wire in the first column from this group.
					var firstColFree = true;
					for (var m = 0; m < firstWireCol.length; m++){
						if (firstWireCol[m].gate == wire.gate){
							firstColFree = false;
						}
					}

					if (firstColFree || (gate.yOffset == nextGate.yOffset)){
						firstWireCol.push(wire);
					} else {
						wireCols.push([wire]);
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
				wire.x1 = xOffset + (4*SC) + ((j+1)*gap);
				wire.x2 = xOffset + (4*SC) + ((j+1)*gap);
				// If first column in this section, y1 is the output of the gate. Else, y1 is the y2 of the previous vertical wire in this group.
				if (j == 0){
					wire.y1 = gateSections[i][wire.gate].yOffset + (2*SC);
				} else {
					var y1 = -1;
					var count = 1;
					// Go back through previous columns until we find a wire in this group.
					while (y1 == -1){
						if ((j-count) < 0){
							y1 = gateSections[i][wire.gate].yOffset + (2*SC);
						} else {
							for (var l = 0; l < wireCols[j-count].length; l++){
								if (wireCols[j-count][l].gate == wire.gate){
									y1 = wireCols[j-count][l].y2;
								}
							}
						}
						count++;
					}
					wire.y1 = y1;
				}
				// Add this vertical wire to it's corresponding group.
				wireSection[wire.gate].wires.push(wire);

				// Add a horizontal wire leading from this wire's y2 to the next gate to this wire's group.
				var wire = {};
				wire.x1 = wireCols[j][k].x1;
				wire.y1 = wireCols[j][k].y2;
				wire.x2 = xOffset + (8*SC);
				wire.y2 = wireCols[j][k].y2;
				wireSection[wireCols[j][k].gate].wires.push(wire);
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

	// Add the starting wire column
	var firstSection = [{signals : [], wires : []}];
	for (var i = 0; i < gateSections[0].length; i++){
		var gate = gateSections[0][i];
		for (var j = 0; j < 2; j++){
			var inputY = gate.yOffset + (1*SC) + (j*2*SC);
			var signal = {};
			signal.x = (2*SC)-6;
			signal.y = inputY+10;
			signal.val = gate.inputs[j].val;
			firstSection[0].signals.push(signal);

			var wire = {};
			wire.y1 = inputY;
			wire.x1 = (2*SC)+12;
			wire.y2 = inputY;
			wire.x2 = 4*SC;
			wire.live = gate.inputs[j].val;
			firstSection[0].wires.push(wire);
		}
	}
	wireSections.unshift(firstSection);
	circuit.wireSections = wireSections;
}

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

// Draws an input signal.
function drawSignal(x, y, sig, ctx){
	ctx.font = "26px Arial";
	ctx.fillText(sig, x, y);
}

// Draws all the gate sections of a circuit.
function drawGates(circuit, ctx){
	for (var i = 0; i < circuit.gateSections.length; i++){
		var section = circuit.gateSections[i];
		for (var j = 0; j < section.length; j++){
			var gate = section[j];
			drawGate(
				circuit.startx+gate.xOffset,
				circuit.starty+gate.yOffset,
				gate.type,
				gate.inputs[0].val,
				gate.inputs[1].val,
				gate.outputVal,
				ctx
			);
		}
	}
}

// Draws the wires column. Width 4.
// function drawWires(circuit, colIdx, startx, starty, ctx) {
// 	// Draw signals.
// 	var hasSignals = false;
// 	var clmn = circuit.columns[colIdx];
// 	for (var i = 0; i < clmn.signals.length; i++) {
// 		if (typeof(clmn.signals[i]) != "undefined"){
// 			drawSignal(startx, starty+(i*2*SC), clmn.signals[i], ctx);
// 			hasSignals = true;
// 		}
// 	}
//
// 	if (colIdx != 0){
// 		// Find which output goes to which inputs and which of those inputs are closest.
// 		var wireGroups = findWireGroups(circuit, colIdx, starty);
// 		// Find the coordinates of all the vertical lines to draw.
// 		var verticals = findVerticals(wireGroups, startx, hasSignals);
//
// 		for (var i = 0; i < verticals.length; i++){
// 			var v = verticals[i];
// 			// Draw vertical wire
// 			drawWire(v.x, v.y1, v.x, v.y2, false, ctx);
// 			// Draw horizontal wire to input
// 			drawWire(v.x, v.y2, startx+(4*SC), v.y2, false, ctx);
// 		}
//
// 		// Draw horizontal wire from output
// 		for (var i = 0; i < wireGroups.length; i++){
// 			drawWire(startx, wireGroups[i].outputY, verticals[0].x, wireGroups[i].outputY, false, ctx);
// 		}
// 	}
// }
//

//
// // Finds which output wires connect to which input wires, and which input is closest.
// function findWireGroups(circuit, colIdx, starty){
// 	var wireGroups = [];
// 	var prevClmn = circuit.columns[colIdx - 1];
// 	var nextClmn = circuit.columns[colIdx + 1];
//
// 	// For each output in previous gates column...
// 	for (var i = 0; i < prevClmn.gates.length; i++){
// 		if (typeof(prevClmn.gates[i]) != "undefined"){
// 			// Store y coordinate of the output
// 			var group = {};
// 			group.outputY = starty + (2*SC) + (i*4*SC);
// 			group.inputs = [];
// 			// For each input in the next gates column...
// 			for (var j = 0; j < nextClmn.gates.length; j++){
// 				if (typeof(nextClmn.gates[j]) != "undefined"){
// 					var nextGate = nextClmn.gates[j];
// 					for (var k = 0; k < 2; k++){
// 						// If the input is from the current output...
// 						if (nextGate.inputs[k] == i){
// 							// Store y coordinate of this input
// 							var input = {};
// 							input.y = starty + (j*4*SC) + (k*2*SC) + SC;
// 							group.inputs.push(input);
// 						}
// 					}
// 				}
// 			}
//
// 			// Find which inputs are the closest
// 			var smallestDist = -1;
// 			var closestIndx = [];
// 			for (var j = 0; j < group.inputs.length; j++){
// 				var dist = Math.abs(group.outputY - group.inputs[j].y);
// 				if (smallestDist == -1 || dist < smallestDist){
// 					smallestDist = dist;
// 					closestIndx = [j];
// 				} else if (dist == smallestDist){
// 					closestIndx.push(j);
// 				}
// 			}
// 			group.closest = closestIndx;
//
// 			// Push this group to the array
// 			wireGroups.push(group);
// 		}
// 	}
// 	return wireGroups;
// }
//
// function findVerticals(wireGroups, startx, hasSignals){
// 	var verticals = [];
// 	var tempArr = [];
//
// 	for (var i = 0; i < wireGroups.length; i++){
// 		var group = wireGroups[i];
// 		for (var j = 0; j < group.inputs.length; j++){
// 			var line = {};
// 			line.y2 = group.inputs[j].y;
// 			if (group.closest.indexOf(j) != -1){
// 				line.y1 = group.outputY;
// 				verticals.push(line);
// 			} else {
// 				line.y1 = group.inputs[group.closest[0]].y;
// 				tempArr.push(line);
// 			}
// 		}
// 	}
//
// 	var gap = (4*SC)/(tempArr.length+2);
// 	gap = hasSignals ? gap/2 : gap;
// 	var x = startx+gap;
// 	for (var i = 0; i < verticals.length; i++){
// 		verticals[i].x = x;
// 	}
// 	for (var j = 0; j < tempArr.length; j++){
// 		x = startx+((j+2)*gap);
// 		tempArr[j].x = x;
// 	}
//
// 	while (tempArr.length != 0){
// 		verticals.push(tempArr.pop());
// 	}
//
// 	return verticals;
// }

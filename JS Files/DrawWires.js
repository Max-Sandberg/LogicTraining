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

// Draws an input signal.
function drawSignal(x, y, sig, ctx){
	ctx.font = "26px Arial";
	ctx.fillText(sig, x, y);
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

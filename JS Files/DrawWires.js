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

	setTimeout(startAnimation, Math.random()*1000)

	function startAnimation(){
		wire.animations.push([xOffset, yOffset]);
		setTimeout(stopAnimation, 250);
	}

	function stopAnimation(){
		for (var i = 0; i < wire.animations.length; i++){
			if ((wire.animations[i][0] == xOffset) && (wire.animations[i][1] == yOffset)){
				wire.animations.splice(i, 1);
			}
		}
	}
}

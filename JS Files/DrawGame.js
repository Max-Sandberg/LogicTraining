// Draws the menu bar at the top of the screen.
function drawMenuBar(){
	// Clear the menu area.
	ctx1.clearRect(0, 0, cvs1.width, (6*SC));

	// Draw outer box.
	ctx1.beginPath();
	ctx1.lineWidth = 2;
	ctx1.strokeStyle = "#000000";
	ctx1.fillStyle="#2A8958";
	ctx1.rect(1, 1, cvs1.width-2, (SC*6)-1);
	ctx1.fill();
	ctx1.stroke();
	ctx1.closePath();

	// Clear any existing gate button intervals.
	while (gateButtonIntervals.length > 0){
		clearInterval(gateButtonIntervals.pop());
	}

	// Create buttons for all the gates.
	var startx = Math.round((cvs1.width / 2) - (14.5*SC));
	for (var i = 0; i < 6; i++){
		createGateButton(startx + (i*5*SC), SC, i+1);
	}

	// Function to stop the game and return to the menu.
	function handleMenuButtonClick(){
		clearIntervals();
		resetGameState();
		drawMenu();
	}

	// Creates the menu button.
	clearInterval(menuHoverInterval);
	menuHoverInterval = createTextButton(0.5*SC, 0.5*SC, "MENU", SC+2, "left", "#2A8958", handleMenuButtonClick, screens.game);
}

function createGateButton(x, y, gate){
	var unlocked = (allowedGates.indexOf(gate) != -1);

	// Function to draw a gate button.
	function drawGateButton(args, highlight){
		// var x = Math.floor(args[0])+0.5,
		// 	y = Math.floor(args[1])+0.5,
		// 	gate = args[2];
		var x = args[0],
			y = args[1],
			gate = args[2];

		// Draw over whatever was already here.
		ctx1.save();
		ctx1.fillStyle="#2A8958";
		ctx1.fillRect(x-2, y-2, (4*SC)+4, (4*SC)+4);

		// Draw the box, with a thicker border and lighter colour if selected.
		ctx1.strokeStyle = "#000000";
		if (highlight && unlocked){
			ctx1.fillStyle = "#E0F5EB";
			ctx1.lineWidth = 3;
			ctx1.fillRect(x-0.5, y-0.5, (4*SC)+1, (4*SC)+1);
			ctx1.strokeRect(x-0.5, y-0.5, (4*SC)+1, (4*SC)+1);
		} else {
			ctx1.fillStyle = "#CDE7DA";
			ctx1.lineWidth = 2;
			ctx1.fillRect(x, y, 4*SC, 4*SC);
			ctx1.strokeRect(x, y, 4*SC, 4*SC);
		}


		// Draw the gate.
		switch (gate){
			case gates.and:
				drawAND(x, y, 0, 0, 0, ctx1);
				break;
			case gates.nand:
				drawNAND(x, y, 0, 0, 0, ctx1);
				break;
			case gates.or:
				drawOR(x, y, 0, 0, 0, ctx1);
				break;
			case gates.nor:
				drawNOR(x, y, 0, 0, 0, ctx1);
				break;
			case gates.xor:
				drawXOR(x, y, 0, 0, 0, ctx1);
				break;
			case gates.xnor:
				drawXNOR(x, y, 0, 0, 0, ctx1);
				break;
		}

		// Draw the hotkey number.
		ctx1.textAlign = "left";
		ctx1.font = "8pt Arial";
		ctx1.fillStyle = "#000000";
		ctx1.fillText(gate, x+(4*SC)-10, y+(4*SC)-4);

		if (!unlocked){
			// Draw transparent grey box.
			ctx1.fillStyle = "rgba(0, 0, 0, 0.6)";
			ctx1.fillRect(x, y, 4*SC, 4*SC);

			// Draw lock icon.
			ctx1.textAlign = "center";
			ctx1.font = 2*SC + "px FontAwesome";
			ctx1.fillStyle = "#000000";
			ctx1.fillText("\uf023", x+(2*SC)+3, y+(2.7*SC)+3);
			ctx1.font = 2*SC + "px FontAwesome";
			ctx1.fillStyle = "#ffffff";
			ctx1.fillText("\uf023", x+(2*SC), y+(2.7*SC));
		}
		ctx1.restore();
	}

	// Function to check if the mouse is hovering over the button.
	function checkHover(){
		return (draggedGate == 0 && (mousex > x && mousex < x+(4*SC) && mousey > y && mousey < y+(4*SC)));
	}

	// Function to call when the button is clicked.
	function handleClick(){
		if (unlocked){
			// Sets draggedGate to the selected gate, and puts drawDraggedGate on an interval, so that it can be redrawn to snap to nearby gates even if the mouse doesn't move.
			draggedGate = gate;
			drawDraggedInterval = setInterval(drawDraggedGate, 1000/60);
			updateSelectedInterval = setInterval(updateSelectedGate, 50);
		}
	}

	gateButtonIntervals.push(createButton(drawGateButton, [x, y, gate], checkHover, handleClick, screens.game));
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
			if (circuits[i].fast && circuits[i].startx < cvs1.width){
				circuits[i].startx -= 20* 1.5 * scrollSpeed;
			} else {
				circuits[i].startx -= 20* scrollSpeed;
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

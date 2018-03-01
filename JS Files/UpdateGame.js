
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

		won = (gameState == "won");
		showEndScreen();
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

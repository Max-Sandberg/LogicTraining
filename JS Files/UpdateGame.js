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

	// When the last two circuits are on the screen, we need to start regularly checking if all the circuits are complete or scrolled off the screen, so we can end the game.
	if ((level.tutorial || circuits[circuits.length-2].startx <= 0) && checkAllCircuitsComplete()){
		endLevel();
	}
}

// Returns true if all the circuits in a level are complete or off the screen.
function checkAllCircuitsComplete(){
	for (var i = 0; i < circuits.length; i++){
		var gateSections = circuits[i].gateSections,
			bulb = gateSections[gateSections.length-1][0];
		if (bulb.outputVal == -1){
			if (circuits[i].startx + circuits[i].width < 0){
				bulb.outputVal == 0;
			} else {
				return false;
			}
		}
	}
	return true;
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

	var frame = -1,
	 	xOffset = Math.round(cvs1.width / 2) + (26*SC),
		yOffset = SC,
		opacity,
		id = setInterval(animateCountdown, 20);

	function animateCountdown(){
		frame++;
		if (won == undefined){
			// Fill over whatever is already there.
			ctx1.fillStyle = "#2A8958";
			ctx1.fillRect(xOffset-(4*SC), yOffset, (8*SC), (4*SC));

			if (frame != 150){
				// Draw the number.
				ctx1.textAlign = "center";
				opacity = 1-(frame%50)/50;
				ctx1.font = "italic " + (2*SC) + "pt Impact";
				ctx1.fillStyle = "rgba(180, 214, 197, " + opacity + ")";
				ctx1.fillText(3-Math.floor(frame/50), xOffset+2, yOffset+(3*SC)+2);
				ctx1.fillStyle = "rgba(17, 55, 35, " + opacity + ")";
				ctx1.fillText(3-Math.floor(frame/50), xOffset, yOffset+(3*SC));
				ctx1.textAlign = "left";
			}
		}
		if (frame == 150){
			// Update the allowed gates and redraw the menu bar, then display the "Gate change!" animation.
			clearInterval(id);
			if (won == undefined){
				allowedGates = [gate1, gate2, gate3];
				drawMenuBar();
			}
			frame = -1;
			id = setInterval(animateGateChange, 20);
		}
	}

	function animateGateChange(){
		frame++;
		if (won == undefined){
			// Fill over whatever is already there.
			ctx1.fillStyle = "#2A8958";
			ctx1.fillRect(xOffset-(10*SC), yOffset, (20*SC), (4*SC));

			if (frame != 75){
				// Draw "GATE CHANGE!".
				ctx1.textAlign = "center";
				opacity = (frame < 50) ? 1 : (75-frame)/25;
				ctx1.font = "italic " + (2*SC) + "pt Impact";
				ctx1.fillStyle = "rgba(180, 214, 197, " + opacity + ")";
				ctx1.fillText("GATE CHANGE!", xOffset+2, yOffset + (3*SC) + 2);
				ctx1.fillStyle = "rgba(17, 55, 35, " + opacity + ")";
				ctx1.fillText("GATE CHANGE!", xOffset, yOffset + (3*SC));
				ctx1.textAlign = "left";
			}
		}
		if (frame == 75){
			clearInterval(id);
		}
	}
}

// Checks if the user clicked on a gate in the menu bar, and if so, set draggedGate to that gate.
function handleMouseDown(){
	// If player is already holding a gate without holding the mouse down, i.e. they used a hotkey, place that gate.
	if (draggedGate != 0){
		updateSelectedGate();
		handleMouseUp();
	}

	// if (draggedGate != 0){
	// 	// Player is already holding a gate without holding the mouse down, i.e. they used a hotkey.
	// 	handleMouseUp();
	// } else {
	// 	// See if the mouse position is in the boundaries of one of the gates in the menu bar.
	// 	if ((mousey > SC) && (mousey < (5*SC))){
	// 		var startX = (cvs1.width/2) - (14.5*SC);
	// 		for (var i = 1; i < 7; i++){
	// 			if ((allowedGates.indexOf(i) != -1) && (mousex > startX+((i-1)*5*SC)) && (mousex < startX+((i-1)*5*SC)+(4*SC))){
	// 				// Sets draggedGate to the selected gate, and puts drawDraggedGate on an interval, so that it can be redrawn to snap to nearby gates even if the mouse doesn't move.
	// 				draggedGate = i;
	// 				drawDraggedInterval = setInterval(drawDraggedGate, 1000/60);
	// 				updateSelectedInterval = setInterval(updateSelectedGate, 50);
	// 			}
	// 		}
	// 	// } else {
	// 		// var gate = getSelectedGate(mousex, mousey, 0);
	// 		// if (gate != null){
	// 		// 	// If the user clicked and dragged a non-fixed gate in the circuit, remove that gate from the circuit.
	// 		// 	draggedGate = gate.type;
	// 		// 	gate.type = 0;
	// 		// 	updateCircuitValues(gate.idx);
	// 		// 	drawDraggedInterval = setInterval(drawDraggedGate, 1000/60);
	// 		// 	updateSelectedInterval = setInterval(updateSelectedGate, 50);
	// 		// }
	// 	}
	// }
}

// Checks if the user is currently dragging a gate, and if they released the mouse over a non-fixed gate in a circuit. If so, update that gate's type and update the circuit's values.
function handleMouseUp(){
	if (draggedGate != 0){
		var gate = getSelectedGate(mousex, mousey, 12),
			chosenGate = draggedGate;

		// Clear all the gate dragging intervals, and clear whatever dragged gate is being drawn.
		clearInterval(updateSelectedInterval);
		clearInterval(drawDraggedInterval);
		updateSelectedInterval = undefined;
		drawDraggedInterval = undefined;
		draggedGate = 0;
		ctx2.clearRect(0, 0, cvs2.width, cvs2.height);

		// If there is a gate at this position, update it with the selected gate.
		if (gate != null){
			gate.type = chosenGate;
			gate.invis = false;
			gate.fixed = true;
			updateCircuitValues(gate.idx);
		}

		// Check if all the circuits are now complete, and end the game if so.
		if (currentScreen != screens.gateIntro && checkAllCircuitsComplete()){
			endLevel();
		}
	}
	selectedGate = null;
}

function handleMouseMove(event){
	mousex = event.clientX;
	mousey = event.clientY;
}

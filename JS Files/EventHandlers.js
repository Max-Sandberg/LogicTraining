// Checks if the user clicked on a gate in the menu bar, and if so, set draggedGate to that gate.
function handleMouseDown(){
	draggedGate = 0;

	// See if the mouse position is in the boundaries of one of the gates in the menu bar.
	if ((mousey > SC) && (mousey < (5*SC))){
		var startX = (cvs1.width/2) - (14.5*SC);
		for (var i = 1; i < 7; i++){
			if ((mousex > startX+((i-1)*5*SC)) && (mousex < startX+((i-1)*5*SC)+(4*SC))){
				// Sets draggedGate to the selected gate, and puts drawDraggedGate on an interval, so that it can be redrawn to snap to nearby gates even if the mouse doesn't move.
				draggedGate = i;
				drawDraggedIntervalId = setInterval(drawDraggedGate, 10);
			}
		}
	} else {
		var gateIdx = getSelectedGate(mousex, mousey);
		if (gateIdx != null){
			// If the user clicked and dragged a non-fixed gate in the circuit, remove that gate from the circuit.
			var gate = getGate(gateIdx);
			if (!gate.fixed){
				draggedGate = gate.type;
				gate.type = 0;
				updateCircuitValues(gateIdx);
				drawDraggedIntervalId = setInterval(drawDraggedGate, 10);
			}
		}
	}
}

// Checks if the user is currently dragging a gate, and if they released the mouse over a non-fixed gate in a circuit. If so, update that gate's type and update the circuit's values.
function handleMouseUp(){
	if (draggedGate != 0){
		var gateIdx = getSelectedGate(mousex, mousey),
			chosenGate = draggedGate;

		clearInterval(drawDraggedIntervalId);
		drawDraggedIntervalId = undefined;
		draggedGate = 0;
		ctx2.clearRect(0, 0, cvs2.width, cvs2.height);

		if (gateIdx != null){
			var gate = getGate(gateIdx);
			if (!gate.fixed){
				gate.invis = false;
				if (gate.type != chosenGate){
					gate.type = chosenGate;
					updateCircuitValues(gateIdx);
				}
			}
		}
	}
}

function handleMouseMove(){
	mousex = event.clientX-5;
	mousey = event.clientY-5;
	if (draggedGate != 0){
		drawDraggedGate();
	}
}

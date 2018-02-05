// Checks if the user clicked on a gate in the menu bar, and if so, set draggedGate to that gate.
function handleMouseDown(){
	var y = event.clientY-5;
	draggedGate = 0;

	// See if the mouse position is in the boundaries of one of the gates in the menu bar.
	if ((y > SC) && (y < (5*SC))){
		var x = event.clientX-5;
		var startX = (cvs1.width/2) - (14.5*SC);
		for (var i = 1; i < 7; i++){
			if ((x > startX+((i-1)*5*SC)) && (x < startX+((i-1)*5*SC)+(4*SC))){
				// Sets draggedGate to the selected gate, and puts drawDraggedGate on an interval, so that it can be redrawn to snap to nearby gates even if the mouse doesn't move.
				draggedGate = i;
				intervalId = setInterval(drawDraggedGate, 10);
			}
		}
	}
}

// Checks if the user is currently dragging a gate, and if they released the mouse over a gate in a circuit. If so, update that gate's type and update the circuit's values.
function handleMouseUp(){
	if (draggedGate != 0){
		var gateIdx = getSelectedGate(mousex, mousey),
			chosenGate = draggedGate;

		clearInterval(intervalId);
		intervalId = undefined;
		draggedGate = 0;
		ctx2.clearRect(0, 0, cvs2.width, cvs2.height);

		if (gateIdx != null){
			var circuit = circuits[gateIdx[0]],
				gate = circuit.gateSections[gateIdx[1]][gateIdx[2]];
			gate.invis = false;
			if (gate.type != chosenGate){
				gate.type = chosenGate;
				updateCircuitValues(gateIdx);
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

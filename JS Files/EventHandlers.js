function handleMouseDown(){
	var y = event.clientY-5;

	if ((y > SC) && (y < (5*SC))){
		var x = event.clientX-5;
		var startX = (cvs1.width/2) - (14.5*SC);
		for (var i = 1; i < 7; i++){
			// See if the mouse position is in the boundaries of one of the gates in the menu bar.
			if ((x > startX+((i-1)*5*SC)) && (x < startX+((i-1)*5*SC)+(4*SC))){
				draggedGate = i;
			}
		}
	}

	intervalId = setInterval(drawDraggedGate, 10);
}

function handleMouseUp(){
	clearInterval(intervalId);
	intervalId = undefined;

	var gateIdx = getSelectedGate(mousex, mousey);
	if (gateIdx != null){
		var circuit = circuits[gateIdx[0]];
		var gate = circuit.gateSections[gateIdx[1]][gateIdx[2]];
		gate.type = draggedGate;
		updateCircuitValues(gateIdx);
	}

	draggedGate = 0;
	ctx2.clearRect(0, 0, cvs2.width, cvs2.height);
}

function handleMouseMove(){
	mousex = event.clientX-5;
	mousey = event.clientY-5;
	if (draggedGate != 0){
		drawDraggedGate();
	}
}

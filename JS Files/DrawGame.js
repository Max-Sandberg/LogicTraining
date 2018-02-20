// Draws the menu bar at the top of the screen.
function drawMenuBar(){
	// Clear the menu area.
	ctx1.clearRect(1, 1, cvs1.width-2, (6*SC));

	// Draw outer box.
	ctx1.beginPath();
	ctx1.lineWidth = 2;
	ctx1.strokeStyle = "#000000";
	ctx1.fillStyle="#2a8958";
	ctx1.rect(1, 1, cvs1.width-2, (SC*6));
	ctx1.fill();
	ctx1.stroke();
	ctx1.closePath();

	// Draw box for each gate.
	var x = Math.round((cvs1.width / 2) - (14.5*SC));
	var y = SC;
	ctx1.beginPath();
	ctx1.lineWidth = 2;
	ctx1.fillStyle = "#d8f3e6";
	ctx1.rect(x, y, 4*SC, 4*SC);
	ctx1.rect(x+(5*SC), y, 4*SC, 4*SC);
	ctx1.rect(x+(10*SC), y, 4*SC, 4*SC);
	ctx1.rect(x+(15*SC), y, 4*SC, 4*SC);
	ctx1.rect(x+(20*SC), y, 4*SC, 4*SC);
	ctx1.rect(x+(25*SC), y, 4*SC, 4*SC);
	ctx1.fill();
	ctx1.stroke();
	ctx1.closePath();

	// Draw all the gates.
	drawAND(x, y, 0, 0, 0, ctx1);
	drawNAND(x+(5*SC), y, 0, 0, 0, ctx1);
	drawOR(x+(10*SC), y, 0, 0, 0, ctx1);
	drawNOR(x+(15*SC), y, 0, 0, 0, ctx1);
	drawXOR(x+(20*SC), y, 0, 0, 0, ctx1);
	drawXNOR(x+(25*SC), y, 0, 0, 0, ctx1);

	// Draw a partially transparent grey box and a lock symbol on any locked gates.
	for (var i = 1; i < 7; i++){
		if (!allowedGates.includes(i)){
			// Draw transparent grey box.
			var startx = x+((i-1)*5*SC);
			ctx1.fillStyle = "rgba(0, 0, 0, 0.4)";
			ctx1.beginPath();
			ctx1.rect(startx, y, 4*SC, 4*SC);
			ctx1.fill();
			ctx1.closePath();

			// Draw lock icon.
			ctx1.font = 2*SC + "px FontAwesome";
			ctx1.fillStyle = "#000000";
			ctx1.fillText("\uf023", startx+(1.45*SC), y+(2.8*SC));
			ctx1.font = 2*SC + "px FontAwesome";
			ctx1.fillStyle = "#ffffff";
			ctx1.fillText("\uf023", startx+(1.3*SC), y+(2.65*SC));
		}
	}
}

// Draws and moves all the circuits.
function drawGameArea(ctx){
	// Increase frameNo, and clear the game area.
	if (!pause) { frameNo++; }
	clearGameArea();

	// Move and draw the circuits.
	for (var i = 0; i < circuits.length; i++){
		if (!pause){ circuits[i].startx--; }
		drawCircuit(circuits[i], ctx);
	}

	// Draw box around game area.
	ctx1.beginPath();
	ctx1.strokeStyle="#000000";
	ctx1.rect(1, (SC*6), cvs1.width-2, cvs1.height-(SC*6)-2);
	ctx1.stroke();
	ctx1.closePath();
}

// Display the "You Lost" message box.
function displayLoseMessage(ctx){
	// Draw the box.
	ctx.lineWidth = 1;
	ctx.fillStyle = "#eeeeee";
	var rectX = (cvs1.width/2)-100,
		rectY = ((cvs1.height-(6*SC))/2)+(6*SC)-50;
	ctx.rect(rectX, rectY, 200, 100);
	ctx.fill();
	ctx.stroke();
	ctx.fillStyle = "#000000";

	// Write the "You Lost :(" message
	ctx.font = "26px Arial";
	ctx.fillText("You lost.", rectX + 32, rectY + 60);
	ctx.font = "26px FontAwesome";
	ctx.fillText("\uf119", rectX + 148, rectY + 60);
}

function displayWinMessage(ctx){
	// Draw the box.
	ctx.lineWidth = 1;
	ctx.fillStyle = "#eeeeee";
	var rectX = (cvs1.width/2)-100,
		rectY = ((cvs1.height-(6*SC))/2)+(6*SC)-50;
	ctx.rect(rectX, rectY, 200, 100);
	ctx.fill();
	ctx.stroke();
	ctx.fillStyle = "#000000";

	// Write the "You Won! :)" message
	ctx.font = "26px Arial";
	ctx.fillText("You win!", rectX + 32, rectY + 60);
	ctx.font = "26px FontAwesome";
	ctx.fillText("\uf118", rectX + 148, rectY + 60);
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
	ctx.font = SC + "px FontAwesome";
	ctx.fillStyle = "#00bfff";
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
	ctx1.clearRect(2, (SC*6), cvs1.width-4, cvs1.height-(SC*6)-2);
}
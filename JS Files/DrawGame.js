// Draws the menu bar at the top of the screen.
function drawMenuBar(){
	// Clear the menu area.
	ctx1.clearRect(0, 0, cvs1.width, (6*SC));

	// Draw outer box.
	ctx1.beginPath();
	ctx1.lineWidth = 2;
	ctx1.strokeStyle = "#000000";
	ctx1.fillStyle="#2a8958";
	ctx1.rect(1, 1, cvs1.width-2, (SC*6)-1);
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

	// Draw the hotkey numbers.
	for (var i = 0; i < 6; i++){
		ctx1.font = "8pt Arial";
		ctx1.fillStyle = "#000000";
		ctx1.fillText(i+1, x+(i*5*SC)+(4*SC)-10, y+(4*SC)-4);
	}

	// Draw a partially transparent grey box and a lock symbol on any locked gates.
	for (var i = 1; i < 7; i++){
		if (!allowedGates.includes(i)){
			// Draw transparent grey box.
			var startx = x+((i-1)*5*SC);
			ctx1.fillStyle = "rgba(0, 0, 0, 0.4)";
			ctx1.fillRect(startx, y, 4*SC, 4*SC);

			// Draw lock icon.
			ctx1.font = 2*SC + "px FontAwesome";
			ctx1.fillStyle = "#000000";
			ctx1.fillText("\uf023", startx+(1.45*SC), y+(2.8*SC));
			ctx1.font = 2*SC + "px FontAwesome";
			ctx1.fillStyle = "#ffffff";
			ctx1.fillText("\uf023", startx+(1.3*SC), y+(2.65*SC));
		}
	}

	// Draw the menu button.
	ctx1.font = "16pt Impact";
	ctx1.fillStyle = "rgba(0, 0, 0, 0.4)";
	ctx1.fillText("MENU", 10, 28);
	if (menuHoverIntervalId == undefined){
		var highlightMenu = false;
		menuHoverIntervalId = setInterval(function(){
			// Clear this interval if we go back to the menu.
			if (selectedLevel == -1){
				clearInterval(menuHoverIntervalId);
				menuHoverIntervalId = undefined;
			} else {
				// Highlight or un-highlight the button.
				if ((mousex > 10 && mousex < 60 && mousey > 10 && mousey < 28) && !highlightMenu){
					highlightMenu = true;
					ctx1.fillStyle="#2a8958";
					ctx1.fillRect(10, 10, 50, 18);
					ctx1.fillStyle = "rgba(0, 0, 0, 1)";
					ctx1.font = "16pt Impact";
					ctx1.fillText("MENU", 10, 28);
				}
				else if (!(mousex > 10 && mousex < 60 && mousey > 10 && mousey < 28) && highlightMenu){
					highlightMenu = false;
					ctx1.fillStyle="#2a8958";
					ctx1.fillRect(10, 10, 50, 18);
					ctx1.fillStyle = "rgba(0, 0, 0, 0.4)";
					ctx1.font = "16pt Impact";
					ctx1.fillText("MENU", 10, 28);
				}
			}
		}, 50);
	}
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
			if (circuits[i].type == gatesEnum.star && circuits[i].startx < cvs1.width){
				circuits[i].startx -= 1.5;
			} else {
				circuits[i].startx -= 1;
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

function drawMoves(){
	ctx1.strokeStyle = "#000000";
	ctx1.fillStyle = "#2a8958";
	ctx1.lineWidth = 2;
	ctx1.beginPath();
	ctx1.moveTo((cvs1.width/2)-80, cvs1.height-2);
	ctx1.lineTo((cvs1.width/2)-50, cvs1.height-60);
	ctx1.lineTo((cvs1.width/2)+50, cvs1.height-60);
	ctx1.lineTo((cvs1.width/2)+80, cvs1.height-2);
	ctx1.fill();
	ctx1.stroke();
	ctx1.closePath();

	ctx1.textAlign = "center";
	ctx1.font = "18pt Impact";
	ctx1.fillStyle = "#000000";
	ctx1.fillText("MOVES: " + moves, cvs1.width/2, cvs1.height-30);
	ctx1.fillStyle = (moves > levels[selectedLevel].par) ? "#B4301F" : "#C4EDD8";
	ctx1.font = "12pt Tahoma";
	ctx1.fontWeight = "bold"
	ctx1.fillText("(PAR: " + levels[selectedLevel].par + ")", cvs1.width/2, cvs1.height-10);
	ctx1.fontWeight = "normal"
	ctx1.textAlign = "left";
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

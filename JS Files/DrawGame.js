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
	ctx1.save();
	ctx1.textAlign = "center";
	for (var i = 1; i < 7; i++){
		if (!allowedGates.includes(i)){
			// Draw transparent grey box.
			var startx = x+((i-1)*5*SC);
			ctx1.fillStyle = "rgba(0, 0, 0, 0.6)";
			ctx1.fillRect(startx, y, 4*SC, 4*SC);

			// Draw lock icon.
			ctx1.font = 2*SC + "px FontAwesome";
			ctx1.fillStyle = "#000000";
			ctx1.fillText("\uf023", startx+(2*SC)+3, y+(2.7*SC)+3);
			ctx1.font = 2*SC + "px FontAwesome";
			ctx1.fillStyle = "#ffffff";
			ctx1.fillText("\uf023", startx+(2*SC), y+(2.7*SC));
		}
	}
	ctx1.restore();

	// Function to draw the menu button.
	function drawMenuButton(colour){
		ctx1.save();
		// Draw over whatever is already here.
		ctx1.font = (SC+2) + "pt Impact";
		menuButtonWidth = ctx1.measureText("MENU").width;
		ctx1.fillStyle = "#2A8958";
		ctx1.fillRect((0.5*SC)-3, (0.5*SC)-4, menuButtonWidth+6, SC+8);
		// Draw the MENU text in the given colour.
		ctx1.textAlign = "left";
		ctx1.fillStyle = colour;
		ctx1.fillText("MENU", 0.5*SC, (1.5*SC)+2);
		ctx1.restore();
	}
	var menuButtonWidth;
	drawMenuButton("rgba(0, 0, 0, 0.5)");

	// If there isn't already an interval checking if the mouse is hovering over the menu, create one.
	if (menuHoverIntervalId == undefined){
		var highlightMenu = false,
			btnStartX = 0.5*SC,
			btnEndX = (0.5*SC)+menuButtonWidth,
			btnStartY = (0.5*SC)-2,
			btnEndY = 1.5*SC+2;

		// Function to check if the mouse is hovering over the menu button.
		function checkMenuHover(){
			return (mousex > btnStartX && mousex < btnEndX && mousey > btnStartY && mousey < btnEndY);
		}
		var onBtn = checkMenuHover();

		// Function to check the menu button is in the correct state, to be called on an interval.
		function updateMenuButton(){
			// Clear this interval if we go back to the menu.
			if (currentScreen == screens.menu){
				clearInterval(menuHoverIntervalId);
				menuHoverIntervalId = undefined;
			} else {
				mouseOverBtn = checkMenuHover();
				if (!highlightMenu && mouseOverBtn){
					// If the mouse is over the button and it isn't highlighted, highlight it.
					highlightMenu = true;
					drawMenuButton("rgba(0, 0, 0, 1)");
					cvs2.onmousedown = handleMenuButtonClick;
				}
				else if (highlightMenu && !mouseOverBtn){
					// If the mouse isn't over the button and it's still highlighted, unhighlight it.
					highlightMenu = false;
					drawMenuButton("rgba(0, 0, 0, 0.5)");
					cvs2.onmousedown = handleMouseDown;
				}
			}
		}

		// Function to stop the game and return to the menu.
		function handleMenuButtonClick(){
			clearIntervals();
			resetGameState();
			drawMenu();
		}

		menuHoverIntervalId = setInterval(updateMenuButton, 80);
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
				circuits[i].startx -= 1.6 * scrollSpeed;
			} else {
				circuits[i].startx -= scrollSpeed;
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
	ctx1.fillStyle = (moves > level.par) ? "#B4301F" : "#C4EDD8";
	ctx1.font = "12pt Tahoma";
	ctx1.fontWeight = "bold"
	ctx1.fillText("(PAR: " + level.par + ")", cvs1.width/2, cvs1.height-10);
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

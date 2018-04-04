var selectedLevel = -1;

function drawMenu(){
	// Clear the area.
	ctx1.clearRect(0, 0, cvs1.width, cvs1.height);

	// Draw dark green background
	ctx1.fillStyle = "#184e32";
	ctx1.beginPath();
	ctx1.rect(0, 0, cvs1.width, cvs1.height);
	ctx1.fill();
	ctx1.stroke();
	ctx1.closePath();

	// Draw title
	ctx1.font = (3*SC) + "pt Impact";
	ctx1.fillStyle = "#FFFFFF";
	ctx1.fillText("Logic Training", (cvs1.width/2) - (11.5*SC) + 2, (cvs1.height/2) - (6*SC) + 2);
	ctx1.fillStyle = "#000000";
	ctx1.fillText("Logic Training", (cvs1.width/2) - (11.5*SC), (cvs1.height/2) - (6*SC));

	drawLevels(ctx1);

	cvs2.onmousedown = handleMenuMouseDown;
	cvs2.onmousemove = handleMenuMouseMove;
}

// Draws the icons for each level.
function drawLevels(ctx){
	var startx, width, x, y, selected;
	y = Math.round((cvs1.height/2) - (2*SC));
	width = (levels.length*6*SC) + ((levels.length-1)*3*SC);
	startx = Math.round((cvs1.width/2) - (width/2));

	for (var i = 0; i < levels.length; i++){
		selected = (levels[i].unlocked && selectedLevel == i);

		// Draw rectangle around the level.
		x = startx + (i*9*SC);
		ctx.fillStyle = (selected) ? "#7D9C8D" : "#5D8370";
		ctx.lineWidth = (selected) ? 3 : 1;
		ctx.strokeStyle = "#000000";
		ctx.fillRect(x+0.5, y+0.5, 6*SC, 6*SC);
		ctx.strokeRect(x+0.5, y+0.5, 6*SC, 6*SC);
		ctx.lineWidth = 1;

		if (i == 0){
			// Draw the tutorial button
			ctx.font = SC + "pt Impact";
			ctx.textAlign = "center";
			ctx.fillStyle = "#000000";
			ctx.fillText("TUTORIAL", x+(3*SC), y+(3*SC)+(0.4*SC));
			ctx.textAlign = "left";
		} else {
			// Write the "LEVEL" text.
			ctx.font = (0.8*SC) + "pt Impact";
			ctx.fillStyle = "#000000";
			ctx.fillText("LEVEL", x+(1.8*SC), y+(1.5*SC));

			// Draw the level number.
			ctx.font = (2*SC) + "pt Impact";
			ctx.fillStyle = "#000000";
			ctx.fillText(i, x+(2.3*SC), y+(4.2*SC));

			// Draw the stars, filling in the ones which have been earned.
			ctx.font = (0.8*SC) + "pt FontAwesome";
			for (var j = 0; j < 3; j++){
				if (j < levels[i].starsGained){
					ctx.fillStyle = "#ffff00";
					ctx.fillText("\uF005", x+(1.2*SC)+(j*25), y+(5.5*SC));
				}
				ctx.strokeStyle = "#000000";
				ctx.strokeText("\uF005", x+(1.2*SC)+(j*25), y+(5.5*SC));
			}

			if (!levels[i].unlocked){
				// Draw transparent grey box.
				ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
				ctx.fillRect(x, y, 6*SC, 6*SC);

				// Draw lock icon.
				ctx.font = 1.5*SC + "px FontAwesome";
				ctx.fillStyle = "#262626";
				ctx.fillText("\uf023", x+8, y+(1.5*SC)+2);
				ctx.font = 1.5*SC + "px FontAwesome";
				ctx.fillStyle = "#f2f2f2";
				ctx.fillText("\uf023", x+6, y+(1.5*SC));
			}
		}
	}
}

function handleMenuMouseMove(){
	mousex = event.clientX;
	mousey = event.clientY;

	var lvl = getSelectedLevel();
	if (lvl != selectedLevel){
		selectedLevel = lvl;
		drawMenu();
	}
}

function handleMenuMouseDown(){
	// If the level is unlocked, start the level the user clicked on.
	if (selectedLevel == 0){
		startTutorial();
	} else if (selectedLevel != -1 && levels[selectedLevel].unlocked){
		startLevel(selectedLevel);
	}
}

// Find which level icon the mouse is hovering over, if any.
function getSelectedLevel(){
	if ((mousey > (cvs1.height/2)-(2*SC)) && (mousey < (cvs1.height/2)+(4*SC))){
		// In y range of levels
			var width = (levels.length*6*SC) + ((levels.length-1)*3*SC),
			startx = Math.round((cvs1.width/2)-(width/2));
		for (var i = 0; i < levels.length; i++){
			if ((mousex > startx+(i*9*SC)) && (mousex < startx+(i*9*SC)+(6*SC))){
				// In x range of a level
				return i;
			}
		}
	}

	return -1;
}

var selectedLevel = -1;

function prepareGame(){
	// Create the main canvas
	cvs1 = document.createElement("canvas");
	ctx1 = cvs1.getContext("2d");
	cvs1.width = window.innerWidth-15;
	cvs1.height = window.innerHeight-15;
	cvs1.style = "position: absolute; left: 5; top: 5; z-index: 0; background-color: #d8f3e6; border:0px solid #d3d3d3;";
	document.body.insertBefore(cvs1, document.body.childNodes[0]);

	// Create the layer 2 canvas
	cvs2 = document.createElement("canvas");
	ctx2 = cvs2.getContext("2d");
	cvs2.width = window.innerWidth-15;
	cvs2.height = window.innerHeight-15;
	cvs2.style = "position: absolute; left: 5; top: 5; z-index: 1;";
	document.body.insertBefore(cvs2, document.body.childNodes[0]);

	SC = Math.round((cvs1.height/50)/5) * 5;

	// Draw a dark green box over the whole screen
	drawMenu(ctx1);
}

function drawMenu(ctx){
	// Clear the area.
	ctx.clearRect(0, 0, cvs1.width, cvs1.height);

	// Draw dark green background
	ctx.fillStyle = "#184e32";
	ctx.beginPath();
	ctx.rect(0, 0, cvs1.width, cvs1.height);
	ctx.fill();
	ctx.stroke();
	ctx.closePath();

	// Draw title
	ctx.font = (3*SC) + "pt Impact";
	ctx.fillStyle = "#FFFFFF";
	ctx.fillText("Logic Training", (cvs1.width/2) - (11.5*SC) + 2, (cvs1.height/2) - (6*SC) + 2);
	ctx.fillStyle = "#000000";
	ctx.fillText("Logic Training", (cvs1.width/2) - (11.5*SC), (cvs1.height/2) - (6*SC));

	drawLevels(ctx);

	cvs2.onmousedown = handleMenuMouseDown;
	cvs2.onmousemove = handleMenuMouseMove;
}

// Draws the icons for each level.
function drawLevels(ctx){
	var startx, width, x, y, selected;
	y = (cvs1.height/2) - (2*SC);
	width = ((levels.length+1)*6*SC) + (levels.length*3*SC);
	startx = Math.round((cvs1.width/2) - (width/2));

	for (var i = 0; i < levels.length + 1; i++){
		selected = ((i == 0 || levels[i-1].unlocked) && selectedLevel == i);

		// Draw rectangle around the level.
		x = startx + (i*9*SC);
		ctx.beginPath();
		ctx.fillStyle = (selected) ? "#7D9C8D" : "#5D8370";
		ctx.lineWidth = (selected) ? 3 : 1;
		ctx.strokeStyle = "#000000";
		ctx.rect(x, y, 6*SC, 6*SC);
		ctx.fill();
		ctx.stroke();
		ctx.lineWidth = 1;
		ctx.closePath();

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
				if (j < levels[i-1].starsGained){
					ctx.fillStyle = "#ffff00";
					ctx.fillText("\uF005", x+(1.2*SC)+(j*25), y+(5.5*SC));
				}
				ctx.strokeStyle = "#000000";
				ctx.strokeText("\uF005", x+(1.2*SC)+(j*25), y+(5.5*SC));
			}

			if (!levels[i-1].unlocked){
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
	mousex = event.clientX-8;
	mousey = event.clientY-8;

	var lvl = getSelectedLevel();
	if (lvl != selectedLevel){
		selectedLevel = lvl;
		drawMenu(ctx1);
	}
}

function handleMenuMouseDown(){
	if (selectedLevel == 0){
		startTutorial();
	} else if (selectedLevel != -1){
		selectedLevel--;
		startGame(selectedLevel);
	}
}

// Find which level icon the mouse is hovering over, if any.
function getSelectedLevel(){
	if ((mousey > (cvs1.height/2)-(2*SC)) && (mousey < (cvs1.height/2)+(4*SC))){
		// In y range of levels
			var width = ((levels.length+1)*6*SC) + (levels.length*3*SC),
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

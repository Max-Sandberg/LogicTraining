var levelButtonIntervals = [];

// Draws the whole menu screen.
function drawMenu(){
	// Set currentScreen to menu, and clear the area.
	currentScreen = screens.menu;
	ctx1.clearRect(0, 0, cvs1.width, cvs1.height);

	// If the window has been resized, correct the scale and canvas sizes now.
	if (cvs1.width != window.innerWidth){
		handleResize();
	} else {
		// Draw dark green background
		ctx1.fillStyle = "#184E32";
		ctx1.beginPath();
		ctx1.rect(0, 0, cvs1.width, cvs1.height);
		ctx1.fill();
		ctx1.stroke();
		ctx1.closePath();

		// Calculate the correct y positions for the title and the levels
		var levelRows = Math.ceil(levels.length / 6),
			levelsHeight = (levelRows*6*SC) + ((levelRows-1)*3*SC),
			titleHeight = 8*SC,
			titleY = (cvs1.height/2)-((levelsHeight+titleHeight)/2)+(4*SC),
			levelsY = titleY + (4*SC);

		// Draw title
		ctx1.font = (3.4*SC) + "pt Impact";
		ctx1.textAlign = "center";
		ctx1.fillStyle = "#FFFFFF";
		ctx1.fillText("Logic Training", (cvs1.width/2) + 2, titleY + 2);
		ctx1.fillStyle = "#000000";
		ctx1.fillText("Logic Training", (cvs1.width/2), titleY);

		// Create a button for each level (and delete any existing ones).
		clearLevelButtonIntervals();
		createAllLevelButtons(levelsY);
	}
}

// Creates the buttons for all levels in the correct positions.
function createAllLevelButtons(starty){
	for (var i = 0; i < Math.ceil(levels.length / 6); i++){
		// For each row of levels, draw the individual levels.
		var levelCount = Math.min(6, levels.length-(i*6)),
			startx = Math.round((cvs1.width/2) - (((levelCount*6*SC) + ((levelCount-1)*3*SC))/2));
		for (var j = 0; j < levelCount; j++){
			createLevelButton(startx+(j*9*SC), starty+(i*9*SC), (i*6)+j);
		}
	}
}

function drawLevelButton(x, y, levelIdx, selected){
	ctx1.save();

	// Draw over whatever is already here.
	ctx1.fillStyle = "#184E32";
	ctx1.fillRect(x-4, y-4, (6*SC)+8, (6*SC)+8);

	// Draw the box, with a thicker border and lighter colour if selected.
	ctx1.lineWidth = (selected) ? 3 : 1;
	ctx1.fillStyle = (selected) ? "#7D9C8D" : "#5D8370";
	ctx1.strokeStyle = "#000000";
	ctx1.fillRect(x+0.5, y+0.5, 6*SC, 6*SC);
	ctx1.strokeRect(x+0.5, y+0.5, 6*SC, 6*SC);

	// Draw the TUTORIAL or LEVEL text.
	var level = levels[levelIdx],
		text = (level.tutorial) ? "TUTORIAL" : "LEVEL",
		fontSize = (level.tutorial) ? SC : 0.8*SC,
		texty = (level.tutorial) ? y+(3.4*SC) : y+(1.5*SC);
	ctx1.font = fontSize + "pt Impact";
	ctx1.fillStyle = "#000000";
	ctx1.textAlign = "center";
	ctx1.fillText(text, x+(3*SC), texty);

	if (!level.tutorial){
		// Draw the level number.
		ctx1.font = (2*SC) + "pt Impact";
		ctx1.fillStyle = "#000000";
		ctx1.fillText(levelIdx, x+(3*SC), y+(4.2*SC));

		// Draw the stars, filling in the ones which have been earned.
		ctx1.font = (0.8*SC) + "pt FontAwesome";
		ctx1.lineWidth = 1;
		for (var j = 0; j < 3; j++){
			if (j < levels[levelIdx].starsGained){
				ctx1.fillStyle = "#ffff00";
				ctx1.fillText("\uF005", x+(1.6*SC)+(j*1.4*SC), y+(5.5*SC));
			}
			ctx1.strokeStyle = "#000000";
			ctx1.strokeText("\uF005", x+(1.6*SC)+(j*1.4*SC), y+(5.5*SC));
		}

		if (!levels[levelIdx].unlocked){
			// If the level is locked, draw a transparent grey box over it.
			ctx1.save();
			ctx1.fillStyle = "rgba(0, 0, 0, 0.6)";
			ctx1.fillRect(x+1, y+1, (6*SC)-1, (6*SC)-1);

			// Draw lock icon.
			ctx1.textAlign = "left";
			ctx1.font = 1.5*SC + "px FontAwesome";
			ctx1.fillStyle = "#000000";
			ctx1.fillText("\uf023", x+8, y+(1.5*SC)+2);
			ctx1.font = 1.5*SC + "px FontAwesome";
			ctx1.fillStyle = "#ffffff";
			ctx1.fillText("\uf023", x+6, y+(1.5*SC));
			ctx1.restore();
		}
	}

	ctx1.restore();
}

// Creates a level button, drawing it and creating an interval to handle mouse hovering and clicking.
function createLevelButton(x, y, levelIdx){
	// Draw the button.
	drawLevelButton(x, y, levelIdx, false);

	// Function to check if the mouse is hovering over this button.
	function checkMouseHover(){
		return (mousex > x && mousex < x+(6*SC) && mousey > y && mousey < y+(6*SC));
	}

	// Function to be called if this button is clicked.
	function handleLevelClick(){
		cvs2.mousedown = undefined;
		clearLevelButtonIntervals();
		if (levels[levelIdx].tutorial){
			startTutorial();
		} else {
			startLevel(levelIdx);
		}
	}

	// Function to check if the button is in the correct state, to be called on an interval.
	var highlight = false,
		updateButtonInterval, mouseHover;
	function updateLevelButton(){
		mouseHover = checkMouseHover();
		if (!highlight && mouseHover){
			// If the mouse is over the button and it isn't highlighted, highlight it.
			highlight = true;
			drawLevelButton(x, y, levelIdx, true);
			cvs2.onmousedown = handleLevelClick;
		}
		else if (highlight && !mouseHover){
			// If the mouse isn't over the button and it's still highlighted, unhighlight it.
			highlight = false;
			drawLevelButton(x, y, levelIdx, false);
			cvs2.onmousedown = undefined;
		}
	}

	// If the level is unlocked, start the updateLevelButton function on an interval.
	if (levels[levelIdx].unlocked){
		updateButtonInterval = setInterval(updateLevelButton, 1000/60);
		levelButtonIntervals.push(updateButtonInterval);
	}
}

function clearLevelButtonIntervals(){
	while (levelButtonIntervals.length != 0){
		clearInterval(levelButtonIntervals.pop());
	}
}
//
// 	var width = (levels.length*6*SC) + ((levels.length-1)*3*SC);
// 		startx = Math.round((cvs1.width/2) - (width/2)),
// 		x, selected;
//
// 	for (var i = 0; i < levels.length; i++){
// 		selected = (levels[i].unlocked && selectedLevel == i);
//
// 		// Draw rectangle around the level.
// 		x = startx + (i*9*SC);
// 		ctx1.fillStyle = (selected) ? "#7D9C8D" : "#5D8370";
// 		ctx1.lineWidth = (selected) ? 3 : 1;
// 		ctx1.strokeStyle = "#000000";
// 		ctx1.fillRect(x+0.5, y+0.5, 6*SC, 6*SC);
// 		ctx1.strokeRect(x+0.5, y+0.5, 6*SC, 6*SC);
// 		ctx1.lineWidth = 1;
//
// 		if (i == 0){
// 			// Draw the tutorial button
// 			ctx1.font = SC + "pt Impact";
// 			ctx1.textAlign = "center";
// 			ctx1.fillStyle = "#000000";
// 			ctx1.fillText("TUTORIAL", x+(3*SC), y+(3*SC)+(0.4*SC));
// 			ctx1.textAlign = "left";
// 		} else {
// 			// Write the "LEVEL" text.
// 			ctx1.textAlign = "center";
// 			ctx1.font = (0.8*SC) + "pt Impact";
// 			ctx1.fillStyle = "#000000";
// 			ctx1.fillText("LEVEL", x+(3*SC), y+(1.5*SC));
//
// 			// Draw the level number.
// 			ctx1.font = (2*SC) + "pt Impact";
// 			ctx1.fillStyle = "#000000";
// 			ctx1.fillText(i, x+(3*SC), y+(4.2*SC));
//
// 			// Draw the stars, filling in the ones which have been earned.
// 			ctx1.font = (0.8*SC) + "pt FontAwesome";
// 			for (var j = 0; j < 3; j++){
// 				if (j < levels[i].starsGained){
// 					ctx1.fillStyle = "#ffff00";
// 					ctx1.fillText("\uF005", x+(1.6*SC)+(j*1.4*SC), y+(5.5*SC));
// 				}
// 				ctx1.strokeStyle = "#000000";
// 				ctx1.strokeText("\uF005", x+(1.6*SC)+(j*1.4*SC), y+(5.5*SC));
// 			}
//
// 			if (!levels[i].unlocked){
// 				// Draw transparent grey box.
// 				ctx1.fillStyle = "rgba(0, 0, 0, 0.6)";
// 				ctx1.fillRect(x, y, 6*SC, 6*SC);
//
// 				// Draw lock icon.
// 				ctx1.font = 1.5*SC + "px FontAwesome";
// 				ctx1.fillStyle = "#262626";
// 				ctx1.fillText("\uf023", x+8, y+(1.5*SC)+2);
// 				ctx1.font = 1.5*SC + "px FontAwesome";
// 				ctx1.fillStyle = "#f2f2f2";
// 				ctx1.fillText("\uf023", x+6, y+(1.5*SC));
// 			}
// 		}
// 	}
// }
//
// function handleMenuMouseDown(){
// 	// If the level is unlocked, start the level the user clicked on.
// 	if (selectedLevel == 0){
// 		startTutorial();
// 	} else if (selectedLevel != -1 && levels[selectedLevel].unlocked){
// 		startLevel(selectedLevel);
// 	}
// }
//
// // Find which level icon the mouse is hovering over, if any.
// function getSelectedLevel(){
// 	if ((mousey > (cvs1.height/2)-(2*SC)) && (mousey < (cvs1.height/2)+(4*SC))){
// 		// In y range of levels
// 			var width = (levels.length*6*SC) + ((levels.length-1)*3*SC),
// 			startx = Math.round((cvs1.width/2)-(width/2));
// 		for (var i = 0; i < levels.length; i++){
// 			if ((mousex > startx+(i*9*SC)) && (mousex < startx+(i*9*SC)+(6*SC))){
// 				// In x range of a level
// 				return i;
// 			}
// 		}
// 	}
//
// 	return -1;
// }

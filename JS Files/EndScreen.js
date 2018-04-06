var won, btn;
var selectedButton = null;

function showEndScreen(){
	if (won){
		// Unlock the next level if they won.
		if (levelIdx < levels.length-1){
			levels[levelIdx+1].unlocked = true;
		}
		// Give an extra star if they completed the level in less moves than the par.
		if (moves <= level.par){
			starsGained++;
		}
		// If they earned more stars than they had previously earned for this level, update the stars gained.
		if (level.starsGained < starsGained){
			level.starsGained = starsGained;
		}
	}

	// Animation to slowly fade the screen.
	var frame = -1;
	var id = setInterval(fadeScreen, 1000/60);

	function fadeScreen(){
		frame++;
		if (frame < 40){
			ctx2.clearRect(0, 0, cvs1.width, cvs1.height);
			ctx2.fillStyle = "rgba(0, 0, 0, " + ((frame/40)*0.8) + ")";
			ctx2.fillRect(0, 0, cvs1.width, cvs1.height);
		} else if (frame == 40){
			ctx2.clearRect(0, 0, cvs1.width, cvs1.height);
			ctx1.fillStyle = "rgba(0, 0, 0, " + ((frame/40)*0.8) + ")";
			ctx1.fillRect(0, 0, cvs1.width, cvs1.height);
		} else if (frame > 80){
			clearInterval(id);
			frame = -1;
			id = setInterval(slideEndMessage, 1000/60);
		}
	}

	var width = won ? 400 : 300;
		height = won ? 260 : 200,
		x = (cvs1.width/2) - (width/2);
		y = -height;
	var starX, starY, size;
	function slideEndMessage(){
		frame++;
		y = (frame/50) * ((cvs1.height/2)+(height/2)) - height;
		ctx2.clearRect(0, 0, cvs1.width, cvs1.height);
		if (frame < 50){
			drawEndMessage(x, y, ctx2);
		} else if (frame == 50){
			drawEndMessage(x, y, ctx1);
			clearInterval(id);
			if (won){
				frame = -1;
				starX = x+0.3*width;
				starY = y+128;
				ctx2.fillStyle = "#FFFF00";
				ctx2.strokeStyle = "#000000";
				ctx2.lineWidth = 1.5;
				if (starsGained > 0){
					id = setInterval(animateStars, 1000/60);
				}
			}
		}
	}

	function animateStars(){
		frame++;
		ctx1.save();
		if (frame == 25 || frame == 50 || frame == 75){
			if (starsGained > frame/25){
				// ctx2.fillStyle = "#184e32";
				// ctx2.fillRect()
				starX += 0.2*width;
			} else {
				clearInterval(id);
			}
		}
		size = (((frame % 25)+1)/25) * 40;
		ctx1.font = size + "pt FontAwesome";
		ctx1.fillStyle = "#FFFF00";
		ctx1.textAlign = "center";
		ctx1.fillText("\uF005", starX, starY+(size/2));
		if (size == 40){
			ctx1.strokeStyle = "#000000";
			ctx1.strokeText("\uF005", starX, starY+(size/2));
		}
		ctx1.restore()
	}
}

function drawEndMessage(x, y, ctx){
	var width = won ? 400 : 300;
		height = won ? 260 : 200;

	// Draw the box.
	ctx.save();
	ctx.lineWidth = 2;
	ctx.fillStyle = "#184e32";
	ctx.beginPath();
	ctx.rect(Math.round(x), Math.round(y), width, height);
	ctx.fill();
	ctx.stroke();
	ctx.closePath();

	// Write the win or lose message.
	var text = won ? "LEVEL " + levelIdx + " COMPLETE!" : "GAME OVER";
	ctx.textAlign = "center";
	ctx.font = "30pt Impact";
	ctx.fillStyle = "#FFFFFF";
	ctx.fillText(text, x+(width/2)+1, y+71);
	ctx.fillStyle = "#000000";
	ctx.fillText(text, x+(width/2), y+70);

	// If the game was won, draw the number of stars earned (empty for now).
	if (won){
		ctx.textAlign = "center";
		ctx.lineWidth = 1.5;
		ctx.font = "40pt FontAwesome"
		for (var i = 0; i < 3; i++){
			ctx.strokeText("\uF005", x+(0.3*width)+(i*0.2*width), y+148);
		}
	}

	// Calculate the positions of the retry, menu, and next level buttons.
	ctx.font = "20pt Impact";
	var retryWidth = Math.round(ctx.measureText("RETRY").width) + 20,
		menuWidth = Math.round(ctx.measureText("MENU").width) + 20,
		nextWidth = Math.round(ctx.measureText("NEXT LEVEL").width) + 20,
		retryx, menux, nextx, yOffset;
	if (won && levelIdx != levels.length-1){
		retryx = x + ((width-retryWidth-menuWidth-nextWidth)/4);
		menux = retryx + retryWidth + ((width-retryWidth-menuWidth-nextWidth)/4);
		nextx = menux + menuWidth + ((width-retryWidth-menuWidth-nextWidth)/4);
	} else {
		retryx = x + ((width-retryWidth-menuWidth)/3);
		menux = retryx + retryWidth + ((width-retryWidth-menuWidth)/3);
	}
	yOffset = won ? 180.5 : 120.5;

	// Draw the buttons.
	if (ctx == ctx2){
		// If we are using ctx2, this means the box is still in the sliding animation, so just draw the button.
		drawEndScreenButton("RETRY", retryx, y+yOffset, false, ctx);
		drawEndScreenButton("MENU", menux, y+yOffset, false, ctx);
		if (won && levelIdx != levels.length-1){
			drawEndScreenButton("NEXT LEVEL", nextx, y+yOffset, false, ctx);
		}
	} else if (ctx == ctx1){
		// If we are using ctx1 the animation has finished, and we want to be able to interact with the buttons, so we create them instead of just drawing.
		createEndScreenButton("RETRY", retryx, y+yOffset, false, ctx);
		createEndScreenButton("MENU", menux, y+yOffset, false, ctx);
		if (won && levelIdx != levels.length-1){
			createEndScreenButton("NEXT LEVEL", nextx, y+yOffset, false, ctx);
		}
	}
	ctx.restore();
}

function drawEndScreenButton(text, x, y, selected, ctx){
	// Calculate the width of this button.
	ctx.save();
	ctx.font = "20pt Impact";
	var btnWidth = Math.round(ctx.measureText(text).width) + 20;

	// Fill over whatever was here before.
	ctx.fillStyle = "#184E32";
	ctx.fillRect(x-4, y-4, btnWidth+8, 48);

	// Draw the retry or menu button.
	ctx.fillStyle = selected ? "#7D9C8D" : "#5D8370";
	ctx.lineWidth = selected ? 3 : 1;
	ctx.fillRect(Math.floor(x)+0.5, Math.floor(y)+0.5, btnWidth, 40);
	ctx.strokeRect(Math.floor(x)+0.5, Math.floor(y)+0.5, btnWidth, 40);
	ctx.textAlign = "center";
	ctx.fillStyle = "#000000";
	ctx.fillText(text, x+(btnWidth/2), y+30);
	ctx.restore();
}

function createEndScreenButton(text, x, y){
	// Draw the button, and calculate its width.
	drawEndScreenButton(text, x, y, false, ctx1);
	ctx1.font = "20pt Impact";
	var btnWidth = Math.round(ctx1.measureText(text).width) + 20;

	// Function to check if the mouse is hovering over this button.
	function checkMouseHover(){
		return (mousex > x && mousex < x+btnWidth && mousey > y && mousey < y+40);
	}

	// Function to be called if this button is clicked.
	function handleButtonClick(){
		// Reset the game state in preparation for the next level.
		resetGameState();
		cvs2.mousedown = undefined;
		if (text == "RETRY"){
			if (level.tutorial){
				startTutorial();
			} else {
				startLevel(levelIdx);
			}
		} else if (text == "MENU"){
			drawMenu();
		} else if (text == "NEXT LEVEL"){
			startLevel(levelIdx+1);
		}
	}

	// Function to check if the button is in the correct state, to be called on an interval.
	var highlight = false,
		updateButtonInterval, mouseHover;
	function updateEndScreenButton(){
		// Clear this interval if we leave the end screen (won gets reset to undefined).
		if (won == undefined){
			clearInterval(updateButtonInterval);
			updateButtonInterval = undefined;
		} else {
			mouseHover = checkMouseHover();
			if (!highlight && mouseHover){
				// If the mouse is over the button and it isn't highlighted, highlight it.
				highlight = true;
				drawEndScreenButton(text, x, y, true, ctx1);
				cvs2.onmousedown = handleButtonClick;
			}
			else if (highlight && !mouseHover){
				// If the mouse isn't over the button and it's still highlighted, unhighlight it.
				highlight = false;
				drawEndScreenButton(text, x, y, false, ctx1);
				cvs2.onmousedown = undefined;
			}
		}
	}

	// Start the updateEndScreenButton function on an interval.
	updateButtonInterval = setInterval(updateEndScreenButton, 1000/60);
}

// function handleEndScreenMouseMove(){
// 	mousex = event.clientX-8;
// 	mousey = event.clientY-8;
//
// 	var newBtn = getSelectedButton();
// 	if (newBtn != selectedButton){
// 		var btnX = (newBtn == "RETRY" || selectedButton == "RETRY") ? (cvs1.width/2)-105 : (cvs1.width/2)+25,
// 			btnY = won ? (cvs1.height/2)+50 : (cvs1.height/2)+20,
// 			text = (newBtn == null) ? selectedButton : newBtn;
// 		drawButton(text, btnX, btnY, (newBtn != null), ctx1);
// 		selectedButton = newBtn;
// 	}
// }
//
// function handleEndScreenMouseDown(){
// 	if (selectedButton != null){
// 		if (won){
// 			if (levelIdx < levels.length-1){
// 				levels[levelIdx+1].unlocked = true;
// 			}
// 			if (level.starsGained < starsGained){
// 				level.starsGained = starsGained;
// 			}
// 		}
//
// 		resetGameState();
//
// 		if (selectedButton == "RETRY"){
// 			selectedButton = null;
// 			cvs2.onmousedown = undefined;
// 			cvs2.onmousemove = undefined;
// 			if (level.tutorial){
// 				startTutorial();
// 			} else {
// 				startLevel(levelIdx);
// 			}
// 		} else {
// 			selectedButton = null;
// 			cvs2.onmousedown = handleMenuMouseDown;
// 			drawMenu();
// 		}
// 	}
// }
//
// function getSelectedButton(){
// 	var btnX = (cvs1.width/2)-114;
// 		btnY = won ? (cvs1.height/2)+50 : (cvs1.height/2)+20;
//
// 	for (var i = 0; i < 2; i++){
// 		btnX += (i * 130);
// 		if ((mousex > btnX) && (mousex < btnX+80) && (mousey > btnY) && (mousey < btnY+40)){
// 			return (i == 0) ? "RETRY" : "MENU";
// 		}
// 	}
// 	return null;
// }

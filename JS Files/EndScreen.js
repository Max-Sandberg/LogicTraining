var won, btn;
var selectedButton = null;

function showEndScreen(){
	// Give an extra star if they completed the level in less moves than the par.
	if (won && moves <= levels[selectedLevel].par){
		starsGained++;
	}

	// Animation to slowly fade the screen.
	var frame = -1;
	var id = setInterval(fadeScreen, 10);

	function fadeScreen(){
		frame++;
		if (frame < 80){
			ctx2.clearRect(0, 0, cvs1.width, cvs1.height);
			ctx2.fillStyle = "rgba(0, 0, 0, " + ((frame/80)*0.8) + ")";
			ctx2.fillRect(0, 0, cvs1.width, cvs1.height);
		} else if (frame == 80){
			ctx2.clearRect(0, 0, cvs1.width, cvs1.height);
			ctx1.fillStyle = "rgba(0, 0, 0, " + ((frame/80)*0.8) + ")";
			ctx1.fillRect(0, 0, cvs1.width, cvs1.height);
		} else if (frame > 160){
			clearInterval(id);
			frame = -1;
			id = setInterval(slideEndMessage, 10);
		}
	}

	var width = won ? 360 : 300;
		height = won ? 260 : 200,
		x = (cvs1.width/2) - (width/2);
		y = -height;
	function slideEndMessage(){
		frame++;
		y = (frame/100) * ((cvs1.height/2)+(height/2)) - height;
		ctx2.clearRect(0, 0, cvs1.width, cvs1.height);
		if (frame < 100){
			drawEndMessage(x, y, ctx2);
		} else if (frame == 100){
			drawEndMessage(x, y, ctx1);
			clearInterval(id);
			if (won){
				frame = -1;
				starX = x+100;
				starY = y+128;
				ctx2.fillStyle = "#FFFF00";
				ctx2.strokeStyle = "#000000";
				ctx2.lineWidth = 1.5;
				if (starsGained > 0){
					id = setInterval(animateStars, 10);
				} else {
					cvs2.onmousedown = handleEndScreenMouseDown;
					cvs2.onmousemove = handleEndScreenMouseMove;
				}
			} else {
				cvs2.onmousedown = handleEndScreenMouseDown;
				cvs2.onmousemove = handleEndScreenMouseMove;
			}
		}
	}

	var starX, starY, size;
	function animateStars(){
		frame++;
		if (frame == 50 || frame == 100 || frame == 150){
			if (starsGained > frame/50){
				starX += 80;
			} else {
				cvs2.onmousedown = handleEndScreenMouseDown;
				cvs2.onmousemove = handleEndScreenMouseMove;
				clearInterval(id);
			}
		}
		size = Math.ceil(((frame % 50)/50) * 36);
		ctx2.font = size + "pt FontAwesome";
		ctx2.fillText("\uF005", starX, starY+(size/2));
	}
}

function drawEndMessage(x, y, ctx){
	var width = won ? 360 : 300;
		height = won ? 260 : 200;

	// Draw the box.
	ctx.lineWidth = 2;
	ctx.fillStyle = "#184e32";
	ctx.beginPath();
	ctx.rect(x, y, width, height);
	ctx.fill();
	ctx.stroke();
	ctx.closePath();

	// Write the win or lose message.
	var text = won ? "LEVEL COMPLETE" : "GAME OVER";
	ctx.textAlign = "center";
	ctx.font = "30pt Impact";
	ctx.fillStyle = "#FFFFFF";
	ctx.fillText(text, x+(width/2)+1, y+71);
	ctx.fillStyle = "#000000";
	ctx.fillText(text, x+(width/2), y+70);

	// If the game was won, draw the number of stars earned (empty for now).
	if (won){
		ctx.lineWidth = 1.5;
		ctx.font = "40pt FontAwesome"
		for (var i = 0; i < 3; i++){
			ctx.strokeText("\uF005", x+100+(i*80), y+148);
		}
	}

	// Draw the retry and menu buttons.
	xOffset = won ? 75 : 45;
	yOffset = won ? 180 : 120;
	drawButton("RETRY", x+xOffset, y+yOffset, false, ctx);
	drawButton("MENU", x+xOffset+130, y+yOffset, false, ctx);
}

function drawButton(text, x, y, selected, ctx){
	// Draw a flat green box over whatever was here before.
	ctx.beginPath();
	ctx.fillStyle = "#184E32";
	ctx.fillRect(x-4, y-4, 88, 48);

	// Draw the retry or menu button.
	ctx.fillStyle = selected ? "#7D9C8D" : "#5D8370";
	ctx.lineWidth = selected ? 3 : 1;
	ctx.rect(x, y, 80, 40);
	ctx.fill();
	ctx.stroke();
	ctx.fillStyle = "#000000";
	ctx.font = "20pt Impact";
	ctx.fillText(text, x+40, y+30);
	ctx.closePath();
}

function handleEndScreenMouseMove(){
	mousex = event.clientX-8;
	mousey = event.clientY-8;

	var newBtn = getSelectedButton();
	if (newBtn != selectedButton){
		var btnX = (newBtn == "RETRY" || selectedButton == "RETRY") ? (cvs1.width/2)-105 : (cvs1.width/2)+25,
			btnY = won ? (cvs1.height/2)+50 : (cvs1.height/2)+20,
			text = (newBtn == null) ? selectedButton : newBtn;
		drawButton(text, btnX, btnY, (newBtn != null), ctx1);
		selectedButton = newBtn;
	}
}

function handleEndScreenMouseDown(){
	if (selectedButton != null){
		if (won){
			if (selectedLevel < levels.length-1){
				levels[selectedLevel+1].unlocked = true;
			}
			if (levels[selectedLevel].starsGained < starsGained){
				levels[selectedLevel].starsGained = starsGained;
			}
		}

		resetGameState();

		if (selectedButton == "RETRY"){
			selectedButton = null;
			cvs2.onmousedown = undefined;
			cvs2.onmousemove = undefined;
			startGame(selectedLevel);
		} else {
			selectedButton = null;
			selectedLevel = -1;
			cvs2.onmousedown = handleMenuMouseDown;
			cvs2.onmousemove = handleMenuMouseMove;
			drawMenu(ctx1);
		}
	}
}

function getSelectedButton(){
	var btnX = (cvs1.width/2)-105;
		btnY = won ? (cvs1.height/2)+50 : (cvs1.height/2)+20;

	for (var i = 0; i < 2; i++){
		btnX += (i * 130);
		if ((mousex > btnX) && (mousex < btnX+80) && (mousey > btnY) && (mousey < btnY+40)){
			return (i == 0) ? "RETRY" : "MENU";
		}
	}
	return null;
}

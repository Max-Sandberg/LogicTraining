var tutDialogues = [
	{
		idx : 0,
		topText : "Welcome to Logic Training! This tutorial will teach you what logic gates are and how to play the game.",
		botText : "This is an empty circuit. The lines either side of the box are wires, each of which has a voltage. The blue wires have voltage 1, and the black wires have voltage 0.",
		drawDiagram : function(x, y){
			drawSignal(x+2, y+SC+9, 0, ctx1);
			drawSignal(x+2, y+(3*SC)+9, 1, ctx1);
			drawDottedBox(x+(2*SC), y, ctx1);
			drawWire(x+14, y+SC, x+(2*SC), y+SC, 0, ctx1);
			drawWire(x+14, y+(3*SC), x+(2*SC), y+(3*SC), 1, ctx1);
			drawWire(x+(6*SC), y+(2*SC), x+(8*SC), y+(2*SC), -1, ctx1);
		},
		getDiagramWidth : function () { return (8*SC); },
		getDiagramHeight : function () { return (4*SC); }
	},
	{
		idx : 1,
		topText : "So we have two 0 or 1 inputs. To get an output, complete the circuit by dragging a logic gate from the top of the screen into the empty box.",
		botText : "This is what a circuit with a logic gate in looks like. The output will be either 0 or 1, depending on on what the inputs are, and which logic gate we used.",
		drawDiagram : function(x, y){
			drawSignal(x+2, y+SC+9, 0, ctx1);
			drawSignal(x+2, y+(3*SC)+9, 1, ctx1);
			drawDottedBox(x+(2*SC), y, ctx1);
			drawWire(x+14, y+SC, x+(2*SC), y+SC, 0, ctx1);
			drawWire(x+14, y+(3*SC), x+(2*SC), y+(3*SC), 1, ctx1);
			drawOR(x+(2*SC), y, 0, 1, 1, ctx1);
			drawWire(x+(6*SC), y+(2*SC), x+(8*SC), y+(2*SC), 1, ctx1);
		},
		getDiagramWidth : function () { return (8*SC); },
		getDiagramHeight : function () { return (4*SC); }
	},
	{
		idx : 2,
		topText : "This circuit has a lightbulb at the end of it. To turn the lightbulb on, the wire leading into it must be a 1.",
		botText : "In each level, circuits will slide across the screen to the left. You need to light the bulbs before they reach the edge of the screen, or else it's game over! Do this by dragging gates into the circuits. Lets give it a go.",
		drawDiagram : function(x, y){
			drawSignal(x+2, y+SC+9, 0, ctx1);
			drawSignal(x+2, y+(3*SC)+9, 1, ctx1);
			drawDottedBox(x+(2*SC), y, ctx1);
			drawWire(x+14, y+SC, x+(2*SC), y+SC, 0, ctx1);
			drawWire(x+14, y+(3*SC), x+(2*SC), y+(3*SC), 1, ctx1);
			drawOR(x+(2*SC), y, 0, 1, 1, ctx1);
			drawWire(x+(6*SC), y+(2*SC), x+(10*SC), y+(2*SC), 1, ctx1);
			drawFixedBox(x+(10*SC), y, ctx1);
			drawBulb(x+(10*SC), y, 1, ctx1);
		},
		getDiagramWidth : function () { return (14*SC); },
		getDiagramHeight : function () { return (4*SC); }
	},
	{
		idx : 3,
		text : "Drag this gate into the circuit!"
	},
	{
		idx : 4,
		topText : "Nice one! Sometimes the circuits will have fixed gates in them. These gates can't be changed.",
		botText : "You'll have to decide what output you want the gate to have, and figure out what the inputs should be in order to get that output!",
		drawDiagram : function(x, y){
			drawSignal(x+2, y+SC+9, 0, ctx1);
			drawWire(x+14, y+SC, x+(2*SC), y+SC, 0, ctx1);
			drawSignal(x+2, y+(3*SC)+9, 1, ctx1);
			drawWire(x+14, y+(3*SC), x+(2*SC), y+(3*SC), 1, ctx1);
			drawDottedBox(x+(2*SC), y, ctx1);
			drawWire(x+(6*SC), y+(2*SC), x+(7.2*SC), y+(2*SC), -1, ctx1);
			drawWire(x+(7.2*SC), y+(2*SC), x+(7.2*SC), y+(1*SC), -1, ctx1);
			drawWire(x+(7.2*SC), y+(1*SC), x+(10*SC), y+(1*SC), -1, ctx1);
			drawSignal(x+(8*SC), y+(3*SC)+9, 1, ctx1);
			drawWire(x+(8*SC)+12, y+(3*SC), x+(10*SC), y+(3*SC), 1, ctx1);
			drawFixedBox(x+(10*SC), y, ctx1);
			drawAND(x+(10*SC), y, -1, 1, -1, ctx1);
			drawWire(x+(14*SC), y+(2*SC), x+(18*SC), y+(2*SC), -1, ctx1);
			drawFixedBox(x+(18*SC), y, ctx1);
			drawBulb(x+(18*SC), y, -1, ctx1);
		},
		getDiagramWidth : function () { return (22*SC); },
		getDiagramHeight : function () { return (4*SC); }
	},
	{
		idx : 5,
		topText : "Some circuits end in a star rather than a lightbulb. Lighting a star works the same way as lighting a bulb, we just make the input wire a 1.",
		botText : "Each level has 2 star circuits. You won't lose if you don't complete these, but you'll earn a star for that level if you do. They're a bit quicker than the other circuits though, so you'll have to be fast!",
		drawDiagram : function(x, y){
			drawSignal(x+2, y+SC+9, 0, ctx1);
			drawSignal(x+2, y+(3*SC)+9, 1, ctx1);
			drawDottedBox(x+(2*SC), y, ctx1);
			drawWire(x+14, y+SC, x+(2*SC), y+SC, 0, ctx1);
			drawWire(x+14, y+(3*SC), x+(2*SC), y+(3*SC), 1, ctx1);
			drawOR(x+(2*SC), y, 0, 1, 1, ctx1);
			drawWire(x+(6*SC), y+(2*SC), x+(10*SC), y+(2*SC), 1, ctx1);
			drawFixedBox(x+(10*SC), y, ctx1);
			ctx1.textAlign = "left";
			drawStar(x+(10*SC), y, 1, ctx1);
		},
		getDiagramWidth : function () { return (14*SC); },
		getDiagramHeight : function () { return (4*SC); }
	},
	{
		idx : 6,
		text : "One more thing. Each level has a third star, which you get for completing the level in the minimum number of moves. This means completing every circuit first try! You can see the number of moves you've made (and the par for the level) at the bottom of the screen."
	},
	{
		idx : 7,
		text : "Thats it for the tutorial. You're now ready for level 1, where you'll learn how to use the AND gate!"
	}
]

function startTutorial(){
	startGame(0);
	pause = true;

	displayDialogue(0);
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight, noPrint) {
	var words = text.split(" "),
		line = "",
		lineCount = 1;

	ctx.font = "14pt Arial";
	for (var i = 0; i < words.length; i++) {
		var testLine = line + words[i] + " ",
			metrics = ctx.measureText(testLine),
			testWidth = metrics.width;
		if (testWidth > maxWidth && i > 0) {
		  	if (!noPrint) { ctx.fillText(line, x, y); }
		  	line = words[i] + " ";
		  	y += lineHeight;
			lineCount++;
		}
		else {
	  		line = testLine;
		}
	}
	if (!noPrint) { ctx.fillText(line, x, y); }
	return lineCount * lineHeight;
}

function displayDialogue(dlgIdx){
	var dlg = tutDialogues[dlgIdx];

	// Calculate the height the dialogue box should be.
	var topTextHeight, botTextHeight, textHeight, boxHeight;
	if (dlg.text == undefined){
		topTextHeight = wrapText(ctx1, dlg.topText, 0, 0, 480, 24, true);
		botTextHeight = wrapText(ctx1, dlg.botText, 0, 0, 480, 24, true);
		boxHeight = 15 + topTextHeight + 35 + dlg.getDiagramHeight() + 25 + botTextHeight + 68;
	} else {
		textHeight = wrapText(ctx1, dlg.text, 0, 0, 480, 24, true);
		boxHeight = 15 + textHeight + 58;
	}

	var startx = (cvs1.width/2) - 250;
	var starty = (cvs1.height/2) - (boxHeight/2);

	// Draw the rectangle.
	ctx1.beginPath();
	ctx1.fillStyle = "#2a8958";
	ctx1.rect(startx, starty, 500, boxHeight);
	ctx1.fill();
	ctx1.stroke();
	ctx1.closePath();

	// Write the tutorial messages.
	ctx1.font = "14pt Arial";
	ctx1.fillStyle = "#000000";
	ctx1.textAlign = "center";
	if (dlg.text == undefined){
		wrapText(ctx1, dlg.topText, cvs1.width/2, starty+39, 470, 24);
		wrapText(ctx1, dlg.botText, cvs1.width/2, starty+30+topTextHeight+35+dlg.getDiagramHeight()+25+24, 470, 24);
	} else {
		wrapText(ctx1, dlg.text, cvs1.width/2, starty+39, 470, 24);
	}

	// Draw the diagram if there is one.
	if (dlg.drawDiagram != undefined){
		var dgrmX = startx+250-(dlg.getDiagramWidth()/2),
			dgrmY = starty+20+topTextHeight+35+4;
		ctx1.clearRect(dgrmX-20, dgrmY-20, dlg.getDiagramWidth()+40, dlg.getDiagramHeight()+40);
		ctx1.strokeStyle = "#000000";
		ctx1.lineWidth = 1;
		ctx1.strokeRect(dgrmX-20, dgrmY-20, dlg.getDiagramWidth()+40, dlg.getDiagramHeight()+40);
		dlg.drawDiagram(dgrmX, dgrmY);
	}

	// Draw the continue button.
	var highlight = false,
		btnX = startx+394,
		btnY = starty+boxHeight-34;
	ctx1.font = "18pt Impact";
	ctx1.textAlign = "left";
	ctx1.fillStyle = "rgba(0, 0, 0, 0.6)";
	ctx1.fillText("CONTINUE", btnX, btnY+20);

	// The interval to control highlighting the continue button when the mouse hovers over it.
	btnHoverIntervalId = setInterval(function(){
		// Clear this interval if we go back to the menu.
		if (selectedLevel == -1){
			clearInterval(btnHoverIntervalId);
			btnHoverIntervalId = undefined;
		}

		// If the mouse is over the button, and it isn't already highlighted.
		if ((mousex > btnX-4 && mousex < btnX+98  && mousey > btnY-2 && mousey < btnY+24) && !highlight){
			highlight = true;
			ctx1.fillStyle="#2a8958";
			ctx1.fillRect(btnX, btnY-2, 94, 24);
			ctx1.fillStyle = "rgba(0, 0, 0, 1)";
			ctx1.font = "18pt Impact";
			ctx1.fillText("CONTINUE", btnX, btnY+20);
			// If the mouse is hovering over the button, change the mousedown handler to go to the next message.
			cvs2.onmousedown = function(){
				ctx1.clearRect(startx-3, starty-3, 506, boxHeight+6);
				clearInterval(btnHoverIntervalId);
				btnHoverIntervalId = undefined;
				if (dlgIdx+1 < tutDialogues.length){
					cvs2.onmousedown = handleMouseDown;
					if (dlgIdx+1 != 3){
						displayDialogue(dlgIdx+1);
					} else {
						startTestCircuit();
					}
				} else {
					// End the tutorial
					clearIntervals();
					resetGameState();
					selectedLevel = -1;
					drawMenu(ctx1);
				}
			}
		}
		// If the mouse isn't over the button, but it is still highlighted.
		else if (!(mousex > btnX-4 && mousex < btnX+98  && mousey > btnY-2 && mousey < btnY+24) && highlight){
			highlight = false;
			ctx1.fillStyle="#2a8958";
			ctx1.fillRect(btnX, btnY-2, 94, 24);
			ctx1.fillStyle = "rgba(0, 0, 0, 0.6)";
			ctx1.font = "18pt Impact";
			ctx1.fillText("CONTINUE", btnX, btnY+20);
			cvs2.onmousedown = handleMouseDown;
		}
	}, 50);

	ctx1.textAlign = "left";
}

// Scroll a single test circuit across the screen, and show prompts for the player.
function startTestCircuit(){
	dlg = tutDialogues[3];
	// Calculate where the dialogue box should be.
	ctx1.font = "14pt Arial";
	textWidth = ctx1.measureText(dlg.text).width;
	boxWidth = textWidth + 40;
	var startx = (cvs1.width/2) - (2.5*SC) - (boxWidth/2),
		starty = (6*SC) + 40;

	// Draw the dialogue box.
	ctx1.beginPath();
	ctx1.fillStyle = "#2a8958";
	ctx1.rect(startx, starty, boxWidth, 34);
	ctx1.fill();
	ctx1.stroke();
	ctx1.closePath();

	// Draw the text in the dialogue box.
	ctx1.fillStyle = "#000000";
	ctx1.textAlign = "left";
	ctx1.fillText(dlg.text, startx + 20, starty + 24);

	// Draw an arrow pointing to the OR gate in the menu bar.
	var x = (cvs1.width/2) - (2.5*SC),
		y = (5.3*SC);
	ctx1.fillStyle = "#ff0000";
	ctx1.beginPath();
	ctx1.moveTo(x, y);
	ctx1.lineTo(x-20, y+20);
	ctx1.lineTo(x-8, y+20);
	ctx1.lineTo(x-8, (5.6*SC)+40);
	ctx1.lineTo(x+8, (5.6*SC)+40);
	ctx1.lineTo(x+8, y+20);
	ctx1.lineTo(x+20, y+20);
	ctx1.lineTo(x,y);
	ctx1.stroke();
	ctx1.fill();

	// Start moving the circuit
	var gameAreaHeight = cvs1.height - (6*SC) - 60;
	circuits[0].starty = Math.round((0.5*gameAreaHeight)-(4*SC));
	pause = false;
}

function handleTestCircuit(){
	ctx1.clearRect((cvs1.width/2)-200, 6*SC, 400, 100);
	drawMenuBar();
	displayDialogue(4);
}

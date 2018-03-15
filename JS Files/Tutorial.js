var tutDialogues = [
	{
		idx : 0,
		topText : "Welcome to Logic Training! This tutorial will teach you what logic gates are and how to play the game.",
		botText : "This is an empty circuit. The lines either side of the box are wires, each of which has a voltage. The blue wires have voltage 1, and the black wires have voltage 0.",
		drawDiagram : function(x, y){
			drawWire(x, y+SC, x+(2*SC), y+SC, 0, ctx1);
			drawWire(x, y+(3*SC), x+(2*SC), y+(3*SC), 1, ctx1);
			drawWire(x+(6*SC), y+(2*SC), x+(8*SC), y+(2*SC), -1, ctx1);
			ctx1.strokeRect(x+(2*SC), y, 4*SC, 4*SC);
		},
		getDiagramWidth : function () { return (8*SC); },
		getDiagramHeight : function () { return (4*SC); }
	},
	{
		idx : 1,
		topText : "So we have two 0 or 1 inputs. To get an output, we need to drag a logic gate from the top of the screen into the empty box on the circuit. This is what a circuit with a logic gate in looks like.",
		botText : "How do we know whether the output will be 0 or 1? This depends on what the inputs are, and which gate we used."
	},
	{
		idx : 2,
		topText : "This circuit has a lightbulb at the end of it. To turn the lightbulb on, the wire leading into it must be a 1.",
		botText : "When you start a level, circuits will slide across the screen to the left. You need to complete the circuits and light the bulbs before they reach the edge of the screen, otherwise it's game over! Lets give it a go."
	},
	{
		idx : 3,
		text : "Drag a gate into the circuit!"
	},
	{
		idx : 4,
		text : "Nice one!"
	},
	{
		idx : 5,
		topText : "Some circuits end in a star rather than a lightbulb. Lighting a star works the same way as lighting a bulb, we just make the input wire a 1.",
		botText : "Each level has 2 star circuits. You won't lose if you don't complete these, but you'll earn a star for that level if you do. They're a bit quicker than the other circuits though, so you'll have to be fast!"
	},
	{
		idx : 6,
		text : "One more thing. Each level has a third star, which you get for completing the level in the minimum number of moves. This means completing every circuit first try! You can see the number of moves you've made (and the par for the level) here."
	},
	{
		idx : 7,
		text : "Thats it for the tutorial. You're now ready for level 1, where you'll learn about your first logic gate, the AND gate!"
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
	var dgrmX = startx+250-(dlg.getDiagramWidth()/2),
		dgrmY = starty+20+topTextHeight+35+4;
	ctx1.clearRect(dgrmX-20, dgrmY-20, dlg.getDiagramWidth()+40, dlg.getDiagramHeight()+40);
	ctx1.strokeStyle = "#000000";
	ctx1.lineWidth = 1;
	ctx1.strokeRect(dgrmX-20, dgrmY-20, dlg.getDiagramWidth()+40, dlg.getDiagramHeight()+40);
	if (dlg.drawDiagram != undefined){
		dlg.drawDiagram(dgrmX, dgrmY);
	}

	// Draw the continue button.
	var highlight = false,
		btnX = startx+394	,
		btnY = starty+boxHeight-34;
	ctx1.font = "18pt Impact";
	ctx1.textAlign = "left";
	ctx1.fillStyle = "rgba(0, 0, 0, 0.6)";
	ctx1.fillText("CONTINUE", btnX, btnY+20);

	btnHoverIntervalId = setInterval(function(){
		if ((mousex > btnX-4 && mousex < btnX+98  && mousey > btnY-2 && mousey < btnY+24) && !highlight){
			highlight = true;
			ctx1.fillStyle="#2a8958";
			ctx1.fillRect(btnX, btnY-2, 94, 24);
			ctx1.fillStyle = "rgba(0, 0, 0, 1)";
			ctx1.font = "18pt Impact";
			ctx1.fillText("CONTINUE", btnX, btnY+20);
		}
		else if (!(mousex > btnX-4 && mousex < btnX+98  && mousey > btnY-2 && mousey < btnY+24) && highlight){
			highlight = false;
			ctx1.fillStyle="#2a8958";
			ctx1.fillRect(btnX, btnY-2, 94, 24);
			ctx1.fillStyle = "rgba(0, 0, 0, 0.6)";
			ctx1.font = "18pt Impact";
			ctx1.fillText("CONTINUE", btnX, btnY+20);
		}
	}, 50);

	ctx1.textAlign = "left";
}

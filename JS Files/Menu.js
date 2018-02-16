function openMenu(){
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
	cvs2.onmousedown = handleMouseDown;
	cvs2.onmouseup = handleMouseUp;
	cvs2.onmousemove = handleMouseMove;
	document.body.insertBefore(cvs2, document.body.childNodes[0]);

	// Draw a dark green box over the whole screen
	drawMenu(ctx1);
}

function drawMenu(ctx){
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
}

function drawLevels(ctx){
	var startx, width, x, y;
	y = (cvs1.height/2) - (2*SC);
	width = (levels.length*6*SC) + ((levels.length-1)*3*SC);
	startx = Math.round((cvs1.width/2) - (width/2));

	for (var i = 0; i < levels.length; i++){
		x = startx + (i*9*SC);
		ctx.beginPath();
		ctx.rect(x, y, 6*SC, 6*SC);
		ctx.stroke();
		ctx.closePath();

		ctx.beginPath();
		ctx.font = (0.8*SC) + "pt Impact";
		ctx.fillText("LEVEL", x+(1.8*SC), y+(1.5*SC));
		ctx.closePath();

		ctx.beginPath();
		ctx.font = (0.8*SC) + "pt FontAwesome";
		ctx.fillText("\uF005 \uF005 \uF005", x+(1.2*SC), y+(5.5*SC));
		ctx.closePath();
	}
}

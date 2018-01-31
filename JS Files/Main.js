var SC = 30; // Scale

function startGame() {
    myGameArea.start();
}

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = window.innerWidth*0.97;
        this.canvas.height = window.innerHeight*0.97;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;

		var x = (myGameArea.canvas.width / 2) - (14.5*SC);
		drawCircuit(x);
		drawMenuItems();

		var ctx = myGameArea.context;
		ctx.beginPath();
		ctx.strokeStyle="#666666"; //hail satan?
		ctx.rect(1, (SC*6), myGameArea.canvas.width-2, myGameArea.canvas.height-((SC*6)+1));
		ctx.stroke();
		ctx.closePath();

        this.interval = setInterval(updateGameArea, 20);
    },
    clear : function() {
        this.context.clearRect(2, (SC*6)+2, this.canvas.width-4, this.canvas.height-((SC*6)+4));
    }
}

var gatesEnum = Object.freeze({"and":1, "nand":2, "or":3, "nor":4, "xor":5, "xnor":6});

function updateGameArea() {
	var startx = 2000;
	myGameArea.clear();
	myGameArea.frameNo += 1;
	//drawCircuit(startx - (2 * myGameArea.frameNo));
	var x = (myGameArea.canvas.width / 2) - (14.5*SC);
	drawCircuit(x);
}

function drawLine(x1, y1, x2, y2, live){
	ctx = myGameArea.context;
	ctx.beginPath();
	ctx.moveTo(x1,y1);
	ctx.lineTo(x2,y2);
	if (live){
		ctx.strokeStyle="#00bfff";
		ctx.lineWidth = 3;
	} else {
		ctx.strokeStyle="#000000";
		ctx.lineWidth = 1;
	}
	ctx.stroke();
}

// Draws an input signal. Height 2, Width 4.
function drawSignal(x, y, sig) {
	ctx = myGameArea.context;
	ctx.font = "26px Arial";
	ctx.fillText(sig, x+(2*SC)-8, y+SC+10);
	var live = (sig == 1);
	drawLine(x+(2*SC)+14, y+SC, x+(4*SC), y+SC, live);
}

// Draws a logic gate. Height 4, Width 6.
function drawGate(x, y) {
	ctx = myGameArea.context;
	// Input wires
	//drawLine(x, y+SC, x+(2*SC), y+SC, false);
	//drawLine(x, y+(3*SC), x+(2*SC), y+(3*SC), false);
	// Output wire
	drawLine(x+(4*SC), y+(2*SC), x+(6*SC), y+(2*SC), false);
	ctx.setLineDash([5, 3]);
	ctx.strokeStyle="#666666"; //hail satan?
	ctx.rect(x, y, 4*SC, 4*SC);
	ctx.stroke();
	ctx.setLineDash([]);
	ctx.strokeStyle="#000000";
}

// Draws the wires column. Width 4.
function drawWires(colIdx, startx, starty) {
	var y = starty;
	var clmn = circuit.columns[colIdx];
	// Draw signals.
	for (var i = 0; i < clmn.signals.length; i++) {
		if (typeof(clmn.signals[i]) != "undefined"){
			drawSignal(startx, y, clmn.signals[i]);
		}
		y += (2*SC);
	}
	// Draw wires.
	if (colIdx != 0) {
		var prevClmn = circuit.columns[colIdx - 1];
		var nextClmn = circuit.columns[colIdx + 1];
		var verticals = [];
		for (var i = 0; i < prevClmn.gates.length; i++){
			if (typeof(prevClmn.gates[i]) != "undefined"){
				// Output wire from the previous column we need to connect somewhere
				var outputY = starty + (2*SC) + (i*4*SC);
				var inputsY = []; // The inputs we need to connect this output to

				for (var j = 0; j < nextClmn.gates.length; j++){
					if (typeof(nextClmn.gates[j]) != "undefined"){
						var nextGate = nextClmn.gates[j];
						for (var k = 0; k < 2; k++){
							if ((nextGate.inputs[k][0] == colIdx-1) && (nextGate.inputs[k][1] == i)){
								inputsY.push(starty + (j*4*SC) + (k*2*SC) + SC);
							}
						}
					}
				}

				var closestDist = 9999;
				var closestIndx = -1;
				for (var j = 0; j < inputsY.length; j++){
					if (Math.abs(outputY - inputsY[j]) < closestDist){
						closestDist = Math.abs(outputY - inputsY[j]);
						closestIndx = j;
					}
				}

				for (var j = 0; j < inputsY.length; j++){
					if (j != closestIndx){
						verticals.push([inputsY[closestIndx], inputsY[j]]);
					}
				}

				var inputY = inputsY[closestIndx];
				drawLine(startx, outputY, startx, inputY, false);
				drawLine(startx, inputY, startx + (4*SC), inputY, false);
			}
		}

		for (var i = 0; i < verticals.length; i++){
			var x = startx + ((i+1)*((4*SC)/(verticals.length+1)));
			drawLine(x, verticals[i][0], x, verticals[i][1], false);
			drawLine(x, verticals[i][1], startx + (4*SC), verticals[i][1], false);
		}
	}
}

// Draws the whole circuit.
function drawCircuit(startx) {
	var starty = 240;
	var x = startx;

	for (var i = 0; i < circuit.columns.length; i++){
		var column = circuit.columns[i];
		console.log("Drawing column " + i + ", type " + column.type + ".");
		if (column.type == "wires") {
			drawWires(i, x, starty);
		} else if (column.type == "gates") {
			var y = starty;
			for (var j = 0; j < column.gates.length; j++) {
				if (typeof(column.gates[j]) != "undefined"){
					drawGate(x, y);
				}
				y += (4*SC);
			}
		}
		x = (column.type == "wires") ? x + (4*SC) : x + (6*SC);
	}
}

function drawMenuItems(){
	var ctx = myGameArea.context;
	ctx.beginPath();
	ctx.strokeStyle="#666666"; //hail satan?
	ctx.rect(1, 1, myGameArea.canvas.width-2, (SC*6));
	ctx.stroke();
	ctx.closePath();

	var x = (myGameArea.canvas.width / 2) - (14.5*SC);
	var y = SC;
	ctx.beginPath();
	//ctx.setLineDash([5, 3]);
	ctx.rect(x, y, 4*SC, 4*SC);
	ctx.rect(x+(5*SC), y, 4*SC, 4*SC);
	ctx.rect(x+(10*SC), y, 4*SC, 4*SC);
	ctx.rect(x+(15*SC), y, 4*SC, 4*SC);
	ctx.rect(x+(20*SC), y, 4*SC, 4*SC);
	ctx.rect(x+(25*SC), y, 4*SC, 4*SC);
	ctx.stroke();
	ctx.closePath();

	drawAND(x, y);
	drawNAND(x+(5*SC), y);
	drawOR(x+(10*SC), y);
	drawNOR(x+(15*SC), y);
	drawXOR(x+(20*SC), y);
	drawXNOR(x+(25*SC), y);
}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
}

var SC = 25; // Scale
var frameNo = 0;
var cvs1, ctx1, cvs2, ctx2;
var gatesEnum = Object.freeze({"and":1, "nand":2, "or":3, "nor":4, "xor":5, "xnor":6});
var draggedGate = 0;

function startGame() {
	// Create the main canvas
	cvs1 = document.createElement("canvas");
	ctx1 = cvs1.getContext("2d");
	cvs1.width = window.innerWidth-15;
	cvs1.height = window.innerHeight-15;
	cvs1.style = "position: absolute; left: 5; top: 5; z-index: 0; background-color: #f1f1f1; border:0px solid #d3d3d3;";
	document.body.insertBefore(cvs1, document.body.childNodes[0]);

	// Create the layer 2 canvas
	cvs2 = document.createElement("canvas");
	ctx2 = cvs2.getContext("2d");
	cvs2.width = window.innerWidth-15;
	cvs2.height = window.innerHeight-15;
	cvs2.style = "position: absolute; left: 5; top: 5; z-index: 1;";
	cvs2.onmousedown = testmousedown;
	cvs2.onmouseup = testmouseup;
	cvs2.onmousemove = testmousemove;
	document.body.insertBefore(cvs2, document.body.childNodes[0]);

	drawMenuBar();
	prepareGameArea();

	setInterval(updateGameArea, 20);
}

function testmousedown(){
	console.log("mousedown");
	var x = event.clientX - 5;
	var y = event.clientY - 5;

	var startX = (cvs1.width/2) - (14.5*SC);
	for (var i = 1; i < 7; i++){
		if ((y > SC) && (y < (5*SC)) && (x > startX+((i-1)*5*SC)) && (x < startX+((i-1)*5*SC)+(4*SC))){
			draggedGate = i;
		}
	}
}

function testmouseup(){
	console.log("mouseup");
	draggedGate = 0;
	ctx2.clearRect(0, 0, cvs2.width, cvs2.height);
}

function testmousemove(){
	console.log("mousemove");
	if (draggedGate != 0){
		var x = event.clientX - 5;
		var y = event.clientY - 5;
		ctx2.clearRect(0, 0, cvs2.width, cvs2.height);
		switch(draggedGate){
			case gatesEnum.and:
				drawAND(x-(2*SC), y-(2*SC), ctx2);
				break;
			case gatesEnum.nand:
				drawNAND(x-(2*SC), y-(2*SC), ctx2);
				break;
			case gatesEnum.or:
				drawOR(x-(2*SC), y-(2*SC), ctx2);
				break;
			case gatesEnum.nor:
				drawNOR(x-(2*SC), y-(2*SC), ctx2);
				break;
			case gatesEnum.xor:
				drawXOR(x-(2*SC), y-(2*SC), ctx2);
				break;
			case gatesEnum.xnor:
				drawXNOR(x-(2*SC), y-(2*SC), ctx2);
				break;
		}
	}
}

function drawMenuBar(){
	// Draw outer box
	ctx1.beginPath();
	ctx1.strokeStyle="#666666"; //hail satan?
	ctx1.rect(1, 1, cvs1.width-2, (SC*6));
	ctx1.stroke();
	ctx1.closePath();

	// Draw box for each gate
	var x = (cvs1.width / 2) - (14.5*SC);
	var y = SC;
	ctx1.beginPath();
	ctx1.rect(x, y, 4*SC, 4*SC);
	ctx1.rect(x+(5*SC), y, 4*SC, 4*SC);
	ctx1.rect(x+(10*SC), y, 4*SC, 4*SC);
	ctx1.rect(x+(15*SC), y, 4*SC, 4*SC);
	ctx1.rect(x+(20*SC), y, 4*SC, 4*SC);
	ctx1.rect(x+(25*SC), y, 4*SC, 4*SC);
	ctx1.stroke();
	ctx1.closePath();

	// Draw all the gates
	drawAND(x, y, ctx1);
	drawNAND(x+(5*SC), y, ctx1);
	drawOR(x+(10*SC), y, ctx1);
	drawNOR(x+(15*SC), y, ctx1);
	drawXOR(x+(20*SC), y, ctx1);
	drawXNOR(x+(25*SC), y, ctx1);
}

function prepareGameArea(){
	// Draw box around the game area
	ctx1.beginPath();
	ctx1.strokeStyle="#666666";
	ctx1.rect(1, (SC*6), cvs1.width-2, cvs1.height-(SC*6)-2);
	ctx1.stroke();
	ctx1.closePath();
}

function clearGameArea(){
	ctx1.clearRect(2, (SC*6)+2, cvs1.width-4, cvs1.height-(SC*6)-6);
}

function updateGameArea() {
	clearGameArea();
	frameNo += 1;
	//var startx = 2000;
	//drawCircuit(startx - (2 * myGameArea.frameNo));
	//var x = (cvs1.width / 2) - (14.5*SC);
	drawCircuit(circuit1, 20);
	drawCircuit(circuit2, 620);
	drawCircuit(circuit3, 1220);
}

function drawWire(x1, y1, x2, y2, live, ctx){
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
	ctx.closePath();
}

// Draws a logic gate. Height 4, Width 6.
function drawGate(x, y) {
	ctx1.setLineDash([5, 3]);
	ctx1.strokeStyle="#666666";
	ctx1.rect(x, y, 4*SC, 4*SC);
	ctx1.stroke();
	ctx1.setLineDash([]);
	ctx1.strokeStyle="#000000";
}

// Draws the whole circuit.
function drawCircuit(circuit, startx) {
	var starty = 240;
	var x = startx;

	for (var i = 0; i < circuit.columns.length; i++){
		var column = circuit.columns[i];
		if (column.type == "wires") {
			drawWires(circuit, i, x, starty, ctx1);
		} else if (column.type == "gates") {
			var y = starty;
			for (var j = 0; j < column.gates.length; j++) {
				if (typeof(column.gates[j]) != "undefined"){
					drawGate(x, y);
				}
				y += (4*SC);
			}
		}
		//x = (column.type == "wires") ? x + (4*SC) : x + (6*SC);
		x += (4*SC);
	}
}

function everyinterval(n) {
    if ((frameNo / n) % 1 == 0) {return true;}
    return false;
}

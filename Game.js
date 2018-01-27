var SC = 20; // Scale

function startGame() {
    myGameArea.start();
}

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = window.innerWidth * 0.9;
        this.canvas.height = window.innerHeight * 0.9;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;

		drawCircuit();

        this.interval = setInterval(updateGameArea, 20);
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

var circuit = {
	columns : [{
		type : "wires",
		signals : [,,0, 1,,, 1, 0,,,]
	}, {
		type : "gates",
		gates : [,{
			inputs : ["sig", "sig"]
		},,{
			inputs : ["sig", "sig"]
		},,]
	}, {
		type : "wires",
		signals : [,,0,,,,,,,,]
	}, {
		type : "gates",
		gates : [,{
			inputs : ["sig", [2, 1]]
		},,{
			inputs : [[2, 1], [2, 3]]
		},,]
	}, {
		type : "wires",
		signals: []
	}, {
		type : "gates",
		gates : [,,{
			inputs : [[4, 1], [4, 2]]
		},,,]
	}]
}

function updateGameArea() {

}

function drawLine(x1, y1, x2, y2){
	ctx = myGameArea.context;
	ctx.beginPath();
	ctx.moveTo(x1,y1);
	ctx.lineTo(x2,y2);
	ctx.stroke();
}

// Draws an input signal. Height 2, Width 4.
function drawSignal(x, y, sig) {
	ctx = myGameArea.context;
	ctx.font = "26px Arial";
	ctx.fillText(sig, x+(2*SC)-8, y+SC+10);
	drawLine(x+(2*SC)+14, y+SC, x+(4*SC), y+SC);
}

//Draws a logic gate. Height 4, Width 8.
function drawGate(x, y) {
	ctx = myGameArea.context;
	// Input wires
	drawLine(x, y+SC, x+(2*SC), y+SC);
	drawLine(x, y+(3*SC), x+(2*SC), y+(3*SC));
	// Output wire
	drawLine(x+(6*SC), y+(2*SC), x+(8*SC), y+(2*SC));
	ctx.rect(x+(2*SC), y, 4*SC, 4*SC);
	ctx.stroke();
}

// Draws the whole circuit.
function drawCircuit() {
	var startx = 100;
	var starty = 100;
	var x = startx;

	for (i = 0; i < circuit.columns.length; i++){
		var column = circuit.columns[i];
		console.log("Drawing column " + i + ", type " + column.type + ".");
		if (column.type == "wires") {
			var y = starty;
			for (j = 0; j < column.signals.length; j++) {
				if (typeof(column.signals[j]) != "undefined"){
					drawSignal(x, y, column.signals[j]);
				}
				y += (2*SC);
			}
		} else if (column.type == "gates") {
			var y = starty;
			for (j = 0; j < column.gates.length; j++) {
				if (typeof(column.gates[j]) != "undefined"){
					drawGate(x, y);
				}
				y += (4*SC);
			}
		}
		x = (column.type == "wires") ? x + (4*SC) : x + (8*SC);
	}
}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
}

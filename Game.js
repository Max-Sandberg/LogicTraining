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

// Draws an input signal. Height 1, Width 2. (sc = 1/2)
function drawSignal(x, y, sig, sc) {
	ctx = myGameArea.context;
	ctx.font = "26px Arial";
	ctx.fillText(sig, x+32, y+30);
	drawLine(x+54, y+20, x+80, y+20);
}

//Draws a logic gate. Height 2, Width 4. (sc = 1/2)
function drawGate(x, y, sc) {
	ctx = myGameArea.context;
	// Input wires
	drawLine(x, y+sc, x+(2*sc), y+sc);
	drawLine(x, y+(3*sc), x+(2*sc), y+(3*sc));
	// Output wire
	drawLine(x+(6*sc), y+(2*sc), x+(8*sc), y+(2*sc));
	ctx.rect(x+(2*sc), y, 4*sc, 4*sc);
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
					drawSignal(x, y, column.signals[j], 20);
				}
				y += 40;
			}
		} else if (column.type == "gates") {
			var y = starty;
			for (j = 0; j < column.gates.length; j++) {
				if (typeof(column.gates[j]) != "undefined"){
					drawGate(x, y, 20);
				}
				y = y + 80;
			}
		}
		x = (column.type == "wires") ? x + 80 : x + 160;
	}
}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
}

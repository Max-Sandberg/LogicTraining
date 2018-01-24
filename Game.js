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
        this.interval = setInterval(updateGameArea, 20);
        },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

var circuit = {
	columns : [{
		type : "wires",
		signals : [0, 1, 1, 0]
	}, {
		type : "gates",
		gates : [{
			inputs : [[1, 0], [1, 1]]
		}, {
			inputs : [[1, 2], [1, 3]]
		}]
	}, {
		type : "wires",
		signals : [0]
	}, {
		type : "gates",
		gates : [{
			inputs : [[3, 1], [2, 1]]
		}, {
			inputs : [[2, 1], [2, 2]]
		}]
	}, {
		type : "wires"
	}, {
		type : "gates",
		gates : [{
			inputs : [[4, 1], [4, 2]]
		}]
	}]
}

function updateGameArea() {
	drawGate(200, 200);
}

function drawLine(x1, y1, x2, y2){
	ctx = myGameArea.context;
	ctx.beginPath();
	ctx.moveTo(x1,y1);
	ctx.lineTo(x2,y2);
	ctx.stroke();
}

function drawGate(x, y) {
	ctx = myGameArea.context;
	sc = 20;	// Scale
	// Input wires
	drawLine(x, y+sc, x+(2*sc), y+sc);
	drawLine(x, y+(3*sc), x+(2*sc), y+(3*sc));
	// Output wire
	drawLine(x+(6*sc), y+(2*sc), x+(8*sc), y+(2*sc));
	ctx.rect(x+(2*sc), y, (4*sc), (4*sc));
	ctx.stroke();
}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
}

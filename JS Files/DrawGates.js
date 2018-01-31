function drawAND(x, y, ctx){
	ctx.beginPath();
	ctx.setLineDash([]);
	ctx.strokeStyle="#000000";
	ctx.lineWidth = 1.5;
	ctx.moveTo(x+(1.6*SC), y+(3.6*SC));
	ctx.lineTo(x+(0.5*SC), y+(3.6*SC));
	ctx.lineTo(x+(0.5*SC), y+(0.4*SC));
	ctx.lineTo(x+(1.6*SC), y+(0.4*SC));
	ctx.stroke();
	ctx.closePath();

	ctx.beginPath();
	ctx.strokeStyle="#000000";
	ctx.lineWidth = 1.5;
	ctx.moveTo(x+(1.6*SC), y+(0.4*SC));
	ctx.bezierCurveTo(x+(4.1*SC), y+(0.4*SC), x+(4.1*SC), y+(3.6*SC), x+(1.6*SC), y+(3.6*SC));
	ctx.stroke();
	ctx.closePath();

	drawWire(x, y+SC, x+(0.5*SC), y+SC, false, ctx);
	drawWire(x, y+(3*SC), x+(0.5*SC), y+(3*SC), false, ctx);
	drawWire(x+(3.5*SC), y+(2*SC), x+(4*SC), y+(2*SC), false, ctx);
}

function drawNAND(x, y, ctx){
	ctx.beginPath();
	ctx.setLineDash([]);
	ctx.strokeStyle="#000000";
	ctx.lineWidth = 1.5;
	ctx.moveTo(x+(1.4*SC), y+(3.6*SC));
	ctx.lineTo(x+(0.5*SC), y+(3.6*SC));
	ctx.lineTo(x+(0.5*SC), y+(0.4*SC));
	ctx.lineTo(x+(1.4*SC), y+(0.4*SC));
	ctx.stroke();
	ctx.closePath();

	ctx.beginPath();
	ctx.strokeStyle="#000000";
	ctx.lineWidth = 1.5;
	ctx.moveTo(x+(1.4*SC), y+(0.4*SC));
	ctx.bezierCurveTo(x+(3.9*SC), y+(0.4*SC), x+(3.9*SC), y+(3.6*SC), x+(1.4*SC), y+(3.6*SC));
	ctx.stroke();
	ctx.closePath();

	ctx.beginPath();
	ctx.arc(x+(3.5*SC), y+(2*SC), 0.25*SC, 0, 2*Math.PI);
	ctx.stroke();

	drawWire(x, y+SC, x+(0.5*SC), y+SC, false, ctx);
	drawWire(x, y+(3*SC), x+(0.5*SC), y+(3*SC), false, ctx);
	drawWire(x+(3.75*SC), y+(2*SC), x+(4*SC), y+(2*SC), false, ctx);
}

function drawOR(x, y, ctx){
	ctx.beginPath();
	ctx.strokeStyle="#000000";
	ctx.lineWidth = 1.5;
	ctx.moveTo(x+(0.4*SC), y+(0.4*SC));
	ctx.bezierCurveTo(x+(1.2*SC), y+(1*SC), x+(1.2*SC), y+(3*SC), x+(0.4*SC), y+(3.6*SC));
	ctx.stroke();
	ctx.closePath();

	ctx.beginPath();
	ctx.strokeStyle="#000000";
	ctx.lineWidth = 1.5;
	ctx.moveTo(x+(0.4*SC), y+(0.4*SC));
	ctx.quadraticCurveTo(x+(3*SC), y+(0.4*SC), x+(3.5*SC), y+(2*SC));
	ctx.moveTo(x+(0.4*SC), y+(3.6*SC));
	ctx.quadraticCurveTo(x+(3*SC), y+(3.6*SC), x+(3.5*SC), y+(2*SC));
	ctx.stroke();
	ctx.closePath();

	drawWire(x, y+SC, x+(0.8*SC), y+SC, false, ctx);
	drawWire(x, y+(3*SC), x+(0.8*SC), y+(3*SC), false, ctx);
	drawWire(x+(3.5*SC), y+(2*SC), x+(4*SC), y+(2*SC), false, ctx);
}

function drawNOR(x, y, ctx){
	ctx.beginPath();
	ctx.strokeStyle="#000000";
	ctx.lineWidth = 1.5;
	ctx.moveTo(x+(0.4*SC), y+(0.4*SC));
	ctx.bezierCurveTo(x+(1.2*SC), y+(1*SC), x+(1.2*SC), y+(3*SC), x+(0.4*SC), y+(3.6*SC));
	ctx.stroke();
	ctx.closePath();

	ctx.beginPath();
	ctx.strokeStyle="#000000";
	ctx.lineWidth = 1.5;
	ctx.moveTo(x+(0.4*SC), y+(0.4*SC));
	ctx.quadraticCurveTo(x+(2.75*SC), y+(0.4*SC), x+(3.25*SC), y+(2*SC));
	ctx.moveTo(x+(0.4*SC), y+(3.6*SC));
	ctx.quadraticCurveTo(x+(2.75*SC), y+(3.6*SC), x+(3.25*SC), y+(2*SC));
	ctx.stroke();
	ctx.closePath();

	ctx.beginPath();
	ctx.arc(x+(3.5*SC), y+(2*SC), 0.25*SC, 0, 2*Math.PI);
	ctx.stroke();

	drawWire(x, y+SC, x+(0.8*SC), y+SC, false, ctx);
	drawWire(x, y+(3*SC), x+(0.8*SC), y+(3*SC), false, ctx);
	drawWire(x+(3.75*SC), y+(2*SC), x+(4*SC), y+(2*SC), false, ctx);
}

function drawXOR(x, y, ctx){
	ctx.beginPath();
	ctx.strokeStyle="#000000";
	ctx.lineWidth = 1.5;
	ctx.moveTo(x+(0.3*SC), y+(0.4*SC));
	ctx.bezierCurveTo(x+(1.1*SC), y+(1*SC), x+(1.1*SC), y+(3*SC), x+(0.3*SC), y+(3.6*SC));
	ctx.moveTo(x+(0.6*SC), y+(0.4*SC));
	ctx.bezierCurveTo(x+(1.4*SC), y+(1*SC), x+(1.4*SC), y+(3*SC), x+(0.6*SC), y+(3.6*SC));
	ctx.stroke();
	ctx.closePath();

	ctx.beginPath();
	ctx.strokeStyle="#000000";
	ctx.lineWidth = 1.5;
	ctx.moveTo(x+(0.6*SC), y+(0.4*SC));
	ctx.quadraticCurveTo(x+(3*SC), y+(0.4*SC), x+(3.5*SC), y+(2*SC));
	ctx.moveTo(x+(0.6*SC), y+(3.6*SC));
	ctx.quadraticCurveTo(x+(3*SC), y+(3.6*SC), x+(3.5*SC), y+(2*SC));
	ctx.stroke();
	ctx.closePath();

	drawWire(x, y+SC, x+(0.7*SC), y+SC, false, ctx);
	drawWire(x, y+(3*SC), x+(0.7*SC), y+(3*SC), false, ctx);
	drawWire(x+(3.5*SC), y+(2*SC), x+(4*SC), y+(2*SC), false, ctx);
}

function drawXNOR(x, y, ctx){
	ctx.beginPath();
	ctx.strokeStyle="#000000";
	ctx.lineWidth = 1.5;
	ctx.moveTo(x+(0.3*SC), y+(0.4*SC));
	ctx.bezierCurveTo(x+(1.1*SC), y+(1*SC), x+(1.1*SC), y+(3*SC), x+(0.3*SC), y+(3.6*SC));
	ctx.moveTo(x+(0.6*SC), y+(0.4*SC));
	ctx.bezierCurveTo(x+(1.4*SC), y+(1*SC), x+(1.4*SC), y+(3*SC), x+(0.6*SC), y+(3.6*SC));
	ctx.stroke();
	ctx.closePath();

	ctx.beginPath();
	ctx.strokeStyle="#000000";
	ctx.lineWidth = 1.5;
	ctx.moveTo(x+(0.6*SC), y+(0.4*SC));
	ctx.quadraticCurveTo(x+(2.75*SC), y+(0.4*SC), x+(3.25*SC), y+(2*SC));
	ctx.moveTo(x+(0.6*SC), y+(3.6*SC));
	ctx.quadraticCurveTo(x+(2.75*SC), y+(3.6*SC), x+(3.25*SC), y+(2*SC));
	ctx.stroke();
	ctx.closePath();

	ctx.beginPath();
	ctx.arc(x+(3.5*SC), y+(2*SC), 0.25*SC, 0, 2*Math.PI);
	ctx.stroke();

	drawWire(x, y+SC, x+(0.7*SC), y+SC, false, ctx);
	drawWire(x, y+(3*SC), x+(0.7*SC), y+(3*SC), false, ctx);
	drawWire(x+(3.75*SC), y+(2*SC), x+(4*SC), y+(2*SC), false, ctx);
}

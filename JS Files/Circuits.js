var circuits = [
{
	startx : null,
	starty : null,
	gateSections : [
		[{
			inputs : [{
				type : "signal",
				val : 0
			}, {
				type : "signal",
				val : 1
			}],
			type : 0,
			outputVal : -1,
			nextGates : [{
				gateIdx : [0, 1, 0],
				inputs : [0]
			}, {
				gateIdx : [0, 1, 1],
				inputs : [0]
			}]
		}, {
			inputs : [{
				type : "signal",
				val : 1
			}, {
				type : "signal",
				val : 0
			}],
			type : 0,
			outputVal : -1,
			nextGates : [{
				gateIdx : [0, 1, 1],
				inputs : [1]
			}, {
				gateIdx : [0, 1, 0],
				inputs : [1]
			}]
		}],
		[{
			inputs : [{
				type : "gate",
				gate : [0, 0],
				val : -1
			}, {
				type : "gate",
				gate : [0, 1],
				val : -1
			}],
			type : 0,
			outputVal : -1,
			nextGates : [{
				gateIdx : [0, 2, 0],
				inputs : [0]
			}]
		}, {
			inputs : [{
				type : "gate",
				gate : [0, 0],
				val : -1
			}, {
				type : "gate",
				gate : [0, 1],
				val : -1
			}],
			type : 0,
			outputVal : -1,
			nextGates : [{
				gateIdx : [0, 2, 0],
				inputs : [1]
			}]
		}],
		[{
			inputs : [{
				type : "gate",
				gate : [1, 0],
				val : -1
			}, {
				type : "gate",
				gate : [1, 1],
				val : -1
			}],
			type : 0,
			outputVal : -1,
			nextGates : [{
				gateIdx : [0, 3, 0],
				inputs : [0]
			}]
		}],
		[{
			inputs : [{
				type : "gate",
				gate : [2, 0],
				val : -1
			}],
			type : 7,
			outputVal : 0,
			nextGates : []
		}]
	]
},
{
	startx : null,
	starty : null,
	gateSections : [
		[{
			inputs : [{
				type : "signal",
				val : 0
			}, {
				type : "signal",
				val : 1
			}],
			type : 0,
			outputVal : -1,
			nextGates : [{
				gateIdx : [1, 1, 0],
				inputs : [1]
			}, {
				gateIdx : [1, 1, 1],
				inputs : [0]
			}]
		}, {
			inputs : [{
				type : "signal",
				val : 1
			}, {
				type : "signal",
				val : 0
			}],
			type : 0,
			outputVal : -1,
			nextGates : [{
				gateIdx : [1, 1, 1],
				inputs : [1]
			}]
		}],
		[{
			inputs : [{
				type : "signal",
				val : 1
			}, {
				type : "gate",
				gate : [0, 0],
				val : -1
			}],
			type : 0,
			outputVal : -1,
			nextGates : [{
				gateIdx : [1, 2, 0],
				inputs : [0]
			}]
		}, {
			inputs : [{
				type : "gate",
				gate : [0, 0],
				val : -1
			}, {
				type : "gate",
				gate : [0, 1],
				val : -1
			}],
			type : 0,
			outputVal : -1,
			nextGates : [{
				gateIdx : [1, 2, 0],
				inputs : [1]
			}]
		}],
		[{
			inputs : [{
				type : "gate",
				gate : [1, 0],
				val : -1
			}, {
				type : "gate",
				gate : [1, 1],
				val : -1
			}],
			type : 0,
			outputVal : -1,
			nextGates : [{
				gateIdx : [1, 3, 0],
				inputs : [0]
			}]
		}],
		[{
			inputs : [{
				type : "gate",
				gate : [2, 0],
				val : -1
			}],
			type : 7,
			outputVal : 0,
			nextGates : []
		}]
	]
},
{
	startx : null,
	starty : null,
	gateSections : [
		[{
			inputs : [{
				type : "signal",
				val : 0
			}, {
				type : "signal",
				val : 1
			}],
			type : 0,
			outputVal : -1,
			nextGates : [{
				gateIdx : [2, 1, 0],
				inputs : [0, 1]
			}, {
				gateIdx : [2, 1, 1],
				inputs : [0]
			}]
		}, {
			inputs : [{
				type : "signal",
				val : 1
			}, {
				type : "signal",
				val : 0
			}],
			type : 0,
			outputVal : -1,
			nextGates : [{
				gateIdx : [2, 1, 1],
				inputs : [1]
			}]
		}],
		[{
			inputs : [{
				type : "gate",
				gate : [0, 0],
				val : -1
			}, {
				type : "gate",
				gate : [0, 0],
				val : -1
			}],
			type : 0,
			outputVal : -1,
			nextGates : [{
				gateIdx : [2, 2, 0],
				inputs : [0]
			}]
		}, {
			inputs : [{
				type : "gate",
				gate : [0, 0],
				val : -1
			}, {
				type : "gate",
				gate : [0, 1],
				val : -1
			}],
			type : 0,
			outputVal : -1,
			nextGates : [{
				gateIdx : [2, 2, 0],
				inputs : [1]
			}]
		}],
		[{
			inputs : [{
				type : "gate",
				gate : [1, 0],
				val : -1
			}, {
				type : "gate",
				gate : [1, 1],
				val : -1
			}],
			type : 0,
			outputVal : -1,
			nextGates : [{
				gateIdx : [2, 3, 0],
				inputs : [0]
			}]
		}],
		[{
			inputs : [{
				type : "gate",
				gate : [2, 0],
				val : -1
			}],
			type : 7,
			outputVal : 0,
			nextGates : []
		}]
	]
}];

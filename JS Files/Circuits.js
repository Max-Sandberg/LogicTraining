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
			outputVal : 0,
			nextGates : [[1, 0, [0]], [1, 1, [0]]]
		}, {
			inputs : [{
				type : "signal",
				val : 1
			}, {
				type : "signal",
				val : 0
			}],
			type : 0,
			outputVal : 0,
			nextGates : [[1, 1, [1]], [1, 0, [1]]]
		}],
		[{
			inputs : [{
				type : "gate",
				gate : [0, 0],
				val : 0
			}, {
				type : "gate",
				gate : [0, 1],
				val : 0
			}],
			type : 0,
			outputVal : 0,
			nextGates : [[2, 0, [0]]]
		}, {
			inputs : [{
				type : "gate",
				gate : [0, 0],
				val : 0
			}, {
				type : "gate",
				gate : [0, 1],
				val : 0
			}],
			type : 0,
			outputVal : 0,
			nextGates : [[2, 0, [1]]]
		}],
		[{
			inputs : [{
				type : "gate",
				gate : [2, 0],
				val : 0
			}, {
				type : "gate",
				gate : [2, 1],
				val : 0
			}],
			type : 0,
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
			outputVal : 0,
			nextGates : [[1, 0, [1]], [1, 1, [0]]]
		}, {
			inputs : [{
				type : "signal",
				val : 1
			}, {
				type : "signal",
				val : 0
			}],
			type : 0,
			outputVal : 0,
			nextGates : [[1, 1, [1]]]
		}],
		[{
			inputs : [{
				type : "signal",
				val : 1
			}, {
				type : "gate",
				gate : [0, 0],
				val : 0
			}],
			type : 0,
			outputVal : 0,
			nextGates : [[2, 0, [0]]]
		}, {
			inputs : [{
				type : "gate",
				gate : [0, 0],
				val : 0
			}, {
				type : "gate",
				gate : [0, 1],
				val : 1
			}],
			type : 0,
			outputVal : 0,
			nextGates : [[2, 0, [1]]]
		}],
		[{
			inputs : [{
				type : "gate",
				gate : [2, 0],
				val : 0
			}, {
				type : "gate",
				gate : [2, 1],
				val : 0
			}],
			type : 0,
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
			outputVal : 0,
			nextGates : [[1, 0, [0]], [1, 0, [1]], [1, 1, [0]]]
		}, {
			inputs : [{
				type : "signal",
				val : 1
			}, {
				type : "signal",
				val : 0
			}],
			type : 0,
			outputVal : 0,
			nextGates : [[1, 1, [1]]]
		}],
		[{
			inputs : [{
				type : "gate",
				gate : [0, 0],
				val : 0
			}, {
				type : "gate",
				gate : [0, 0],
				val : 0
			}],
			type : 0,
			outputVal : 0,
			nextGates : [[2, 0, [0]]]
		}, {
			inputs : [{
				type : "gate",
				gate : [0, 0],
				val : 0
			}, {
				type : "gate",
				gate : [0, 1],
				val : 1
			}],
			type : 0,
			outputVal : 0,
			nextGates : [[2, 0, [1]]]
		}],
		[{
			inputs : [{
				type : "gate",
				gate : [2, 0],
				val : 0
			}, {
				type : "gate",
				gate : [2, 1],
				val : 0
			}],
			type : 0,
			outputVal : 0,
			nextGates : []
		}]
	]
}];

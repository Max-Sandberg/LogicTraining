var circuit = {
	columns : [{
		type : "wires",
		signals : [,,0, 1,,, 1, 0,,,],
		gate : 0
	}, {
		type : "gates",
		gates : [,{
			inputs : ["sig", "sig"]
		},,{
			inputs : ["sig", "sig"]
		},,]
	}, {
		type : "wires",
		signals : []
		// signals : [,,1,,,,,,,,]
	}, {
		type : "gates",
		gates : [,{
			// inputs : ["sig", [1, 1]]
			inputs : [[1, 1], [1, 3]],
			gate : 0
		},,{
			inputs : [[1, 1], [1, 3]],
			gate : 0
		},,]
	}, {
		type : "wires",
		signals: []
	}, {
		type : "gates",
		gates : [,,{
			inputs : [[3, 1], [3, 3]],
			gate : 0
		},,,]
	}]
}

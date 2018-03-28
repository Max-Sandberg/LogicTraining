/*
	Contains all the information about the levels, including the layout of every circuit. The general outline of each level is as follows:

	Level 0 - TUTORIAL
	Level 1 - AND/NAND, easy
	Level 2 - AND/NAND, medium
	Level 3 - OR/NOR, easy
	Level 4 - OR/NOR, medium
	Level 5 - XOR/XNOR, easy
	Level 6 - XOR/XNOR, medium
	Level 7 - All, medium
	Level 8 - All, hard
	Level 9 - All, medium, gate changes
	Level 10 - All, hard, gate changes
*/
var levels = [
	//#region Tutorial level
	{
		unlocked : true,
		allowedGates : [3],
		enableGateChanges : false,
		circuits: [
			//#region Circuit 1
			{
				gateSections : [
					[{
						inputs : [{
							type : "signal",
							val : 1
						}, {
							type : "signal",
							val : 1
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [0, 0],
						}],
						type : gatesEnum.bulb,
						fixed : true,
						nextGates : []
					}]
				]
			}
			//#endregion
		]
	},
	//#endregion

	//#region Level 1
	{
		unlocked : true,
		starsGained : 0,
		allowedGates : [1, 2],
		newGates : true,
		enableGateChanges : false,
		circuits : [
			//#region Circuit 1
			{
				gateSections : [
					[{
						inputs : [{
							type : "signal",
							val : 1
						}, {
							type : "signal",
							val : 1
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [0, 0],
						}],
						type : gatesEnum.bulb,
						fixed : true,
						nextGates : []
					}]
				]
			},
			//#endregion
			//#region Circuit 2
			{
				gateSections : [
					[{
						inputs : [{
							type : "signal",
							val : 0
						}, {
							type : "signal",
							val : 0
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [0, 0],
						}],
						type : gatesEnum.bulb,
						fixed : true,
						nextGates : []
					}]
				]
			},
			//#endregion
			//#region Circuit 3
			{
				gateSections : [
					[{
						inputs : [{
							type : "signal",
							val : 0
						}, {
							type : "signal",
							val : 1
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [0, 0],
						}],
						type : gatesEnum.bulb,
						fixed : true,
						nextGates : []
					}]
				]
			},
			//#endregion
			//#region Circuit 4 (star)
			{
				gateSections : [
					[{
						inputs : [{
							type : "signal",
							val : 0
						}, {
							type : "signal",
							val : 0
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [0, 0],
						}, {
							type : "signal",
							val : 1
						}],
						type : gatesEnum.and,
						fixed : true,
						nextGates : [{
							gateIdx : [2, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [1, 0],
						}],
						type : gatesEnum.star,
						fixed : true,
						nextGates : []
					}]
				]
			},
			//#endregion
			//#region Circuit 5
			{
				gateSections : [
					[{
						inputs : [{
							type : "signal",
							val : 0
						}, {
							type : "signal",
							val : 0
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [0, 0],
						}, {
							type : "signal",
							val : 1
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [2, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [1, 0],
						}],
						type : gatesEnum.bulb,
						fixed : true,
						nextGates : []
					}]
				]
			},
			//#endregion
			//#region Circuit 6
			{
				gateSections : [
					[{
						inputs : [{
							type : "signal",
							val : 1
						}, {
							type : "signal",
							val : 0
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [0, 0],
						}, {
							type : "signal",
							val : 1
						}],
						type : gatesEnum.nand,
						fixed : true,
						nextGates : [{
							gateIdx : [2, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [1, 0],
						}],
						type : gatesEnum.bulb,
						fixed : true,
						nextGates : []
					}]
				]
			},
			//#endregion
			//#region Circuit 7
			{
				gateSections : [
					[{
						inputs : [{
							type : "signal",
							val : 1
						}, {
							type : "signal",
							val : 1
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [0]
						}]
					}, {
						inputs : [{
							type : "signal",
							val : 0
						}, {
							type : "signal",
							val : 0
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [1]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [0, 0],
						}, {
							type : "gate",
							gate : [0, 1],
						}],
						type : gatesEnum.and,
						fixed : true,
						nextGates : [{
							gateIdx : [2, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [1, 0],
						}],
						type : gatesEnum.bulb,
						fixed : true,
						nextGates : []
					}]
				]
			},
			//#endregion
			//#region Circuit 8 (star)
			{
				gateSections : [
					[{
						inputs : [{
							type : "signal",
							val : 0
						}, {
							type : "signal",
							val : 1
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [0]
						}]
					}, {
						inputs : [{
							type : "signal",
							val : 0
						}, {
							type : "signal",
							val : 1
						}],
						type : gatesEnum.nand,
						fixed : true,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [1]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [0, 0],
						}, {
							type : "gate",
							gate : [0, 1],
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [2, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [1, 0],
						}],
						type : gatesEnum.star,
						fixed : true,
						nextGates : []
					}]
				]
			},
			//#endregion
			//#region Circuit 9
			{
				gateSections : [
					[{
						inputs : [{
							type : "signal",
							val : 0
						}, {
							type : "signal",
							val : 0
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
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
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [1]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [0, 0],
						}, {
							type : "gate",
							gate : [0, 1],
						}],
						type : gatesEnum.nand,
						fixed : true,
						nextGates : [{
							gateIdx : [2, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [1, 0],
						}],
						type : gatesEnum.bulb,
						fixed : true,
						nextGates : []
					}]
				]
			}
			//#endregion
		]
	},
	//#endregion

	//#region Level 2
	{
		unlocked : false,
		starsGained : 0,
		allowedGates : [3,4],
		newGates : true,
		enableGateChanges : false,
		circuits : [
			//#region Circuit 1
			{
				gateSections : [
					[{
						inputs : [{
							type : "signal",
							val : 1
						}, {
							type : "signal",
							val : 1
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [0, 0],
						}],
						type : gatesEnum.bulb,
						fixed : true,
						nextGates : []
					}]
				]
			},
			//#endregion
			//#region Circuit 2
			{
				gateSections : [
					[{
						inputs : [{
							type : "signal",
							val : 0
						}, {
							type : "signal",
							val : 0
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [0, 0],
						}],
						type : gatesEnum.star,
						fixed : true,
						nextGates : []
					}]
				]
			},
			//#endregion
			//#region Circuit 3
			{
				gateSections : [
					[{
						inputs : [{
							type : "signal",
							val : 0
						}, {
							type : "signal",
							val : 1
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [0, 0],
						}],
						type : gatesEnum.bulb,
						fixed : true,
						nextGates : []
					}]
				]
			},
			//#endregion
			//#region Circuit 4 (star)
			{
				gateSections : [
					[{
						inputs : [{
							type : "signal",
							val : 0
						}, {
							type : "signal",
							val : 0
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [0, 0],
						}, {
							type : "signal",
							val : 0
						}],
						type : gatesEnum.or,
						fixed : true,
						nextGates : [{
							gateIdx : [2, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [1, 0],
						}],
						type : gatesEnum.bulb,
						fixed : true,
						nextGates : []
					}]
				]
			},
			//#endregion
			//#region Circuit 5
			{
				gateSections : [
					[{
						inputs : [{
							type : "signal",
							val : 0
						}, {
							type : "signal",
							val : 0
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [0, 0],
						}, {
							type : "signal",
							val : 1
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [2, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [1, 0],
						}],
						type : gatesEnum.bulb,
						fixed : true,
						nextGates : []
					}]
				]
			},
			//#endregion
			//#region Circuit 6
			{
				gateSections : [
					[{
						inputs : [{
							type : "signal",
							val : 1
						}, {
							type : "signal",
							val : 1
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [0, 0],
						}, {
							type : "signal",
							val : 0
						}],
						type : gatesEnum.nor,
						fixed : true,
						nextGates : [{
							gateIdx : [2, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [1, 0],
						}],
						type : gatesEnum.bulb,
						fixed : true,
						nextGates : []
					}]
				]
			},
			//#endregion
			//#region Circuit 7
			{
				gateSections : [
					[{
						inputs : [{
							type : "signal",
							val : 1
						}, {
							type : "signal",
							val : 1
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [0]
						}]
					}, {
						inputs : [{
							type : "signal",
							val : 0
						}, {
							type : "signal",
							val : 0
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [1]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [0, 0],
						}, {
							type : "gate",
							gate : [0, 1],
						}],
						type : gatesEnum.or,
						fixed : true,
						nextGates : [{
							gateIdx : [2, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [1, 0],
						}],
						type : gatesEnum.bulb,
						fixed : true,
						nextGates : []
					}]
				]
			},
			//#endregion
			//#region Circuit 8 (star)
			{
				gateSections : [
					[{
						inputs : [{
							type : "signal",
							val : 0
						}, {
							type : "signal",
							val : 1
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [0]
						}]
					}, {
						inputs : [{
							type : "signal",
							val : 0
						}, {
							type : "signal",
							val : 1
						}],
						type : gatesEnum.nor,
						fixed : true,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [1]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [0, 0],
						}, {
							type : "gate",
							gate : [0, 1],
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [2, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [1, 0],
						}],
						type : gatesEnum.star,
						fixed : true,
						nextGates : []
					}]
				]
			},
			//#endregion
			//#region Circuit 9
			{
				gateSections : [
					[{
						inputs : [{
							type : "signal",
							val : 0
						}, {
							type : "signal",
							val : 0
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
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
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [1]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [0, 0],
						}, {
							type : "gate",
							gate : [0, 1],
						}],
						type : gatesEnum.nor,
						fixed : true,
						nextGates : [{
							gateIdx : [2, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [1, 0],
						}],
						type : gatesEnum.bulb,
						fixed : true,
						nextGates : []
					}]
				]
			}
			//#endregion
		]
	},
	//#endregion

	//#region Level 3
	{
		unlocked : false,
		starsGained : 0,
		allowedGates : [1,2,4],
		enableGateChanges : true,
		circuits : [
			//#region Circuit 1
			{
				gateSections : [
					[{
						inputs : [{
							type : "signal",
							val : 1
						}, {
							type : "signal",
							val : 1
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [0]
						}]
					}, {
						inputs : [{
							type : "signal",
							val : 0
						}, {
							type : "signal",
							val : 0
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [1]
						}]
					}],
					[{
						inputs : [{
							type : "gate",
							gate : [0, 0]
						}, {
							type : "gate",
							gate : [0, 1]
						}],
						type : gatesEnum.and,
						fixed : true,
						nextGates : [{
							gateIdx : [2, 0],
							inputs : [0]
						}]
					}],
					[{
						inputs : [{
							type : "gate",
							gate : [1, 0]
						}],
						type : gatesEnum.bulb,
						fixed : true,
						nextGates : []
					}]
				]
			},
			//#endregion
			//#region Circuit 2 (star)
			{
				gateSections : [
					[{
						inputs : [{
							type : "signal",
							val : 1
						}, {
							type : "signal",
							val : 1
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [0]
						}]
					}, {
						inputs : [{
							type : "signal",
							val : 0
						}, {
							type : "signal",
							val : 0
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [1]
						}]
					}],
					[{
						inputs : [{
							type : "gate",
							gate : [0, 0]
						}, {
							type : "gate",
							gate : [0, 1]
						}],
						type : gatesEnum.nor,
						fixed : true,
						nextGates : [{
							gateIdx : [2, 0],
							inputs : [0]
						}]
					}],
					[{
						inputs : [{
							type : "gate",
							gate : [1, 0]
						}],
						type : gatesEnum.star,
						fixed : true,
						nextGates : []
					}]
				]
			},
			//#endregion
			//#region Circuit 3
			{
				gateSections : [
					[{
						inputs : [{
							type : "signal",
							val : 1
						}, {
							type : "signal",
							val : 1
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [0]
						}]
					}, {
						inputs : [{
							type : "signal",
							val : 0
						}, {
							type : "signal",
							val : 0
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [1]
						}]
					}],
					[{
						inputs : [{
							type : "gate",
							gate : [0, 0]
						}, {
							type : "gate",
							gate : [0, 1]
						}],
						type : gatesEnum.xor,
						fixed : true,
						nextGates : [{
							gateIdx : [2, 0],
							inputs : [0]
						}]
					}],
					[{
						inputs : [{
							type : "gate",
							gate : [1, 0]
						}],
						type : gatesEnum.bulb,
						fixed : true,
						nextGates : []
					}]
				]
			},
			//#endregion
			//#region Circuit 4
			{
				gateSections : [
					[{
						inputs : [{
							type : "signal",
							val : 0
						}, {
							type : "signal",
							val : 1
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [1]
						}, {
							gateIdx : [1, 1],
							inputs : [0]
						}]
					}],
					[{
						inputs : [{
							type : "signal",
							val : 1
						}, {
							type : "gate",
							gate : [0, 1]
						}],
						type : gatesEnum.xor,
						fixed : true,
						nextGates : [{
							gateIdx : [2, 0],
							inputs : [0]
						}]
					}, {
						inputs : [{
							type : "gate",
							gate : [0, 0]
						}, {
							type : "signal",
							val : 0
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [2, 0],
							inputs : [1]
						}]
					}],
					[{
						inputs : [{
							type : "gate",
							gate : [1, 0]
						}, {
							type : "gate",
							gate : [1, 1]
						}],
						type : gatesEnum.nor,
						fixed : true,
						nextGates : [{
							gateIdx : [3, 0],
							inputs : [0]
						}]
					}],
					[{
						inputs : [{
							type : "gate",
							gate : [2, 0]
						}],
						type : gatesEnum.bulb,
						fixed : true,
						nextGates : []
					}]
				]
			},
			//#endregion
			//#region Circuit 5
			{
				gateSections : [
					[{
						inputs : [{
							type : "signal",
							val : 0
						}, {
							type : "signal",
							val : 1
						}],
						type : gatesEnum.and,
						fixed : true,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [1]
						}, {
							gateIdx : [1, 1],
							inputs : [0]
						}]
					}],
					[{
						inputs : [{
							type : "signal",
							val : 1
						}, {
							type : "gate",
							gate : [0, 1]
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [2, 0],
							inputs : [0]
						}]
					}, {
						inputs : [{
							type : "gate",
							gate : [0, 0]
						}, {
							type : "signal",
							val : 0
						}],
						type : gatesEnum.nand,
						fixed : true,
						nextGates : [{
							gateIdx : [2, 0],
							inputs : [1]
						}]
					}],
					[{
						inputs : [{
							type : "gate",
							gate : [1, 0]
						}, {
							type : "gate",
							gate : [1, 1]
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [3, 0],
							inputs : [0]
						}]
					}],
					[{
						inputs : [{
							type : "gate",
							gate : [2, 0]
						}],
						type : gatesEnum.bulb,
						fixed : true,
						nextGates : []
					}]
				]
			},
			//#endregion
			//#region Circuit 6
			{
				gateSections : [
					[{
						inputs : [{
							type : "signal",
							val : 1
						}, {
							type : "signal",
							val : 1
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [1]
						}, {
							gateIdx : [1, 1],
							inputs : [0]
						}]
					}],
					[{
						inputs : [{
							type : "signal",
							val : 0
						}, {
							type : "gate",
							gate : [0, 1]
						}],
						type : gatesEnum.or,
						fixed : true,
						nextGates : [{
							gateIdx : [2, 0],
							inputs : [0]
						}]
					}, {
						inputs : [{
							type : "gate",
							gate : [0, 0]
						}, {
							type : "signal",
							val : 0
						}],
						type : gatesEnum.nor,
						fixed : true,
						nextGates : [{
							gateIdx : [2, 0],
							inputs : [1]
						}]
					}],
					[{
						inputs : [{
							type : "gate",
							gate : [1, 0]
						}, {
							type : "gate",
							gate : [1, 1]
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [3, 0],
							inputs : [0]
						}]
					}],
					[{
						inputs : [{
							type : "gate",
							gate : [2, 0]
						}],
						type : gatesEnum.bulb,
						fixed : true,
						nextGates : []
					}]
				]
			},
			//#endregion
			//#region Circuit 7
			{
				gateSections : [
					[{
						inputs : [{
							type : "signal",
							val : 0
						}, {
							type : "signal",
							val : 1
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [0]
						}, {
							gateIdx : [1, 1],
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
						type : gatesEnum.or,
						fixed : true,
						nextGates : [{
							gateIdx : [1, 1],
							inputs : [1]
						}, {
							gateIdx : [1, 0],
							inputs : [1]
						}]
					}],
					[{
						inputs : [{
							type : "gate",
							gate : [0, 0]
						}, {
							type : "gate",
							gate : [0, 1]
						}],
						type : gatesEnum.or,
						fixed : true,
						nextGates : [{
							gateIdx : [2, 0],
							inputs : [0]
						}]
					}, {
						inputs : [{
							type : "gate",
							gate : [0, 0]
						}, {
							type : "gate",
							gate : [0, 1]
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [2, 0],
							inputs : [1]
						}]
					}],
					[{
						inputs : [{
							type : "gate",
							gate : [1, 0]
						}, {
							type : "gate",
							gate : [1, 1]
						}],
						type : gatesEnum.xnor,
						fixed : true,
						nextGates : [{
							gateIdx : [3, 0],
							inputs : [0]
						}]
					}],
					[{
						inputs : [{
							type : "gate",
							gate : [2, 0]
						}],
						type : gatesEnum.bulb,
						fixed : true,
						nextGates : []
					}]
				]
			},
			//#endregion
			//#region Circuit 8 (star)
			{
				gateSections : [
					[{
						inputs : [{
							type : "signal",
							val : 0
						}, {
							type : "signal",
							val : 0
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [1]
						}, {
							gateIdx : [1, 1],
							inputs : [0]
						}]
					}, {
						inputs : [{
							type : "signal",
							val : 1
						}, {
							type : "signal",
							val : 1
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 1],
							inputs : [1]
						}]
					}],
					[{
						inputs : [{
							type : "signal",
							val : 1
						}, {
							type : "gate",
							gate : [0, 0]
						}],
						type : gatesEnum.xnor,
						fixed : true,
						nextGates : [{
							gateIdx : [2, 0],
							inputs : [0]
						}]
					}, {
						inputs : [{
							type : "gate",
							gate : [0, 0]
						}, {
							type : "gate",
							gate : [0, 1]
						}],
						type : gatesEnum.xor,
						fixed : true,
						nextGates : [{
							gateIdx : [2, 0],
							inputs : [1]
						}]
					}],
					[{
						inputs : [{
							type : "gate",
							gate : [1, 0]
						}, {
							type : "gate",
							gate : [1, 1]
						}],
						type : gatesEnum.and,
						fixed : true,
						nextGates : [{
							gateIdx : [3, 0],
							inputs : [0]
						}]
					}],
					[{
						inputs : [{
							type : "gate",
							gate : [2, 0]
						}],
						type : gatesEnum.star,
						fixed : true,
						nextGates : []
					}]
				]
			},
			//#endregion
			//#region Circuit 9
			{
				gateSections : [
					[{
						inputs : [{
							type : "signal",
							val : 0
						}, {
							type : "signal",
							val : 1
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [1, 0],
							inputs : [0, 1]
						}, {
							gateIdx : [1, 1],
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
						type : gatesEnum.nand,
						fixed : true,
						nextGates : [{
							gateIdx : [1, 1],
							inputs : [1]
						}]
					}],
					[{
						inputs : [{
							type : "gate",
							gate : [0, 0]
						}, {
							type : "gate",
							gate : [0, 0]
						}],
						type : gatesEnum.xor,
						fixed : true,
						nextGates : [{
							gateIdx : [2, 0],
							inputs : [0]
						}]
					}, {
						inputs : [{
							type : "gate",
							gate : [0, 0]
						}, {
							type : "gate",
							gate : [0, 1]
						}],
						type : gatesEnum.blank,
						fixed : false,
						nextGates : [{
							gateIdx : [2, 0],
							inputs : [1]
						}]
					}],
					[{
						inputs : [{
							type : "gate",
							gate : [1, 0]
						}, {
							type : "gate",
							gate : [1, 1]
						}],
						type : gatesEnum.xnor,
						fixed : true,
						nextGates : [{
							gateIdx : [3, 0],
							inputs : [0]
						}]
					}],
					[{
						inputs : [{
							type : "gate",
							gate : [2, 0]
						}],
						type : gatesEnum.bulb,
						fixed : true,
						nextGates : []
					}]
				]
			}
			//#endregion
		]
	}
	//#endregion
]

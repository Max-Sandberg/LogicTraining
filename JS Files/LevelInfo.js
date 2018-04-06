// Contains all the information about the levels: Whether it is unlocked or not; how many stars have been earned for that level; which gates are allowed; whether gate changes are enabled; whether the level introduces new gates; and most importantly, the layout of every circuit in each level.
var circuitPools = [
	//#region Difficulty 1
	{
		all : [
			//#region - Circuit, 1 Gate
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
			//#region - Circuit, 1 Gate
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
			//#region - Circuit, 1 Gate
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
						}],
						type : gatesEnum.bulb,
						fixed : true,
						nextGates : []
					}]
				]
			},
			//#endregion
			//#region - Circuit, 1 Gate
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
			//#region - Circuit, 1 Gate
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
			//#region - Circuit, 1 Gate
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
		]
	},
	//#endregion
	//#region Difficulty 2
	{
		andNand : [
			//#region - Circuit, 2 Gates
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
						type : gatesEnum.bulb,
						fixed : true,
						nextGates : []
					}]
				]
			},
			//#endregion
			//#region - Circuit, 2 Gates
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
						}]
					}], [{
						inputs : [{
							type : "signal",
							val : 1
						}, {
							type : "gate",
							gate : [0, 0],
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
			//#region - Circuit, 2 Gates
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
						type : gatesEnum.bulb,
						fixed : true,
						nextGates : []
					}]
				]
			},
			//#endregion
			//#region - Circuit, 2 Gates
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
						}]
					}], [{
						inputs : [{
							type : "signal",
							val : 1
						}, {
							type : "gate",
							gate : [0, 0],
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
			//#region - Circuit, 2 Gates
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
			//#region - Circuit, 2 Gates
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
						}]
					}], [{
						inputs : [{
							type : "signal",
							val : 1
						}, {
							type : "gate",
							gate : [0, 0],
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
		],
		orNor : [
			//#region - Circuit, 2 Gates
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
			//#region - Circuit, 2 Gates
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
						}]
					}], [{
						inputs : [{
							type : "signal",
							val : 0
						}, {
							type : "gate",
							gate : [0, 0],
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
			//#region - Circuit, 2 Gates
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
			//#region - Circuit, 2 Gates
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
						}]
					}], [{
						inputs : [{
							type : "signal",
							val : 0
						}, {
							type : "gate",
							gate : [0, 0],
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
			//#region - Circuit, 2 Gates
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
			//#region - Circuit, 2 Gates
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
						}]
					}], [{
						inputs : [{
							type : "signal",
							val : 0
						}, {
							type : "gate",
							gate : [0, 0],
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
		],
		xorXnor : [
			//#region - Circuit, 2 Gates
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
						}]
					}], [{
						inputs : [{
							type : "signal",
							val : 0
						}, {
							type : "gate",
							gate : [0, 0],
						}],
						type : gatesEnum.xor,
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
			//#region - Circuit, 2 Gates
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
							val : 1
						}],
						type : gatesEnum.xor,
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
			//#region - Circuit, 2 Gates
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
						type : gatesEnum.xor,
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
			//#region - Circuit, 2 Gates
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
						}]
					}], [{
						inputs : [{
							type : "signal",
							val : 0
						}, {
							type : "gate",
							gate : [0, 0],
						}],
						type : gatesEnum.xnor,
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
			//#region - Circuit, 2 Gates
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
						}]
					}], [{
						inputs : [{
							type : "signal",
							val : 0
						}, {
							type : "gate",
							gate : [0, 0],
						}],
						type : gatesEnum.xnor,
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
			//#region - Circuit, 2 Gates
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
						type : gatesEnum.xnor,
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
		],
		getAndNandOrNor : function(){
			return circuitPools[1].andNand.concat(circuitPools[1].orNor);
		},
		getAll : function(){
			return circuitPools[1].getAndNandOrNor().concat(circuitPools[1].xorXnor);
		}
	},
	//#endregion
	//#region Difficulty 3
	{
		andNand : [
			//#region - Circuit, 3 Gates
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
			//#region - Circuit, 3 Gates
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
			//#region - Circuit, 3 Gates
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
			//#region - Circuit, 3 Gates
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
							val : 1
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
			},
			//#endregion
			//#region - Circuit, 3 Gates
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
							val : 1
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
			},
			//#endregion
			//#region - Circuit, 3 Gates
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
			},
			//#endregion
		],
		orNor : [
			//#region - Circuit, 3 Gates
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
			//#region - Circuit, 3 Gates
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
			//#region - Circuit, 3 Gates
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
			//#region - Circuit, 3 Gates
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
							val : 1
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
			},
			//#endregion
			//#region - Circuit, 3 Gates
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
							val : 1
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
			},
			//#endregion
			//#region - Circuit, 3 Gates
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
			},
			//#endregion
		],
		xorXnor : [
			//#region - Circuit, 3 Gates
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
						type : gatesEnum.xor,
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
			//#region - Circuit, 3 Gates
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
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [0, 0],
						}, {
							type : "gate",
							gate : [0, 1],
						}],
						type : gatesEnum.xor,
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
			//#region - Circuit, 3 Gates
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
						type : gatesEnum.xor,
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
			//#region - Circuit, 3 Gates
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
							val : 1
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
						type : gatesEnum.xnor,
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
			//#region - Circuit, 3 Gates
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
							val : 1
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
						type : gatesEnum.xnor,
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
			//#region - Circuit, 3 Gates
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
						type : gatesEnum.xnor,
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
		],
		getAndNandOrNor : function(){
			return circuitPools[2].andNand.concat(circuitPools[2].orNor);
		},
		getAll : function(){
			return circuitPools[2].getAndNandOrNor().concat(circuitPools[2].xorXnor);
		}
	},
	//#endregion
	//#region Difficulty 4
	{
		onlyAndNand : [
			//#region - Circuit, 3 Gates
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
							gate : [0, 0]
						}, {
							type : "signal",
							val : 1
						}],
						type : gatesEnum.nand,
						fixed : true,
						nextGates : [{
							gateIdx : [2, 0],
							inputs : [1]
						}]
					}], [{
						inputs : [{
							type : "signal",
							val : 1,
						}, {
							type : "gate",
							gate : [1, 0],
						}],
						type : gatesEnum.and,
						fixed : true,
						nextGates : [{
							gateIdx : [3, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [2, 0],
						}],
						type : gatesEnum.bulb,
						fixed : true,
						nextGates : []
					}]
				]
			},
			//#endregion
			//#region - Circuit, 3 Gates
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
							inputs : [1]
						}]
					}], [{
						inputs : [{
							type : "signal",
							val : 1
						}, {
							type : "gate",
							gate : [0, 0]
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
						}, {
							type : "signal",
							val : 1,
						}],
						type : gatesEnum.and,
						fixed : true,
						nextGates : [{
							gateIdx : [3, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [2, 0],
						}],
						type : gatesEnum.bulb,
						fixed : true,
						nextGates : []
					}]
				]
			},
			//#endregion
			//#region - Circuit, 3 Gates
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
							gate : [0, 0]
						}, {
							type : "signal",
							val : 1
						}],
						type : gatesEnum.nand,
						fixed : true,
						nextGates : [{
							gateIdx : [2, 0],
							inputs : [1]
						}]
					}], [{
						inputs : [{
							type : "signal",
							val : 1,
						}, {
							type : "gate",
							gate : [1, 0],
						}],
						type : gatesEnum.and,
						fixed : true,
						nextGates : [{
							gateIdx : [3, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [2, 0],
						}],
						type : gatesEnum.bulb,
						fixed : true,
						nextGates : []
					}]
				]
			},
			//#endregion
			//#region - Circuit, 3 Gates
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
						}]
					}], [{
						inputs : [{
							type : "signal",
							val : 1
						}, {
							type : "gate",
							gate : [0, 0]
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
						}, {
							type : "signal",
							val : 1,
						}],
						type : gatesEnum.nand,
						fixed : true,
						nextGates : [{
							gateIdx : [3, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [2, 0],
						}],
						type : gatesEnum.bulb,
						fixed : true,
						nextGates : []
					}]
				]
			},
			//#endregion
			//#region - Circuit, 3 Gates
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
							gate : [0, 0]
						}, {
							type : "signal",
							val : 1
						}],
						type : gatesEnum.and,
						fixed : true,
						nextGates : [{
							gateIdx : [2, 0],
							inputs : [1]
						}]
					}], [{
						inputs : [{
							type : "signal",
							val : 1,
						}, {
							type : "gate",
							gate : [1, 0],
						}],
						type : gatesEnum.nand,
						fixed : true,
						nextGates : [{
							gateIdx : [3, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [2, 0],
						}],
						type : gatesEnum.bulb,
						fixed : true,
						nextGates : []
					}]
				]
			},
			//#endregion
			//#region - Circuit, 3 Gates
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
						}]
					}], [{
						inputs : [{
							type : "signal",
							val : 1
						}, {
							type : "gate",
							gate : [0, 0]
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
						}, {
							type : "signal",
							val : 1,
						}],
						type : gatesEnum.nand,
						fixed : true,
						nextGates : [{
							gateIdx : [3, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [2, 0],
						}],
						type : gatesEnum.bulb,
						fixed : true,
						nextGates : []
					}]
				]
			}
			//#endregion
		],
		mixedAndNandOrNor : [
			//#region - Circuit, 3 Gates
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
							gate : [0, 0]
						}, {
							type : "signal",
							val : 1
						}],
						type : gatesEnum.nand,
						fixed : true,
						nextGates : [{
							gateIdx : [2, 0],
							inputs : [1]
						}]
					}], [{
						inputs : [{
							type : "signal",
							val : 0,
						}, {
							type : "gate",
							gate : [1, 0],
						}],
						type : gatesEnum.or,
						fixed : true,
						nextGates : [{
							gateIdx : [3, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [2, 0],
						}],
						type : gatesEnum.bulb,
						fixed : true,
						nextGates : []
					}]
				]
			},
			//#endregion
			//#region - Circuit, 3 Gates
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
							gate : [0, 0]
						}, {
							type : "signal",
							val : 1
						}],
						type : gatesEnum.and,
						fixed : true,
						nextGates : [{
							gateIdx : [2, 0],
							inputs : [1]
						}]
					}], [{
						inputs : [{
							type : "signal",
							val : 0,
						}, {
							type : "gate",
							gate : [1, 0],
						}],
						type : gatesEnum.nor,
						fixed : true,
						nextGates : [{
							gateIdx : [3, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [2, 0],
						}],
						type : gatesEnum.bulb,
						fixed : true,
						nextGates : []
					}]
				]
			},
			//#endregion
			//#region - Circuit, 3 Gates
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
					}], [{
						inputs : [{
							type : "signal",
							val : 1,
						}, {
							type : "gate",
							gate : [1, 0],
						}],
						type : gatesEnum.and,
						fixed : true,
						nextGates : [{
							gateIdx : [3, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [2, 0],
						}],
						type : gatesEnum.bulb,
						fixed : true,
						nextGates : []
					}]
				]
			},
			//#endregion
			//#region - Circuit, 3 Gates
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
							gate : [0, 0]
						}, {
							type : "signal",
							val : 0
						}],
						type : gatesEnum.or,
						fixed : true,
						nextGates : [{
							gateIdx : [2, 0],
							inputs : [1]
						}]
					}], [{
						inputs : [{
							type : "signal",
							val : 1,
						}, {
							type : "gate",
							gate : [1, 0],
						}],
						type : gatesEnum.nand,
						fixed : true,
						nextGates : [{
							gateIdx : [3, 0],
							inputs : [0]
						}]
					}], [{
						inputs : [{
							type : "gate",
							gate : [2, 0],
						}],
						type : gatesEnum.bulb,
						fixed : true,
						nextGates : []
					}]
				]
			},
			//#endregion
		],
		getMixedAll : function(){
			return circuitPools[3].mixedAndNandOrNor.concat([
				//#region - Circuit, 3 Gates
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
								gate : [0, 0]
							}, {
								type : "signal",
								val : 1
							}],
							type : gatesEnum.xnor,
							fixed : true,
							nextGates : [{
								gateIdx : [2, 0],
								inputs : [1]
							}]
						}], [{
							inputs : [{
								type : "signal",
								val : 0,
							}, {
								type : "gate",
								gate : [1, 0],
							}],
							type : gatesEnum.or,
							fixed : true,
							nextGates : [{
								gateIdx : [3, 0],
								inputs : [0]
							}]
						}], [{
							inputs : [{
								type : "gate",
								gate : [2, 0],
							}],
							type : gatesEnum.bulb,
							fixed : true,
							nextGates : []
						}]
					]
				},
				//#endregion
				//#region - Circuit, 3 Gates
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
								gate : [0, 0]
							}, {
								type : "signal",
								val : 0
							}],
							type : gatesEnum.xor,
							fixed : true,
							nextGates : [{
								gateIdx : [2, 0],
								inputs : [1]
							}]
						}], [{
							inputs : [{
								type : "signal",
								val : 0,
							}, {
								type : "gate",
								gate : [1, 0],
							}],
							type : gatesEnum.nor,
							fixed : true,
							nextGates : [{
								gateIdx : [3, 0],
								inputs : [0]
							}]
						}], [{
							inputs : [{
								type : "gate",
								gate : [2, 0],
							}],
							type : gatesEnum.bulb,
							fixed : true,
							nextGates : []
						}]
					]
				},
				//#endregion
				//#region - Circuit, 3 Gates
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
						}], [{
							inputs : [{
								type : "signal",
								val : 0,
							}, {
								type : "gate",
								gate : [1, 0],
							}],
							type : gatesEnum.xor,
							fixed : true,
							nextGates : [{
								gateIdx : [3, 0],
								inputs : [0]
							}]
						}], [{
							inputs : [{
								type : "gate",
								gate : [2, 0],
							}],
							type : gatesEnum.bulb,
							fixed : true,
							nextGates : []
						}]
					]
				},
				//#endregion
				//#region - Circuit, 3 Gates
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
								gate : [0, 0]
							}, {
								type : "signal",
								val : 0
							}],
							type : gatesEnum.or,
							fixed : true,
							nextGates : [{
								gateIdx : [2, 0],
								inputs : [1]
							}]
						}], [{
							inputs : [{
								type : "signal",
								val : 1,
							}, {
								type : "gate",
								gate : [1, 0],
							}],
							type : gatesEnum.xnor,
							fixed : true,
							nextGates : [{
								gateIdx : [3, 0],
								inputs : [0]
							}]
						}], [{
							inputs : [{
								type : "gate",
								gate : [2, 0],
							}],
							type : gatesEnum.bulb,
							fixed : true,
							nextGates : []
						}]
					]
				},
				//#endregion
				//#region - Circuit, 3 Gates
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
								gate : [0, 0]
							}, {
								type : "signal",
								val : 1
							}],
							type : gatesEnum.nand,
							fixed : true,
							nextGates : [{
								gateIdx : [2, 0],
								inputs : [1]
							}]
						}], [{
							inputs : [{
								type : "signal",
								val : 0,
							}, {
								type : "gate",
								gate : [1, 0],
							}],
							type : gatesEnum.xor,
							fixed : true,
							nextGates : [{
								gateIdx : [3, 0],
								inputs : [0]
							}]
						}], [{
							inputs : [{
								type : "gate",
								gate : [2, 0],
							}],
							type : gatesEnum.bulb,
							fixed : true,
							nextGates : []
						}]
					]
				},
				//#endregion
				//#region - Circuit, 3 Gates
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
								gate : [0, 0]
							}, {
								type : "signal",
								val : 1
							}],
							type : gatesEnum.and,
							fixed : true,
							nextGates : [{
								gateIdx : [2, 0],
								inputs : [1]
							}]
						}], [{
							inputs : [{
								type : "signal",
								val : 0,
							}, {
								type : "gate",
								gate : [1, 0],
							}],
							type : gatesEnum.xnor,
							fixed : true,
							nextGates : [{
								gateIdx : [3, 0],
								inputs : [0]
							}]
						}], [{
							inputs : [{
								type : "gate",
								gate : [2, 0],
							}],
							type : gatesEnum.bulb,
							fixed : true,
							nextGates : []
						}]
					]
				},
				//#endregion
				//#region - Circuit, 3 Gates
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
								gate : [0, 0]
							}, {
								type : "signal",
								val : 1
							}],
							type : gatesEnum.xnor,
							fixed : true,
							nextGates : [{
								gateIdx : [2, 0],
								inputs : [1]
							}]
						}], [{
							inputs : [{
								type : "signal",
								val : 1,
							}, {
								type : "gate",
								gate : [1, 0],
							}],
							type : gatesEnum.and,
							fixed : true,
							nextGates : [{
								gateIdx : [3, 0],
								inputs : [0]
							}]
						}], [{
							inputs : [{
								type : "gate",
								gate : [2, 0],
							}],
							type : gatesEnum.bulb,
							fixed : true,
							nextGates : []
						}]
					]
				},
				//#endregion
				//#region - Circuit, 3 Gates
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
								gate : [0, 0]
							}, {
								type : "signal",
								val : 1
							}],
							type : gatesEnum.xor,
							fixed : true,
							nextGates : [{
								gateIdx : [2, 0],
								inputs : [1]
							}]
						}], [{
							inputs : [{
								type : "signal",
								val : 1,
							}, {
								type : "gate",
								gate : [1, 0],
							}],
							type : gatesEnum.nand,
							fixed : true,
							nextGates : [{
								gateIdx : [3, 0],
								inputs : [0]
							}]
						}], [{
							inputs : [{
								type : "gate",
								gate : [2, 0],
							}],
							type : gatesEnum.bulb,
							fixed : true,
							nextGates : []
						}]
					]
				},
				//#endregion
			])
		}
	},
	//#endregion
	//#region Difficulty 5
	{
		mixedAll : [
			//#region Circuit, 5 Gates
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
							val : 1
						}],
						type : gatesEnum.blank,
						fixed : false,
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
						type : gatesEnum.and,
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
						type : gatesEnum.xor,
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
			//#region Circuit, 5 Gates
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
						type : gatesEnum.bulb,
						fixed : true,
						nextGates : []
					}]
				]
			},
			//#endregion
			//#region Circuit, 5 Gates
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
							inputs : [0]
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
							type : "signal",
							val : 0
						}],
						type : gatesEnum.or,
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
						type : gatesEnum.bulb,
						fixed : true,
						nextGates : []
					}]
				]
			},
			//#endregion
			//#region Circuit, 5 Gates
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
							val : 1
						}],
						type : gatesEnum.blank,
						fixed : false,
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
						type : gatesEnum.nand,
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
						type : gatesEnum.and,
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
						type : gatesEnum.xor,
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
			//#region Circuit, 5 Gates
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
						}, {
							gateIdx : [1, 1],
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
						type : gatesEnum.blank,
						fixed : false,
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
						type : gatesEnum.and,
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
			//#region Circuit, 5 Gates
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
							gateIdx : [1, 1],
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
							gateIdx : [1, 1],
							inputs : [1]
						}, {
							gateIdx : [1, 0],
							inputs : [1]
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
						type : gatesEnum.nor,
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
						type : gatesEnum.or,
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

var levels = [
	//#region Level 0 - Tutorial
	{
		tutorial : true,
		unlocked : true,
		allowedGates : [3],
		circuitDifficulties : [1],
		circuitPool : {
			diff1 : [
				//#region - Tutorial Circuit
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
		}
	},
	//#endregion

	//#region Level 1 - AND/NAND, Easy
	{
		unlocked : true, //Change me back!
		starsGained : 0,
		allowedGates : [1, 2],
		newGates : true,
		circuitDifficulties : [1, 1, 1, 2, 1, 2, 1, 2, 1, 3],
		circuitPool : {
			diff1 : circuitPools[0].all,
			diff2 : circuitPools[1].andNand,
			diff3 : circuitPools[2].andNand
		}
	},
	//#endregion

	//#region Level 2 - AND/NAND, Medium
	{
		unlocked : true, //Change me back!
		starsGained : 0,
		allowedGates : [1, 2],
		circuitDifficulties : [2, 2, 2, 3, 2, 3, 2, 3, 2, 4],
		circuitPool : {
			diff2 : circuitPools[1].andNand,
			diff3 : circuitPools[2].andNand,
			diff4 : circuitPools[3].onlyAndNand
		}
	},
	//#endregion

	//#region Level 3 - OR/NOR, Easy
	{
		unlocked : true, //Change me back!
		starsGained : 0,
		allowedGates : [3,4],
		newGates : true,
		circuitDifficulties : [1, 1, 1, 2, 1, 2, 1, 2, 1, 3],
		circuitPool : {
			diff1 : circuitPools[0].all,
			diff2 : circuitPools[1].orNor,
			diff3 : circuitPools[2].orNor
		}
	},
	//#endregion

	//#region Level 4 - OR/NOR, Medium
	{
		unlocked : true, //Change me back!
		starsGained : 0,
		allowedGates : [3,4],
		circuitDifficulties : [2, 2, 2, 3, 2, 3, 2, 3, 2, 4],
		circuitPool : {
			diff2 : circuitPools[1].getAndNandOrNor(),
			diff3 : circuitPools[2].getAndNandOrNor(),
			diff4 : circuitPools[3].mixedAndNandOrNor,
		}
	},
	//#endregion

	//#region Level 5 - XOR/XNOR, Easy
	{
		unlocked : true, //Change me back!
		starsGained : 0,
		allowedGates : [5,6],
		newGates : true,
		circuitDifficulties : [1, 1, 1, 2, 1, 2, 1, 2, 1, 3],
		circuitPool : {
			diff1 : circuitPools[0].all,
			diff2 : circuitPools[1].xorXnor,
			diff3 : circuitPools[2].xorXnor
		}
	},
	//#endregion

	//#region Level 6 - XOR/XNOR, Medium
	{
		unlocked : true, //Change me back!
		starsGained : 0,
		allowedGates : [5,6],
		circuitDifficulties : [2, 2, 2, 3, 2, 3, 2, 3, 2, 4],
		circuitPool : {
			diff2 : circuitPools[1].getAll(),
			diff3 : circuitPools[2].getAll(),
			diff4 : circuitPools[3].getMixedAll()
		}
	},
	//#endregion

	//#region Level 7 - AND/NAND, Hard
	{
		unlocked : true, //Change me back!
		starsGained : 0,
		allowedGates : [1,2],
		circuitDifficulties : [3, 3, 3, 4, 2, 3, 3, 4, 2, 5],
		circuitPool : {
			diff2 : circuitPools[1].getAll(),
			diff3 : circuitPools[2].getAll(),
			diff4 : circuitPools[3].getMixedAll(),
			diff5 : circuitPools[4].mixedAll
		}
	},
	//#endregion

	//#region Level 8 - OR/NOR, Hard
	{
		unlocked : true, //Change me back!
		starsGained : 0,
		allowedGates : [3,4],
		circuitDifficulties : [3, 3, 3, 4, 2, 3, 3, 4, 2, 5],
		circuitPool : {
			diff2 : circuitPools[1].getAll(),
			diff3 : circuitPools[2].getAll(),
			diff4 : circuitPools[3].getMixedAll(),
			diff5 : circuitPools[4].mixedAll
		}
	},
	//#endregion

	//#region Level 9 - XOR/XNOR, Hard
	{
		unlocked : true, //Change me back!
		starsGained : 0,
		allowedGates : [5,6],
		circuitDifficulties : [3, 3, 3, 4, 2, 3, 3, 4, 2, 5],
		circuitPool : {
			diff2 : circuitPools[1].getAll(),
			diff3 : circuitPools[2].getAll(),
			diff4 : circuitPools[3].getMixedAll(),
			diff5 : circuitPools[4].mixedAll
		}
	},
	//#endregion

	//#region Level 10 - Gate changes, Hard
	{
		unlocked : true, //Change me back!
		starsGained : 0,
		allowedGates : [1,2,3,4,5,6],
		introduceGateChanges : true,
		enableGateChanges : true,
		circuitDifficulties : [3, 3, 3, 4, 2, 3, 3, 4, 2, 5],
		circuitPool : {
			diff2 : circuitPools[1].getAll(),
			diff3 : circuitPools[2].getAll(),
			diff4 : circuitPools[3].getMixedAll(),
			diff5 : circuitPools[4].mixedAll
		}
	},
	//#endregion

	/*
	//#region Level 7 - All gates, Medium, Gate changes
	{
		unlocked : true, //Change me back!
		starsGained : 0,
		allowedGates : [1,2,3],
		newGates : false,
		enableGateChanges : true,
		introduceGateChanges : true,
		circuits : [
			//#region Circuit 1 - 2 Gates
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
			//#region Circuit 2 - 3 Gates
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
			//#region Circuit 3 - 2 Gates
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
							val : 0
						}],
						type : gatesEnum.xnor,
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
			//#region Circuit 4 - 1 Gate, Star
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
						type : gatesEnum.star,
						fixed : true,
						nextGates : []
					}]
				]
			},
			//#endregion
			//#region Circuit 5 - 3 Gates
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
			//#region Circuit 6 - 2 Gates
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
			//#region Circuit 7 - 3 Gates
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
						type : gatesEnum.xnor,
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
			//#region Circuit 8 - 2 Gates, Star
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
						type : gatesEnum.star,
						fixed : true,
						nextGates : []
					}]
				]
			},
			//#endregion
			//#region Circuit 9 - 3 Gates
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
							val : 1
						}, {
							type : "signal",
							val : 0
						}],
						type : gatesEnum.or,
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
			//#region Circuit 10 - 4 Gates
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
					}],
					[{
						inputs : [{
							type : "signal",
							val : 0
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
							val : 1
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
						type : gatesEnum.xor,
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
	},
	//#endregion

	//#region Level 8 - All gates, Hard, Gate changes
	{
		unlocked : true, //Change me back!
		starsGained : 0,
		allowedGates : [1,2,3],
		newGates : false,
		enableGateChanges : true,
		circuits : [
			//#region Circuit 1 - 3 Gates
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
			//#region Circuit 2 - 4 Gates
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
							val : 1
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
						type : gatesEnum.bulb,
						fixed : true,
						nextGates : []
					}]
				]
			},
			//#endregion
			//#region Circuit 3 - 3 Gates
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
			},
			//#endregion
			//#region Circuit 4 - 2 Gates, Star
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
						type : gatesEnum.star,
						fixed : true,
						nextGates : []
					}]
				]
			},
			//#endregion
			//#region Circuit 5 - 4 Gates
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
							val : 1
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
			//#region Circuit 6 - 3 Gates
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
						type : gatesEnum.xnor,
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
			//#region Circuit 7 - 4 Gates
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
							val : 1
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
						type : gatesEnum.nand,
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
			//#region Circuit 8 - 3 Gates, Star
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
						type : gatesEnum.star,
						fixed : true,
						nextGates : []
					}]
				]
			},
			//#endregion
			//#region Circuit 9 - 5 Gates
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
			//#region Circuit 10 - 5 Gates
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
	*/
]

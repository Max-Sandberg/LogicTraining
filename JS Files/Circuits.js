var tutorial = {
	circuits: [{
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
	}]
}

var levels = [{
	unlocked : true,
	starsGained : 0,
	allowedGates : [1, 2],
	enableGateChanges : false,
	circuits : [{
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
	}, {
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
	}, {
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
	}, {
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
	}, {
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
	}, {
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
	}, {
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
	}, {
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
	}, {
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
	}]
}, {
	unlocked : false,
	starsGained : 0,
	allowedGates : [3,4],
	enableGateChanges : false,
	circuits : [{
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
	}, {
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
	}, {
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
	}, {
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
	}, {
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
	}, {
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
	}, {
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
	}, {
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
	}, {
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
	}]
}, {
	unlocked : false,
	starsGained : 0,
	allowedGates : [1,2,4],
	enableGateChanges : true,
	circuits : [{
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
	}, {
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
	}, {
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
	}, {
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
	}, {
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
	}, {
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
	}, {
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
	}, {
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
	}, {
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
	}]
}]

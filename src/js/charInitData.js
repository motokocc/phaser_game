export const charInitData = [
	{ 
		name: "slime", 
		isOneSpritesheetOnly: true, 
		location: "elven forest", 
		role: "enemy", 
		speed: 400, 
		flipImage: false, 
		distance: -100,
		animation: {
			attack: { start: 0, end: 5 },
			run: { start: 6, end: 7 },
			dead: { start: 45, end: 47 }
		},
		stats: {
			attack: 1,
			speed: 1,
			health: 5
		},
		xp: 20 
	}
]
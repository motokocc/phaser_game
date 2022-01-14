let missions = [
	{
		title: 'Goblin Extermination',
		description: 'Exterminate 5 goblins',
		requiredLevel: 5,
		reward:{
			amount: 500,
			currency: 'gold'
		},
		condition: {
			task: 'kill',
			enemy: 'goblin',
			amountNeed: 5,
		}
	},
	{
		title: 'Kill Goblin Lord',
		description: 'Exterminate goblin lord',
		requiredLevel: 10,
		reward:{
			amount: 250,
			currency: 'gems'
		},
		condition: {
			task: 'kill',
			enemy: 'goblin lord',
			amountNeed: 3,
		}
	},
	{
		title: 'Kill Slime King',
		description: 'Exterminate Slime King',
		requiredLevel: 20,
		reward:{
			amount: 500,
			currency: 'gems'
		},
		condition: {
			task: 'kill',
			enemy: 'Slime king',
			amountNeed: 1,
		}
	},	
]

export class Mission{

	constructor(playerLevel){
		this.playerLevel = playerLevel
		this.allowedMissions = [];
	}

	generateMissions(){
		missions.forEach(mission => {
			if(this.playerLevel >= mission.requiredLevel){
				this.allowedMissions.push(mission);
			}
		});

		return this.allowedMissions;
	}

	takeMission(missionsCompleted){
		let allMissions = this.generateMissions();

		if(missionsCompleted){
			let filteredMission = allMissions.filter(mission => !missionsCompleted.includes(mission.title));

			if(filteredMission.length >= 1){
				return filteredMission[0];
			}
			else{
				return null;
			}
		}
		else{
			return allMissions[0];
		}
    }
};
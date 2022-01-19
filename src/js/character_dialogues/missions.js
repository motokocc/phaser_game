import { missions } from './mission_dialogue';

export class Mission{

	constructor(playerLevel){
		this.playerLevel = playerLevel
		this.allowedMissions = [];
		this.currentDialogue = 0;
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

    skip(skipNumber){
    	if(!skipNumber){
    		this.currentDialogue++;
    	}
    	else{
    		this.currentDialogue = this.currentDialogue + skipNumber;
    	}
    }

    getDialogue(dialogue){
    	return dialogue[this.currentDialogue].text;
    }
};
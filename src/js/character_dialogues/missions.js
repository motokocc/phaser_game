let missions = [
	{
		title: 'Goblin Extermination',
		description: 'Exterminate 5 goblins',
		dialogue: {
			lines: [
				{ text: "Hmmm... Seems like you are strong enough to take a mission but first I need to test your skills before giving you a hard one." },
				{ text: "Recently, there are reports of goblins attacking villagers. I want you to exterminate them. Would you like to take care of this one?" },

			],
			accept: "Great! The person who requested this mission said there are at least 5 of them. Report to me once you finish them all.",
			decline: "I see. You're scared of just mere goblins. Come back when you are ready.",
			complete: "Good job! You did great for your first mission. Take this as a reward." ,
			notComplete: "You still haven't completed the mission yet? Its just 5 goblins. Are you sure you are ready to take missions? Hmmmm...",
			rewardTaken: "Come again later and I'll give you a mission once there is a new one." 
		},
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
		title: 'Kill the Goblin Leader',
		description: 'Exterminate goblin lord',
		dialogue: {
			lines: [
				{ text: "I have a new mission for you. It seems like there is a goblin that survived during your last mission and is now seeking for revenge. It called their leader and is now destroying the village!" },
				{ text: "You have to finish the Goblin leader before things get worse and he calls more goblins. You better hurry and go there now!" }
			],
			accept: "For this mission, you only need to kill their leader and his minions will retreat. I wish you luck.",
			decline: "You scared? Oh you just need to prepare first. Come back once you are ready.",
			complete: "Awesome you took down the Goblin leader. Take this as a reward." ,
			notComplete: "Why are you here? You need advice? Kill their leader and those goblins will all run out of fear.",
			rewardTaken: "Come again later and I'll give you a mission once there is a new one. I hope those goblins learn their lesson. " 
		},
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
		title: 'Kill the Slime King',
		description: 'Exterminate Slime King',
		dialogue: {
			lines: [
				{ text: "A rich guy requested a mission and he wants the King slime's crown. This mission will give a big reward. Would you like to take it?" },
			],
			accept: "Great! Come back when its done and let's have some beer! You aren't possibly thinking of wasting that reward all by yourself right?",
			decline: "Are you sure? You might never get a mission that gives reward as big as this!",
			complete: "Great! I never thought you will be the one to kill the Slime king. Here, take this reward" ,
			notComplete: "Still not killing that Slime king? You should hurry. There are many adventurers hunting that one because of the reward.",
			rewardTaken: "Come again later for more missions!" 
		},
		requiredLevel: 20,
		reward:{
			amount: 1000,
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
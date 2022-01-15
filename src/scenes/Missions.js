import 'regenerator-runtime/runtime';
import BaseScene from '../plugins/BaseScene';
import { Mission } from '../js/character_dialogues/missions';
import { doc, updateDoc } from "firebase/firestore";

class Missions extends BaseScene {

    create(){
        const paddingX = this.gameW * 0.025;
        const dialogPadding = 18;
        const dialogBoxH = this.game.config.height / 5;

        this.generateBg();
        this.generateUpperUI();

        let box = this.add.sprite(0,this.gameH - dialogBoxH, 'dialogueBox').setOrigin(0);
        box.displayWidth = this.gameW;
        box.displayHeight = dialogBoxH;

        this.messageText = this.add.text(
            dialogPadding, 
            (this.gameH - dialogBoxH) + dialogPadding,
            '',
            {color: '#613e1e'}
        ).setWordWrapWidth(this.gameW * 0.9, true);

        //Next Button Function
        this.nextText = this.add.text( this.gameW-dialogPadding, this.gameH - dialogPadding, 'Next >>>', {color: '#613e1e'}).setInteractive();
        this.nextText.setOrigin(1,1);

        this.nextText.on('pointerdown', () => {
            this.nextText.setScale(0.9);
            this.nextText.setAlpha(0.7);
            this.sound.play('hoverEffect', {loop: false});
        })

        let quest = new Mission(20);
        let missionsToTake = quest.generateMissions();
        this.missionReply = false;

        if(quest.playerLevel < 5){
            this.typewriteTextWrapped('Come back when you are at least level 5');
            this.proceedToMainPage(this.nextText);
        }
        else if(missionsToTake.length >= 1){
            let { currentMission, finished } = this.player.playerInfo.missions;

            if(this.player.playerInfo.missions.currentMission){
                let { progress, condition, title } = currentMission;

                if(progress >= condition.amountNeed){
                    this.typewriteTextWrapped('Mission Complete. Please take this.');

                    this.nextText.on('pointerdown', () => {
                        if(this.missionReply){
                            this.scene.start("game");
                        }
                        else{
                            this.rewardPopup(currentMission);
                        }
                    })
                }
                else{
                    this.typewriteTextWrapped(`You still haven't completed the mission yet`);
                    this.proceedToMainPage(this.nextText);
                }
            }
            else{
                if(finished.length <= 0){
                    let firstQuest = quest.takeMission();
                    this.typewriteTextWrapped(`Your first mission is ${firstQuest.title}. Will you accept the mission?`);

                    this.nextText.on('pointerdown', () => {
                        if(this.missionReply){
                            this.scene.start("game");
                        }
                        else{
                            this.acceptMissionPopUp(firstQuest);  
                        }
                    })
                }
                else{
                    let latestQuest = quest.takeMission(finished);

                    if(latestQuest){
                        this.typewriteTextWrapped(`Your latest mission is ${latestQuest.title}. Will you accept the mission?`);

                        this.nextText.on('pointerdown', () => {
                            if(this.missionReply){
                                this.scene.start("game");
                            }
                            else{
                                this.acceptMissionPopUp(latestQuest);  
                            }
                        })           
                    }
                    else{
                        this.typewriteTextWrapped('No missions available at the moment');
                        this.proceedToMainPage(this.nextText);
                    }
                }
            }
        }
        else{
            this.typewriteTextWrapped('No missions available at the moment');
            this.proceedToMainPage(this.nextText);
        }
    }

    acceptMissionPopUp(quest){

        let missionPopUpGroup = this.add.group();

        const missionDescription = this.add.text(
            this.gameW/2,
            this.gameH/2 -25,
            "Do you want to accept this mission?",
            {fontFamily: 'Arial', color:'#613e1e', align: 'center'}
        ).setOrigin(0.5).setWordWrapWidth(200).setScale(0,1.3);

        const missionAcceptButton = this.add.sprite(
            missionDescription.x - 10,
            missionDescription.y + 50,
            'confirmButtonAlt'
        ).setOrigin(1,0).setInteractive().setScale(0,1.3);

        const missionCancelButton = this.add.sprite(
            missionDescription.x + 10,
            missionDescription.y + 50,
            'cancelButtonAlt'
        ).setOrigin(0).setInteractive().setScale(0,1.3);

        missionCancelButton.on("pointerdown", () => {
            this.sound.play('clickEffect', {loop: false});

            this.messageText.setText('');
            this.typewriteTextWrapped(`Ok. I'll wait when you are ready.`);

            this.missionReply = true;
            this.popupContainer.destroy(true);
        });

        missionAcceptButton.on('pointerdown', async () => {
            this.sound.play('clickEffect', {loop: false});

            quest.progress = 0;
            this.player.playerInfo.missions.currentMission = quest;

            try{
                let { users, playerInfo } = this.player;
                await updateDoc(doc(users, playerInfo.address), { missions : playerInfo.missions});
            }
            catch(e){
                console.log(e.message)
            }

            this.missionReply = true;
            this.messageText.setText('');
            this.typewriteTextWrapped(`Great! Comeback again later when its done`);

            this.popupContainer.destroy(true);
        });

        missionPopUpGroup.addMultiple([missionDescription, missionAcceptButton, missionCancelButton]);

        this.popUp('Mission',missionPopUpGroup);        
    }

    rewardPopup(mission){

        let { title, reward } = mission

        let rewardGroup = this.add.group();

        let rewardItem = this.add.text(
            this.game.config.width/2, 
            this.game.config.height/2 - 50,
            `${reward.amount} ${reward.currency}`
            ,{fontFamily: 'Arial', color: '#613e1e', align: 'justify'}
        ).setOrigin(0.5,0).setWordWrapWidth(230).setScale(0,1.3);

        let okButton = this.add.sprite(
            rewardItem.x, 
            rewardItem.y + 100,
            'confirmButtonAlt'
        ).setOrigin(0.5).setInteractive().setScale(0,1.3);

        okButton.on("pointerdown", () => {
            this.player.playerInfo.missions.finished.push(title);
            this.player.playerInfo.missions.currentMission = null;
            this.player.playerInfo[reward.currency] = this.player.playerInfo[reward.currency] + reward.amount;
            this[`${reward.currency}_value`].setText = this.player.playerInfo[reward.currency];

            try{
                let { users, playerInfo } = this.player;
                await updateDoc(doc(users, playerInfo.address),
                    { 
                        missions: playerInfo.missions, 
                        gems: playerInfo.gems, 
                        gold: playerInfo.gold 
                    }
                );
            }
            catch(e){
                console.log(e.message)
            }

            this.messageText.setText('');
            this.typewriteTextWrapped('Thank you for completing the mission. Comeback again later for more quest');
            this.missionReply = true;

            this.sound.play('clickEffect', {loop: false});
            this.popupContainer.destroy(true);
        });

        rewardGroup.addMultiple([rewardItem, okButton]);
        this.popUp('Mission Completed', rewardGroup);
    }
}



export default Missions;
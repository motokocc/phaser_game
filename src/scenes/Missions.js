import 'regenerator-runtime/runtime';
import BaseScene from '../plugins/BaseScene';
import { Mission } from '../js/character_dialogues/missions';
import { doc, updateDoc } from "firebase/firestore";

class Missions extends BaseScene {

    create(){
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
            this.sound.play('hoverEffect', {loop: false});
        })

        let quest = new Mission(this.player.playerInfo.level);
        let missionsToTake = quest.generateMissions();
        this.missionReply = false;

        if(quest.playerLevel < 5){
            this.typewriteTextWrapped(`Hi ${this.player.playerInfo.name || 'Adventurer'}. You and your djinn seems wea.... I mean not ready to take missions. Come back when you are stronger(level 5). Say hi to Lilith for me!`);
            this.proceedToMainPage(this.nextText);
        }
        else if(missionsToTake.length >= 1){
            let { currentMission, finished } = this.player.playerInfo.missions;

            if(this.player.playerInfo.missions.currentMission){
                let { progress, condition } = currentMission;

                if(progress >= condition.amountNeed){
                    this.typewriteTextWrapped(currentMission.dialogue.complete);

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
                    this.typewriteTextWrapped(currentMission.dialogue.notComplete);
                    this.proceedToMainPage(this.nextText);
                }
            }
            else{
                if(finished.length <= 0){
                    let firstQuest = quest.takeMission();
                    let { lines } = firstQuest.dialogue;
                    this.typewriteTextWrapped(quest.getDialogue(lines));

                    this.nextText.on('pointerdown', () => {
                        if(this.missionReply){
                            this.scene.start("game");
                        }
                        else if(lines.length > 1 && quest.currentDialogue < lines.length - 1){
                            quest.skip();
                            this.textTimer.remove();
                            this.messageText.setText('');
                            this.typewriteTextWrapped(quest.getDialogue(lines));
                        }
                        else{
                            this.acceptMissionPopUp(firstQuest);  
                        }
                    })
                }
                else{
                    let latestQuest = quest.takeMission(finished);
            
                    if(latestQuest){
                        let { lines } = latestQuest.dialogue;
                        this.typewriteTextWrapped(quest.getDialogue(lines));

                        this.nextText.on('pointerdown', () => {
                            if(this.missionReply){
                                this.scene.start("game");
                            }
                            else if(lines.length > 1 && quest.currentDialogue < lines.length - 1){
                                quest.skip();
                                this.textTimer.remove();
                                this.messageText.setText('');
                                this.typewriteTextWrapped(quest.getDialogue(lines));
                            }
                            else{
                                this.acceptMissionPopUp(latestQuest);  
                            }
                        })           
                    }
                    else{
                        this.typewriteTextWrapped('No missions available at the moment. Please come again later');
                        this.proceedToMainPage(this.nextText);
                    }
                }
            }
        }
        else{
            this.typewriteTextWrapped('No missions available at the moment. Please come again later');
            this.proceedToMainPage(this.nextText);
        }
    }

    acceptMissionPopUp(quest){
        this.nextText.disableInteractive();
        let { dialogue } = quest;
        let { accept, decline } = dialogue;

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
            this.textTimer.remove();
            this.messageText.setText('');
            this.typewriteTextWrapped(decline);

            this.missionReply = true;
            this.nextText.setInteractive();
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
            this.textTimer.remove();
            this.messageText.setText('');
            this.typewriteTextWrapped(accept);
            this.nextText.setInteractive();

            this.popupContainer.destroy(true);
        });

        missionPopUpGroup.addMultiple([missionDescription, missionAcceptButton, missionCancelButton]);

        this.popUp(quest.title ,missionPopUpGroup, null, null, true);        
    }

    rewardPopup(mission){

        let { title, reward } = mission

        let rewardGroup = this.add.group();

        let rewardIcon = this.add.sprite(this.gameW/2, this.gameH/2 - (this.paddingX*1.2), reward.currency).setOrigin(0.5).setScale(0,1.3);

        let rewardItem = this.add.text(
            rewardIcon.x, 
            rewardIcon.y + rewardIcon.displayHeight/2,
            `${reward.amount}`
            ,{fontFamily: 'Arial', color: '#613e1e', align: 'justify', fontSize: 14, fontStyle: 'Bold' }
        ).setOrigin(0.5,0).setWordWrapWidth(230).setScale(0,1.3);      

        let okButton = this.add.sprite(
            rewardItem.x, 
            rewardItem.y + 50,
            'confirmButtonAlt'
        ).setOrigin(0.5).setInteractive().setScale(0,1.3);

        okButton.on("pointerdown", async() => {
            this.player.playerInfo.missions.finished.push(title);
            this.player.playerInfo.missions.currentMission = null;

            let updatedAmount = this.player.playerInfo[reward.currency] + reward.amount;

            this.player.playerInfo[reward.currency] = updatedAmount;
            this[`${reward.currency}_value`].setText(updatedAmount);

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
            this.textTimer.remove();
            this.messageText.setText('');
            this.typewriteTextWrapped(mission.dialogue.rewardTaken);
            this.missionReply = true;

            this.sound.play('clickEffect', {loop: false});
            this.popupContainer.destroy(true);
        });

        rewardGroup.addMultiple([rewardIcon, rewardItem, okButton]);
        this.popUp('Mission Completed', rewardGroup, null, null, true);
    }
}



export default Missions;
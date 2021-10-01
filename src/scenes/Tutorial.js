import Phaser from 'phaser';
import { tutorialDialogue } from '../js/character_dialogues/tutorial';
import BaseScene from '../plugins/BaseScene';

class TutorialScreen extends BaseScene {

    create(){
        this.gameBg = this.add.image(0,0,'background');
        this.gameBg.setOrigin(0,0);
        this.gameBg.setScale(1.1);

        this.npc = this.add.image(this.game.config.width/2, this.game.config.height * 0.85, 'elf-0').setOrigin(0.5,1);

        this.dialogueBoxScene = this.dialogBox(
            tutorialDialogue(this.player.playerInfo.name || 'Drake'),
            {
                sceneNumber: 0,
                type: 'inputBox'
            });
    }

    update(){
    }
}

export default TutorialScreen;
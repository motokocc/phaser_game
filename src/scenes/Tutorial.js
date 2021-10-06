import Phaser from 'phaser';
import { tutorialDialogue } from '../js/character_dialogues/tutorial';
import BaseScene from '../plugins/BaseScene';

class TutorialScreen extends BaseScene {

    create(){
        this.gameBg = this.add.image(0,0,'background');
        this.gameBg.setOrigin(0,0);
        this.gameBg.setScale(1.1);

        this.anims.create({
            key: 'elf_idle',
            frames: [
                { key: 'elf_idle_1' },
                { key: 'elf_idle_2' }
            ],
            frameRate: 24,
            repeatDelay: 2500,
            repeat: -1
        });

        this.anims.create({
            key: 'elf_happy',
            frames: [
                { key: 'elf_happy_1' },
                { key: 'elf_happy_2' }
            ],
            frameRate: 24,
            repeatDelay: 2500,
            repeat: -1
        });

        this.npc = this.add.sprite(this.game.config.width/2, this.game.config.height * 0.85, 'elf_idle_1').setOrigin(0.5,1);

        this.npc.play('elf_idle');

        this.dialogueBoxScene = this.dialogBox(
            tutorialDialogue(this.player.playerInfo.name || 'Drake'),
            {
                sceneNumber: 0,
                type: 'inputBox',
                nextPage : "summoningArea"
            },
            [
                {
                    sceneNumber: 1,
                    spriteImage: this.npc,
                    animationType: 'elf_happy'
                }
            ]
        );
    }

    update(){
    }
}

export default TutorialScreen;
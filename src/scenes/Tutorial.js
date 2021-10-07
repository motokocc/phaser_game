import Phaser from 'phaser';
import { tutorialDialogue } from '../js/character_dialogues/tutorial';
import BaseScene from '../plugins/BaseScene';

class TutorialScreen extends BaseScene {

    create(){
        let gameBg = this.add.image(0,0,'background');
        gameBg.setOrigin(0,0);
        gameBg.setScale(1.1);

        this.anims.create({
            key: 'elf_idle',
            frames: [
                { key: 'elf_idle_1' },
                { key: 'elf_idle_2' }
            ],
            frameRate: 8,
            repeatDelay: 2500,
            repeat: -1
        });

        this.anims.create({
            key: 'elf_happy',
            frames: [
                { key: 'elf_happy_1' },
                { key: 'elf_happy_2' }
            ],
            frameRate: 8,
            repeatDelay: 2500,
            repeat: -1
        });

        this.anims.create({
            key: 'elf_shocked',
            frames: [
                { key: 'elf_shocked_1' },
                { key: 'elf_shocked_2' },
                { key: 'elf_shocked_1' },
                { key: 'elf_shocked_2' }
            ],
            frameRate: 8,
            repeat: 2
        });

        this.anims.create({
            key: 'elf_talk',
            frames: [
                { key: 'elf_talk_2' },
                { key: 'elf_talk_1' },
                { key: 'elf_talk_2' },
                { key: 'elf_talk_1' },
                { key: 'elf_talk_2' },
                { key: 'elf_talk_1' },
                { key: 'elf_talk_2' },
                { key: 'elf_talk_1' },
                { key: 'elf_talk_2' },
                { key: 'elf_talk_1' }
            ],
            frameRate: 8,
            repeatDelay: 1500,
            repeat: -1
        });

        this.anims.create({
            key: 'elf_wink',
            frames: [
                { key: 'elf_smile_1' },
                { key: 'elf_smile_2', duration: 500 },
                { key: 'elf_smile_1' },
            ],
            frameRate: 8,
            repeatDelay: 2500,
            repeat: -1
        });

        this.anims.create({
            key: 'elf_smile',
            frames: [
                { key: 'elf_smile_1' },
                { key: 'elf_smile_3', duration: 500 },
                { key: 'elf_smile_1' },
            ],
            frameRate: 8,
            repeatDelay: 3500,
            repeat: -1
        });

        this.npc = this.add.sprite(this.game.config.width/2, this.game.config.height * 0.85, 'elf_idle_1').setOrigin(0.5,1);

        this.npc.play('elf_idle');

        this.dialogBox(
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
                },
                {
                    sceneNumber: 2,
                    spriteImage: this.npc,
                    animationType: 'elf_shocked'
                },
                {
                    sceneNumber: 3,
                    spriteImage: this.npc,
                    animationType: 'elf_talk'
                },
                {
                    sceneNumber: 4,
                    spriteImage: this.npc,
                    animationType: 'elf_talk'
                },
                {
                    sceneNumber: 5,
                    spriteImage: this.npc,
                    animationType: 'elf_talk'
                },
                {
                    sceneNumber: 6,
                    spriteImage: this.npc,
                    animationType: 'elf_talk'
                },
                {
                    sceneNumber: 7,
                    spriteImage: this.npc,
                    animationType: 'elf_wink'
                },
                {
                    sceneNumber: 8,
                    spriteImage: this.npc,
                    animationType: 'elf_smile'
                }

            ]
        );
    }

    update(){
    }
}

export default TutorialScreen;
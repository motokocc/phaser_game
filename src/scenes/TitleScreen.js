import 'regenerator-runtime/runtime';
import Phaser from 'phaser';
import { doc, updateDoc } from "firebase/firestore";
import { getSoundSettings } from '../js/utils';

class TitleScreen extends Phaser.Scene {

    loadData = async() => {
        // Load Data from blockchain
        this.loadingIndicator.setAlpha(1)
        this.loadingIndicator.play('loading');

        this.connectButton.disableInteractive();
        await this.player.loadWeb3();
        if(this.player.playerInfo.address){
            this.connectButton.setTexture('startBtn');
        }
        this.connectButton.setInteractive();
        this.loadingIndicator.setAlpha(0)
        this.loadingIndicator.stop();
    }
 
    create(){
        this.anims.create({
            key: "loading",
            frameRate: 8,
            frames: this.anims.generateFrameNumbers("loading", { start: 0, end: 7 }),
            repeat: -1
        });
        let buttonPosY = this.game.config.height/6;

        this.loadingIndicator = this.add.sprite(this.game.config.width/2, buttonPosY *3.15, 'loading').setDepth(20).setScale(0.25).setAlpha(0);

        let gameBg = this.add.image(0,0,'background');
        gameBg.setOrigin(0,0);
        gameBg.setScale(1.1);

        let titleLogo = this.add.sprite(this.game.config.width/2, buttonPosY * 2.1,'gameTitle');
        let soundButton = this.add.sprite(this.game.config.width*0.95, buttonPosY*0.5,'soundOn').setInteractive();
        this.connectButton = this.add.sprite(this.game.config.width/2, buttonPosY * 4.2,'connectBtn').setInteractive();

        //Game version
        this.versionText = this.add.text(
            this.game.config.width * 0.02 , 
            this.game.config.height *0.95, 
            `Version: ${process.env.npm_package_version || '1.0.0'}`,
            {fontFamily: 'Arial'}
        );

        const buttons = [ this.connectButton ];

        buttons.forEach(button => {
            button.setScale(1.2);
            button.on('pointerover', () => {
                button.setScale(1.3);
                this.sound.play('hoverEffect', {loop: false, volume: getSoundSettings('hoverEffect')});
            });

            button.on('pointerout', () => {
                button.setScale(1.2);
            });

            button.on('pointerup', () => {
                button.setAlpha(1.2);
            });
        });

        //Sound Button
        soundButton.on('pointerover', () => {
            soundButton.setAlpha(0.7)
            this.sound.play('hoverEffect', {loop: false, volume: getSoundSettings('hoverEffect')});
        });
        soundButton.on('pointerout', () => {
            soundButton.setAlpha(1)
        });
        soundButton.on('pointerdown', () => {
            if(this.sound.mute){
                soundButton.setTexture('soundOn')
            }
            else{
                soundButton.setTexture('soundOff')
            }

            this.sound.mute = !this.sound.mute;
        });

        //Start Button
        this.connectButton.on('pointerdown', async() => {
            this.sound.play('clickEffect', {loop: false, volume: getSoundSettings('clickEffect')});
            if(!this.player.playerInfo.address){
                this.loadData();
            }
            else if(this.player.playerInfo.address && this.player.playerInfo.isFirstTime){
                this.player.playerInfo.dateJoined = new Date();
                this.scene.start("tutorial");
            }
            else{
                this.player.playerInfo.lastLogin = new Date();
                await updateDoc(doc(this.player.users, this.player.playerInfo.address),{ lastLogin : this.player.playerInfo.lastLogin });
                this.scene.start("game");
            }
        });


        //Animations
        titleLogo.setAlpha(0);
        soundButton.setAlpha(0);
        this.connectButton.setAlpha(0);
        this.cameras.main.fadeIn(1000);

        this.tweens.add({
            targets: titleLogo,
            alpha: { value: 1, duration: 4000, ease: 'Power1'},
            yoyo: false,
            delay: 1000
        });

        this.tweens.add({
            targets: [this.connectButton, soundButton],
            alpha: { value: 1, duration: 3000, ease: 'Power1'},
            yoyo: false,
            delay: 3000
        });

        this.particles = this.add.particles('light');

        this.emitter = this.particles.createEmitter({
            speedY: 50,
            gravityY: 3,
            gravityX: Math.ceil((Math.random() - 0.5) * 2) < 1 ? -10 : 10,
            quantity: 1,
            lifespan: { min: 18000, max: 28000 },
            emitZone: { source: new Phaser.Geom.Line(-100, -100, 1200, -100 )},
            frequency:700,
            blendMode: 'ADD',
            scale: { min: 0.5, max: 1.5 },
            angle: { min: -180, max: 180 },
       });
    }
}

export default TitleScreen;
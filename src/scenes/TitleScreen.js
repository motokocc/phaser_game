import 'regenerator-runtime/runtime';
import Phaser from 'phaser';
import { doc, updateDoc } from "firebase/firestore";

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

        this.loadingIndicator = this.add.sprite(this.game.config.width/2, this.game.config.height/2, 'loading').setDepth(20).setScale(0.3).setAlpha(0);

        this.gameBg = this.add.image(0,0,'background');
        this.gameBg.setOrigin(0,0);
        this.gameBg.setScale(1.1);

        let buttonPosY = this.game.config.height/6;

        this.titleLogo = this.add.sprite(this.game.config.width/2, buttonPosY * 2,'gameTitle');
        this.soundButton = this.add.sprite(this.game.config.width*0.95, buttonPosY*0.5,'soundOn').setInteractive();
        this.connectButton = this.add.sprite(this.game.config.width/2, buttonPosY * 4,'connectBtn').setInteractive();
        this.exitButton = this.add.sprite(this.game.config.width/2, buttonPosY * 5,'exitBtn').setInteractive();

        //Game version
        this.versionText = this.add.text(
            this.game.config.width * 0.02 , 
            this.game.config.height *0.95, 
            `Version: ${process.env.npm_package_version || '1.0.0'}`
        );

        const buttons = [
            this.connectButton,
            this.exitButton,
        ];

        buttons.forEach(button => {
            button.setScale(0.11);
            button.on('pointerover', () => {
                button.setScale(0.14);
                this.sound.play('hoverEffect', {loop: false});
            });

            button.on('pointerout', () => {
                button.setScale(0.11);
            });

            button.on('pointerup', () => {
                button.setAlpha(1);
            });
        });

        //Sound Button
        this.soundButton.on('pointerover', () => {
            this.soundButton.setAlpha(0.7)
            this.sound.play('hoverEffect', {loop: false});
        });
        this.soundButton.on('pointerout', () => {
            this.soundButton.setAlpha(1)
        });
        this.soundButton.on('pointerdown', () => {
            if(this.sound.mute){
                this.soundButton.setTexture('soundOn')
            }
            else{
                this.soundButton.setTexture('soundOff')
            }

            this.sound.mute = !this.sound.mute;
        });

        //Exit Button
        this.exitButton.on('pointerdown', () => {
            this.sound.play('clickEffect', {loop: false});
            window.close();
        });

        //Start Button
        this.connectButton.on('pointerdown', async() => {
            this.sound.play('clickEffect', {loop: false});
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
        this.titleLogo.setAlpha(0);
        this.soundButton.setAlpha(0);
        this.connectButton.setAlpha(0);
        this.exitButton.setAlpha(0);
        this.cameras.main.fadeIn(1000);

        this.tweens.add({
            targets: this.titleLogo,
            alpha: { value: 1, duration: 4000, ease: 'Power1'},
            yoyo: false,
            delay: 1000
        });

        this.tweens.add({
            targets: [this.connectButton, this.exitButton, this.soundButton],
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
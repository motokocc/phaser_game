import Phaser from 'phaser';
import bg from '../images/bg.PNG';
import gameTitle from '../images/title.png';
import startBtn from '../images/start.png';
import exitBtn from '../images/quit.png';
import soundOff from '../images/sound_off.png';
import soundOn from '../images/sound_on.png';
import connectBtn from '../images/connect.png';
import light from '../images/light.png';
import hoverSound from '../audio/hover_button2.mp3';
import clickSound from '../audio/click_button.wav';
import titleBgMusic from '../audio/title_bg.mp3';
import elf from '../images/elf-0.png';
import okButton from '../images/ok-button.png';

class LoadingScreen extends Phaser.Scene {

    init(data){
        this.data = data;
    }

    preload(){
        this.load.image('elf-0', elf);
        this.load.image('okButton', okButton);
        this.load.image('background', bg);
        this.load.image('gameTitle', gameTitle);
        this.load.image('startBtn', startBtn);
        this.load.image('exitBtn', exitBtn);
        this.load.image('connectBtn', connectBtn);
        this.load.image('soundOff', soundOff);
        this.load.image('soundOn', soundOn);
        this.load.image('light', light);
        this.load.audio('clickEffect', [clickSound]);
        this.load.audio('hoverEffect', [hoverSound]);
        this.load.audio('titleBgMusic', [titleBgMusic]);

        this.progressBar = this.add.graphics();
        this.progressBox = this.add.graphics();

        let barWidth = 520;
        let barHeight = 50;
        let loaderPosX = this.game.config.width/2 - barWidth/2;
        let loaderPosY = this.game.config.height/2 - barHeight/2;

        this.loaderText = this.add.text(this.game.config.width/2, this.game.config.height/2, "Loading...");
        this.completeText = this.add.text(this.game.config.width/2, this.game.config.height - barHeight, '');
        this.loaderText.setFontSize(20);
        this.loaderText.setOrigin(0.5,0.5);
        this.completeText.setFontSize(20);
        this.completeText.setOrigin(0.5,0.5);

        this.progressBox.fillStyle(0x222222, 0.8);
        this.progressBox.fillRect(loaderPosX, loaderPosY,barWidth, barHeight);

        this.load.on('progress', val => {
            this.progressBar.clear();
            this.progressBar.fillStyle(0x7cfc00, 1);
            this.progressBar.fillRect(loaderPosX + 10 , loaderPosY + 10 , (barWidth - 20)*val, barHeight-20);
            this.loaderText.setText(`Loading... ${(val*100).toFixed(2)}%`);
        });
    }

    create(){

        this.completeText.setText('Click anywhere to continue');

        this.input.on('pointerdown', () => {
            this.progressBar.destroy();
            this.progressBox.destroy();
            this.loaderText.destroy();
            this.completeText.destroy();
            this.sound.play('titleBgMusic', {loop: true, volume:0.2});
            this.scene.start(this.data.nextPage);
        })

    }
}

export default LoadingScreen;
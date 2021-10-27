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
import sceneBgMusic from '../audio/scene_bg.mp3';
import elf from '../images/elf-0.png';
import okButton from '../images/ok-button.png';
import scroll from '../images/scroll.png';
import summoningCircle from '../images/summoning_circle.png';
import freeButton from '../images/buttons/free_button.png';
import rareButton from '../images/buttons/rare_button.png';
import premiumButton from '../images/buttons/premium_button.png';
import cardBack from '../images/cards/card_yellow.png';

//Lilith's animations
import elf_idle_1 from '../images/Animations/elf-idle-2.png';
import elf_idle_2 from '../images/Animations/elf-idle-1.png';
import elf_happy_1 from '../images/Animations/elf-happy-2.png';
import elf_happy_2 from '../images/Animations/elf-happy-1.png';
import elf_shocked_1 from '../images/Animations/elf-shocked-1.png';
import elf_shocked_2 from '../images/Animations/elf-shocked-2.png';
import elf_shocked_3 from '../images/Animations/elf-shocked-3.png';
import elf_smile_1 from '../images/Animations/elf-smile-1.png';
import elf_smile_2 from '../images/Animations/elf-smile-2.png';
import elf_smile_3 from '../images/Animations/elf-smile-3.png';
import elf_talk_1 from '../images/Animations/elf-talk-1.png';
import elf_talk_2 from '../images/Animations/elf-talk-2.png';
import dialogueBox from '../images/UI/dialogue_box.png';

class LoadingScreen extends Phaser.Scene {

    init(data){
        this.data = data;
    }

    preload(){
        this.load.image('Alpha', "https://ipfs.infura.io/ipfs/QmXwhouX6z9DLtBmpGiGwpDu9W8NCyMhtzHW4Bqfct3Rfd");
        this.load.image('cardBack', cardBack);
        this.load.image('elf_idle_1', elf_idle_1);
        this.load.image('elf_idle_2', elf_idle_2);
        this.load.image('elf_happy_1', elf_happy_1);
        this.load.image('elf_happy_2', elf_happy_2);
        this.load.image('elf_shocked_1', elf_shocked_1);
        this.load.image('elf_shocked_2', elf_shocked_2);
        this.load.image('elf_shocked_3', elf_shocked_3);
        this.load.image('elf_smile_1', elf_smile_1);
        this.load.image('elf_smile_2', elf_smile_2);
        this.load.image('elf_smile_3', elf_smile_3);
        this.load.image('elf_talk_1', elf_talk_1);
        this.load.image('elf_talk_2', elf_talk_2);
        
        this.load.image('dialogueBox', dialogueBox);
        this.load.image('summoningCircle', summoningCircle);
        this.load.image('freeBtn', freeButton);
        this.load.image('rareBtn', rareButton);
        this.load.image('premiumBtn', premiumButton);
        this.load.image('elf-0', elf);
        this.load.image('scroll', scroll);
        this.load.image('okButton', okButton);
        this.load.image('background', bg);
        this.load.image('gameTitle', gameTitle);
        this.load.image('startBtn', startBtn);
        this.load.image('exitBtn', exitBtn);
        this.load.image('connectBtn', connectBtn);
        this.load.image('soundOff', soundOff);
        this.load.image('soundOn', soundOn);
        this.load.image('light', light);

        //Audio Files
        this.load.audio('clickEffect', [clickSound]);
        this.load.audio('hoverEffect', [hoverSound]);
        this.load.audio('titleBgMusic', [titleBgMusic]);
        this.load.audio('sceneBgMusic', [sceneBgMusic]);

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
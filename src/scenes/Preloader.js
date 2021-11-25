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
import spinWheelSound from '../audio/spin_wheel.wav';
import optionSound from '../audio/options_sound.wav';
import titleBgMusic from '../audio/title_bg.mp3';
import sceneBgMusic from '../audio/scene_bg.mp3';
import elf from '../images/elf-0.png';
import okButton from '../images/ok-button.png';
import scroll from '../images/scroll.png';
import summoningCircle from '../images/summoning_circle.png';
import freeButton from '../images/buttons/free_button.png';
import normalButton from '../images/buttons/normal_button.png';
import rareButton from '../images/buttons/rare_button.png';
import backButton from '../images/buttons/back_button.png';
import proceedButton from '../images/buttons/exit_button.png';
import premiumButton from '../images/buttons/premium_button.png';
import cardBack from '../images/cards/card_yellow.png';
import confirmButton from '../images/buttons/confirm_button.png';

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

//Elf Pirate animations
import elf_pirate_talk_1 from '../images/Animations/elf-pirate-talk-1.png';
import elf_pirate_talk_2 from '../images/Animations/elf-pirate-talk-2.png';

//Main screen ui
import explore_button from '../images/buttons/explore_button.png';
import mining_button from '../images/buttons/mining_button.png';
import pvp_button from '../images/buttons/pvp_button.png';
import shop_button from '../images/buttons/shop_button.png';
import roullete_button from '../images/buttons/roullete_button.png';
import black_market_button from '../images/buttons/black_market_button.png';
import missions_button from '../images/buttons/missions_button.png';
import summon_button from '../images/buttons/summon_button.png';
import settings_button from '../images/buttons/settings_button.png';
import mail_button from '../images/buttons/mail_button.png';
import gift_button from '../images/buttons/gift_button.png';
import gold from '../images/buttons/gold.png';
import gems from '../images/buttons/gems.png';
import player_gui_box from '../images/buttons/player_gui_box.png';

//Daily Roullete
import elfPirate from '../images/daily_roullete/elf-pirate.png';
import roulleteBg from '../images/daily_roullete/roullete_bg.png';
import roulleteBoard from '../images/daily_roullete/roullete_board.png';
import roulleteSlices from '../images/daily_roullete/roullete_slices.png';
import roulleteStand from '../images/daily_roullete/roullete_stand.png';
import startSpinButton from '../images/daily_roullete/start_spin_button.png';
import tick from '../images/daily_roullete/tick.png';

//Settings Icons
import couponIcon from '../images/settings/coupon.png';
import creditsIcon from '../images/settings/credits.png';
import exitIcon from '../images/settings/exit.png';
import logoutIcon from '../images/settings/logout.png';
import mailIcon from '../images/settings/mail.png';
import twitterIcon from '../images/settings/twitter.png';
import volumeIcon from '../images/settings/volume.png';
import youtubeIcon from '../images/settings/youtube.png';

class LoadingScreen extends Phaser.Scene {

    init(data){
        this.data = data;
    }

    preload(){
        this.load.image('Alpha', "https://ipfs.infura.io/ipfs/QmXwhouX6z9DLtBmpGiGwpDu9W8NCyMhtzHW4Bqfct3Rfd");
        this.load.image('Saya', "https://ipfs.infura.io/ipfs/QmUDQdkK6DVm6r281TMgskRDdU7WK6x2dkw2TMCiJ9mzYF");
        
        //Main Screen
        this.load.image('explore_button', explore_button);
        this.load.image('mining_button', mining_button);
        this.load.image('pvp_button', pvp_button);
        this.load.image('shop_button', shop_button);
        this.load.image('roullete_button', roullete_button)
        this.load.image('black_market_button', black_market_button);
        this.load.image('missions_button', missions_button);
        this.load.image('summon_button', summon_button);
        this.load.image('settings_button', settings_button);
        this.load.image('mail_button', mail_button);
        this.load.image('gift_button', gift_button);;
        this.load.image('gold', gold);
        this.load.image('gems', gems);
        this.load.image('player_gui_box', player_gui_box);

        //Tutorial
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

        //Daily Roullete
        this.load.image('elfPirate', elfPirate);
        this.load.image('roulleteBg', roulleteBg);
        this.load.image('roulleteBoard', roulleteBoard);
        this.load.image('roulleteSlices', roulleteSlices);
        this.load.image('roulleteStand', roulleteStand);
        this.load.image('startSpinButton', startSpinButton);
        this.load.image('tick', tick);
        this.load.image('elf_pirate_talk_1', elf_pirate_talk_1);
        this.load.image('elf_pirate_talk_2', elf_pirate_talk_2);

        //Settings
        this.load.image('couponIcon', couponIcon);
        this.load.image('creditsIcon', creditsIcon);
        this.load.image('exitIcon', exitIcon);
        this.load.image('logoutIcon', logoutIcon);
        this.load.image('mailIcon', mailIcon);
        this.load.image('twitterIcon', twitterIcon);
        this.load.image('volumeIcon', volumeIcon);
        this.load.image('youtubeIcon', youtubeIcon);
        
        this.load.image('dialogueBox', dialogueBox);
        this.load.image('summoningCircle', summoningCircle);
        this.load.image('freeBtn', freeButton);
        this.load.image('normalBtn', normalButton);
        this.load.image('rareBtn', rareButton);
        this.load.image('premiumBtn', premiumButton);
        this.load.image('proceedBtn', proceedButton);
        this.load.image('elf-0', elf);
        this.load.image('scroll', scroll);
        this.load.image('okButton', okButton);
        this.load.image('background', bg);
        this.load.image('gameTitle', gameTitle);
        this.load.image('startBtn', startBtn);
        this.load.image('exitBtn', exitBtn);
        this.load.image('backBtn', backButton);
        this.load.image('confirmButton', confirmButton);
        this.load.image('connectBtn', connectBtn);
        this.load.image('soundOff', soundOff);
        this.load.image('soundOn', soundOn);
        this.load.image('light', light);

        //Audio Files
        this.load.audio('clickEffect', [clickSound]);
        this.load.audio('hoverEffect', [hoverSound]);
        this.load.audio('titleBgMusic', [titleBgMusic]);
        this.load.audio('sceneBgMusic', [sceneBgMusic]);
        this.load.audio('spinWheelSound', [spinWheelSound]);
        this.load.audio('optionSound', [optionSound]);

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
import Phaser from 'phaser';
import { getSoundSettings } from '../js/utils';
import bg from '../images/bg.PNG';
import inventory_bg from '../images/bg/inventory_bg.png';
import gameTitle from '../images/title.png';
import startBtn from '../images/buttons/start.png';
import connectBtn from '../images/buttons/connect.png';
import light from '../images/light.png';

//Audio
import hoverSound from '../audio/hover_button2.mp3';
import clickSound from '../audio/click_button.wav';
import clickSelectSound from '../audio/click_button_select.wav';
import spinWheelSound from '../audio/spin_wheel.wav';
import optionSound from '../audio/options_sound.wav';
import titleBgMusic from '../audio/title_bg.mp3';
import cardPlace from '../audio/card_place.wav';
import swoosh from '../audio/swoosh.wav';
import denied from '../audio/denied.wav';
import battle_intro from '../audio/bgm/battle_intro.ogg';
import battle_loop from '../audio/bgm/battle_loop.ogg';


import elf from '../images/elf-0.png';
import scroll from '../images/UI/scroll.png';
import summoningCircle from '../images/summoning_circle.png';
import freeButton from '../images/buttons/free_button.png';
import normalButton from '../images/buttons/normal_button.png';
import rareButton from '../images/buttons/rare_button.png';
import backButton from '../images/buttons/back_button.png';
import proceedButton from '../images/buttons/exit_button.png';
import premiumButton from '../images/buttons/premium_button.png';
import cardBack from '../images/cards/card_yellow.png';
import confirmButton from '../images/buttons/confirm_button.png';
import confirmButtonAlt from '../images/buttons/confirm_button_alt.png';
import cancelButton from '../images/buttons/cancel_button.png';
import cancelButtonAlt from '../images/buttons/cancel_button_alt.png';
import sellButton from '../images/buttons/sell_button.png';
import buyButton from '../images/buttons/buy_button.png';
import equipButton from '../images/buttons/equip_button.png';
import unequipButton from '../images/buttons/unequip_button.png';

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
import loading from '../images/spritesheets/loading_spritesheet.png'
import alertIcon from '../images/icons/alert.png';

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

//Marketplace
import list_icon from '../images/icons/list_icon.png';
import square_icon from '../images/icons/square_icon.png';
import fast_forward from '../images/icons/fast_forward.png';
import forward_icon from '../images/icons/forward_arrow.png';

//inventory
import alphaAlt from '../images/image_alt/alpha_alt.png';
import sayaAlt from '../images/image_alt/saya_alt.png';
import alphaMini from '../images/image_alt/alpha_mini.png';
import sayaMini from '../images/image_alt/saya_mini.png';
import summoningCircle2 from '../images/summoning_circle_2.png';
import rarity_1 from '../images/rarity/rarity-1.png';
import rarity_2 from '../images/rarity/rarity-2.png';
import rarity_3 from '../images/rarity/rarity-3.png';
import rarity_4 from '../images/rarity/rarity-4.png';
import rarity_5 from '../images/rarity/rarity-5.png';
import fire from '../images/attribute/fire.png';
import water from '../images/attribute/water.png';
import cards_icon from '../images/icons/cards_icon.png';
import backpack_icon from '../images/icons/bagpack_icon.png';
import magic_icon from '../images/icons/magic_icon.png';
import stats_icon from '../images/icons/stats_icon.png';
import cart_icon from '../images/icons/cart_icon.png';
import eth_icon from '../images/icons/eth_icon.png';

//Skills
import fire_ball from '../images/skills/fire_ball.png';
import fatal_wounds from '../images/skills/fatal_wounds.png';
import ice_spikes from '../images/skills/ice_spikes.png';
import icicle_spears from '../images/skills/icicle_spears.png';
import meteor_rain from '../images/skills/meteor_rain.png';
import war_cry from '../images/skills/war_cry.png';

//Items
import iron_pickaxe from '../images/items/iron_pickaxe.png';
import small_heal_potion from '../images/items/small_heal_potion.png';

//Missions
import ninja from '../images/spritesheets/ninja_spritesheet.png';
import smoke from '../images/spritesheets/smoke_spritesheet.png';

//Adventure
import alpha_idle from '../images/spritesheets/alpha_idle.png';
import alpha_run from '../images/spritesheets/alpha_run.png';

//Parallax BG
import forest_layer_0 from '../images/bg/parallax_bg/Forest/layer_0.png';
import forest_layer_1 from '../images/bg/parallax_bg/Forest/layer_1.png';
import forest_layer_2 from '../images/bg/parallax_bg/Forest/layer_2.png';
import forest_layer_3 from '../images/bg/parallax_bg/Forest/layer_3.png';
import forest_layer_4 from '../images/bg/parallax_bg/Forest/layer_4.png';
import forest_layer_5 from '../images/bg/parallax_bg/Forest/layer_5.png';

//Explore Assets
import adventure_mode_button from '../images/explore_page/adventure_mode_button.png';
import event_mode_button from '../images/explore_page/event_mode_button.png';
import story_mode_button from '../images/explore_page/story_mode_button.png';
import tower_mode_button from '../images/explore_page/tower_mode_button.png';
import start_mode_button from '../images/explore_page/start_mode_button.png';
import lock from '../images/explore_page/lock.png';
import lock_big from '../images/explore_page/lock_big.png';
import select_mode_text from '../images/explore_page/select_mode_text.png';
import setup_team_text from '../images/explore_page/setup_team_text.png';
import alpha_slot from '../images/explore_page/card_slots/alpha_slot.png';
import saya_slot from '../images/explore_page/card_slots/saya_slot.png';
import card_yellow_slot from '../images/explore_page/card_slots/card_yellow_slot.png';

class LoadingScreen extends Phaser.Scene {

    init(data){
        this.data = data;
    }

    preload(){
        //From IPFS
        this.load.image('Alpha', "https://ipfs.infura.io/ipfs/QmXwhouX6z9DLtBmpGiGwpDu9W8NCyMhtzHW4Bqfct3Rfd");
        this.load.image('Saya', "https://ipfs.infura.io/ipfs/QmUDQdkK6DVm6r281TMgskRDdU7WK6x2dkw2TMCiJ9mzYF");

        //Parallax BG
        //Forest
        this.load.image('forest_layer_0', forest_layer_0);
        this.load.image('forest_layer_1', forest_layer_1);
        this.load.image('forest_layer_2', forest_layer_2);
        this.load.image('forest_layer_3', forest_layer_3);
        this.load.image('forest_layer_4', forest_layer_4);
        this.load.image('forest_layer_5', forest_layer_5);

        //Image Alt
        this.load.image('Alpha_alt', alphaAlt);
        this.load.image('Saya_alt', sayaAlt);
        this.load.image('Alpha_mini', alphaMini);
        this.load.image('Saya_mini', sayaMini);
        this.load.image('summoningCircle2', summoningCircle2);
        
        //Main Screen
        this.load.spritesheet("loading", loading, { frameWidth: 300, frameHeight: 300 });
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
        this.load.image('alertIcon', alertIcon);

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

        //Inventory
        this.load.image('rarity_1', rarity_1);
        this.load.image('rarity_2', rarity_2);
        this.load.image('rarity_3', rarity_3);
        this.load.image('rarity_4', rarity_4);
        this.load.image('rarity_5', rarity_5);
        this.load.image('fire', fire);
        this.load.image('water', water);
        this.load.image('cards_icon', cards_icon);
        this.load.image('magic_icon', magic_icon);
        this.load.image('backpack_icon', backpack_icon);
        this.load.image('stats_icon', stats_icon);
        this.load.image('cart_icon', cart_icon);
        this.load.image('eth', eth_icon);

        //Marketplace
        this.load.image('list_icon', list_icon);
        this.load.image('square_icon', square_icon);
        this.load.image('fast_forward', fast_forward);      
        this.load.image('forward_icon', forward_icon);

        //Skills
        this.load.image('Fire ball', fire_ball);
        this.load.image('Fatal wounds', fatal_wounds);
        this.load.image('Ice spikes', ice_spikes);
        this.load.image('Icicle spears', icicle_spears);
        this.load.image('Meteor rain', meteor_rain);
        this.load.image('War cry', war_cry);

        //Items
        this.load.image('Iron pickaxe', iron_pickaxe);
        this.load.image('Small heal potion', small_heal_potion);

        //Others
        this.load.image('dialogueBox', dialogueBox);
        this.load.image('summoningCircle', summoningCircle);
        this.load.image('freeBtn', freeButton);
        this.load.image('normalBtn', normalButton);
        this.load.image('rareBtn', rareButton);
        this.load.image('premiumBtn', premiumButton);
        this.load.image('proceedBtn', proceedButton);
        this.load.image('elf-0', elf);
        this.load.image('scroll', scroll);
        this.load.image('background', bg);
        this.load.image('gameTitle', gameTitle);
        this.load.image('startBtn', startBtn);
        this.load.image('backBtn', backButton);
        this.load.image('confirmButton', confirmButton);
        this.load.image('confirmButtonAlt', confirmButtonAlt);
        this.load.image('cancelButton', cancelButton);
        this.load.image('cancelButtonAlt', cancelButtonAlt);
        this.load.image('sellButton', sellButton);
        this.load.image('buyButton', buyButton);
        this.load.image('equipButton', equipButton);
        this.load.image('unequipButton', unequipButton);
        this.load.image('connectBtn', connectBtn);
        this.load.image('light', light);
        this.load.image('inventory_bg', inventory_bg);

        //Mission
        this.load.spritesheet("ninja", ninja, { frameWidth: 297, frameHeight: 420 });
        this.load.spritesheet("smoke", smoke, { frameWidth: 500, frameHeight: 500 });
        this.load.spritesheet("alpha_idle", alpha_idle, { frameWidth: 335.1, frameHeight: 250 });
        this.load.spritesheet("alpha_run", alpha_run, { frameWidth: 335.1, frameHeight: 250 });

        //Explore
        this.load.image('adventure_mode_button', adventure_mode_button);
        this.load.image('event_mode_button', event_mode_button);
        this.load.image('story_mode_button', story_mode_button);
        this.load.image('tower_mode_button', tower_mode_button);
        this.load.image('start_mode_button', start_mode_button);
        this.load.image('lock', lock);
        this.load.image('lock_big', lock_big);
        this.load.image('select_mode_text', select_mode_text);
        this.load.image('setup_team_text', setup_team_text);
        this.load.image('cardSlot', card_yellow_slot);
        this.load.image('Alpha_slot', alpha_slot);
        this.load.image('Saya_slot', saya_slot);

        //Audio Files
        this.load.audio('clickEffect', [clickSound]);
        this.load.audio('clickSelectEffect', [clickSelectSound]);
        this.load.audio('hoverEffect', [hoverSound]);
        this.load.audio('titleBgMusic', [titleBgMusic]);
        this.load.audio('spinWheelSound', [spinWheelSound]);
        this.load.audio('optionSound', [optionSound]);
        this.load.audio('cardPlace', [cardPlace]);
        this.load.audio('swoosh', [swoosh]);
        this.load.audio('denied', [denied]);
        this.load.audio('battle_intro', [battle_intro]);
        this.load.audio('battle_loop', [battle_loop]);

        this.progressBar = this.add.graphics();
        this.progressBox = this.add.graphics();

        let barWidth = 520;
        let barHeight = 50;
        let loaderPosX = this.game.config.width/2 - barWidth/2;
        let loaderPosY = this.game.config.height/2 - barHeight/2;

        this.loaderText = this.add.text(this.game.config.width/2, this.game.config.height/2, "Loading...", {fontFamily: 'GameTextFont'});
        this.completeText = this.add.text(this.game.config.width/2, this.game.config.height - barHeight, '', {fontFamily: 'GameTextFont'}).setInteractive();
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
        setTimeout(() => {
            this.completeText.setText('Click here to continue');

            this.completeText.on('pointerdown', () => {
                this.completeText.disableInteractive();
                this.progressBar.destroy();
                this.progressBox.destroy();
                this.loaderText.destroy();
                this.completeText.destroy();
                this.sound.play('titleBgMusic', {loop: true, volume: getSoundSettings('titleBgMusic')});
                this.scene.start(this.data.nextPage);
            })
        }, 2000);
    }
}

export default LoadingScreen;
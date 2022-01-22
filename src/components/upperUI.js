import 'regenerator-runtime/runtime'
import { doc, updateDoc } from "firebase/firestore";
import Phaser from 'phaser';

export default class UpperUI extends Phaser.Scene{
	constructor(scene){
		super(scene);
        this.scene = scene;
    }

    generate(isWithRewards, saveToFirebase){
        const width = this.scene.game.config.width;
        const height = this.scene.game.config.height;
        const padding = width * 0.025;
		const buttonScale = width * 0.00078;
		const containerOffset = isWithRewards? -padding*3 : 0;

		//Gems
        let gems = this.scene.add.container(containerOffset,-200);
        const gem_icon = this.scene.add.sprite(width/2 - padding*3, height*0.07,'gems').setOrigin(0.5).setDepth(2);
        const gem_box = this.scene.add.rexRoundRectangle(gem_icon.x, gem_icon.y, padding*4, padding, padding/5, 0x000000).setOrigin(0,0.5).setAlpha(0.6);
        this.gems_value = this.scene.add.text(gem_box.x + gem_box.width/2, gem_box.y, this.scene.player.playerInfo.gems || 0, {fontFamily: 'Arial'}).setOrigin(0.5);

        //Gold
        let gold = this.scene.add.container(containerOffset,-200);
        const gold_icon = this.scene.add.sprite(width/2 + padding*3, height*0.07,'gold').setOrigin(0.5).setDepth(2);
        const gold_box = this.scene.add.rexRoundRectangle(gold_icon.x, gem_icon.y, padding*4, padding, padding/5, 0x000000).setOrigin(0,0.5).setAlpha(0.6);
        this.gold_value = this.scene.add.text(gold_box.x + gold_box.width/2, gold_box.y, this.scene.player.playerInfo.gold || 0, {fontFamily: 'Arial'}).setOrigin(0.5);

        //Player Stat GUI
        let playerUI = this.scene.add.container(0,-200);
        const player_gui_box = this.scene.add.sprite(padding, height*0.07,'player_gui_box').setOrigin(0, 0.5).setScale(buttonScale).setInteractive();
        const player_name = this.scene.add.text(
            player_gui_box.x* 3.6,
            player_gui_box.y - padding*0.33,
            this.scene.player.playerInfo.name || 'Player',
            {fontFamily: 'Arial', fontSize:14}
        ).setOrigin(0, 0.5);

        player_gui_box.on("pointerdown", () => {
            if(!saveToFirebase){
                this.scene.scene.start("inventory");
            }
        });

        const player_role = this.scene.add.text(
            player_gui_box.x* 3.6,
            player_gui_box.y + padding*0.33,
            this.scene.player.playerInfo.role || 'Adventurer',
            {fontFamily: 'Arial', fontSize:13, color: '#00ff00'}
        ).setOrigin(0, 0.5);

        const player_level = this.scene.add.text(
            player_gui_box.x* 2.2,
            player_gui_box.y + padding*0.1,
            ['Lvl', this.scene.player.playerInfo.level] || ['Lvl', 1],
            {fontFamily: 'Arial', fontSize:13, align: 'center'}
        ).setOrigin(0.5);

        let backButton = this.scene.add.sprite(width-padding, padding, 'exitIcon').setOrigin(1,0).setScale(0.6).setInteractive();
        backButton.on('pointerdown', async() => {
            if(saveToFirebase){
                try{
                    await updateDoc(doc(this.scene.player.users, this.scene.player.playerInfo.address), { inventory : this.scene.player.playerInfo.inventory });   
                }
                catch(e){
                    console.log(e.message);
                }
            }
            this.scene.scene.start("game")
        });

        //UI Containers/Groups
        gems.add([gem_box, gem_icon, this.gems_value]);
        gold.add([gold_box, gold_icon, this.gold_value]);
        playerUI.add([player_gui_box, player_name, player_role, player_level, backButton]);

        let rewards = this.scene.add.container(containerOffset,-200);

        //If it has rewards
        if(isWithRewards){
            const rewards_icon = this.scene.add.sprite(gold_box.x + gold_box.displayWidth/2 + padding*4, height*0.07,'gift_button').setOrigin(0.5).setDepth(2).setScale(0.8);
            const rewards_box = this.scene.add.rexRoundRectangle(rewards_icon.x, gem_icon.y, padding*4, padding, padding/5, 0x000000).setOrigin(0,0.5).setAlpha(0.6);
            this.rewards_value = this.scene.add.text(rewards_box.x + rewards_box.width/2, rewards_box.y, this.scene.player.playerInfo.rewardPoints || 0, {fontFamily: 'Arial'}).setOrigin(0.5);         
        
            rewards.add([rewards_box, rewards_icon, this.rewards_value])
        }

        //UI Animations
        this.scene.tweens.add({
            targets: [playerUI, gems, gold, rewards ],
            y: { value: 0, duration: 600, ease: 'Power1'},
            yoyo: false,
        });
	}
}
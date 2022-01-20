import 'regenerator-runtime/runtime'
import { doc, updateDoc } from "firebase/firestore";
import Phaser from 'phaser';

export default class UpperUI extends Phaser.Scene{
	constructor(scene, width, height, padding, isWithRewards, saveToFirebase){
		super(scene);
		this.scene = scene;

		const buttonScale = width * 0.00078;
		const containerOffset = isWithRewards? -padding*3 : 0;

		//Gems
        let gems = this.add.container(containerOffset,-200);
        const gem_icon = this.add.sprite(width/2 - padding*3, height*0.07,'gems').setOrigin(0.5).setDepth(2);
        const gem_box = this.add.rexRoundRectangle(gem_icon.x, gem_icon.y, padding*4, padding, padding/5, 0x000000).setOrigin(0,0.5).setAlpha(0.6);
        this.gems_value = this.add.text(gem_box.x + gem_box.width/2, gem_box.y, this.player.playerInfo.gems || 0, {fontFamily: 'Arial'}).setOrigin(0.5);

        //Gold
        let gold = this.add.container(containerOffset,-200);
        const gold_icon = this.add.sprite(width/2 + padding*3, height*0.07,'gold').setOrigin(0.5).setDepth(2);
        const gold_box = this.add.rexRoundRectangle(gold_icon.x, gem_icon.y, padding*4, padding, padding/5, 0x000000).setOrigin(0,0.5).setAlpha(0.6);
        this.gold_value = this.add.text(gold_box.x + gold_box.width/2, gold_box.y, this.player.playerInfo.gold || 0, {fontFamily: 'Arial'}).setOrigin(0.5);

        //Player Stat GUI
        let playerUI = this.add.container(0,-200);
        const player_gui_box = this.add.sprite(padding, height*0.07,'player_gui_box').setOrigin(0, 0.5).setScale(buttonScale).setInteractive();
        const player_name = this.add.text(
            player_gui_box.x* 3.6,
            player_gui_box.y - padding*0.33,
            this.player.playerInfo.name || 'Player',
            {fontFamily: 'Arial', fontSize:14}
        ).setOrigin(0, 0.5);

        player_gui_box.on("pointerdown", () => {
            if(!saveToFirebase){
                this.scene.start("inventory");
            }
        });

        const player_role = this.add.text(
            player_gui_box.x* 3.6,
            player_gui_box.y + padding*0.33,
            this.player.playerInfo.role || 'Adventurer',
            {fontFamily: 'Arial', fontSize:13, color: '#00ff00'}
        ).setOrigin(0, 0.5);

        const player_level = this.add.text(
            player_gui_box.x* 2.2,
            player_gui_box.y + padding*0.1,
            ['Lvl', this.player.playerInfo.level] || ['Lvl', 1],
            {fontFamily: 'Arial', fontSize:13, align: 'center'}
        ).setOrigin(0.5);

        let backButton = this.add.sprite(width-padding, padding, 'exitIcon').setOrigin(1,0).setScale(0.6).setInteractive();
        backButton.on('pointerdown', async() => {
            if(saveToFirebase){
                try{
                    await updateDoc(doc(this.player.users, this.player.playerInfo.address), { inventory : this.player.playerInfo.inventory });   
                }
                catch(e){
                    console.log(e.message);
                }
            }
            this.scene.start("game")
        });

        //UI Containers/Groups
        gems.add([gem_box, gem_icon, this.gems_value]);
        gold.add([gold_box, gold_icon, this.gold_value]);
        playerUI.add([player_gui_box, player_name, player_role, player_level, backButton]);

        let rewards = this.add.container(containerOffset,-200);

        //If it has rewards
        if(isWithRewards){
            const rewards_icon = this.add.sprite(gold_box.x + gold_box.displayWidth/2 + padding*4, height*0.07,'gift_button').setOrigin(0.5).setDepth(2).setScale(0.8);
            const rewards_box = this.add.rexRoundRectangle(rewards_icon.x, gem_icon.y, padding*4, padding, padding/5, 0x000000).setOrigin(0,0.5).setAlpha(0.6);
            this.rewards_value = this.add.text(rewards_box.x + rewards_box.width/2, rewards_box.y, this.player.playerInfo.rewardPoints || 0, {fontFamily: 'Arial'}).setOrigin(0.5);         
        
            rewards.add([rewards_box, rewards_icon, this.rewards_value])
        }

        //UI Animations
        this.tweens.add({
            targets: [playerUI, gems, gold, rewards ],
            y: { value: 0, duration: 600, ease: 'Power1'},
            yoyo: false,
        });

		this.scene.add.existing(this);
	}
}
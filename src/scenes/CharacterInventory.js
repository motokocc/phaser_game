import 'regenerator-runtime/runtime';
import BaseScene from '../plugins/BaseScene';
import { Tabs } from 'phaser3-rex-plugins/templates/ui/ui-components.js';
import { doc, updateDoc } from "firebase/firestore";

class CharacterInventory extends BaseScene {
    create(){
        this.gameBg = this.add.image(0,0,'inventory_bg');
        this.gameBg.setOrigin(0,0);
        this.gameBg.setScale(1.11);

        const gameW = this.game.config.width;
        const gameH = this.game.config.height;
        const paddingX = gameW * 0.025;
        const buttonScale = gameW * 0.00078;

        //Gems
        let gems = this.add.container();
        const gem_icon = this.add.sprite(gameW/2 - paddingX*3, gameH*0.07,'gems').setOrigin(0.5).setDepth(2);
        const gem_box = this.add.rectangle(gem_icon.x, gem_icon.y, paddingX*4, paddingX, 0x000000).setOrigin(0,0.5).setAlpha(0.6);
        const gem_value = this.add.text(gem_box.x + gem_box.width/2, gem_box.y, this.player.playerInfo.gems || 0, {fontFamily: 'Arial'}).setOrigin(0.5);

        //Gold
        let gold = this.add.container();
        const gold_icon = this.add.sprite(gameW/2 + paddingX*3, gameH*0.07,'gold').setOrigin(0.5).setDepth(2);
        const gold_box = this.add.rectangle(gold_icon.x, gem_icon.y, paddingX*4, paddingX, 0x000000).setOrigin(0,0.5).setAlpha(0.6);
        const gold_value = this.add.text(gold_box.x + gold_box.width/2, gold_box.y, this.player.playerInfo.gold || 0, {fontFamily: 'Arial'}).setOrigin(0.5);

        //Player Stat GUI
        let playerUI = this.add.container();
        const player_gui_box = this.add.sprite(paddingX, gameH*0.07,'player_gui_box').setOrigin(0, 0.5).setScale(buttonScale).setInteractive();
        const player_name = this.add.text(
            player_gui_box.x* 3.6,
            player_gui_box.y,
            this.player.playerInfo.name || 'Adventurer',
            {fontFamily: 'Arial'}
        ).setOrigin(0, 0.5);


        //Content Box;
        let content = this.add.container();
        const contentBox = this.add.rectangle(gameW/2 - paddingX*2, gameH * 0.22, gameW/2 + paddingX, gameH*0.745, 0x000000, 0.9).setOrigin(0);

        //Inventory Tabs
        let tabContainer = this.add.container();
        //const tabBox = this.add.rectangle(contentBox.x - paddingX, contentBox.y, gameW* 0.4, gameH*0.745, 0x000000, 0.9).setOrigin(1,0);

        let tabs = new Tabs(this, {
            x: paddingX,
            y: gameH * 0.22 - paddingX*2,
            width: gameW* 0.4,
            height: gameH*0.745,
            panel: this.add.rectangle(0,0, gameW* 0.4, gameH*0.745, 0x000000, 0.9),
            topButtons: [
                this.add.rectangle(0, 0, paddingX*3, paddingX*2, 0x550000 ),
                this.add.rectangle(0, 0, paddingX*3, paddingX*2, 0x005500 ),
                this.add.rectangle(0, 0, paddingX*3, paddingX*2, 0x000055 ),
            ]
        }).setOrigin(0).layout();

        
        tabs.on('button.click', (button, groupName, index) => {
            console.log(button, groupName + '-' + index);
            tabs.getElement('panel').setFillStyle(button.fillColor);
        });

        this.add.existing(tabs);
 

        //UI Containers/Groups
        gems.add([gem_box, gem_icon, gem_value]);
        gold.add([gold_box, gold_icon, gold_value]);
        playerUI.add([player_gui_box, player_name]);

    }
}

export default CharacterInventory;
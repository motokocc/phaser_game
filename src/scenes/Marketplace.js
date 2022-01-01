import 'regenerator-runtime/runtime';
import BaseScene from '../plugins/BaseScene';
import {  Tabs, ScrollablePanel, FixWidthSizer, OverlapSizer, Menu, Label, Click } from 'phaser3-rex-plugins/templates/ui/ui-components.js';
import { doc, updateDoc } from "firebase/firestore";

class Marketplace extends BaseScene {

    create(){
        this.gameBg = this.add.image(-2,-7.5,'inventory_bg');
        this.gameBg.setOrigin(0,0);
        this.gameBg.setScale(1.10);

        const gameW = this.game.config.width;
        const gameH = this.game.config.height;
        const paddingX = gameW * 0.025;

        this.itemsOnSale=[];
        this.generateUpperUI();

        //Market UI
        this.marketplaceSizer = new FixWidthSizer(this, {
            space: {
                left: 10,
                right: 10,
                bottom: 10,
                item: 10,
                line: 10
            }
        });
        this.add.existing(this.marketplaceSizer);

        this.marketplaceSizer.layout();
        this.searchBox();
        this.loadNFTMarketplace();

        this.panelBox = new ScrollablePanel(this, {
            x: 0,
            y: 0,
            width: gameW - paddingX*2,
            height: gameH*0.745,
            scrollMode:0,
            background: this.add.rectangle(0,0, gameW - paddingX*2, gameH*0.745, 0x000000, 0.9),
            panel: {
                child: this.marketplaceSizer
            },
            space:{
                left: 10,
                right: 20,
                top: 20,
                bottom: 20,
            },
            slider: {
                track: this.add.rexRoundRectangle(0, 0, 10, gameH*0.745, 4.5, 0x000000, 0.9).setStrokeStyle(0.5, 0xffffff, 0.8),
                thumb: this.add.rexRoundRectangle(0, 0, 10, paddingX*4, 4.5, 0xffffff, 0.8).setAlpha(0.5),
                input: 'drag',
                position: 'right',
            },
        }).setOrigin(0).layout();
        this.add.existing(this.panelBox);

        //Inventory Tabs
        this.tabs = new Tabs(this, {
            x: paddingX,
            y: gameH * 0.22 - paddingX*2 + 10,
            width: gameW - paddingX*2,
            height: gameH*0.745,
            panel: this.panelBox,
            topButtons: [
                this.add.rectangle(0, 0, paddingX*4, paddingX*2.1, 0x000000, 0.9 ).setOrigin(0.5,1).setScale(0.8),
                this.add.rectangle(0, 0, paddingX*4, paddingX*2.1, 0x23140a, 0.9 ).setOrigin(0.5,1).setScale(0.8),
                this.add.rectangle(0, 0, paddingX*4, paddingX*2.1, 0x23140a, 0.9 ).setOrigin(0.5,1).setScale(0.8),
            ]
        }).setOrigin(0).layout();

        this.tabs.getElement('topButtons').forEach((tab, index) => {
            tab.setStrokeStyle(2, 0x000000, 1);
            if(index == 0){
                this.cardIcon = this.add.sprite(tab.x, tab.y - tab.displayHeight/2 ,'cards_icon').setOrigin(0.5);
            }
            else if(index == 1){
                this.backpackIcon = this.add.sprite(tab.x, tab.y - tab.displayHeight/2,'backpack_icon').setOrigin(0.5);
            }
            else{
                this.magicIcon = this.add.sprite(tab.x, tab.y - tab.displayHeight/2 ,'magic_icon').setOrigin(0.5);
            }

        });
        
        this.tabs.on('button.click', (button, groupName, index) => {
            let tabButtons = this.tabs.getElement('topButtons');

            tabButtons.forEach((button,indexButton) => {
                if(indexButton == index){
                    button.fillColor = 0x000000 ;
                }
                else{
                    button.fillColor = 0x23140a;
                }
            })

            this.marketplaceSizer.clear(true);

            if(index == 0){
                this.scene.restart();
            }
            else if(index == 1){
                this.marketplaceSizer.add(this.add.text(0,0, 'No items being sold at the moment', {fontFamily: 'Arial'}));
            }
            else{
                this.marketplaceSizer.add(this.add.text(0,0, 'No skills being sold at the moment', {fontFamily: 'Arial'}));
            }    

            this.panelBox.layout();
        });

        this.add.existing(this.tabs);        
    }

    async loadNFTMarketplace(){
        this.marketplaceSizer.add(
            this.add.text(0,0, 'Loading NFT marketplace.. Please wait...', {fontFamily: 'Arial'}).setDepth(10)
        );
 
        this.itemsOnSale = await this.player.getAllItemsOnSale();
        this.marketplaceSizer.removeAll(true);

        if(this.itemsOnSale.length >= 1){
            this.itemsOnSale.forEach((item, index) => {
                this.generateItemUI(item);
            })
        }
        else{
            this.marketplaceSizer.add(
                this.add.text(0,0, 'No cards being sold at the moment', {fontFamily: 'Arial'}).setDepth(10)
            );
        }
        this.panelBox.layout();
    }

    generateItemUI(item){
        const gameW = this.game.config.width;
        const paddingX = gameW * 0.025;

         let itemOnSaleSizer = new OverlapSizer(this,0,0,this.panelBox.width - (paddingX*3), 190, {space:0}).setOrigin(0,0);
        this.add.existing(itemOnSaleSizer);

        itemOnSaleSizer                               
        .add(this.add.rexRoundRectangle(0,0,this.panelBox.width - (paddingX*3),190, 5, 0x000000, 0).setStrokeStyle(1,0xffffff,1), {key: 'salesBox',expand: false})
        .add(this.add.sprite(0, 0, item.name).setScale(0.35), {key: 'itemImage', expand:false, align: 'left-center', padding: { left: 20}})
        .add(this.add.sprite(0, 0, item.properties.attribute).setScale(0.2), {key: 'itemAttribute', expand:false, align: 'left-center', padding: { left: 225, bottom: 80 }})
        .add(this.add.sprite(0, 0, `rarity_${item.properties.rarity}`).setScale(0.2), {key: 'itemRarity', expand:false, align: 'left-center', padding: { left: 205, bottom: 25 }})
        .add(this.add.rexTagText(0,0, [
            `<style='fontStyle:bold'>Name</style> : ${item.name} #${item.saleId}`,
            `<style='fontStyle:bold'>Attribute</style> : `,
            `<style='fontStyle:bold'>Rarity</style> : `,
            `<style='fontStyle:bold'>Quantity on sale</style> : ${item.itemAvailable}`,
            `<style='fontStyle:bold'>Price</style> : ${item.price} ETH`,
            `<style='fontStyle:bold'>Seller</style> : ${item.seller}`,
        ], {
            fontFamily: 'Arial',
            lineSpacing: 9
        }), {key: 'details', expand:false, align: 'left-center', padding: { left: 145}})
        .add(this.add.sprite(0,0,'buyButton').setScale(0.8).setInteractive()
            .on('pointerdown', () => {
            this.sound.play('clickEffect', {loop: false});    
            this.buyItemPopUp(item)
        }), {key: 'sellButton', expand:false, align: 'right-center', padding: { right: 20 }})
        .layout();   

        this.marketplaceSizer.add(itemOnSaleSizer);    
    }

    searchBox(){
        const gameW = this.game.config.width;
        const paddingX = gameW * 0.025;
        this.searchInput = this.add.rexInputText(
            this.game.config.width - paddingX - 4,
            this.game.config.height * 0.22 - paddingX,
            340,
            35,
            {
                fontSize : "17px",
                fontFamily: 'Arial',
                backgroundColor : "black",
                color: "white",
                placeholder: "Search for name, attribute, seller...",
                border: 1,
                borderColor: "white",
                paddingLeft: "15px"
            }
        ).setOrigin(1,0.5)
        .on('textchange', (inputText) => {
            let searchOutput = [];

            let filter = inputText.text.toUpperCase();

            for (let i = 0; i < this.itemsOnSale.length; i++) {
                let { name, seller, properties } = this.itemsOnSale[i];
                let { attribute } = properties;

                if (name.toUpperCase().indexOf(filter) > -1 || 
                    attribute.toUpperCase() == filter ||
                    seller.toUpperCase().indexOf(filter) > -1) 
                {
                    searchOutput.push(this.itemsOnSale[i])
                }
            }

            this.marketplaceSizer.removeAll(true);

            if(searchOutput.length >= 1){
                searchOutput.forEach(item => {
                    this.generateItemUI(item);
                    this.panelBox.layout();
                });
            }
            else{
                this.marketplaceSizer.add(
                    this.add.text(0,0, 'No match found', {fontFamily: 'Arial'}).setDepth(10)
                ); 
                this.panelBox.layout();               
            }

        })

        this.searchInput.setStyle("border-radius", "5px");
 
    }

    async buyItemPopUp(item){
        this.searchInput.setBlur();
        const buyItemGroup = this.add.group();

        let quantity = 1;
        let price = item.price;

        //Quantity of item to be bought
        const buyQuantity = this.add.rexInputText(
            this.game.config.width/2,
            this.game.config.height/2 - 50,
            215,
            25,
            { 
                type: "number",
                maxLength: 2,
                fontSize : "17px",
                fontFamily: 'Arial',
                backgroundColor : "white",
                color: "black",
            }
        ).setOrigin(0.5).setScale(1.3)
        .on('textchange', async(inputText) => {
            let allowedKey = /^[1-9]\d*$/g;
            let wholeNumbersOnly = new RegExp(allowedKey);

            let inputValue = Number(inputText.text);

            if(wholeNumbersOnly.test(inputValue) && inputValue <= item.itemAvailable ){
                quantity = inputValue;                               
                price = item.price * quantity;

                buyingPrice.setText(price);
 
                //Get ETH current price in usd
                try{
                    let response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=ethereum');
                    let ethData = await response.json();
                    let { current_price } = ethData[0];

                    let priceInUsd = price * current_price;
        
                    priceText.setText(`Total Price - ETH ($${priceInUsd.toFixed(2)})`);
                }
                catch(e){
                    console.log(e.message);
                }
            }
            else{
                buyQuantity.setText("");
                quantity = 1;
                priceText.setText('Total Price - ETH ($0.00)');
            }
        });

        buyQuantity.setText(quantity);
        buyQuantity.setStyle("border-radius", "5px");
        buyQuantity.setStyle("text-align", "center");

        //Price of item to be bought
        const buyingPrice = this.add.rexInputText(
            this.game.config.width/2,
            this.game.config.height/2 + 35,
            215,
            25,
            { 
                type: "number",
                maxLength: 2,
                fontSize : "17px",
                fontFamily: 'Arial',
                backgroundColor : "white",
                color: "black",
            }
        ).setOrigin(0.5).setScale(1.3);

        buyingPrice.setText(price);
        buyingPrice.setStyle("border-radius", "5px");
        buyingPrice.setStyle("text-align", "center");

        let quantityInput = document.querySelectorAll('input')[1];
        quantityInput.max = item.itemAvailable;
        quantityInput.min = 1;

        let priceInput = document.querySelectorAll('input')[2];
        priceInput.disabled = true;

        //input title
        let quantityText = this.add.text(
            buyQuantity.x - buyQuantity.displayWidth*0.65,
            buyQuantity.y - buyQuantity.displayHeight,
            'Quantity',
            {fontFamily: 'Arial', fontSize: 14}
        ).setOrigin(0,1);

        let priceText = this.add.text(
            buyingPrice.x - buyingPrice.displayWidth*0.65,
            buyingPrice.y - buyingPrice.displayHeight,
            'Total Price - ETH ($0.00)',
            {fontFamily: 'Arial', fontSize: 14}
        ).setOrigin(0,1);

        let buycancelButton = this.add.sprite(
            buyingPrice.x + 10,
            buyingPrice.y + buyingPrice.displayHeight + 35,
            'cancelButton'
        ).setOrigin(0).setInteractive();

        let buyOkButton = this.add.sprite(
            buyingPrice.x -10,
            buyingPrice.y + buyingPrice.displayHeight + 35,
            'confirmButton'
        ).setOrigin(1,0).setInteractive();

        buycancelButton.on('pointerdown', () => {
            this.sound.play('clickEffect', {loop: false});
            this.formPopupContainer.destroy(true);
        })

        buyOkButton.on("pointerdown", async() => {
            buyOkButton.setAlpha(0.6);
            buyQuantity.setText(quantity);
            buyingPrice.setText(price);
            this.sound.play('clickEffect', {loop: false});
            buyOkButton.disableInteractive();
            try{
                 await this.player.buyItem(item.saleId, quantity, price);
            }
            catch(e){
                alert(e.message);
            }

            buyOkButton.setInteractive();
            this.formPopupContainer.destroy(true);
            this.scene.restart();
        });

        buyOkButton.on("pointerup", () => {
            buyOkButton.setAlpha(1);
        })
        
        buyItemGroup.addMultiple([buyQuantity, buyingPrice, quantityText, priceText, buyOkButton, buycancelButton]);

        this.formPopUp(`Buy ${item.properties.type}`,buyItemGroup);

        try{
            let data = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=ethereum');
            let ethData = await data.json();
            let { current_price } = ethData[0];
            let priceInUsd = price * current_price;
    
            priceText.setText(priceInUsd? `Total Price - ETH ($${priceInUsd.toFixed(2)})` : 'Total Price - ETH ($0.00)');
        }
        catch(e){
            console.log(e.message);
        }
    }
}

export default Marketplace;
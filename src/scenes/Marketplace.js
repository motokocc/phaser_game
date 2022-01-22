import 'regenerator-runtime/runtime';
import BaseScene from '../plugins/BaseScene';
import {  Tabs, ScrollablePanel, FixWidthSizer, OverlapSizer } from 'phaser3-rex-plugins/templates/ui/ui-components.js';
import { getSoundSettings } from '../js/utils';
import UpperUi from '../components/upperUI';

class Marketplace extends BaseScene {

    create(){
        this.gameBg = this.add.image(-2,-7.5,'inventory_bg');
        this.gameBg.setOrigin(0,0);
        this.gameBg.setScale(1.10);

        this.itemsOnSale=[];
        this.cardsOnSale=[];
        this.utilitiesOnSale=[];
        this.skillsOnSale=[];
        this.currentTab = "card";
        this.toggleList = true;
        this.currentPage = 1;
    
        this.upper = new UpperUi(this);
        this.add.existing(this.upper);
        this.upper.generate();

        this.generatePaginationUI();

        //Market UI
        this.marketplaceSizer = new FixWidthSizer(this, {
            space: { left: 10, right: 10, bottom: 10, item: 10, line: 10 }
        });
        this.add.existing(this.marketplaceSizer);

        this.marketplaceSizer.layout();
        this.searchBox();
        this.loadNFTMarketplace(this.currentTab);

        this.thumbnailChanger();

        this.panelBox = new ScrollablePanel(this, {
            x: 0,
            y: 0,
            width: this.gameW - this.paddingX*2,
            height: this.gameH*0.78,
            scrollMode:0,
            background: this.add.rectangle(0,0, this.gameW - this.paddingX*2, this.gameH*0.745, 0x000000, 0.9),
            panel: {
                child: this.marketplaceSizer
            },
            space:{ left: 10, right: 20, top: 20, bottom: 45 },
            slider: {
                track: this.add.rexRoundRectangle(0, 0, 10, this.gameH*0.745, 4.5, 0x000000, 0.9).setStrokeStyle(0.5, 0xffffff, 0.8),
                thumb: this.add.rexRoundRectangle(0, 0, 10, this.paddingX*4, 4.5, 0xffffff, 0.8).setAlpha(0.5),
                input: 'drag',
                position: 'right',
            },
        }).setOrigin(0).layout();
        this.add.existing(this.panelBox);

        //Inventory Tabs
        this.tabs = new Tabs(this, {
            x: this.paddingX,
            y: this.gameH * 0.22 - this.paddingX*2 + 10,
            width: this.gameW - this.paddingX*2,
            height: this.gameH*0.78,
            panel: this.panelBox,
            topButtons: [
                this.add.rectangle(0, 0, this.paddingX*4, this.paddingX*2.1, 0x000000, 0.9 ).setOrigin(0.5,1).setScale(0.8),
                this.add.rectangle(0, 0, this.paddingX*4, this.paddingX*2.1, 0x23140a, 0.9 ).setOrigin(0.5,1).setScale(0.8),
                this.add.rectangle(0, 0, this.paddingX*4, this.paddingX*2.1, 0x23140a, 0.9 ).setOrigin(0.5,1).setScale(0.8),
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
                this.currentTab = 'card';
            }
            else if(index == 1){                            
                this.currentTab = 'item';
            }
            else{
                this.currentTab = 'skill';                
            }

            this.marketplaceSizer.removeAll(true); 
            this.currentPage = 1;
            this.loadNFTMarketplace(this.currentTab);   

            this.panelBox.layout();
        });

        this.add.existing(this.tabs);        
    }

    async loadNFTMarketplace(category){
        this.marketplaceSizer.add(
            this.add.text(0,0, 'Loading NFT marketplace.. Please wait...', {fontFamily: 'Arial'}).setDepth(10)
        );
 
        this.itemsOnSale = await this.player.getAllItemsOnSale();

        //Data test
        for(let i=0; i<=60; i++){
            let testData = {
                name: 'Saya', saleId: 20, itemId: 500, itemAvailable: 1, itemSold:1, seller: '0x0000000', price: 0.555,
                properties:{
                    rarity: 5,
                    type: "card",
                    attribute: "water"
                }
            }            
            testData.saleId = i + 1;
            testData.itemAvailable = Math.floor(Math.random()*10);
            testData.price = Math.random().toFixed(3);
            let randomizer = Math.floor(Math.random()*2);
            testData.name = randomizer == 1? 'Saya': 'Alpha';
            testData.properties.attribute = randomizer == 1? 'water': 'fire';
            testData.properties.rarity = randomizer == 1? 5: 1;
            testData.seller = '0x00000' + i;
            this.itemsOnSale.push(testData); 
        }
        //End of Data test

        this.marketplaceSizer.removeAll(true);

        if(category == 'card'){
            this.cardsOnSale = this.itemsOnSale.filter(item => item.properties.type == category);
            if(this.cardsOnSale.length >= 1){

                this.paginate(this.cardsOnSale);
            }
            else{
                this.marketplaceSizer.add(
                    this.add.text(0,0, 'No cards being sold at the moment', {fontFamily: 'Arial'}).setDepth(10)
                );
            }
        }
        else if(category == 'item'){
            this.utilitiesOnSale = this.itemsOnSale.filter(item => item.properties.type == category);
            if(this.utilitiesOnSale.length >= 1){

                this.paginate(this.utilitiesOnSale);
            }
            else{
                this.marketplaceSizer.add(
                    this.add.text(0,0, 'No items being sold at the moment', {fontFamily: 'Arial'}).setDepth(10)
                );
            }
        }
        else if(category == 'skill'){
            this.skillsOnSale = this.itemsOnSale.filter(item => item.properties.type == category);
            if(this.skillsOnSale.length >= 1){

                this.paginate(this.skillsOnSale);
            }
            else{
                this.marketplaceSizer.add(
                    this.add.text(0,0, 'No skills being sold at the moment', {fontFamily: 'Arial'}).setDepth(10)
                );
            }
        }
        else{
            this.paginate(this.itemsOnSale);
        }

        this.panelBox.layout();
    }

    generatePaginationUI(){
        this.paginationSizer = new OverlapSizer(
            this, this.gameW/2, this.gameH - (this.gameW * 0.025),225, 45, {space:0}
        ).setOrigin(0.5);
        this.add.existing(this.paginationSizer); 

        this.paginationPageNumber = this.add.text(0,0, '1 of 1 Page', {fontFamily: 'Arial'}).setDepth(12).setOrigin(0.5).setInteractive();
        let paginationFirstPage = this.add.sprite(0,0, 'fast_forward').setDepth(12).setInteractive();
        let paginationLastPage = this.add.sprite(0,0, 'fast_forward').setDepth(12).setInteractive();
        let paginationNextPage = this.add.sprite(0,0, 'forward_icon').setDepth(12).setInteractive();
        let paginationPreviousPage = this.add.sprite(0,0, 'forward_icon').setDepth(12).setInteractive();

        paginationFirstPage.flipX = true;
        paginationPreviousPage.flipX = true;

        this.paginationSizer
            .add(this.paginationPageNumber, {expand:false, align: 'center-center'})
            .add(paginationPreviousPage, {expand:false, align: 'left-center', padding:{left: 40}})
            .add(paginationFirstPage, { expand:false, align: 'left-center'})
            .add(paginationNextPage, {expand:false, align: 'right-center', padding:{right:40}})
            .add(paginationLastPage, {expand:false, align: 'right-center'})
            .layout();

        paginationFirstPage.on('pointerdown', () => {
            this.sound.play('hoverEffect', {loop: false, volume: getSoundSettings('hoverEffect')});
            this.firstPage();
        });
        paginationLastPage.on('pointerdown', () => {
            this.sound.play('hoverEffect', {loop: false, volume: getSoundSettings('hoverEffect')});
            this.lastPage();
        });
        paginationNextPage.on('pointerdown', () => {
            this.sound.play('hoverEffect', {loop: false, volume: getSoundSettings('hoverEffect')});
            this.nextPage();
        });
        paginationPreviousPage.on('pointerdown', () => {
            this.sound.play('hoverEffect', {loop: false, volume: getSoundSettings('hoverEffect')});
            this.prevPage();
        });
    }

    generateItemUI(item){       
        if(this.toggleList){
            let itemOnSaleSizer = new OverlapSizer(this,0,0,this.panelBox.width - (this.paddingX*3), 190, {space:0}).setOrigin(0,0);
            this.add.existing(itemOnSaleSizer);

            itemOnSaleSizer                               
            .add(this.add.rexRoundRectangle(0,0,this.panelBox.width - (this.paddingX*3),190, 5, 0x000000, 0).setStrokeStyle(1,0xffffff,1), {key: 'salesBox',expand: false})
            .add(this.add.sprite(0, 0, `${item.name}_mini`).setScale(0.7), { expand:false, align: 'left-center', padding: { left: 20}})
            .add(this.add.sprite(0, 0, item.properties.attribute).setScale(0.2), { expand:false, align: 'left-center', padding: { left: 225, bottom: 80 }})
            .add(this.add.sprite(0, 0, `rarity_${item.properties.rarity}`).setScale(0.2), { expand:false, align: 'left-center', padding: { left: 205, bottom: 25 }})
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
            }), { expand:false, align: 'left-center', padding: { left: 145}})
            .add(this.add.sprite(0,0,'buyButton').setScale(0.8).setInteractive()
                .on('pointerdown', () => {
                this.sound.play('clickEffect', {loop: false, volume: getSoundSettings('clickEffect')});    
                this.buyItemPopUp(item)
            }), {expand:false, align: 'right-center', padding: { right: 20 }})
            .layout(); 

            this.marketplaceSizer.add(itemOnSaleSizer);         
        }
        else{
            let itemOnSaleSizer = new OverlapSizer(this,0,0, 120, 190, {space:0}).setOrigin(0,0);
            this.add.existing(itemOnSaleSizer);

           itemOnSaleSizer
            .add(this.add.sprite(0, 0, `${item.name}_mini`).setScale(0.7), { expand:false, align: 'center-top'})
            .add(this.add.rexRoundRectangle(0,0, 105, 30, 5, 0x005500, 1).setInteractive()
                .on('pointerdown', () => {
                    this.sound.play('clickEffect', {loop: false, volume: getSoundSettings('clickEffect')});    
                    this.buyItemPopUp(item)
                }), { expand:false, align: 'center-bottom'})
            .add(this.add.text(0,0, `${item.price} ETH`, {fontFamily: 'Arial', fontSize: 12}).setOrigin(0.5), { expand:false, align: 'center-bottom', padding:{bottom: 7.5}})
            .layout();

            this.marketplaceSizer.add(itemOnSaleSizer); 
        }

        this.paginationPageNumber.setText(`${this.currentPage} of ${this.numberOfPages} ${this.numberOfPages >1? 'Pages' : 'Page'}`);      
    }

    searchBox(){            
        this.searchInput = this.add.rexInputText(
            this.gameW - this.paddingX - 4,
            this.gameH * 0.22 - this.paddingX,
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
            let itemToFilter = this.itemsOnSale.filter(item => item.properties.type == this.currentTab);

            for (let i = 0; i < itemToFilter.length; i++) {
                let { name, seller, properties } = itemToFilter[i];
                let { attribute } = properties;

                if (name.toUpperCase().indexOf(filter) > -1 || 
                    attribute.toUpperCase() == filter ||
                    seller.toUpperCase().indexOf(filter) > -1) 
                {
                    searchOutput.push(itemToFilter[i])
                }
            }

            this.marketplaceSizer.removeAll(true);

            if(searchOutput.length >= 1){
                if(this.currentTab == 'card'){
                    this.cardsOnSale = searchOutput;
                    this.paginate(this.cardsOnSale);
                }
                else if(this.currentTab == 'item'){
                    this.utilitiesOnSale = searchOutput;
                    this.paginate(this.utilitiesOnSale);
                }
                else{
                    this.skillsOnSale = searchOutput;
                    this.paginate(this.skillsOnSale);
                }

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

    thumbnailChanger(){
        let thumbnail_icon_filter = this.add.sprite(this.searchInput.x - this.searchInput.displayWidth - 5, this.searchInput.y + 3,'square_icon')
            .setOrigin(1,0.5).setInteractive();
        let list_icon_filter = this.add.sprite(thumbnail_icon_filter.x - thumbnail_icon_filter.displayWidth - 5, thumbnail_icon_filter.y, 'list_icon')
            .setOrigin(1,0.5).setInteractive();

        let icons = [thumbnail_icon_filter, list_icon_filter];

        icons.forEach(icon => {
            icon.on('pointerover', () => icon.setAlpha(0.7));
            icon.on('pointerout', () => icon.setAlpha(1));
        })

        thumbnail_icon_filter.on('pointerdown', () => {
            this.toggleList = false;
            this.sound.play('hoverEffect', {loop: false, volume: getSoundSettings('hoverEffect')});
            this.currentPage = 1;
            this.paginateOnTabs();
        })

        list_icon_filter.on('pointerdown', () => {
            this.toggleList = true;
            this.currentPage = 1;
            this.sound.play('hoverEffect', {loop: false, volume: getSoundSettings('hoverEffect')});
            this.paginateOnTabs();         
        })

    }

    paginate(data, currentPageNow){
         let numberOfItems = data.length;
         let numberPerPage = this.toggleList? 5 : 14;
         this.currentPage = currentPageNow || 1;
         this.numberOfPages = Math.ceil(numberOfItems/numberPerPage);

        const trimStart = (this.currentPage - 1) * numberPerPage;
        const trimEnd = trimStart + numberPerPage;

        let itemsOnDisplay = data.slice(trimStart, trimEnd);

        this.marketplaceSizer.removeAll(true);

        itemsOnDisplay.forEach(item => {
            this.generateItemUI(item);
            this.panelBox.layout();
        });
    }

    nextPage(){
        if(this.numberOfPages && this.currentPage != this.numberOfPages){
            this.currentPage++;
            this.paginateOnTabs();
        }
    }

    prevPage(){
        if(this.currentPage > 1){
            this.currentPage--;
            this.paginateOnTabs();
        }
    }

    lastPage(){
        if(this.numberOfPages &&  this.currentPage != this.numberOfPages){
            this.currentPage = this.numberOfPages;
            this.paginateOnTabs();
        }
    }
    
    firstPage(){
        this.currentPage = 1;
        this.paginateOnTabs();
    }

    paginateOnTabs = () => {
        if(this.currentTab == 'card'){
            this.paginate(this.cardsOnSale, this.currentPage);
        }
        else if(this.currentTab == 'item'){
            this.paginate(this.utilitiesOnSale, this.currentPage);
        }
        else{
            this.paginate(this.skillsOnSale, this.currentPage);
        }        
    }

    async buyItemPopUp(item){
        this.searchInput.setBlur();
        this.searchInput.setAlpha(0.3);

        const buyItemGroup = this.add.group();

        let quantity = 1;
        let price = item.price;

        //Quantity of item to be bought
        const buyQuantity = this.add.rexInputText(
            this.gameW/2,
            this.gameH/2 - 50,
            215,
            25,
            { type: "number", maxLength: 2, fontSize : "17px", fontFamily: 'Arial', backgroundColor : "white", color: "black" }
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
            this.gameW/2,
            this.gameH/2 + 35,
            215,
            25,
            { type: "number", maxLength: 2, fontSize : "17px", fontFamily: 'Arial', backgroundColor : "white", color: "black" }
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
            this.sound.play('clickEffect', {loop: false, volume: getSoundSettings('clickEffect')});
            this.searchInput.setAlpha(1);
            this.formPopupContainer.destroy(true);
        })

        buyOkButton.on("pointerdown", async() => {
            buyOkButton.setAlpha(0.6);
            buyQuantity.setText(quantity);
            buyingPrice.setText(price);
            this.sound.play('clickEffect', {loop: false, volume: getSoundSettings('clickEffect')});
            buyOkButton.disableInteractive();
            try{
                 await this.player.buyItem(item.saleId, quantity, price);
            }
            catch(e){
                alert(e.message);
            }

            buyOkButton.setInteractive();
            this.searchInput.setAlpha(1);
            this.formPopupContainer.destroy(true);
            this.scene.restart();
        });

        buyOkButton.on("pointerup", () => {
            buyOkButton.setAlpha(1);
        })
        
        buyItemGroup.addMultiple([buyQuantity, buyingPrice, quantityText, priceText, buyOkButton, buycancelButton]);

        this.formPopUp(`Buy ${item.properties.type}`,buyItemGroup, null, null, null, this.searchInput);

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
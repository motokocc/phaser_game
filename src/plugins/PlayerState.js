import 'regenerator-runtime/runtime'
import Phaser from 'phaser';
import ElvenHunt from '../abis/ElvenHunt.json';
import Web3 from 'web3';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { firebaseConfig } from '../js/config/firebase-config';
import card from "../js/card.json";
import { skills, items } from '../js/shopItems';

class Player extends Phaser.Plugins.BasePlugin {
    constructor(pluginManager) {
        super(pluginManager); 

        // Firebase Database
        let app = initializeApp(firebaseConfig);
        this.db = getFirestore();

       this.users = collection(this.db, 'users');
       this.firebaseChatMessages = collection(this.db, 'chat');

        //Global States
        this.playerInfo = {
            name: '',
            address: null,
            drawCount: 0,
            gold: 3000,
            gems: 3000,
            level: 1,
            role: "Adventurer",
            dateJoined: null,
            lastLogin: new Date(),
            lastSpin: null,
            lastReward: null,
            isFirstTime: true,
            lastRead: 0,
            cards:[],
            couponCodes:[],
            rewards: 0,
            inventory:{
                skill:[],
                item:[]
            }
        }

        this.announcements = {
            id: null,
            title: '',
            content: '',
        }
    }

    async loadWeb3() {
        if (window.ethereum) {
          window.web3 = new Web3(window.ethereum)
          await window.ethereum.enable()
          await this.loadBlockchainData();
        }
        else {
          window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
        }
    }

    loadBlockchainData = async() => {
        // Load account
        try{
            const accounts = await ethereum.request({ method: 'eth_accounts' });

            if(accounts[0]){
                //Get Players Data
                const web3 = window.web3
                const networkId = await web3.eth.net.getId();
                const networkData = ElvenHunt.networks[networkId];
                if(networkData) {
                    this.gameData = new web3.eth.Contract(ElvenHunt.abi, networkData.address);
                    let cardData = [];

                    //Blockchain Data - player name, draw count, cards
                    let cardsFromBlockchain = await this.getCards(accounts[0]);

                    //Firebase Data - gold
                    //Getting data from /users/${account[0]}
                    const userRef = doc(this.db, "users", accounts[0]);
                    const user = await getDoc(userRef);

                    //For announcements
                    const announcementRef = doc(this.db, "announcements", 'mail');
                    const mail = await getDoc(announcementRef);

                    if (user.exists()) {
                        //To add more data later for drops that can be exchanged to nfts
                        const { gold, drawCount, isFirstTime, name, gems, lastLogin, lastSpin, dateJoined, lastReward, lastRead, couponCodes, role, level, rewards, inventory } = user.data();

                        cardData = user.data().cards? user.data().cards.filter(card => card.name === "Alpha") : [];

                        let cards = [...cardData];

                        if(cardsFromBlockchain){
                            cards = [...cardData].concat(cardsFromBlockchain);
                            await updateDoc(doc(this.users, accounts[0]), { cards });
                        }
                            
                        //Set Player Data
                        this.setPlayerInfo(name, accounts[0], drawCount, gold, cards, isFirstTime, gems, lastLogin.toDate(), lastSpin? lastSpin.toDate() : null, dateJoined.toDate(), lastReward? lastReward.toDate():null, lastRead, couponCodes, role, level, rewards, inventory );
                        
                        //Set mail
                        this.announcements = mail.data();
                    } 
                    
                    else {
                        this.playerInfo.gold = 0;
                        this.playerInfo.address = accounts[0]
                        this.playerInfo.isFirstTime = true
                    }

                } 
                else {
                    window.alert('Player contract not deployed to detected network.')
                }
            }
        }
        catch(e){
            console.log(e.message);
            window.alert('Unable to connect to your Metamask wallet. Please try again later');
        }
    }

    setPlayerInfo(name, address, drawCount, gold, cards,isFirstTime, gems, lastLogin, lastSpin, dateJoined, lastReward, lastRead, couponCodes, role, level, rewards, inventory ){
        this.playerInfo = {
            name,
            address,
            drawCount,
            gold,
            cards,
            isFirstTime,
            gems,
            lastLogin,
            lastSpin,
            dateJoined,
            lastReward,
            lastRead,
            couponCodes,
            role,
            level,
            rewards,
            inventory
        }
        console.log('Player Info Set!',this.playerInfo);
    }

    async mintCard(mintType){
        this.playerInfo.drawCount++;

        let newCard = {...card};

        if(this.playerInfo.isFirstTime){
            this.playerInfo.isFirstTime = false;

            //First card
            newCard.name = "Alpha",
            newCard.description = "Alpha is a beast djinn ready to give a helping hand to any adventurer who summons him. He uses his arm-like tail to deal massive damage to his enemies. It is rummored that his eyes can locate hidden treasures and dungeons.",
            newCard.image = "https://ipfs.infura.io/ipfs/QmXwhouX6z9DLtBmpGiGwpDu9W8NCyMhtzHW4Bqfct3Rfd",
            this.playerInfo.cards = [...this.playerInfo.cards, newCard];

            await setDoc(doc(this.users, this.playerInfo.address), this.playerInfo);
        }

        else {
            try{
                let mintRate;

                if(mintType == "normal"){
                    mintRate = await this.gameData.methods.mintRate_Normal().call();
                }
                else if(mintType == "rare"){
                    mintRate = await this.gameData.methods.mintRate_Rare().call();
                }
                else{
                    mintRate = await this.gameData.methods.mintRate_Premium().call();
                }

                let cardMinted = await this.gameData.methods.mintCard(mintType).send({from: this.playerInfo.address, value: String(mintRate)});
                let cardData = cardMinted.events.ItemMinted.returnValues.card;

                let quantity = Number(await this.gameData.methods.balanceOf(this.playerInfo.address, cardData.id).call());

                const response = await fetch(cardData.tokenURI);
                let data = await response.json();
                data = {...data, quantity, id: cardData.id, fromBlockchain: true };

                newCard = {...data};

                let cardCombined = [data].concat(this.playerInfo.cards);
                let cards = cardCombined.reduce((arr, item)=> { 
                    let exists = !!arr.find(x => x.name === item.name && x.quantity >= item.quantity); 
                    if(!exists){arr.push(item)}; 
                    return arr 
                },[])

                this.playerInfo.cards = cards;
                await updateDoc(doc(this.users, this.playerInfo.address), { cards });
            }
            catch(e){
                console.log(e.message);
            }
        }
        return newCard;
    }

    getCards  = async(address) =>{
        const ids = [100, 101, 102, 200, 201, 202, 300, 301, 302, 400, 401, 402, 500, 501, 502];

        let blockchainCards = [];

        try{
            for(const id of ids){

                let quantity = Number(await this.gameData.methods.balanceOf(address, id).call());
                if(quantity){
                    let tokenURI = await this.gameData.methods.uri(id).call();
                    const response = await fetch(tokenURI);
                    let data = await response.json();
                    data = {...data, quantity, id, fromBlockchain: true };

                    blockchainCards.push(data);
                }
            } 
        }
        catch(e){
            console.log(e.message);
        }
     
        return blockchainCards;
    }

    getCardSaleStatus = async(cardId) => {
        let onSale = {};

        try{
            let itemOnSale = await this.gameData.methods.playerToItemsOnSale(this.playerInfo.address, cardId).call();
            let itemOnHand = Number(await this.gameData.methods.balanceOf(this.playerInfo.address, cardId).call());

            let { orderId, price, quantity } = itemOnSale;
            
            let priceInEth = Web3.utils.fromWei(price.toString(), 'ether');

            onSale = { orderId: Number(orderId), price: Number(priceInEth), quantityOnSale: Number(quantity), itemOnHand };
        }
        catch(e){
            console.log(e.message);
        }

        return onSale;
    }

    sellItem = async(itemId, price, quantity) => {
         let priceInWei = Web3.utils.toWei(price.toString(), 'ether');

         try{
            await this.gameData.methods.sellItem(itemId, priceInWei, quantity).send({from: this.playerInfo.address});
         }
         catch(e){
             console.log(e.message);
         }
    }

    cancelSale = async(orderId) => {
        try{
            await this.gameData.methods.cancelSale(orderId).send({from: this.playerInfo.address});
        }
        catch(e){
            console.log(e.message);
        }
    }

    buyItem = async(saleId, quantity, price) => {
        let priceInWei = Web3.utils.toWei(price.toString(), 'ether');

        try{
           await this.gameData.methods.buyItem(saleId, quantity).send({from: this.playerInfo.address, value: String(priceInWei)});
        }
        catch(e){
            console.log(e.message);
        }
    }

    getAllItemsOnSale = async() => {
        let itemsOnSale = [];
        let itemCounter = await this.gameData.methods.itemCounter().call();

        for(let i=1; i<= itemCounter; i++){
            let item = await this.gameData.methods.items(i).call();
            let {itemId, available, forSale, price, seller, sold, id } = item;

            if(forSale && (seller.toUpperCase() != this.playerInfo.address.toUpperCase())){
                let tokenURI = await this.gameData.methods.uri(itemId).call();
                const response = await fetch(tokenURI);

                let data = await response.json();
                let { name, description, properties } = data;

                let formattedItem = {
                    saleId: id,
                    itemId,
                    itemAvailable: Number(available),
                    itemSold: Number(sold),
                    seller,
                    price: Web3.utils.fromWei(price.toString(), 'ether'),
                    name,
                    description,
                    properties
                }    
                itemsOnSale.push(formattedItem);
            }
        }

        return itemsOnSale;
    }

    getShopItems = (category) => {
        let itemsOnSale = [];

        if(category == 'skill'){
            itemsOnSale = skills;
        }
        else{
            itemsOnSale = items;
        }

        //Add fetch of blockchain data later

        return itemsOnSale;
    }

    buyItemOnShop = async(quantity, price, item) => {
        let { priceCurrency, properties } = item;

        if(priceCurrency == 'eth'){
            console.log('Make smart contract interaction later');
            //Mint the item
        }
        else if(priceCurrency == 'rewards'){
            console.log('Make smart contract interaction later');
            //Subtract the rewards
            //Save to firebase
            //Mint the item
        }
        else{
            this.playerInfo[priceCurrency] = this.playerInfo[priceCurrency] - price;
            //Check if its already in the inventory
            let hasItem = this.playerInfo.inventory[properties.type].some(data => data.name == item.name);

            if(hasItem){
                let itemFiltered = this.playerInfo.inventory[properties.type].filter(data => data.name == item.name)[0];
                let newItems = this.playerInfo.inventory[properties.type].filter(data => data.name != item.name);
                itemFiltered.quantity = itemFiltered.quantity + quantity;

                newItems.push(itemFiltered);

                this.playerInfo.inventory[properties.type] = newItems;
            }
            else{
                Object.assign(item, { equipped: false, quantity, fromBlockchain: false });
                this.playerInfo.inventory[properties.type].push(item);
            }
            
            try{
                let { inventory, gold, gems } = this.playerInfo;
                await updateDoc(doc(this.users, accounts[0]), { inventory, gold, gems });
            }
            catch(e){
                console.log(e.message);
            }
        }
    }

    getAllSkills = () => {
        let skillsInGame = this.playerInfo.inventory.skill.filter(skill => skill.fromBlockchain == false);
        //TODO: Fetch skills owned in the blockchain
        return skillsInGame.sort((a, b) => (a.itemId - b.itemId));
    }

    getAllItems = () => {
        let itemsInGame = this.playerInfo.inventory.item.filter(item => item.fromBlockchain == false);
        //TODO: Fetch items owned in the blockchain
        return itemsInGame.sort((a, b) => (a.itemId - b.itemId));
    }

    sellInGameItems = (itemId, quantity, price, currency, itemType) => {
        let itemToSell = this.playerInfo.inventory[itemType].filter(item => item.itemId == itemId)[0];
        let itemNotToSell = this.playerInfo.inventory[itemType].filter(item => item.itemId != itemId); 

        let quantityRemaining = itemToSell.quantity - quantity;

        this.playerInfo[currency] = this.playerInfo[currency] + Number(price);

        if(quantityRemaining >= 1){
            itemToSell.quantity = quantityRemaining;
            itemNotToSell.push(itemToSell);
        }

        this.playerInfo.inventory[itemType] = itemNotToSell.sort((a, b) => (a.itemId - b.itemId));
    }
}

export default Player;
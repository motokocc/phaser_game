import 'regenerator-runtime/runtime'
import Phaser from 'phaser';
import PlayerData from '../abis/GameData.json';
import ElvenHunt from '../abis/ElvenHunt.json';
import Web3 from 'web3';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc, getDoc } from "firebase/firestore";
import { firebaseConfig } from '../js/config/firebase-config';
import card from "../js/card.json"

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
            gold: 0,
            gems: 0,
            dateJoined: null,
            lastLogin: new Date(),
            lastSpin: null,
            lastReward: null,
            isFirstTime: true,
            lastRead: 0,
            cards:[],
            couponCodes:[]
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
                    let cardsFromBlockchain = [];
                    const playerCardsCounter = await this.gameData.methods.playerCardsCounter(accounts[0]).call();
                    if(playerCardsCounter){
                        for(let i = 1; i <= playerCardsCounter; i++){
                            let card = await this.gameData.methods.playerCards(accounts[0],i).call();
                            const response = await fetch(card.tokenURI);
                            let data = await response.json();
                            data = {...data, quantity: card.amount, id: card.id, cardRarity: card.cardRarity};

                            cardsFromBlockchain.push(data);
                        }
                    }
                                                    
                    console.log(cardsFromBlockchain);

                    //Firebase Data - gold
                    //Getting data from /users/${account[0]}
                    const userRef = doc(this.db, "users", accounts[0]);
                    const user = await getDoc(userRef);

                    //For announcements
                    const announcementRef = doc(this.db, "announcements", 'mail');
                    const mail = await getDoc(announcementRef);

                    if (user.exists()) {
                        //To add more data later for drops that can be exchanged to nfts
                        const { gold, drawCount, isFirstTime, name, gems, lastLogin, lastSpin, dateJoined, lastReward, lastRead, couponCodes } = user.data();

                        cardData = user.data().cards? user.data().cards: [];
                            
                        //Set Player Data
                        this.setPlayerInfo(name, accounts[0], drawCount, gold, cardData, isFirstTime, gems, lastLogin.toDate(), lastSpin.toDate(), dateJoined.toDate(), lastReward.toDate(), lastRead, couponCodes );
                        
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

    setPlayerInfo(name, address, drawCount, gold, cards,isFirstTime, gems, lastLogin, lastSpin, dateJoined, lastReward, lastRead, couponCodes ){
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
            couponCodes
        }
        console.log('Player Info Set!',this.playerInfo);
    }

    async mintCard(){
        this.playerInfo.drawCount++;

        let newCard = {...card};

        if(this.playerInfo.isFirstTime){
            this.playerInfo.isFirstTime = false;

            //First card
            newCard.name = "Alpha",
            newCard.description = "Alpha is a beast djinn ready to give a helping hand to any adventurer who summons him. He uses his arm-like tail to deal massive damage to his enemies. It is rummored that his eyes can locate hidden treasures and dungeons.",
            newCard.image = "https://ipfs.infura.io/ipfs/QmXwhouX6z9DLtBmpGiGwpDu9W8NCyMhtzHW4Bqfct3Rfd",
            newCard.image_alt = "test_again"
            this.playerInfo.cards = [...this.playerInfo.cards, newCard];

            await setDoc(doc(this.users, this.playerInfo.address), this.playerInfo);
        }

        else {
            try{
                let cardMinted = await this.gameData.methods.mintCard("normal").send({from: this.playerInfo.address, value: Web3.utils.toWei('0.05', 'Ether')});
                let cardData = cardMinted.events.ItemMinted.returnValues.card;

                const response = await fetch(cardData.tokenURI);
                let data = await response.json();
                data = {...data, quantity: cardData.amount, id: cardData.id, cardRarity: cardData.cardRarity };

                newCard = {...data};
                this.playerInfo.cards = [...this.playerInfo.cards, newCard];
            }
            catch(e){
                console.log(e.message);
            }
        }
        return newCard;
    }
}

export default Player;
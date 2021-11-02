import 'regenerator-runtime/runtime'
import Phaser from 'phaser';
import PlayerData from '../abis/GameData.json';
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
            isFirstTime: true,
            cards:[]
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
                const networkData = PlayerData.networks[networkId];
                if(networkData) {
                    const playerData = new web3.eth.Contract(PlayerData.abi, networkData.address);
                    let cardData = [];
                    //Blockchain Data - player name, draw count, cards
                    const player = await playerData.methods.players(accounts[0]).call();
                    const { cards } = player;

                    //Firebase Data - gold
                    //Getting data from /users/${account[0]}
                    const userRef = doc(this.db, "users", accounts[0]);
                    const user = await getDoc(userRef);

                    if (user.exists()) {
                        //To add more data later for drops that can be exchanged to nfts
                        const { gold, drawCount, isFirstTime, name } = user.data();

                        cardData = user.data().cards? user.data().cards: [];
                            
                        //Set Player Data
                        this.setPlayerInfo(name, accounts[0], drawCount, gold, cardData, isFirstTime);
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

    setPlayerInfo(name, address, drawCount, gold, cards,isFirstTime){
        this.playerInfo = {
            name,
            address,
            drawCount,
            gold,
            cards,
            isFirstTime
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

            // await setDoc(doc(this.users, this.playerInfo.address), this.playerInfo);
        }
        else {
            console.log('minting....')
        }
     
        return newCard
    }
}

export default Player;
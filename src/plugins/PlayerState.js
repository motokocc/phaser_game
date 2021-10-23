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
          this.loadBlockchainData();
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
              
                    //Blockchain Data - player name, draw count, cards
                    const player = await playerData.methods.players(accounts[0]).call();
                    const { playerName, drawCount, cards} = player;

                    //Firebase Data - gold
                    //Getting data from /users/${account[0]}
                    let gold;
                    let isFirstTime;
                    const userRef = doc(this.db, "users", accounts[0]);
                    const user = await getDoc(userRef);

                    if (user.exists()) {
                        //To add more data later for drops that can be exchanged to nfts
                        gold = user.data().gold;
                        isFirtstTime = user.data().isFirstTime;
                    } 
                    
                    else {
                        gold = 0;
                        isFirstTime = true
                    }

                    //Set Player Data
                    this.setPlayerInfo(playerName, accounts[0], drawCount, gold, cards, isFirstTime);


                } 
                else {
                    window.alert('Player contract not deployed to detected network.')
                }
            }
        }
        catch(e){
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
    }

    async mintCard(){
        this.playerInfo.drawCount++;

        if(this.playerInfo.isFirstTime){
            this.playerInfo.isFirstTime = false;

            //First card
            card.name = "Alpha",
            card.description = "test",
            card.image = "test",
            card.image_alt = "test_again"
            this.playerInfo.cards = [...this.playerInfo.cards, card ];

            //await setDoc(doc(this.users, 'test'), this.playerInfo);
        }
        else {
            console.log('minting....')
        }
    }
}

export default Player;
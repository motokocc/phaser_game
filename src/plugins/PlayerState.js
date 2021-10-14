import 'regenerator-runtime/runtime'
import Phaser from 'phaser';
import PlayerData from '../abis/GameData.json';
import Web3 from 'web3';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc, getDoc } from "firebase/firestore";
import { firebaseConfig } from '../js/config/firebase-config';

class Player extends Phaser.Plugins.BasePlugin {
    constructor(pluginManager) {
        super(pluginManager); 

        // Firebase Database
        let app = initializeApp(firebaseConfig);
        this.db = getFirestore();

       this.users = collection(this.db, 'users');

        // setDoc(doc(users, 'test'), {
        //     name: 'Justin',
        //     address: '0x0',
        //     isFirstTime: true,
        //     cards:[],
        //     gold:1000,
        //     drawCount:0
        // });

        //Global States
        this.playerInfo = {
            name: '',
            address: null,
            drawCount: 0,
            gold: 0,
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
                    const userRef = doc(this.db, "users", accounts[0]);
                    const user = await getDoc(userRef);

                    if (user.exists()) {
                        //To add more data later for drops that can be exchanged to nfts
                        gold = user.data().gold;
                    } 
                    
                    else {
                        gold = 0;
                    }

                    //Set Player Data
                    this.setPlayerInfo(playerName, accounts[0], drawCount, gold, cards);


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

    setPlayerInfo(id, name, address, drawCount, gold){
        this.playerInfo = {
            name,
            address,
            drawCount,
            gold,
            cards
        }
    }
}

export default Player;
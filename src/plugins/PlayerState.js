import 'regenerator-runtime/runtime'
import Phaser from 'phaser';
import PlayerData from '../abis/GameData.json';
import Web3 from 'web3';

class Player extends Phaser.Plugins.BasePlugin {
    constructor(pluginManager) {
        super(pluginManager); 
        //Global States
        this.playerInfo = {
            id: null,
            name: '',
            address: null,
            drawCount: 0
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
                    const playerData = new web3.eth.Contract(PlayerData.abi, networkData.address)
              
                    const player = await playerData.methods.players(accounts[0]).call();
                    const { playerName, drawCount, id } = player;
                    this.setPlayerInfo(id, playerName, accounts[0], drawCount);
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

    setPlayerInfo(id, name, address, drawCount){
        this.playerInfo = {
            id,
            name,
            address,
            drawCount
        }
    }
}

export default Player;
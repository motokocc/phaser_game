const GameData = artifacts.require("./GameData.sol");

contract('GameData', accounts => {
    let gameData;

    before(async() => {
        gameData = await GameData.deployed();
    })

    describe('players', async() => {
        let playerCount;

        before(async() => {
            playerCount = await gameData.playerCount();
        })

        it('gets a card data from a player', async() => {
            //Set the player data
            await gameData.drawCard('free', 'Justin', {from: accounts[0], value: web3.utils.toWei('0', 'Ether') });
            await gameData.drawCard('rare', 'Justin', {from: accounts[0], value: web3.utils.toWei('0.1', 'Ether') });
            await gameData.drawCard('premium', 'Justin', {from: accounts[0], value: web3.utils.toWei('0.2', 'Ether') });

            //Check if card is received by player
            const playerCard = await gameData.playerCards(accounts[0],1);
            const player = await gameData.players(accounts[0]);
            assert.equal(playerCard.id, 1);
            assert.equal(player.playerName, 'Justin');
            assert.equal(player.playerAddress, accounts[0]);
            assert.equal(player.drawCount, 3);
        })
    });
});
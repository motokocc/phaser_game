const GameData = artifacts.require("GameData");

module.exports = function (deployer) {
    deployer.deploy(GameData, '0x435d8fdb00ac3E3450248633Bc21f174D8D95440');
};
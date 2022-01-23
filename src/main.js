import Phaser from 'phaser';
import TitleScreen from './scenes/TitleScreen';
import Game from './scenes/Game';
import Player from './plugins/PlayerState';
import LoadingScreen from './scenes/Preloader';
import TutorialScreen from './scenes/Tutorial';
import FlipPlugin from 'phaser3-rex-plugins/plugins/flip-plugin.js';
import InputTextPlugin from 'phaser3-rex-plugins/plugins/inputtext-plugin.js';
import TagTextPlugin from 'phaser3-rex-plugins/plugins/tagtext-plugin.js';
import RoundRectanglePlugin from 'phaser3-rex-plugins/plugins/roundrectangle-plugin.js';
import SummoningArea from './scenes/SummoningArea';
import DailyRoullete from './scenes/Roullete';
import Credits from './scenes/Credits';
import CharacterInventory from './scenes/CharacterInventory';
import Marketplace from './scenes/Marketplace';
import Shop from './scenes/Shop';
import Missions from './scenes/Missions';
import Explore from './scenes/Explore';

const config = {
    widht: 800,
    height: 600,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    type: Phaser.AUTO,
    physics: {
        default: "arcade",
        arcade: {
            gravity: {y: 0}
        }
    },
    parent: "phaser-input",
    resolution: 1.5,
    dom: {
        createContainer: true
    }, 
    plugins: {
        global: [
            { key: 'Player', plugin: Player, start: false, mapping: 'player'},
            { key: 'rexFlip', plugin: FlipPlugin, start: true },
            { key: 'rexInputTextPlugin', plugin: InputTextPlugin, start: true },
            { key: 'rexTagTextPlugin', plugin: TagTextPlugin, start: true },
            { key: 'rexRoundRectanglePlugin',plugin: RoundRectanglePlugin,start: true }
        ]
    }
}

const game = new Phaser.Game(config);

game.scene.add("loading", LoadingScreen);
game.scene.add("titlescreen", TitleScreen);
game.scene.add("tutorial", TutorialScreen);
game.scene.add("summoningArea", SummoningArea);
game.scene.add("roullete", DailyRoullete);
game.scene.add("credits", Credits);
game.scene.add("inventory", CharacterInventory);
game.scene.add("marketplace", Marketplace);
game.scene.add("shop", Shop);
game.scene.add("missions", Missions);
game.scene.add("game", Game);
game.scene.add("explore", Explore);

game.scene.start("loading", {nextPage: "titlescreen"});
//game.scene.start("loading", {nextPage: "summoningArea"});
//game.scene.start("loading", {nextPage: "tutorial"});
//game.scene.start("loading", {nextPage: "game"});
//game.scene.start("loading", {nextPage: "roullete"});
//game.scene.start("credits");
//game.scene.start("loading", {nextPage: "inventory"});
//game.scene.start("loading", {nextPage: "marketplace"});
//game.scene.start("loading", {nextPage: "shop"});
//game.scene.start("loading", {nextPage: "missions"});
//game.scene.start("loading", {nextPage: "explore"});
import Phaser from 'phaser';
import TitleScreen from './scenes/TitleScreen';
import Game from './scenes/Game';
import Player from './plugins/PlayerState';
import LoadingScreen from './scenes/Preloader';
import TutorialScreen from './scenes/Tutorial';
import FlipPlugin from 'phaser3-rex-plugins/plugins/flip-plugin.js';
import InputTextPlugin from 'phaser3-rex-plugins/plugins/inputtext-plugin.js';
import TextTypingPlugin from 'phaser3-rex-plugins/plugins/texttyping-plugin.js';

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
    dom: {
        createContainer: true
    }, 
    plugins: {
        global: [
            { key: 'Player', plugin: Player, start: false, mapping: 'player'},
            { key: 'rexFlip', plugin: FlipPlugin, start: true },
            { key: 'rexInputTextPlugin', plugin: InputTextPlugin, start: true },
            { key: 'rexTextTyping', plugin: TextTypingPlugin, start: true }
        ]
    }
}

const game = new Phaser.Game(config);

game.scene.add("loading", LoadingScreen);
game.scene.add("titlescreen", TitleScreen);
game.scene.add("tutorial", TutorialScreen);
game.scene.add("game", Game);

// game.scene.start("loading", {nextPage: "titlescreen"});
game.scene.start("loading", {nextPage: "tutorial"});
//game.scene.start("tutorial");
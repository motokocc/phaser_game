import Phaser from 'phaser';

class DialogPlugin extends Phaser.Plugins.BasePlugin {
    constructor(pluginManager) {
        super(pluginManager); 
        //Global States
        this.displayInfo = {
            id: null,
            name: '',
            address: null,
            drawCount: 0
        }
    }
}

export default DialogPlugin;
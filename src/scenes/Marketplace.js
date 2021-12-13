import 'regenerator-runtime/runtime';
import BaseScene from '../plugins/BaseScene';
import { doc, updateDoc } from "firebase/firestore";

class Marketplace extends BaseScene {

    create(){
        this.gameBg = this.add.image(-2,-7.5,'inventory_bg');
        this.gameBg.setOrigin(0,0);
        this.gameBg.setScale(1.10);

        const gameW = this.game.config.width;
        const gameH = this.game.config.height;
        const paddingX = gameW * 0.025;

        this.generateUpperUI();
        
    }
}

export default Marketplace;
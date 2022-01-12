import 'regenerator-runtime/runtime';
import BaseScene from '../plugins/BaseScene';
import { Mission } from '../js/character_dialogues/missions';

class Missions extends BaseScene {

    create(){
        let test = new Mission(20);
        console.log(test.generateMissions());
    }
}

export default Missions;
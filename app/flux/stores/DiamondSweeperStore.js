import { EventEmitter } from 'events';
import Dispatcher from '../dispatcher/dispatcher';
import FindClosestDiamond from '../../../utilities/findClosestDiamond';

/* A pure function that will return an object with keys which will map the position of diamonds on the grid */
let DiamondPositions = (dimension) => {
      let obj ={};
      let randomNumber = (dimension) => {
        let row = Math.floor(Math.random()*dimension) + 1;
        let column = Math.floor(Math.random()*dimension) + 1;
        return 'r'+row+'_'+'c'+column;
      };

      while(Object.keys(obj).length < dimension ) {
            obj[randomNumber(dimension)]=1;
      }
      return obj;
};

class DiamondSweeperStore extends EventEmitter {
    constructor(){
      super();
      this._dimension=0;
      this._diamondPositions = {};
      this._missedClicks = {};
      this._foundPositions={};
      Dispatcher.register(this.registerCallback.bind(this));
    }

    registerCallback(action) {
        if(action.type == 'DIAMOND_FOUND') {
            this.onDiamondFound(action.payload);
        } else if ( action.type == 'DIAMOND_MISSED') {
            this.onDiamondMissed(action.payload);
        } else if ( action.type == "INIT") {
            this.onInit(action.payload);
        }
    }

    onInit(dimension) {
        this._dimension = parseInt(dimension);
        this._diamondPositions = DiamondPositions(dimension);
        this.emit('STORE_INIT');
    }
    onDiamondFound(position) {
       this._foundPositions[position]=1; 
       if ( Object.keys(this._foundPositions).length == this._dimension ) {
           this.emit('GAME_OVER');
       }
    }

    onDiamondMissed(position) {
       this._missedClicks[position]=1; 
       this.emit('change');
    }

    score() {
        return  (100 - Object.keys(this._missedClicks).length*100/(this._dimension*this._dimension - this._dimension)).toFixed(2);
    }
   
    findClosestDiamond(current_index) {
        let diamondPositionstoBefound = {};
        for ( let pos of Object.keys(this._diamondPositions)) {
            if (! this._foundPositions.hasOwnProperty(pos)) {
                diamondPositionstoBefound[pos]=1;
            }
        }    
        return FindClosestDiamond(current_index, diamondPositionstoBefound);
    }
     
    position() {
        return this._diamondPositions;
    }

}

export default new DiamondSweeperStore()

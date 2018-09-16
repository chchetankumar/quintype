import { EventEmitter } from 'events';
import Dispatcher from '../dispatcher/dispatcher';
import FindClosestDiamond from '../../../utilities/findClosestDiamond';
import  SecureLS  from 'secure-ls';

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

/* The state of the store will also be stored in the local storage. 
If the browser is closed and reopened the application will reconstruct the previous state using the state from the local storage.
The object stored in the local storage will be encrypted using secure-ls */

class DiamondSweeperStore extends EventEmitter {
    constructor(){
      super();
      this._ls = new SecureLS({encodingType: 'aes'});
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
        if(window.localStorage.getItem('diamond-sweeper')) {
            /* If there is a reference to earlier state found in localStorage, extract the state the game continues from that state */
             let diamondObject= JSON.parse(this._ls.get('diamond-sweeper'));
             this._diamondPositions = diamondObject['positions'];
             this._missedClicks = diamondObject['missedClicks'];
             this._foundPositions = diamondObject['foundPositions'];
             this._dimension = diamondObject['dimension'];
         } else {
            /* If there is no prior reference found start a new game and instantiate the localStorage object*/
            this._dimension = dimension;
            this._diamondPositions = DiamondPositions(dimension);
            this._ls.set('diamond-sweeper', JSON.stringify({positions: this._diamondPositions, missedClicks: {}, foundPositions:{}, dimension: dimension }));
         }
        this.emit('STORE_INIT');
    }

    onDiamondFound(position) {
        /* Update the store and localstorage with the position where the diamond was found  */
        this._foundPositions[position]=1; 
        let diamondObject= JSON.parse(this._ls.get('diamond-sweeper'));
        diamondObject['foundPositions']=this._foundPositions;
        this._ls.set('diamond-sweeper', JSON.stringify(diamondObject));
        if ( Object.keys(this._foundPositions).length == this._dimension ) {
            window.localStorage.removeItem('diamond-sweeper');
            this.emit('GAME_OVER');
        }
    }

    touched(index) {
        /* This function will be used to reconstruct the game using the state saved in localStorage */
        if ( this._foundPositions.hasOwnProperty(index)) {
            return true;
        }  else if ( this._missedClicks.hasOwnProperty(index)) {
            return false;
        } else {
            return null;
        }
    }

    checkPosition(index) {
        /* This function is called at every click to validate if a diamond was found or not */
        if ( this._diamondPositions[index]) {
            return true;
        } else {
            return false;
        }
    }

    onDiamondMissed(position) {
        /* Update the store and localstorage with the position where the diamond was missed  */
        this._missedClicks[position]=1; 
        let diamondObject= JSON.parse(this._ls.get('diamond-sweeper'));
        diamondObject['missedClicks']=this._missedClicks;
        this._ls.set('diamond-sweeper', JSON.stringify(diamondObject));
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
}

export default new DiamondSweeperStore()

import React from 'react';
import DiamondSweeperStore from '../flux/stores/DiamondSweeperStore';
import Dispatcher from '../flux/dispatcher/dispatcher';

export default class DiamondSweeperNode extends React.Component {

    constructor(props){
        super(props);
        this.state = { 'showDiamond': null};
        this.node = React.createRef();
    }
    
    clickHandle() {
       /* Clear Out all other hints */
        for ( let dir of ['left','right','up','down'] ) {
            if (document.getElementsByClassName(dir).length > 0 ) {
               document.getElementsByClassName(dir)[0].remove();
            }
        }

        if(this.DiamondPositions[this.props.index]) {
            this.setState( {
                'showDiamond': true
            });
            Dispatcher.dispatch({type: 'DIAMOND_FOUND', payload: this.props.index }); 
        } else {
            this.setState( {
                  'showDiamond': false
            });
            Dispatcher.dispatch({type: 'DIAMOND_MISSED', payload: this.props.index }); 
        }
    }

    render() {
        this.DiamondPositions = DiamondSweeperStore.position();
        let img = <img  src="/assets/question.png" className="thumbnail"></img>;
        if (this.state.showDiamond == true) {
            img = <img  src="/assets/diamond.png" className="thumbnail"></img>
        } else if ( this.state.showDiamond == false) {
            let closestDiamondPosition = DiamondSweeperStore.findClosestDiamond(this.props.index );
            img = <div class={closestDiamondPosition}></div>;
        }
        return (<div className="diamond-sweeper-node" onClick={this.clickHandle.bind(this)} ref={this.node}>
                            { img }
                </div>);
    }
};

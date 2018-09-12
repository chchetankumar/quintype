import React from 'react';
import DiamondPositionsContext from '../DiamondPositionsContext';

export default class DiamondSweeperNode extends React.Component {

    constructor(props){
        super(props);
        this.state = { 'showDiamond': false};
        this.node = React.createRef();
    }

    clickHandle() {
        if(this.DiamondPositions[this.props.index]) {
            this.setState( {
                'showDiamond': true
            });
        }
    }

    render() {
        return (<DiamondPositionsContext.Consumer>
            { ctx=> {
             this.DiamondPositions =ctx;
             return(<div style={{"backgroundColor":"purple", "width":"30px","height":"30px", "border":"solid black 1px", "backgroundImage":"/question.png"}} onClick={this.clickHandle.bind(this)} ref={this.node}> 
                </div>);
            }
            }
            </DiamondPositionsContext.Consumer>);
    }
};

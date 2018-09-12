import React from 'react';
import ReactDOM from 'react-dom';
import DiamondSweeper from './components/DiamondSweeper';
import DiamondSweeperNode from './components/DiamondSweeperNode';
import DiamondPositionsContext from './DiamondPositionsContext';

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

export default class App extends React.Component {

    render() {
        let rows = [];
        for ( let i =1; i<=this.props.dimension; i++) {
            let nodes=[];
            for ( let j=1; j<= this.props.dimension; j++ ) {
                nodes.push(<DiamondSweeperNode index={'r'+i+'_'+'c'+j}> </DiamondSweeperNode>);
            } 
            rows.push(<DiamondSweeper.DiamondSweeperRow number={this.props.dimension} key={'r'+i} index={'r'+i}>
                        {nodes}
                    </DiamondSweeper.DiamondSweeperRow>);
        }
        return(
            <DiamondPositionsContext.Provider value={DiamondPositions(this.props.dimension)}>
                    <DiamondSweeper>
                        {rows}
                    </DiamondSweeper>
            </DiamondPositionsContext.Provider>
        );
    }
}

ReactDOM.render(<App dimension="4"/>, document.getElementById('container'));

import React from 'react';
import ReactDOM from 'react-dom';
import DiamondSweeper from './components/DiamondSweeper';
import DiamondSweeperNode from './components/DiamondSweeperNode';
import DiamondSweeperStore from './flux/stores/DiamondSweeperStore';
import Dispatcher from './flux/dispatcher/dispatcher';


let ScoreCard = ({message}) => <> {message()} </>;

/* The Root App. It takes the dimension as the props and makes a grid with dimension*dimension squares */
class App extends React.Component { 

    constructor(props){
        super(props);
        this.state = { 
                'GameInProgress': undefined
        };
        DiamondSweeperStore.on('STORE_INIT', this.onInit.bind(this));
    }
    componentWillMount() {
        /* Initialise the store */
        Dispatcher.dispatch( { type: 'INIT', payload: this.props.dimension} );
        
        /* Add Event Listener to detect Game is Over */
        DiamondSweeperStore.on('GAME_OVER', this.onGameOver.bind(this));
    }

    onInit(){
        this.setState({'GameInProgress': true});
    }

    onGameOver() {
        this.setState({'GameInProgress': false});
    }

    render() {
        if ( this.state.GameInProgress == true ) {
            /*Generate the Markup for the Game. The Markup will be generated as below
                <DiamondSweeper>
                    <DiamondSweeper.DiamondSweeperRow>
                        <DiamondSweeperNode />
                        <DiamondSweeperNode />
                        { all the nodes}
                    </DiamondSweeper.DiamondSweeperRow>
                    {All the rows}
                </DiamondSweeper>

             */ 
            let dimension = this.props.dimension;
            let rows = [];
            for (let i =1; i<= dimension; i++) {
                let nodes=[];
                for ( let j=1; j<= dimension; j++ ) {
                    nodes.push(<DiamondSweeperNode index={'r'+i+'_'+'c'+j}> </DiamondSweeperNode>);
                } 
                rows.push(<DiamondSweeper.DiamondSweeperRow number={dimension} key={'r'+i} index={'r'+i}>
                        {nodes}
                    </DiamondSweeper.DiamondSweeperRow>);
            }
            return(<DiamondSweeper position={DiamondSweeperStore.position() }>
                        {rows}
                   </DiamondSweeper>)
        } else if (this.state.GameInProgress == false) {
            /* If Game is Over Show the ScoreCard */
            return ( <ScoreCard  
                         message={ () => <div className="gameover"> 
                                              <h1>Congratulations!!!!</h1> Game is successfully completed
                                              <h2>Score : { DiamondSweeperStore.score() } </h2>
                                              <div> 
                                                   <input type="button" className="resume" onClick={ ()=> window.location.reload(true)} value="Try Again" ></input>
                                              </div>
                                         </div> 
                                 }>
               </ScoreCard>)
        } else if (this.state.GameInProgress == undefined) {
            return (<div> Game Loading</div>);
        }
    }
};

/* The dimension prop will control the dimension of grid. It will generate n*n grid if given a dimension of n*/
ReactDOM.render(<App dimension="8"/>, document.getElementById('container'));

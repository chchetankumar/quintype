import React from 'react';

export default class DiamondSweeper extends React.Component {
        constructor(props) {
            super(props);
        }
        static DiamondSweeperRow = ({children}) =>  {
             return <div style={{"display":"flex"}}>{children}</div>;
        };

        render() {
            return (<div style={{"position":"absolute" ,"top":"30px","left":"50px"}}>
                    {this.props.children}
                </div>)
        }
}

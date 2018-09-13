import React from 'react';

export default class DiamondSweeper extends React.Component {
        constructor(props) {
            super(props);
        }
        static DiamondSweeperRow = ({children}) =>  {
             return <div className="diamond-sweeper-row">{children}</div>;
        };

        render() {
            return (<div className="diamond-sweeper">
                    {this.props.children}
                </div>)
        }
}

import React from 'react';
import LeftSquare from './LeftSquare';
import MidSquare from './MidSquare';
import RightSquare from './RightSquare';
import './index.css';

class BackBar extends React.Component {
  render() {
    return (
      <button
        className="back"
        onClick={() => {this.props.onClick()}}>
        {this.props.value}
      </button>
    );
  }
}

class Board extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        output: 'Output: '
      }
    }

    renderLeftSquare(str) {
      return <LeftSquare
                value={str}
                onClick={(i) => this.handleClick(str, i)}/>;
    }
    
    renderMidSquare(str) {
      return <MidSquare
                value={str}
                onClick={(i) => this.handleClick(str, i)}/>;
    }

    renderRightSquare(str) {
      return <RightSquare
                value={str}
                onClick={(i) => this.handleClick(str, i)}/>;
    }

    handleClick(str, i) {
      const output = this.state.output;
      if (this.state.output.length < 168) {
        this.setState({output: output + str[i]})
      }
    }

    handleBack() {
      const output = this.state.output;
      if (this.state.output.length > 8 ) {
        this.setState({output: output.slice(0, -1)});
      }
    }
    render() {
  
      return (
        <div>
          <div className="status">{this.state.output}</div>
          <div>
            {this.renderLeftSquare('ABC')}
            {this.renderMidSquare('DEF')}
            {this.renderRightSquare('GHI')}
          </div>
          <div>
            {this.renderLeftSquare('JKL')}
            {this.renderMidSquare('MNO')}
            {this.renderRightSquare('PQR')}
          </div>
          <div>
            {this.renderLeftSquare('STU')}
            {this.renderMidSquare('VWX')}
            {this.renderRightSquare('YZ_\u200e')}
            
          </div>
          <BackBar
            value='<='
            onClick={() => this.handleBack()}/>
        </div>
      );
    }
}


export default Board;
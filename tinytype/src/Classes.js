import React from 'react';
import LeftSquare from './LeftSquare';
import RightSquare from './RightSquare';
import './index.css';

class SpaceBar extends React.Component {
  render() {
    return (
      <button
        className="space"
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
    
    renderRightSquare(str) {
      return <RightSquare
                value={str}
                onClick={(i) => this.handleClick(str, i)}/>;
    }

    handleClick(str, i) {
      const output = this.state.output;
      this.setState({output: output + str[i]})
    }

    handleBack() {
      const output = this.state.output;
      if (this.state.output.length > 8) {
        this.setState({output: output.slice(0, -1)});
      }
    }
    render() {
  
      return (
        <div>
          <div className="status">{this.state.output}</div>
          <div>
            {this.renderLeftSquare('ABC')}
            {this.renderLeftSquare('DEF')}
            {this.renderRightSquare('GHI')}
          </div>
          <div>
            {this.renderLeftSquare('JKL')}
            {this.renderLeftSquare('MNO')}
            {this.renderRightSquare('PQR')}
          </div>
          <div>
            {this.renderLeftSquare('STU')}
            {this.renderLeftSquare('VWX')}
            {this.renderRightSquare('YZ_')}
            
          </div>
          <SpaceBar
            value='Space'
            onClick={() => this.handleClick(' ', 0)}/>
          <SpaceBar
            value='<='
            onClick={() => this.handleBack()}/>
        </div>
      );
    }
}

class Game extends React.Component {
    render() {
        return (
        <div className="game">
            <div className="game-board">
            <Board />
            </div>
        </div>
        );
    }
}

export default Game;
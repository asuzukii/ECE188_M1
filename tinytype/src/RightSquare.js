import React from 'react';
import './index.css';

class RightSquare extends React.Component {
    state = {
        text: this.props.value
    }
    render() {
      return (
        <div
            className="right-navigation"
            onMouseOver={() => {this.setState({text: this.props.value[2]})}}
            onMouseLeave={() => {this.setState({text: this.props.value})}}>
          <button
            className="square"
            onClick={() => {this.props.onClick(2)}}>
            {this.state.text}
          </button>
          <div className="navigation-content">
            <button
              className="nav-button"
              onClick={() => {this.props.onClick(1)}}>
              {this.props.value[1]}
            </button>
            <button
              className="nav-button"
              onClick={() => {this.props.onClick(0)}}>
              {this.props.value[0]}
            </button>
          </div>
        </div>
        
      );
    }
  }

  export default RightSquare;
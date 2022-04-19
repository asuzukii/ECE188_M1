import React from 'react';
import './index.css';

class MidSquare extends React.Component {
    state = {
        text: this.props.value
    }
    render() {
      return (
        <div
            className="mid-navigation"
            onMouseOver={() => {this.setState({text: this.props.value[1]})}}
            onMouseLeave={() => {this.setState({text: this.props.value})}}>
          <div className="mid-left-navigation-content">
            <button
              className="nav-button"
              onClick={() => {this.props.onClick(0)}}>
              {this.props.value[0]}
            </button>
          </div>
          <button
            className="square"
            onClick={() => {this.props.onClick(1)}}>
            {this.state.text}
          </button>
          <div className="mid-right-navigation-content">
            <button
              className="nav-button"
              onClick={() => {this.props.onClick(2)}}>
              {this.props.value[2]}
            </button>
          </div>
        </div>
        
      );
    }
  }


export default MidSquare;
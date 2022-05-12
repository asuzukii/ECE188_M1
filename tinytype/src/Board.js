import React from 'react';
import LeftSquare from './LeftSquare';
import MidSquare from './MidSquare';
import RightSquare from './RightSquare';
import DollarRecognizer from './Stroke';
import Gesture from './Gesture';
import Point from './Point';
import './index.css';

// some other stuff 
var Grapheme = require('grapheme-splitter');

/* The Backbar for the UI */
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

/* The Switch Button that changes the keys for the UI */
class Switch extends React.Component {
  render() {
    return (
      <button
        className="switch"
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
        output: 'Output: ',
        KeyBoardState: 2,
        isDown: false,
        points: [],
        len: 0
      };
      this._r = null;
      this._g = null;
      this._rc = null;
      this.mouseDownEvent = this.mouseDownEvent.bind(this);
      this.mouseMoveEvent = this.mouseMoveEvent.bind(this);
      this.mouseUpEvent = this.mouseUpEvent.bind(this);
  
    }

    callbackFunction = (childData) => {
      this.setState({message: childData})
    }

    mouseDownEvent(e) {
      // each time the canvas is clicked, new Dollar recognizer is created
      this._r = new DollarRecognizer();
      var canvas = document.getElementById('myCanvas');
      // mostly configs for the brushstroke
			this._g = canvas.getContext('2d');
			this._g.fillStyle = "rgb(0,0,225)";
			this._g.strokeStyle = "rgb(0,0,225)";
			this._g.lineWidth = 3;
			this._g.font = "12px Gentilis";
			this._g.fillStyle = "rgb(255,255,136)";
      // canvas rect dims on page
      this._rc = this.getCanvasRect(canvas); 
      
			document.onselectstart = () => false; // disable drag-select
			document.onmousedown = () => false; // disable drag-select
			if (e.button <= 1) {
				this.setState({isDown: true});
        let x = e.clientX - canvas.offsetLeft;
        let y = e.clientY - canvas.offsetTop;
				if (this.state.len >= 0) {
          this._g.clearRect(0, 0, this._rc.width, this._rc.height);
        }
				this.setState({points: [new Point(x, y)]});
        this.setState({len: 1});
        this._g.beginPath();
			  this._g.moveTo(x, y);
			}
		}

    /* */
    mouseMoveEvent(e) {
			if (this.state.isDown) {
        var canvas = document.getElementById('myCanvas');
        let x = e.clientX - canvas.offsetLeft;
        let y = e.clientY - canvas.offsetTop;
        this.setState(previousState => ({points: [...previousState.points, new Point(x, y)]}));
				this.setState(previousState => ({len: previousState.len + 1}));
        this._g.lineTo(x, y);
			  this._g.stroke();
			}
		}

    mouseUpEvent(e) {
			document.onselectstart = () => true; // enable drag-select
			document.onmousedown = () => true; // enable drag-select
			if (this.state.isDown || e.button === 2) {
        this.setState({isDown: false});
				if (this.state.len >= 10) {
					var result = this._r.Recognize(this.state.points);
          // switch case for the DollarRecognizer outputs -> emoji
          switch (result.Name) {
            case 'frown':
              if (this.state.output.length < 168) {
                this.setState(previousState => ({output: previousState.output + '☹️'}));
              }
              break;
            case 'smile':
                if (this.state.output.length < 168) {
                  this.setState(previousState => ({output: previousState.output + '😊'}));
                }
                break;
            case 'zzz':
              if (this.state.output.length < 168) {
                this.setState(previousState => ({output: previousState.output + '😴'}));
              }
              break;
            case 'cry':
              if (this.state.output.length < 168) {
                this.setState(previousState => ({output: previousState.output + '😭'}));
              }
              break;
            case 'check':
              if (this.state.output.length < 168) {
                this.setState(previousState => ({output: previousState.output + '✅'}));
              }
              break;
            default:
              break;
          }
				}
			}
      this.setState({points: []});
      this.setState({len: 0});
		}

    drawText(str) {
			this._g.fillStyle = "rgb(255,255,136)";
			this._g.fillRect(0, 0, this._rc.width, 15);
			this._g.fillStyle = "rgb(0,0,255)";
			this._g.fillText(str, 1, 14);
		}

    round(n, d) // round 'n' to 'd' decimals
		{
			d = Math.pow(10, d);
			return Math.round(n * d) / d;
		}

    getCanvasRect(canvas) {
			var w = canvas.width;
			var h = canvas.height;

			var cx = canvas.offsetLeft;
			var cy = canvas.offsetTop;
			while (canvas.offsetParent != null)
			{
				canvas = canvas.offsetParent;
				cx += canvas.offsetLeft;
				cy += canvas.offsetTop;
			}
			return {x: cx, y: cy, width: w, height: h};
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
      var splitter = new Grapheme();

      if (splitter.splitGraphemes(this.state.output).length > 8 ) {
        // splits the arr to emoji-considerate chunks
        let new_arr = splitter.splitGraphemes(this.state.output);
        new_arr.pop();
        this.setState({output: new_arr.join('')});
      }
    }

    handleKeyBoard() {
      this.setState({KeyBoardState: this.state.KeyBoardState === 2 ? 0 : this.state.KeyBoardState + 1});
    }

    
    render() {
      switch (this.state.KeyBoardState) {
        case 0:
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
              <div>
                <Switch
                value='Emojis'
                onClick={() => this.handleKeyBoard()}/>
                <BackBar
                value='<='
                onClick={() => this.handleBack()}/>
              </div>
              
            </div>
          );
        case 1:
          return (
            <div id="base">
              <div className="status">{this.state.output}</div>
              <canvas id="myCanvas"
              height={'105px'}
              width={'105px'}
              onMouseDown={(e) => this.mouseDownEvent(e)}
              onMouseMove={(e) => this.mouseMoveEvent(e)}
              onMouseUp={(e) => this.mouseUpEvent(e)}
              />
              <div>
                <Switch
                value='📷'
                onClick={() => this.handleKeyBoard()}/>
                <BackBar
                value='<='
                onClick={() => this.handleBack()}/>
              </div>
            </div>
          );
        case 2:
          return (
            <div>
              <div className="status">{this.state.output}</div>
              <Gesture parentCallback = {this.callbackFunction}
                        value = {this.state.output}/>
              <div>
                <Switch
                value='Aa'
                onClick={() => this.handleKeyBoard()}/>
                <BackBar
                value='<='
                onClick={() => this.handleBack()}/>
              </div>
            </div>
            
          );
        default:
          break;
      }
    }
}


export default Board;


  



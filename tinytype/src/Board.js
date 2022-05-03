import React from 'react';
import LeftSquare from './LeftSquare';
import MidSquare from './MidSquare';
import RightSquare from './RightSquare';
import DollarRecognizer from './Stroke';
import Point from './Point';
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
        emojiState: false,
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
    
    mouseDownEvent(e) {
      this._r = new DollarRecognizer();
      var canvas = document.getElementById('myCanvas');
			this._g = canvas.getContext('2d');
			this._g.fillStyle = "rgb(0,0,225)";
			this._g.strokeStyle = "rgb(0,0,225)";
			this._g.lineWidth = 3;
			this._g.font = "12px Gentilis";
			this._rc = this.getCanvasRect(canvas); // canvas rect on page
			this._g.fillStyle = "rgb(255,255,136)";
      
			document.onselectstart = () => false; // disable drag-select
			document.onmousedown = () => false; // disable drag-select
			if (e.button <= 1) {
				this.setState({isDown: true});
        // let x = e.pageX - canvas.offsetLeft;
        // let y = e.pageY - canvas.offsetTop;
        let x = e.clientX - canvas.offsetLeft;
        let y = e.clientY - canvas.offsetTop;
				if (this.state.len >= 0) {
          this._g.clearRect(0, 0, this._rc.width, this._rc.height);
        }
				this.setState({points: [new Point(x, y)]});
        this.setState({len: 1});
        this._g.beginPath();
			  this._g.moveTo(x, y);
        console.log(this.state.points)
			} else if (e.button === 2) {
			}
		}

    mouseMoveEvent(e) {
			if (this.state.isDown) {
        var canvas = document.getElementById('myCanvas');
        // let x = e.pageX - canvas.offsetLeft;
        // let y = e.pageY - canvas.offsetTop;
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
      console.log(this.state.points);
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
      const output = this.state.output;
      if (this.state.output.length > 8 ) {
        this.setState({output: output.slice(0, -1)});
      }
    }

    handleEmoji() {
      this.setState({emojiState: !this.state.emojiState});
    }

    
    render() {
  
      return this.state.emojiState ? (
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
            onClick={() => this.handleEmoji()}/>
            <BackBar
            value='<='
            onClick={() => this.handleBack()}/>
          </div>
          
        </div>
      ) : (
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
            value='Aa'
            onClick={() => this.handleEmoji()}/>
            <BackBar
            value='<='
            onClick={() => this.handleBack()}/>
          </div>
          
        </div>
      );
    }
}


export default Board;



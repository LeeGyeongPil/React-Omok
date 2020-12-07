import React, { Component } from 'react';
import Cell from './Cell';
import Board from './Board';
import Panel from './Panel';
import {Match} from './Layout';
import cookie from 'react-cookies';

class Game extends Component {
	constructor(props) {
		super(props);
		this.state = {
			load : false,
			game : 'no',
			turn : '',
			color : '',
			user : {},
			matchPlayer : {
				name : '',
				win : 0,
				lose : 0,
			},
			layout : {
				match : false,
				result : false,
			}
		};
		this.panel = React.createRef();
		this.cellref = JSON.parse(JSON.stringify(Array(362).fill(React.createRef())));
	}

	componentDidMount = () => {
		this.props.socket.emit('Check User', { id : cookie.load('userid') || null, name :cookie.load('username') || null });
		this.props.socket.on('Get User', (obj) => {
			this.setState({
				user : obj.user
			});
			cookie.save('userid', obj.user.id,{path:'/'});
			cookie.save('username', obj.user.name,{path:'/'});
			this.setState({
				load : true,
			});
		});
		this.props.socket.on('Match Game', (obj) => {
			this.setState({
				matchPlayer : {
					name : obj.matchPlayer.name,
					win : parseInt(obj.matchPlayer.win),
					lose : parseInt(obj.matchPlayer.lose),
				}
			});
			this.setState({
				layout : {
					match : true,
					result : false,
				}
			});
			document.getElementById('game-layout-wrap').className = 'active';
		});
		this.props.socket.on('Match Cancel', (obj) => {
			this.props.socket.emit('Match Accept Cancel',{ });
			this.setState({
				matchPlayer : {
					name : '',
					win : 0,
					lose : 0,
				},
				layout : {
					match : false,
					result : false,
				}
			});
			document.getElementById('game-layout-wrap').className = '';
		});
		this.props.socket.on('Game Start', (obj) => {
			this.panel.current.play(obj.color);
			this.setState({
				turn : 'B',
				color : obj.color,
				layout : {
					match : false,
					result : false,
				}
			});
			if (obj.color === 'B') {
				document.getElementById('game-wrap').className = 'turn';
			}
			document.getElementById('game-layout-wrap').className = '';
		});
		this.props.socket.on('Draw Cell', (obj) => {
			const index = parseInt(obj.x) + (19 * (parseInt(obj.y) - 1));
			this.cellref[index].current.chState({ color : obj.color });
		});
		this.props.socket.on('My Turn Alert', (obj) => {
			this.setState({
				turn : this.state.color
			});
			document.getElementById('game-wrap').className = 'turn';
		});
		this.props.socket.on('My Turn End', (obj) => {
			if (this.state.color === 'B') {
				this.setState({
					turn : 'W'
				});
			} else {
				this.setState({
					turn : 'B'
				});
			}
			document.getElementById('game-wrap').className = '';
		});
		this.props.socket.on('Game Victory', (obj) => {
			alert('you win');
			this.panel.current.end();
			document.getElementById('game-wrap').className = '';
		});
		this.props.socket.on('Game Lose', (obj) => {
			alert('you lose');
			this.panel.current.end();
			document.getElementById('game-wrap').className = '';
		});
		this.props.socket.on('Disconnect Match Player', (obj) => {
			alert('you win\n(Disconnect Player)');
			this.panel.current.end();
			document.getElementById('game-wrap').className = '';
		});
		this.props.socket.on('Exit Match Player', (obj) => {
			alert('you win\n(Exit Player)');
			this.panel.current.end();
			document.getElementById('game-wrap').className = '';
		});
		this.props.socket.on('Receive Message', (obj) => {
			this.panel.current.msg(obj);
		});
	}

	chState = (ch) => {
		this.setState(ch);
	}

	matchAccept = () => {
		this.props.socket.emit('Match Accept', { });
	}

	matchDecline = () => {
		this.panel.current.decline();
		this.props.socket.emit('Match Cancel', { });
		this.setState({
			matchPlayer : {
				name : '',
				win : 0,
				lose : 0,
			},
			layout : {
				match : false,
				result : false,
			}
		});
		document.getElementById('game-layout-wrap').className = '';
	}

	msgSend = (msg) => {
		this.props.socket.emit('Send Message', { msg : msg });
	}

	cellClick = (x,y) => {
		if (this.state.game === 'play' && this.state.color === this.state.turn) {
			this.props.socket.emit('Click Cell', { color : this.state.color, x : x, y : y});
		}
	}

	render() {
		const cells = [];
		for (var y = 1;y < 20;y++) {
			for (var x = 1;x < 20;x++) {
				const index = x + (19 * (y - 1));
				cells.push([x,y,index]);
			}
		}
		return (
			<div id="root-wrap">
				{this.state.load && 
				<div id="game-wrap">
					<div id="game-board-wrap">
						<Board />
						{this.state.game === 'play' &&
						<div className="game-board-cell-wrap">
							{cells.map(item => 
								<Cell pX={item[0]} pY={item[1]} key={item[2]} ref={this.cellref[item[2]]} cellClick={this.cellClick} />
							)}
						</div>
						}
					</div>
					<Panel socket={this.props.socket} state={this.state} setState={this.chState} ref={this.panel} msgSend={this.msgSend} />
					<div id="game-layout-wrap">
						<div className="game-layout-popup">
							{this.state.layout.match && 
								<Match matchPlayer={this.state.matchPlayer} matchAccept={this.matchAccept} matchDecline={this.matchDecline} />
							}
						</div>
					</div>
				</div>
				}
			</div>
		);
	}
}

export default Game;
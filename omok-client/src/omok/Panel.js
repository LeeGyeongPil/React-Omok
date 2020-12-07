import React, { Component } from 'react';

class Panel extends Component {
	constructor(props) {
		super(props);
		this.state = {
			btnText : 'New Game',
			color : ''
		}
	}

	// New Game Click
	action = () => {
		if (this.props.state.game === 'no') {
			this.props.socket.emit('New Game', { });
			this.setState({ btnText : 'Searching...'});
			this.props.setState({ game : 'search' });
		} else if (this.props.state.game === 'search') {
			this.props.socket.emit('Search Cancel', { });
			this.setState({ btnText : 'New Game' });
			this.props.setState({ game : 'no' });
		} else if (this.props.state.game === 'play') {
			if (window.confirm('?')) {
				this.props.socket.emit('Exit Game', { });
				this.setState({ btnText : 'New Game', color : '' });
			}
		}
	}

	// Decline Click
	decline = () => {
		this.props.socket.emit('Search Cancel', { });
		this.setState({ btnText : 'New Game' });
		this.props.setState({ game : 'no' });
	}

	play = (color) => {
		this.setState({ btnText : 'Exit Game', color : color });
		this.props.setState({ game : 'play' });
	}

	end = () => {
		this.setState({ btnText : 'New Game' });
		this.props.setState({ game : 'no' });
	}

	msgBox = (e) => {
		if (e.key === 'Enter') {
			this.msgSend();
		}
	}

	msgSend = () => {
		if (document.getElementsByClassName('msg-text-box')[0].value) {
			if (this.props.state.game === 'play') {
				this.props.msgSend(document.getElementsByClassName('msg-text-box')[0].value);
				document.getElementsByClassName('msg-text-box')[0].value = '';
			}
		}
	}

	msg = (obj) => {
		this.createMsg(obj);
	}
	createMsg = (obj) => {
		var rowCls = '';
		if (obj.name === 'System') rowCls = 'alert';
		var msgclone = document.createElement('div');
		msgclone.innerHTML = "<div class='talk-row " + rowCls + "'><label class='talk-name'>" + obj.name + " : </label><span class='talk-msg'>" + obj.msg + "</span></div>";
		document.getElementsByClassName('talk-msg-box')[0].appendChild(msgclone.children[0]);
		document.getElementsByClassName('talk-msg-box')[0].scrollTop = document.getElementsByClassName('talk-msg-box')[0].scrollHeight;
	}

	render() {
		return (
			<div id="game-panel-wrap">
				<div className="profile-wrap">
					<div className="profile-name">{this.props.state.user.name}</div>
					<span className="game-action-btn" onClick={this.action}>{this.state.btnText}</span>
				</div>
				<div className="chat-wrap">
					<div className="talk-msg-box"></div>
					<div className="talk-input">
						<input type="text" className="msg-text-box" onKeyUp={this.msgBox} />
						<span className="talk-send-btn" onClick={this.msgSend} >Send</span>
					</div>
				</div>
			</div>
		);
	}
}

export default Panel;
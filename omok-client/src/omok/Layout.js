import React, { Component } from 'react';

export class Match extends Component {
	constructor(props) {
		super(props);
		this.state = {
			accept : ''
		};
	}

	matchAccept = () => {
		this.setState({ accept : ' active' });
		this.props.matchAccept();
	}

	matchDecline = () => {
		this.props.matchDecline();
	}

	render() {
		return (
			<div id="game-match-wrap">
				<div className="game-match-popup">
					<div className="layout-title">Match Game</div>
					<div className="layout-contents">
						<label className="layout-label">Match Player : </label>
						<span className="layout-label-context">&nbsp;{this.props.matchPlayer.name}</span>
						<label className="layout-label">Total : </label>
						<span className="layout-label-context"><label>&nbsp;Win : {this.props.matchPlayer.win}</label>&nbsp;&nbsp;<label>Lose : {this.props.matchPlayer.lose}</label></span>
						<div className={"layout-btn accept" + this.state.accept} onClick={this.matchAccept}>Accept</div>
						<div className="layout-btn decline" onClick={this.matchDecline}>Decline</div>
					</div>
				</div>
			</div>
		);
	}
}
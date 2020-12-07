import React, { Component } from 'react';

class Cell extends Component {
	constructor(props) {
		super(props);
		this.state = {
			'color' : ''
		};
	}

	chState = (ch) => {
			this.setState(ch);
	}

	cellClick = () => {
		this.props.cellClick(this.props.pX,this.props.pY);
	}

	render() {
		var classNames = "game-board-cell ";
		if (this.state.color === 'B') {
			classNames += 'black';
		} else if (this.state.color === 'W') {
			classNames += 'white';
		}
		return (
			<div className={classNames} onClick={this.cellClick}></div>
		);
	}
}

export default Cell;
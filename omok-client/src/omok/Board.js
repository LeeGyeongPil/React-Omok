import React, { Component } from 'react';

class Board extends Component {
	render() {
		const boardComponent = () => {
			const squares = [];
			for (var y = 1;y < 19;y++) {
				for (var x = 1;x < 19;x++) {
					squares.push(<div className="game-board-square" key={x + '-' + y + 's'} ></div>);
					if (x % 6 === 3 && y % 6 === 4) {
						squares.push(<div className="game-board-round" key={x + '-' + y + 'r'} ></div>);
					}
				}
			}
			return squares;
		};
		return (
			<div className="game-board">
				{boardComponent()}
			</div>
		);
	}
}

export default Board;
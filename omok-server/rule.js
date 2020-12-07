module.exports = class Rule {
	constructor() {
		this.data = new Map();
	}

	// Game Rule Initialize
	init = (matchPlayer1, matchPlayer2) => {
		const cellcolor = ['B','W'];
		var c1 = cellcolor[Math.floor(Math.random() * 2)];
		if (c1 == 'B') {
			var c2 = 'W';
		} else {
			var c2 = 'B';
		}
		this.data.set(matchPlayer1.matchId, {
			turn : 'B',
			state : 'Play',
			player1 : matchPlayer1.sid,
			player1_id : matchPlayer1.id,
			player1_color : c1,
			player2 : matchPlayer2.sid,
			player2_id : matchPlayer2.id,
			player2_color : c2,
			cell : [
				JSON.parse(JSON.stringify(Array(19).fill(Array(19).fill(''))))
			]
		});
		return this.data.get(matchPlayer1.matchId);
	}

	// Game End
	end = (key) => {
		this.data.delete(key);
	}

	// Game Board Cell Set
	set = (key, color, x, y) => {
		const datas = this.data.get(key);
		if (datas.cell[0][parseInt(y)][parseInt(x)]) {
			return false;
		}
		datas.cell[0][parseInt(y)][parseInt(x)] = color;
		this.data.set(key, datas);
		return true;
	}

	// Game Cell Check
	check = (key, color, x, y) => {
		const game = this.data.get(key);
		var result = false;
		game.cell[0].forEach((row,y) => {
			row.forEach((cell,x) => {
				if (game.cell[0][y][x] === color) {
					// Horizontal check
					if (x > 3) {
						if (game.cell[0][y][x-4] === color && game.cell[0][y][x-3] === color && game.cell[0][y][x-2] === color && game.cell[0][y][x-1] === color) {
							result = true;
						}
					}
					if (x < 15) {
						if (game.cell[0][y][x+4] === color && game.cell[0][y][x+3] === color && game.cell[0][y][x+2] === color && game.cell[0][y][x+1] === color) {
							result = true;
						}
					}
					// Vertical check
					if (y > 3) {
						if (game.cell[0][y-4][x] === color && game.cell[0][y-3][x] === color && game.cell[0][y-2][x] === color && game.cell[0][y-1][x] === color) {
							result = true;
						}
					}
					if (y < 15) {
						if (game.cell[0][y+4][x] === color && game.cell[0][y+3][x] === color && game.cell[0][y+2][x] === color && game.cell[0][y+1][x] === color) {
							result = true;
						}
					}
					// Diagonal check
					if (x > 3 && y > 3) {
						if (game.cell[0][y-4][x-4] === color && game.cell[0][y-3][x-3] === color && game.cell[0][y-2][x-2] === color && game.cell[0][y-1][x-1] === color) {
							result = true;
						}
					}
					if (x > 3 && y < 15) {
						if (game.cell[0][y+4][x-4] === color && game.cell[0][y+3][x-3] === color && game.cell[0][y+2][x-2] === color && game.cell[0][y+1][x-1] === color) {
							result = true;
						}
					}
					if (x < 15 && y > 3) {
						if (game.cell[0][y-4][x+4] === color && game.cell[0][y-3][x+3] === color && game.cell[0][y-2][x+2] === color && game.cell[0][y-1][x+1] === color) {
							result = true;
						}
					}
					if (x < 15 && y < 15) {
						if (game.cell[0][y+4][x+4] === color && game.cell[0][y+3][x+3] === color && game.cell[0][y+2][x+2] === color && game.cell[0][y+1][x+1] === color) {
							result = true;
						}
					}
				}
			});
		});
		return result;
	}

	// Return Game Rule
	get = (key) => {
		return this.data.get(key);
	}
}
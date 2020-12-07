const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server, { cors: { origin: '*', } });
const Rule = require('./rule');
const User = require('./user');

var rule = new Rule();
var user = new User();
var gameQueue = [];
var gameList = [];

const cellcolor = ['B','W'];

// Server Connection
io.sockets.on('connection', (socket) => {
	console.log('[' + socket.id + '] : Connection');
	socket.on('Check User', (obj) => {
		const callUser = user.init(socket.id, obj.id, obj.name);
		io.to(socket.id).emit('Get User', { user : { id : callUser.id, name : callUser.name }});
	});

	// Game Search
	socket.on('New Game',(obj) => {
		console.log('[' + socket.id + '] : New Game');
		const callUser= user.get(socket.id);
		gameQueue.push(socket.id);
	});

	// Game Search Cancel
	socket.on('Search Cancel', (obj) => {
		console.log('[' + socket.id + '] : Search Cancel');
		gameQueue.forEach((v,i) => {
			if (v === socket.id) {
				delete gameQueue[i];
				gameQueue = gameQueue.filter(() => {return true;});
				return true;
			}
		});
	});

	// Game Match Cancel
	socket.on('Match Cancel', (obj) => {
		console.log('[' + socket.id + '] : Match Cancel');
		const callUser= user.get(socket.id);
		io.to(callUser.matchPlayer).emit('Match Cancel');
		gameQueue.push(callUser.matchPlayer);
		user.match(socket.id, '', '');
	});

	// Game Match Accept
	socket.on('Match Accept', (obj) => {
		const callUser = user.get(socket.id);
		console.log('[' + socket.id + '] : Match Accept [' + callUser.matchId + ']');
		socket.join(callUser.matchId);
		if (io.sockets.adapter.rooms.get(callUser.matchId).size === 2) {
			const matchPlayer = user.get(callUser.matchPlayer);
			const rules = rule.init(matchPlayer, callUser);
			io.to(rules.player1).emit('Game Start',{ color : rules.player1_color });
			io.to(rules.player2).emit('Game Start',{ color : rules.player2_color });
		}
	});
	// Click Cell
	socket.on('Click Cell', (obj) => {
		const callUser = user.get(socket.id);
		const rules = rule.get(callUser.matchId);
		var currentPlayer = '';
		var nextPlayer = '';
		if (rules.player1 === socket.id && rules.player1_color === obj.color) {
			currentPlayer = rules.player1;
			nextPlayer = rules.player2;
		} else if (rules.player2 === socket.id && rules.player2_color === obj.color) {
			currentPlayer = rules.player2;
			nextPlayer = rules.player1;
		}
		if (currentPlayer && nextPlayer) {
			if (rule.set(callUser.matchId, obj.color, obj.x, obj.y)) {
				// Success
				console.log('[' + socket.id + '] : Click Cell ' + obj.color + ' [' + obj.x + ',' + obj.y + ']');
				io.to(callUser.matchId).emit('Draw Cell', { color : obj.color, x : obj.x, y : obj.y });

				// Win Check
				if (rule.check(callUser.matchId, obj.color, obj.x, obj.y)) {
					// Win Current Player
					io.to(currentPlayer).emit('Game Victory', {});
					io.to(nextPlayer).emit('Game Lose', {});
					user.win(currentPlayer);
					user.lose(nextPlayer);
					rule.end(callUser.matchId);
				} else {
					// Next Turn
					io.to(currentPlayer).emit('My Turn End', {});
					io.to(nextPlayer).emit('My Turn Alert', {});
				}
			} else {
				// Fail (Already Set Cell)
				console.log('[' + socket.id + '] : Click Cell Already Set Cell [' + obj.x + ',' + obj.y + ']');
			}
		}
	});

	// Game Match Accept Cancel
	socket.on('Match Accept Cancel', (obj) => {
		const callUser = user.get(socket.id);
		console.log('[' + socket.id + '] : Match Accept Cancel [' + callUser.matchId + ']');
		socket.leave(callUser.matchId);
		user.match(socket.id, '', '');
	});

	// Exit Game
	socket.on('Exit Game', (obj) => {
		console.log('[' + socket.id + '] : Exit Game');
		const callUser = user.get(socket.id);
		io.to(callUser.matchPlayer).emit('Exit Match Player', {});
		user.win(callUser.matchPlayer);
		user.lose(socket.id);
		rule.end(callUser.matchId);
	});

	socket.on('forceDisconnect',() => {
		socket.disconnect();
	});
	socket.on('disconnect', (reason) => {
		console.log('[' + socket.id + '] : Disconnect');
		// Check GameQueue
		const callUser = user.get(socket.id);
		gameQueue.forEach((v,i) => {
			if (v === socket.id) {
				delete gameQueue[i];
				gameQueue = gameQueue.filter(() => {return true;});
				return true;
			}
		});

		// Check PlayGame
		if (callUser && callUser.matchId) {
			io.to(callUser.matchPlayer).emit('Disconnect Match Player', {});
			user.win(callUser.matchPlayer);
			user.lose(socket.id);
			rule.end(callUser.matchId);
		}
	});
	socket.on('Send Message', (obj) => {
		const callUser = user.get(socket.id);
		io.to(callUser.matchId).emit('Receive Message',{ msg : obj.msg, name : callUser.name });
	});
});

// Game Queue Checking
setInterval(() => {
	if (gameQueue.length > 1) {
		const player1 = gameQueue.shift();
		const player2 = gameQueue.shift();
		const player1Info = user.get(player1);
		const player2Info = user.get(player2);
		const matchId = 'game' + (Math.random() * new Date().getTime());
		// Match Player Info Send
		user.match(player1, matchId, player2);
		user.match(player2, matchId, player1);
		io.to(player1).emit('Match Game', { matchPlayer : { name : player1Info.name, win : player1Info.win, lose : player1Info.lose }});
		io.to(player2).emit('Match Game', { matchPlayer : { name : player2Info.name, win : player2Info.win, lose : player2Info.lose }});
		console.log('<< MatchGame [' + matchId + '] >>');
	}
},1000);

// Server Open ( Port : 3001 )
server.listen(3001, 
	function(){
		console.log('Server Running...');
	}
);
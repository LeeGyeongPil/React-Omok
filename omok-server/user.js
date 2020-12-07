module.exports = class User {
	constructor() {
		this.data = new Map();
	}

	// User Initialize
	init = (socketid, id, name) => {
		if (this.data.has(id)) {
			const checkid = this.data.get(id);
			const checkdata = this.data.get(checkid.sid);
			if (checkid.sid === checkdata.sid && checkdata.sid === socketid) {
				return checkdata;
			} else {
				this.data.delete(checkid.sid);
				this.data.set(id, {
					sid : socketid
				});
				this.data.set(socketid, {
					matchId : '',
					matchPlayer : '',
					sid : socketid,
					id : id,
					name : name,
					win : 0,
					lose : 0
				});
				return this.data.get(socketid);
			}
		} else {
			const id = 'user' + (Math.random() * new Date().getTime());
			this.data.set(id, {
				sid : socketid
			});
			this.data.set(socketid, {
				matchId : '',
				matchPlayer : '',
				sid : socketid,
				id : id,
				name : 'Guest' + parseInt(Math.random() * new Date().getTime()),
				win : 0,
				lose : 0
			});
			return this.data.get(socketid);
		}
	}

	setName = (socketid, name) => {
		if (this.data.has(socketid)) {
			const datas = this.data.get(socketid);
			datas.name = name;
			this.data.set(socketid, datas);
			return true;
		} else {
			return false;
		}
	}

	match = (socketid, matchId, matchPlayer) => {
		if (this.data.has(socketid)) {
			const datas = this.data.get(socketid);
			datas.matchId = matchId;
			datas.matchPlayer = matchPlayer;
			this.data.set(socketid, datas);
			return true;
		} else {
			return false;
		}
	}

	win = (socketid) => {
		if (this.data.has(socketid)) {
			const datas = this.data.get(socketid);
			datas.win = parseInt(datas.win) + 1;
			this.data.set(socketid, datas);
			return true;
		} else {
			return false;
		}
	}

	lose = (socketid) => {
		if (this.data.has(socketid)) {
			const datas = this.data.get(socketid);
			datas.lose = parseInt(datas.lose) + 1;
			this.data.set(socketid, datas);
			return true;
		} else {
			return false;
		}
	}

	get = (socketid) => {
		return this.data.get(socketid);
	}
}
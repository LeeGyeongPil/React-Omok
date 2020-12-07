module.exports = class User {
	constructor(cookie) {
		this.info = {
			id : cookie.load('userid') || btoa('session' + (Math.random() * new Date().getTime())),
			name : cookie.load('username') || 'Guest' + parseInt(Math.random() * new Date().getTime()),
			win : 0,
			lose : 0
		};
		cookie.save('userid', this.info.id,{path:'/'});
		cookie.save('username', this.info.name,{path:'/'});
	}

	get = () => {
		return this.info;
	}
}
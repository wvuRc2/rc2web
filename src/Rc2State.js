export class Rc2State {
	constructor() {
		console.log("Rc2State going");
		this.loggedIn = false;
		this.user = {};
		this.login = "mlilback";
	}
	
	getLogin() { return this.login; }
}


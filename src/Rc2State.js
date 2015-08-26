import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';

class rc2stateClass {
	constructor() {
		console.log("Rc2State going");
		this.loggedIn = false;
		this.user = {};
		this.login = "";
		this.userId = 0;
		this.http = new HttpClient();
		this.headers = {'Accept': 'application/json', 'Content-Type': 'application/json',
			'Access-Control-Allow-Credentials': 'true'};
		this.http.configure(config => {
			config.useStandardConfiguration()
				.withBaseUrl("/api");
		});
	}
	
	getLogin() { return this.login; }

	attemptLogin(theLogin, thePassword) {
		let me = Rc2State;
		let body = JSON.stringify({login:theLogin, password:thePassword})
		var promise = new Promise( function(resolve, reject) {
			me.http.fetch("/login", {	method: 'post', 
									headers:me.headers,
									credentials: 'include',
									body: body})
			.then(res => {
				if (res.status === 200) {
					res.json().then(objs => {
						me.loggedInWithJson(objs)
						resolve(objs)
					});
				}
			})
			.catch(err => { reject(err); });
		});
		return promise;
	}
	
	loggedInWithJson(json) {
		let me = Rc2State;
		let me.loginToken = json.token;
		me.headers['RC2-Auth'] = json.token;
		console.log("token=" + me.loginToken);
		let d = json.user;
		me.loggedIn = true;
		me.userId = d["id"];
		for (let aProp of ['login','firstName','lastName','email',]) {
			me[aProp] = d[aProp];
		}
		//need to parse workspace/file information
	}
}

let Rc2State = new rc2stateClass();
export default Rc2State;

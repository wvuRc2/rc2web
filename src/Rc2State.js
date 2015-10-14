import {inject, Aurelia} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
import 'fetch';

@inject(Aurelia)
class rc2stateClass {
	constructor(aurelia) {
		this.aurelia = aurelia
		this.loggedIn = false;
		this.user = {};
		this.login = "";
		this.userId = 0;
		this.http = new HttpClient();
		this.headers = new Map();
		this.headers.set("Accept", "application/json");
		this.headers.set("Content-Type", "application/json");
		this.headers.set('Access-Control-Allow-Credentials', 'true');
		this.http.configure(config => {
			config
				.withBaseUrl("/api")
				.withDefaults({
					credientals: 'same-origin',
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json',
						'Access-Control-Allow-Credentials': 'true'
					}
				});
		});
	}
	
	verifyLogin() {
		let me = Rc2State;
		let myHeaders = JSON.parse(JSON.stringify(me.headers));
		let auth = window.localStorage.getItem("lastAuthToken");
		if (auth == null || typeof auth === 'undefined') {
			return new Promise(function(resolve,reject) {
				reject(new RemoteError("unauthorized", 401));
			});
		}
		myHeaders["RC2-Auth"] = auth;
		var promise = new Promise(function(resolve, reject) {
			me.http.fetch("/login", {	method: 'get', 
									headers:myHeaders,
									credentials: 'include',
									})
			.then(res => {
				if (res.status === 200) {
					res.json().then(objs => {
						me.loggedInWithJson(objs)
						resolve(objs)
						me.aurelia.setRoot('app')
					});
				} else {
					reject(new RemoteError("unauthorized", res.status));
				}
			})
			.catch(err => { reject(err); });
		});
		return promise;
	}
	
	attemptLogin(theLogin, thePassword) {
		let me = Rc2State;
		let body = JSON.stringify({login:theLogin, password:thePassword})
		var promise = new Promise(function(resolve, reject) {
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
				} else {
					reject(new RemoteError("unauthorized", res.status));
				}
			})
			.catch(err => { reject(err); });
		});
		return promise;
	}
	
	loggedInWithJson(json) {
		let me = Rc2State;
		me.loginToken = json.token;
		me.headers.set('RC2-Auth', json.token);
		let d = json.user;
		me.loggedIn = true;
		me.userId = d["id"];
		for (let aProp of ['login','firstName','lastName','email',]) {
			me[aProp] = d[aProp];
		}
		//need to parse workspace/file information
		var wspaces = [];
		for (let aWspace of json.workspaces) {
			wspaces.push(new Workspace(aWspace));
		}
		this.workspaces = wspaces;
		
		window.localStorage.setItem("lastAuthToken", json.token);
		//adjust our http config to include the auth header
		this.http.configure(config => {
			config
				.withBaseUrl("/api")
				.withDefaults({
					credientals: 'same-origin',
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json',
						'Access-Control-Allow-Credentials': 'true',
						'RC2-Auth': me.loginToken
					}
				});
		});
	}
	
	logout() {
		window.localStorage.removeItem("lastAuthToken");
	}
	
	uploadFile(file, wspace, complete, progress) {
		var data = new FormData();
		data.append("file", file);
		var xhr = new XMLHttpRequest();
		xhr.open('POST', `/api/workspaces/${wspace.id}/files/upload`, true);
		xhr.onload = e => { 
			console.log("upload complete");
			if (xhr.status == 201) {
				complete(xhr);
				var file = new File(JSON.parse(xhr.responseText));
				wspace.files.push(file);
			}
		};
		xhr.addEventListener("progress", progress);
		xhr.setRequestHeader('RC2-Auth', this.loginToken);
		xhr.send(data);
	}
}

let Rc2State = new rc2stateClass();
export default Rc2State;

export class RemoteError extends TypeError {
	constructor(message, status) {
		super(message);
		this.status = status;
	}
}

export class File {
	constructor(jsonObj) {
		this.lastModified = new Date(0);
		this.lastModified.setSeconds(jsonObj["lastModified"]/1000);
		this.id = jsonObj["id"];
		this.version = jsonObj["version"];
		this.name = jsonObj["name"];
		this.fileSize = jsonObj["fileSize"];
	}
};

export class Workspace {
	constructor(jsonObj) {
		this.id = jsonObj["id"];
		this.version = jsonObj["version"];
		this.name = jsonObj["name"];
		this.userId = jsonObj["userId"];
		var files = [];
		for (let aFile of jsonObj["files"]) {
			files.push(new File(aFile));
		}
		this.files = files;
	}
}

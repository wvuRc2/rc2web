import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import Rc2State from 'Rc2State';
import {HttpClient} from 'aurelia-fetch-client';
import 'fetch';
import $ from 'jquery';

@inject(HttpClient, Rc2State, Router)
export class login {
	constructor(http, state, aRouter) {
		this.state = state;
		this.http = http;
		this.theRouter = aRouter;
		this.heading = "Hello, World";
		this.email = "";
		this.password = "";
		this.login = 'test';
		console.log("made Login object");
		this.headers = {'Accept': 'application/json', 'Content-Type': 'application/json',
			'Access-Control-Allow-Credentials': 'true'};


		http.configure(config => {
			config.useStandardConfiguration()
				.withBaseUrl("/api");
		});
	}

	handleLogin() {
		this.noLongerBusy();
		this.theRouter.navigate("wspaces");
	}
	
	handleLoginError(error) {
		//for some reason, we are getting called even when no error happens
		if (typeof error === 'undefined')
			return;
		this.noLongerBusy();
	}
	
	noLongerBusy() {
		$('nav-bar').show();
		$(".loading").remove()
	}
	
	activate() {
		console.log("activate()");
/*		return this.http.fetch("/login", {headers:this.headers, credentials: 'include'})
			.then(res => {
				console.log("lcheck good");
				//this means res.json() contains is parsed json
				//should send them to another page
				})
			.catch(function(err) {
				console.log("lcheck bad");
				//they aren't logged in. show login form
			})
*/	}
	
	doLogin() {
		let me = this;
		document.body.innerHTML += '<div class="loading">loading &#8230;</div>';
		$("nav-bar").hide();
		this.state.attemptLogin(me.login, me.password)
			.then(rsp => { 
				me.handleLogin(); 
			})
			.catch( err => { 
				me.handleLoginError(err); 
			});
	}
}

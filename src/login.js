import {inject} from 'aurelia-framework';
import {Rc2State} from 'Rc2State';
import {HttpClient} from 'aurelia-fetch-client';
import 'fetch';
import $ from 'jquery';

@inject(HttpClient)
@inject(Rc2State)
export class login {
	constructor(http, state) {
		console.log("login js going");
		this.state = state;
		this.http = http;
		this.heading = "Hello, World";
		this.email = "";
		this.passsword = "";
		console.log("made Login object");


		http.configure(config => {
			config.useStandardConfiguration()
				.withBaseUrl("/api");
		});
	}
	
	activate() {
		console.log("activate()");
		return this.http.fetch("/login")
			.then(res => {
				//this means res.json() contains is parsed json
				//should send them to another page
				})
			.catch(function(err) {
				//they aren't logged in. show login form
			})
	}
	
	doLogin() {
		console.log("got " + this.password + " for " + this.email);
		document.body.innerHTML += '<div class="loading">loading &#8230;</div>';
		$("nav-bar").hide();
		setTimeout(function() {
			console.log("trying to remove loading div");
			$('nav-bar').show();
			$(".loading").remove()
		}, 1200);
	}
}



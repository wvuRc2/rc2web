import {inject, Aurelia} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import Rc2State from 'Rc2State';
import {HttpClient} from 'aurelia-fetch-client';
import 'fetch';
import $ from 'jquery';

// Extended disable function so we can disable buttons
$.fn.extend({
    disable: function(state) {
        return this.each(function() {
            var $this = $(this);
            if($this.is('input, button'))
              this.disabled = state;
            else
              $this.toggleClass('disabled', state);
        });
    }
});


@inject(HttpClient, Rc2State, Router, Aurelia)
export class login {
	constructor(http, state, aRouter, aurelia, eventAgg) {
		this.state = state;
		this.http = http;
		this.theRouter = aRouter;
		this.password = "";
		this.login = 'test';
		this.errorMessage = "";
		this.hadError = false;
		this.aurelia = aurelia;

		http.configure(config => {
			config.useStandardConfiguration()
				.withBaseUrl("/api");
		});
	}

	handleLogin() {
		this.noLongerBusy();
		this.aurelia.setRoot('app');
		this.theRouter.navigate("wspaces");
	}
	
	handleLoginError(error) {
		//for some reason, we are getting called even when no error happens
		if (typeof error === 'undefined')
			return;
		this.errorMessage = error.message;
		this.hadError = true;
		this.noLongerBusy();
	}
	
	noLongerBusy() {
		$('nav-bar').show();
		$(".loading").remove()
		$('input, button, a').disable(false);
	}
	
	activate() {
		console.log("activate()");
		return this.state.verifyLogin()
			.then(res => {
				console.log("lcheck good");
				//this means res.json() contains is parsed json
				//should send them to another page
				this.aurelia.setRoot('app');
				this.theRouter.navigate("wspaces")
				})
			.catch(function(err) {
				console.log("lcheck bad");
				//they aren't logged in. show login form
			})
	}
	
	doLogin() {
		let me = this;
		this.errorMessage = "";
		this.hadError = false;
		$('input, button, a').disable(true);
		return this.state.attemptLogin(this.login, this.password).then(rsp => {
			me.handleLogin();
		})
		.catch(err => {
			me.handleLoginError(err);
		});
	}
}

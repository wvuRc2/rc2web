import {inject, Aurelia} from 'aurelia-framework';
import Rc2State from 'Rc2State';
import {Router} from 'aurelia-router';

@inject(Rc2State, Aurelia, Router)
export class logout {
	constructor(state, aurelia, router) {
		this.state = state
		this.aurelia = aurelia
		this.router = router
	}
	
	activate() {
		this.state.logout()
		this.aurelia.setRoot('login')
		this.router.navigate("wspaces")
	}
}


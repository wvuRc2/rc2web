import 'bootstrap';
import 'bootstrap/css/bootstrap.css!';
import {inject} from 'aurelia-framework';
import Rc2State from 'Rc2State';

@inject(Rc2State)
export class App {
	constructor(state) {
		this.state = state;
	}
	
	configureRouter(config, router) {
		config.title = 'Rc²;';
		config.map([
		  { route: ['','welcome'],  name: 'welcome',      moduleId: 'welcome',      nav: true, title:'Welcome' },
		  { route: 'login',         name: 'login',        moduleId: 'login',        nav: true, title:'Login' },
		  { route: 'wspaces',         name: 'wspaces',        moduleId: 'wspaces',        nav: true, title:'Workspaces', auth:false }
		]);

		this.router = router;
		this.state.verifyLogin().then(function () {
			//need to reload stuff possibly?
		});
	}
}

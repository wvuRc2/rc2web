import bootstrap from 'bootstrap/js/bootstrap.min';
import 'bootstrap/css/bootstrap.css!';
import {inject} from 'aurelia-framework';
import Rc2State from 'Rc2State';
import tether from 'tether';

@inject(Rc2State)
export class App {
	constructor(state) {
		this.state = state;
	}
	
	configureRouter(config, router) {
		config.title = 'Rc²;';
		config.map([
		  { route: 'wspaces',         name: 'wspaces',        moduleId: 'wspaces',        nav: true, title:'Workspaces', auth:false },
		  { route: 'session',         name: 'session',        moduleId: 'session',        nav: true, title:'Session', auth:false },
		  { route: 'logout',         name: 'logout',        moduleId: 'logout',        nav: true, title:'Logout', auth:false }
		]);

		this.router = router;
	}
}

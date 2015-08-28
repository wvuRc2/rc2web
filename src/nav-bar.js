import {bindable} from 'aurelia-framework';
import Rc2State from 'Rc2State';

export class NavBar {
	@bindable router = null;
	isloggedIn() {
		return this.state.loggedIn;
	}
}

import {inject} from 'aurelia-framework';
import Rc2State from 'Rc2State';
import $ from 'jquery';

@inject(Rc2State)
export class wspaces {
	constructor(state) {
		this.state = state;
	}
	
}



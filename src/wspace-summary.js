import {bindable} from 'aurelia-framework';
import $ from 'jquery';

export class wspaceSummary {
	@bindable wspace = null;
	
	fileSelected(event, wspaceId) {
		let file = this.$event.target.files[0];
		console.log("got file " + file.name + " in ws " + this.wspace.id);
	}
	
}



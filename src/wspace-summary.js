import {bindable,inject} from 'aurelia-framework';
import Rc2State from 'Rc2State';
import $ from 'jquery';

@inject(Rc2State)
export class wspaceSummary {
	constructor(state) {
		this.state = state;
	}

	@bindable wspace = null;
	
	fileSelected(event, wspaceId) {
		let file = this.$event.target.files[0];
		console.log("got file " + file.name + " in ws " + this.wspace.id);
		var progressSelector = "#progress" + this.wspace.id;
		$(".btn-file").prop('disabled', true);
		$('input[type=file]').prop('disabled', true);
		$('input[type=file]').addClass('disabled');
		$(progressSelector).css('display','block');
		this.state.uploadFile(file, this.wspace, xhr => { this.uploadComplete(xhr); }, 
			e => { 
				//console.log("progress event " + e.loaded);
				//$(progressSelector + ' .progress-bar').css('width',(e.loaded / e.total) * 100); 
			});
	}
	
	uploadComplete(e) {
		var progressSelector = "#progress" + this.wspace.id;
		$(".btn-file").prop('disabled', false);
		$('input[type=file]').prop('disabled', false);
		$('input[type=file]').removeClass('disabled');
		$(progressSelector).css('display','none');
	}
}



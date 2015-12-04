import {customElement, containerless, bindable, inject} from 'aurelia-framework';

@inject(Element)
export class fileSummary {
	@bindable file = null;
	
	constructor(element) {
		this.element = element;
	}
	
	attached() {
		let row = $(this.element.parentNode).children('.fileSummary')
		console.log("fs attached as " + this.element)
		row[0].addEventListener('click', e => {this.fileSelected(e)})
	}
	
	detached() {
		let row = $(this.element.parentNode).children('.fileSummary')
		row[0].removeEventListener('click', this.fileSelected)
	}
	
	activate(aFile) {
		this.file = aFile
	}
	
	fileSelected(e) {
		if (this.file != null)
			document.dispatchEvent(new CustomEvent('openFile', {detail: this.file}))
	}
}



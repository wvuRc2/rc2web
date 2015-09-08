export default class Splitter {
	constructor(handler, leftEl, rightEl) {
		let self = this;
		this.lastX = 0;
		this.leftEl = leftEl;
		this.rightEl = rightEl;
		let w = window;
 		this.dragHandler = evt => this.drag(evt);
 		this.endHandler = evt => this.endDrag(evt);
 		this.startHandler = evt => this.startDrag(evt);
 		
		handler.addEventListener('mousedown', this.startHandler);
		//we need to fake a 1 pixel drag because CodeMirror.scroll will grow in width
		// as new characters are typed. Once a resize happens via drag, this behavior
		// stops. Not sure why, but this is a hackish fix.
		this.startHandler({clientX: handler.offsetLeft});
		this.dragHandler({clientX: handler.offsetLeft + 1});
		this.endHandler();
    }
 
 	tearDown() {
 		window.removeEventListener('mousedown', this.startHandler);
 	}
 	
 	startDragHandler(evt) {
		evt.preventDefault();    /* prevent text selection */
		this.startDrag(evt);
	}
	
	startDrag(evt) {
		let splitter = this;
		splitter.lastX = evt.clientX;
		let w = window;
		w.addEventListener('mousemove', splitter.dragHandler);
		w.addEventListener('mouseup', splitter.endHandler);
 	}
 
    drag(evt) {
    	let splitter = this;
		let wDiff = evt.clientX - splitter.lastX;

		let d = document;
		var wL = d.defaultView.getComputedStyle(splitter.leftEl, '').getPropertyValue('width');
		var wR = d.defaultView.getComputedStyle(splitter.rightEl, '').getPropertyValue('width');
		wL = parseInt(wL, 10) + wDiff;
		wR = parseInt(wR, 10) - wDiff;
		splitter.leftEl.style.width = wL + 'px';
		splitter.rightEl.style.width = wR + 'px';

		splitter.lastX = evt.clientX;
	}
 
	endDrag() {
		window.removeEventListener('mousemove', this.dragHandler);
		window.removeEventListener('mouseup', this.endHandler);
	}
};

export default class Splitter {
	constructor(handler, leftEl, rightEl) {
		let self = this;
		this.lastX = 0;
		this.leftEl = leftEl;
		this.rightEl = rightEl;
		let w = window;
 		this.dragHandler = evt => this.drag(evt);
 		this.endHandler = evt => this.endDrag(evt);
 		
		handler.addEventListener('mousedown', function(evt) {
			evt.preventDefault();    /* prevent text selection */
			self.lastX = evt.clientX;
			w.addEventListener('mousemove', self.dragHandler);
			w.addEventListener('mouseup', self.endHandler);
		});
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

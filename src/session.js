import {inject} from 'aurelia-framework';
import Rc2State from 'Rc2State';
import $ from 'jquery';
import CodeMirror from "codemirror";
import 'codemirror/lib/codemirror.css!';
import 'codemirror/theme/cobalt.css!';
import 'codemirror/mode/r/r';
import Splitter from 'splitter';

@inject(Rc2State)
export class session {
	constructor(state) {
		this.state = state;
	}

	attached() {
		this.cm = CodeMirror.fromTextArea(this.cmTextArea);
		let d =document;
		this.splitter = new Splitter(
									d.getElementById('splitter'), 
									d.getElementById('editor'),
									d.getElementById('console')
									);
	}
}



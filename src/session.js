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
		this.websocket = new WebSocket('ws://localhost:8088/ws/1', [this.state.loginToken]);
		this.websocket.onopen = e => {
			console.log('websocket open');
			this.websocket.binaryType = 'arraybuffer';
			$(".loading").css('display', 'none')
		};
		this.websocket.onerror = e => {
			console.log("error:" + e);
		};
		this.websocket.onmessage = e => {
			if (typeof e.data === "string")
				this.handleTextMessage(e.data);
			else
				this.handleBinaryMessage(e.data);
		};
		this.websocket.onclose = e => {
			console.log("websocket closed");
		};
	}
	executeQuery() {
		this.websocket.send('{"msg":"execute", "code":"rnorm(121)"}');
	}
	requestHelp() {
		this.websocket.send('{"msg":"help","topic":"print"}')
	}
	
	showResults(msg) {
		var newtext = $('<div></div>').text(msg.string)
		$("#console").append(newtext)
	}
	
	handleTextMessage(jsonString) {
		console.log("got:" + jsonString);
		var msg = JSON.parse(jsonString);
		switch(msg.msg) {
			case "userid":
				this.socketId = msg.socketId;
				break;
			case 'results':
				this.showResults(msg);
				break;
			default:
				console.log("unknown message");
		}
	}
	
	handleBinaryMessage(arrayBuffer) {
		console.log("got binary data");
	}
}



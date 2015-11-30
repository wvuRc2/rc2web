import {inject} from 'aurelia-framework';
import Rc2State from 'Rc2State';
import makeSessionImage from 'SessionImage';
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
		this.currentInput = '';
	}

	attached() {
		let me = this
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
			this.timerId = setInterval(function() { me.websocket.send('{"msg":"keepAlive"}') }, 30000)
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
			clearTimeout(this.timerId);
			this.timerId = undefined;
		};
	}
	checkForReturnKey(e) {
		if (e.keyCode === 13)
			this.executeConsoleQuery();
	}
	
	executeConsoleQuery() {
		let msg = {"msg": "execute", "code":this.currentInput};
		this.websocket.send(JSON.stringify(msg))
	}
	
	executeQuery() {
		this.websocket.send('{"msg":"execute", "code":"rnorm(121)"}');
	}
	requestHelp() {
		this.websocket.send('{"msg":"help","topic":"print"}')
	}
	
	echoQuery(msg) {
		var label = "";
		if (msg.fileId > 0) {
		} else {
			label = msg.query;
		}
		var qrcode = "qr" + msg.queryId;
		var query = '<div class="qgroup" id="q' + msg.queryId + '">' +
			'<a data-toggle="collapse" href="#' + qrcode + '" aria-controls="' + qrcode + 
			'" class="qlink">' +
			'<span class="fa fa-caret-down fa-fw fa-2x qtoggle"></span></a>' + label + 
			'<div id="' + qrcode + '" class="collapse in qresults"></div></div>';
		$("#results").append(query);
		var sel = '#' + qrcode;
		$(sel).on('shown.bs.collapse', function() {
			$('#q' + msg.queryId + ' a span').removeClass('fa-caret-right').addClass('fa-caret-down');
		});
		$(sel).on('hidden.bs.collapse', function() {
			$('#q' + msg.queryId + ' a span').removeClass('fa-caret-down').addClass('fa-caret-right');
		});
	}
	
	showResults(msg) {
		var objsToInsert = [];
		if (msg.string && msg.string.length > 0) {
			objsToInsert.push($('<div class="qresults"></div>').text(msg.string));
		}
		if (msg.images && msg.images.length > 0) {
			//images are appended after the text
			var imgHtml = '<div class="imageGroup">'
			msg.images.forEach(img => {
				imgHtml += '<span class="qimg fa fa-file-image-o fa-3x" data-toggle="tooltip" ' +
					'title="' + img.name.replace(/"/g, '&quot;') + '" imgid="' + img.id + '"></span>' 
				setTimeout(function() { $('[imgid="' + img.id + '"]').tooltip() })
			})
			imgHtml += '</div>'
			var imgElems = $.parseHTML(imgHtml)
			objsToInsert.push($(imgElems))
			var images = msg.images.map(src => { return makeSessionImage(src) });
			$(imgElems).data("images", images);
		}
		if (msg.queryId > 0) {
			$("#qr" + msg.queryId).append(objsToInsert);
		} else {
			$("#results").append(objsToInsert)
		}
	}
	
	handleTextMessage(jsonString) {
		console.log("got:" + jsonString);
		var msg = JSON.parse(jsonString);
		switch(msg.msg) {
			case "userid":
				this.socketId = msg.socketId;
				break;
			case "echo":
				this.echoQuery(msg);
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



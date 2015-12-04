import {inject} from 'aurelia-framework';
import Rc2State from 'Rc2State';
import makeSessionImage from 'SessionImage';
import $ from 'jquery';
import CodeMirror from "codemirror";
import 'codemirror/lib/codemirror.css!';
import 'codemirror/theme/cobalt.css!';
import 'codemirror/mode/r/r';
import '../bootstrap/dist/js/bootstrap.js'
import Splitter from 'splitter';

@inject(Rc2State)
export class session {
	constructor(state) {
		this.state = state;
		this.currentInput = '';
		this.workspace = state.workspaces[0]
	}

	attached() {
		let me = this
		this.cm = CodeMirror.fromTextArea(this.cmTextArea, {lineNumbers:true});
		let d = document;
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
		$("#lbox").on('show.bs.modal', me.setupImageModal)
		$('#openModal').on('show.bs.modal', e => {
			$('#openModal').one('hidden.bs.modal', e => {
				$('#openModalBody').empty()
			})
		})
		$(document).on("click", ".tbaction", function(e) {
			var clickSrc = $(this)
			var action = clickSrc.data('action')
			console.log("got action click:" + action)
			if (action == 'new') {
				me.createNewDocument(clickSrc.data('ftype'))
			}
			e.preventDefault()
		})
		document.addEventListener('openFile', this.openDocument)
	}
	
	detached() {
		document.removeEventListener('openFile', this.openDocument)
	}
	
	setupImageModal(event) {
		var button = $(event.relatedTarget)
		var grpIdent = button.data('ig')
		var iconContainer = $('#' + grpIdent)
		var images = iconContainer.data('images')
		var inner = $(".carousel-inner")
		var inds = $(".carousel-indicators")
		var activeIndex = button.data('index')
		inner.empty()
		inds.empty()
		images.forEach((img, index) => {
			var isActive = activeIndex == index ? " active" : ""
			var ihtml = '<div class="item center' + isActive + '"><img id="img' + img.id + '">' +
				'<div class="carousel-caption">' + img.name + '</div></div>';
			var imgobj = $.parseHTML(ihtml)
			$(imgobj).find("img:first").attr('src', img.source)
			inner.append(imgobj)
			ihtml = '<li data-target="#lbox" data-slide-to="' + index + '" class="cident' + isActive + '"></li>'
			inds.append(ihtml)
			isActive = ""
		})
	}
	
	openDocument(e) {
		console.log("opening:" + e.detail.name)
		$('#openModal').modal('toggle')
	}
	
	createNewDocument(doctype) {
		console.log("creating:" + doctype)
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
			var imgHtml = '<div class="imageGroup" id="ig' + msg.images[0].batchId + '">'
			msg.images.forEach((img, index) => {
				imgHtml += '<a href="#lbox" data-toggle="modal" data-target="#lbox" data-ig="ig' + 
					img.batchId + '" data-index="' + index + '"><span class="qimg fa fa-file-image-o fa-3x" data-toggle="tooltip" ' +
					'title="' + img.name.replace(/"/g, '&quot;') + '" imgid="' + img.id + '"></span></a>' 
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



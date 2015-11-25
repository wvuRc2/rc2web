
class SessionImage {
	constructor(jsonObj) {
		this.id = jsonObj["id"];
		this.sessionId = jsonObj["sessionId"];
		this.batchId = jsonObj["batchId"];
		this.name = jsonObj["name"];
		this.dateCreated = jsonObj["dateCreated"];
		this.source = 'data:image/png;base64,' + jsonObj["imageData"];
	}
}

export default function makeSessionImage(img) {
	return new SessionImage(img);
}


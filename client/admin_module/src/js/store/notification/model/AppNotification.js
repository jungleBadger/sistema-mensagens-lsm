"use strict";
import { v1 as uuidv1 } from "uuid";
const titleDictionary = {
	"success": "Success!",
	"warning": "Attention!",
	"error": "Error!"
};
export default function Constructor(params = {}) {
	if (!titleDictionary[params.kind]) {
		throw new Error(`Invalid notification \`kind\` value: ${params.kind}`);
	}
	this.id = uuidv1();
	this.title = params.title || titleDictionary[params.kind];
	this.subtitle = params.subtitle || "";
	this.caption = params.caption || `Timestamp [${new Date().toLocaleTimeString()}]`;
	this.kind = params.kind;
	this.actionType = params.actionType;
	this.actionHandler = params.actionHandler;
	return this;
}
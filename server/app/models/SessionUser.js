"use strict";


module.exports = class SessionUser {

	constructor (userId, isAdmin, isConfirmed) {
		this.id = userId;
		this.isAdmin = Boolean(isAdmin);
		this.isConfirmed = Boolean(isConfirmed);
		this.updated = Date.now();
	}

}
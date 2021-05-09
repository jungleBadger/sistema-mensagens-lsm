"use strict";


module.exports = class SessionUser {

	constructor (userId, userEmail, isAdmin, isConfirmed) {
		this.id = userId;
		this.email = userEmail;
		this.isAdmin = Boolean(isAdmin);
		this.isConfirmed = Boolean(isConfirmed);
		this.updated = Date.now();
	}

}
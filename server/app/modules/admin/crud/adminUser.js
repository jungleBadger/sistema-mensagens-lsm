"use strict";

const AdminUser = require("../models/AdminUser");
const raiseError = require("../../../helpers/errorHandler").raiseError;
const { generateHash, compareHash } = require("../../../helpers/security");
const DBConnectionPool = require("../../../helpers/DBConnectionPool");
const connectionPool = new DBConnectionPool(
	process.env.DB2_DB,
	process.env.DB2_HOST,
	process.env.DB2_PORT,
	process.env.DB2_UID,
	process.env.DB2_PASSWORD
);

module.exports = {

	async create(
		userEmail,
		userPassword,
		userDisplayName = null
	) {

		if (!userEmail || !userPassword) {
			throw raiseError(
				400,
				"Missing required properties for creating Admin user."
			);
		} else if (userPassword.length < 8) {
			throw raiseError(
				400,
				"Password has to have a length greater or equal to 08."
			);
		}

		const adminUser = new AdminUser(
			userEmail,
			await generateHash(userPassword),
			userDisplayName
		);

		const insertKeys = adminUser.getKeys();
		return await connectionPool.executePreparedSqlInstruction(
			[
				`insert into USUARIO (${insertKeys.join(", ")})`,
				`values (${insertKeys.map(key => '?').join(", ")});`
			].join(" "),
			adminUser.getValues(),
			false
		);
	},

	retrieveAll(limit = 20, currentPage = 1, sortBy = "id") {

	},

	async retrieveById(adminUserId, targetColumns = ["*"]) {

		if (!adminUserId) {
			throw raiseError(
				400,
				"Missing required properties for querying admin user by ID."
			);
		}

		let result = await connectionPool.executePreparedSqlInstruction(
			`SELECT ${targetColumns.join(", ")} FROM USUARIO WHERE USUARIO.ID = ? LIMIT 1;`,
			[adminUserId]
		);

		if (!result || !result.length) {
			throw raiseError(
				404,
				`User ID ${adminUserId} not found.`
			);
		} else {
			return result[0];
		}

	},

	async retrieveByEmail(adminUserEmail, targetColumns = ["*"]) {

		if (!adminUserEmail) {
			throw raiseError(
				400,
				"Missing required properties for querying admin user by Email."
			);
		}

		let result = await connectionPool.executePreparedSqlInstruction(
			`SELECT ${targetColumns.join(", ")} FROM USUARIO WHERE USUARIO.EMAIL = ? LIMIT 1;`,
			[adminUserEmail]
		);

		if (!result || !result.length) {
			throw raiseError(
				404,
				`User email ${adminUserEmail} not found.`
			);
		} else {
			return result[0];
		}

	},

	update(adminUserId, adminUserObject) {

	},

	async delete(adminUserId) {
		if (!adminUserId) {
			throw raiseError(
				400,
				"Missing required properties for deleting admin user."
			);
		}

		await this.retrieveById(adminUserId);

		await connectionPool.executePreparedSqlInstruction(
			`DELETE FROM USUARIO WHERE USUARIO.ID = ?;`,
			[adminUserId],
			false
		);

		return `User ${adminUserId} deleted`;
	}
}
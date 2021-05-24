"use strict";

const raiseError = require("../errorHandler").raiseError;
const DBConnectionPool = require("../DBConnectionPool");
const connectionPool = new DBConnectionPool(
	process.env.DB2_DB,
	process.env.DB2_HOST,
	process.env.DB2_PORT,
	process.env.DB2_UID,
	process.env.DB2_PASSWORD
);

module.exports = {

	/**
	 * Links a social provider account with a main account.
	 * @method linkAccount
	 * @param {number|string} userId - [Foreign key - USUARIO (ID) ] - Main account User ID.
	 * @param {number|string} accountProviderId - [Foreign key - PROVEDOR_SOCIAL (ID) ] - Account provider ID.
	 * @param {string} accountProviderUserEmail - Email to link main account with the third party provided.
	 * @param {string|null} [profilePictureURL] - Optional custom profile picture URL.
	 * @return {Promise<Object|Error>} Containing the new User ID.
	 */
	async linkAccount(
		userId,
		accountProviderId,
		accountProviderUserEmail,
		profilePictureURL
	) {

		if (!accountProviderId || !userId || !accountProviderUserEmail) {
			throw raiseError(
				400,
				"Missing required parameters to Link account."
			);
		}

		try {

			await connectionPool.executePreparedSqlInstruction(
				[
					`INSERT into CONTA_SOCIAL_CONECTADA (USUARIO_ID, PROVEDOR_SOCIAL_ID, EMAIL, URL_FOTO_PERFIL)`,
					"VALUES (?, ?, ?, ?);"
				].join(" "),
				[
					userId,
					accountProviderId,
					accountProviderUserEmail,
					profilePictureURL || ""
				]
			);
		} catch (e) {
			console.log(e);
			if (e && e.indexOf && e.indexOf("SQLSTATE=23505") > -1) {
				throw raiseError(
					409,
					`Account already linked.`
				);
			} else {
				throw e;
			}
		}


	},


	async retrieveLinkedAccount(socialProviderId, email, acceptNotFound = false) {
		let result = await connectionPool.executePreparedSqlInstruction(
			[
				"SELECT ID FROM CONTA_SOCIAL_CONECTADA",
				"WHERE CONTA_SOCIAL_CONECTADA.PROVEDOR_SOCIAL_ID = ? AND CONTA_SOCIAL_CONECTADA.EMAIL = ?",
				"LIMIT 1;"
			].join(" "),
			[
				socialProviderId,
				email
			]
		);

		if (!result || !result.length) {

			if (acceptNotFound) {
				return null;
			} else {
				throw raiseError(
					404,
					`User email ${email} not found.`
				);
			}

		} else {
			return result[0];
		}
	},

	createAccountProvider() {

	},

	async retrieveAccountProviderIdByName(providerName) {
		if (!providerName) {
			throw raiseError(
				400,
				"Missing required properties for querying Account provider."
			);
		}

		let result = await connectionPool.executePreparedSqlInstruction(
			`SELECT ID FROM PROVEDOR_SOCIAL WHERE PROVEDOR_SOCIAL.NOME = ? LIMIT 1;`,
			[providerName]
		);

		if (!result || !result.length) {
			throw raiseError(
				404,
				`Account provider ${providerName} not found.`
			);
		} else {
			return result[0].ID;
		}

	}

}
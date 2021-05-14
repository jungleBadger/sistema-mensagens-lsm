"use strict";

const Category = require("../../models/Category");
const raiseError = require("../errorHandler").raiseError;
const DBConnectionPool = require("../DBConnectionPool");
const connectionPool = new DBConnectionPool(
	process.env.DB2_DB,
	process.env.DB2_HOST,
	process.env.DB2_PORT,
	process.env.DB2_UID,
	process.env.DB2_PASSWORD
);

const TABLE_NAME = "CATEGORIA";
const logger = require("../logger");

module.exports = {

	/**
	 * Creates a new Category.
	 * @method create
	 * @param {string} name - Display name.
	 * @param {object} operator - Operator object.
	 * @param {string} operator.id - Operator's ID.
	 * @param {string} operator.email - Operator's email.
	 * @return {Promise<Object|Error>} Containing the new User ID.
	 */
	async create (
		name,
		operator
	) {
		const category = new Category(
			name
		);

		const insertKeys = category.getKeys();

		try {

			return {
				...(
					await logger.generateLog(
						"CREATE",
						(await connectionPool.executePreparedSqlInstruction(
							[
								`(SELECT ID FROM FINAL TABLE (insert INTO ${TABLE_NAME} (${insertKeys.join(", ")})`,
								`values (${insertKeys.map(() => "?").join(", ")})))`
							].join(" "),
							category.getValues(),
							"fetch"
						)).ID,
						TABLE_NAME,
						operator.email,
						Number(operator.id)
					)
				)
			};


		} catch (e) {
			console.log(e);
			if (e && e.indexOf && e.indexOf("duplicate values" > -1)) {
				throw raiseError(
					409,
					`Category ${name} already exists.`
				);
			} else {
				throw e;
			}
		}
	},

	/**
	 * Retrieves the count of total Categories rows.
	 * @method retrieveTotalRowsCount
	 * @return {Promise<Object|Error>} Containing all Category objects and request metadata.
	 */
	async retrieveTotalRowsCount() {
		return {
			"table": TABLE_NAME,
			"count": (await connectionPool.executePreparedSqlInstruction(
				`SELECT COUNT(ID) FROM ${TABLE_NAME};`,
				[],
				"fetch"
			))["1"]
		};
	},

	/**
	 * Retrieves all admin users.
	 * @method retrieveAll
	 * @param {Array<string>} [targetColumns=["*"]] - Optional Array of COLUMNS to be selected.
	 * @param {number} [limit=20] - Optional limit of rows.
	 * @param {number} [skip=0] - Optional row skipping - useful for pagination.
	 * @param {string} [orderBy="ID"] - Optional Order by parameter.
	 * @param {string} [orderDirection="ASC"] - Optional Order direction.
	 * @return {Promise<Object|Error>} Containing all admin Users objects and request metadata.
	 */
	async retrieveAll (targetColumns = ["*"], limit = 20, skip = 0, orderBy = "ID", orderDirection= "DESC") {

		let results = await connectionPool.executeRawSqlInstruction(
			`SELECT ${targetColumns.join(", ")} FROM ${TABLE_NAME} ORDER BY ${TABLE_NAME}.${orderBy} ${orderDirection} OFFSET ${skip} ROWS FETCH FIRST ${limit} ROWS ONLY;`
		);

		return {
			"offset": skip + results.length,
			"orderBy": orderBy,
			"results": results
		};

	},

	/**
	 * Retrieves a single Category by ID.
	 * @method retrieveById
	 * @param {string} categoryId - ID to search for.
	 * @param {Array<string>} [targetColumns=["*"]] - Optional Array of COLUMNS to be selected.
	 * @return {Promise<Object|Error>} Containing the Category object.
	 */
	async retrieveById (categoryId, targetColumns = ["*"]) {

		if (!categoryId) {
			throw raiseError(
				400,
				"Missing required properties for querying Category by ID."
			);
		}

		let result = await connectionPool.executePreparedSqlInstruction(
			`SELECT ${targetColumns.join(", ")} FROM ${TABLE_NAME} WHERE ${TABLE_NAME}.ID = ? LIMIT 1;`,
			[categoryId]
		);

		if (!result || !result.length) {
			throw raiseError(
				404,
				`Category ID ${categoryId} not found.`
			);
		} else {
			return result[0];
		}

	},

	/**
	 * Retrieves a single Category by Display name.
	 * @method retrieveByDisplayName
	 * @param {string} categoryName - Display name to search for.
	 * @param {Array<string>} [targetColumns=["*"]] - Optional Array of COLUMNS to be selected.
	 * @return {Promise<Object|Error>} Containing the category object.
	 */
	async retrieveByDisplayName (categoryName, targetColumns = ["*"]) {

		if (!categoryName) {
			throw raiseError(
				400,
				"Missing required properties for querying admin User by Email."
			);
		}

		let result = await connectionPool.executePreparedSqlInstruction(
			`SELECT ${targetColumns.join(", ")} FROM ${TABLE_NAME} WHERE ${TABLE_NAME}.NOME_EXIBICAO = ? LIMIT 1;`,
			[categoryName]
		);

		if (!result || !result.length) {
			throw raiseError(
				404,
				`Category ${categoryName} not found.`
			);
		} else {
			return result[0];
		}

	},

	/**
	 * Updates a single Category's Display name.
	 * @method update
	 * @param {string} categoryId - Category ID to search for.
	 * @param {string} newName - New name.
	 * @param {object} operator - Operator object.
	 * @param {string} operator.id - Operator's ID.
	 * @param {string} operator.email - Operator's email.
	 * @return {Promise<Object|Error>} Containing the category object.
	 */
	async update (categoryId, newName, operator) {
		if (!categoryId || !newName) {
			throw raiseError(
				400,
				"Missing required properties for updating Category by ID."
			);
		}
		await this.retrieveById(categoryId);

		try {
			await connectionPool.executePreparedSqlInstruction(
				`UPDATE ${TABLE_NAME} SET ${TABLE_NAME}.NOME = ? WHERE ${TABLE_NAME}.ID = ?;`,
				[newName, categoryId]
			);
		} catch (e) {
			if (e && e.indexOf && e.indexOf("duplicate values" > -1)) {
				throw raiseError(
					409,
					`Category ${newName} already exists.`
				);
			} else {
				throw e;
			}
		}

		return {
			...(await logger.generateLog(
				"UPDATE",
				categoryId,
				TABLE_NAME,
				operator.email,
				Number(operator.id)
			)),
			"NOME": newName
		};


	},

	/**
	 * Delete a single admin User.
	 * @method delete
	 * @param {string} categoryId - ID to search for and delete.
	 * @param {object} operator - Operator object.
	 * @param {string} operator.id - Operator's ID.
	 * @param {string} operator.email - Operator's email.
	 * @return {Promise<string|Error>} Containing the deletion confirmation.
	 */
	async delete (categoryId, operator) {
		if (!categoryId) {
			throw raiseError(
				400,
				"Missing required properties for deleting Category."
			);
		}

		await connectionPool.executePreparedSqlInstruction(
			`DELETE FROM ${TABLE_NAME} WHERE ${TABLE_NAME}.ID = ?;`,
			[categoryId]
		);

		return await logger.generateLog(
			"DELETE",
			categoryId,
			TABLE_NAME,
			operator.email,
			Number(operator.id)
		);

	}
};
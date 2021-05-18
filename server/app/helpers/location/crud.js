"use strict";

const Location = require("../../models/Location");
const raiseError = require("../errorHandler").raiseError;
const DBConnectionPool = require("../DBConnectionPool");
const connectionPool = new DBConnectionPool(
	process.env.DB2_DB,
	process.env.DB2_HOST,
	process.env.DB2_PORT,
	process.env.DB2_UID,
	process.env.DB2_PASSWORD
);

const TABLE_NAME = "LOCALIDADE";
const logger = require("../logger");

module.exports = {

	/**
	 * Creates a new Location.
	 * @method create
	 * @param {object} payload - Payload object.
	 * @param {string} payload.country - Location country.
	 * @param {string} payload.state - Location state.
	 * @param {string} payload.city - Location city.
	 * @param {string} [payload.description] - Optional Location description.
	 * @param {object} operator - Operator object.
	 * @param {string} operator.id - Operator's ID.
	 * @param {string} operator.email - Operator's email.
	 * @return {Promise<Object|Error>} Containing the new Location ID.
	 */
	async create (
		payload,
		operator
	) {
		const location = new Location(
			payload.country,
			payload.state,
			payload.city,
			payload.description
		);

		const insertKeys = location.getKeys();

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
							location.getValues(),
							"fetch"
						)).ID,
						TABLE_NAME,
						operator.email,
						Number(operator.id)
					)
				)
			};


		} catch (e) {
			if (e && e.indexOf && e.indexOf("duplicate values" > -1)) {
				throw raiseError(
					409,
					`Location ${payload.country} - ${payload.state} - ${payload.city} already exists.`
				);
			} else {
				throw e;
			}
		}
	},

	/**
	 * Retrieves the count of total Brothers rows.
	 * @method retrieveTotalRowsCount
	 * @return {Promise<Object|Error>} Containing all Brother objects and request metadata.
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
	 * Search locations.
	 * @method search
	 * @param {string} filterText - Filtering text.
	 * @param {string} [filterColumn="NOME_EXIBICAO"] - Optional column selector to use in the SELECT statement.
	 * @param {Array<string>} [extraFilterColumns=[]] - TBD.
	 * @param {Array<string>} [targetColumns=["*"]] - Optional Array of COLUMNS to be selected.
	 * @param {number} [limit=20] - Optional limit of rows.
	 * @param {number} [skip=0] - Optional row skipping - useful for pagination.
	 * @param {string} [orderBy="ID"] - Optional Order by parameter.
	 * @param {string} [orderDirection="ASC"] - Optional Order direction.
	 * @return {Promise<object|Error>} Containing the results.
	 */
	async search (filterText, filterColumn = "PAIS", extraFilterColumns = [], targetColumns = ["*"], limit = 20, skip = 0, orderBy = "PAIS", orderDirection= "ASC") {
		if (!filterText) {
			throw raiseError(
				400,
				"Missing required properties for searching Location."
			);
		}

		let {
			searchQuery,
			countQuery
		} = DBConnectionPool.buildSearchQuery(
			targetColumns, TABLE_NAME, filterColumn, filterText, extraFilterColumns, orderBy, orderDirection, skip, limit
		);

		let [results, countResults] = await Promise.all([
			connectionPool.executeRawSqlInstruction(
				searchQuery,
				[]
			),
			connectionPool.executePreparedSqlInstruction(
				countQuery,
				[],
				"fetch"
			)
		]);

		return {
			"offset": skip + results.length,
			"orderBy": orderBy,
			"orderDirection": orderDirection,
			"totalCount": countResults["1"],
			"results": results
		};
	},

	/**
	 * Retrieves all locations.
	 * @method retrieveAll
	 * @param {Array<string>} [targetColumns=["*"]] - Optional Array of COLUMNS to be selected.
	 * @param {number} [limit=20] - Optional limit of rows.
	 * @param {number} [skip=0] - Optional row skipping - useful for pagination.
	 * @param {string} [orderBy="ID"] - Optional Order by parameter.
	 * @param {string} [orderDirection="ASC"] - Optional Order direction.
	 * @return {Promise<Object|Error>} Containing all Location objects and request metadata.
	 */
	async retrieveAll (targetColumns = ["*"], limit = 20, skip = 0, orderBy = "PAIS", orderDirection= "ASC") {

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
	 * Retrieves a single Location by ID.
	 * @method retrieveById
	 * @param {string} locationId - ID to search for.
	 * @param {Array<string>} [targetColumns=["*"]] - Optional Array of COLUMNS to be selected.
	 * @return {Promise<Object|Error>} Containing the Brother object.
	 */
	async retrieveById (locationId, targetColumns = ["*"]) {

		if (!locationId) {
			throw raiseError(
				400,
				"Missing required properties for querying Location by ID."
			);
		}

		let result = await connectionPool.executePreparedSqlInstruction(
			`SELECT ${targetColumns.join(", ")} FROM ${TABLE_NAME} WHERE ${TABLE_NAME}.ID = ? LIMIT 1;`,
			[locationId]
		);

		if (!result || !result.length) {
			throw raiseError(
				404,
				`Location ID ${locationId} not found.`
			);
		} else {
			return result[0];
		}
	},


	/**
	 * Updates a single Brother's Display name.
	 * @method update
	 * @param {string} locationId - Brother ID to search for.
	 * @param {object} payload - Payload object.
	 * @param {string} payload.country - Location country.
	 * @param {string} payload.state - Location state.
	 * @param {string} payload.city - Location city.
	 * @param {string} [payload.description] - Optional Location description.
	 * @param {object} operator - Operator object.
	 * @param {string} operator.id - Operator's ID.
	 * @param {string} operator.email - Operator's email.
	 * @return {Promise<Object|Error>} Containing the brother object.
	 */
	async update (locationId, payload, operator) {
		if (!locationId) {
			throw raiseError(
				400,
				"Missing required properties for updating Location by ID."
			);
		}
		const updatedLocation = new Location(
			payload.country,
			payload.state,
			payload.city,
			payload.description
		);
		await this.retrieveById(locationId);

		try {
			await connectionPool.executePreparedSqlInstruction(
				"UPDATE LOCALIDADE SET LOCALIDADE.PAIS = ?, LOCALIDADE.ESTADO = ?, LOCALIDADE.CIDADE = ?, LOCALIDADE.DESCRICAO = ? WHERE LOCALIDADE.ID = ? ",
				[updatedLocation.model.PAIS, updatedLocation.model.ESTADO, updatedLocation.model.CIDADE, updatedLocation.model.DESCRICAO, locationId]
			);
		} catch (e) {
			console.log(e);
			throw e;
		}

		return {
			...(await logger.generateLog(
				"UPDATE",
				locationId,
				TABLE_NAME,
				operator.email,
				Number(operator.id)
			)),
			...(updatedLocation.model)
		};

	},

	/**
	 * Delete a single Location.
	 * @method delete
	 * @param {string} locationId - ID to search for and delete.
	 * @param {object} operator - Operator object.
	 * @param {string} operator.id - Operator's ID.
	 * @param {string} operator.email - Operator's email.
	 * @return {Promise<string|Error>} Containing the deletion confirmation.
	 */
	async delete (locationId, operator) {
		if (!locationId) {
			throw raiseError(
				400,
				"Missing required properties for deleting Location."
			);
		}

		await connectionPool.executePreparedSqlInstruction(
			`DELETE FROM ${TABLE_NAME} WHERE ${TABLE_NAME}.ID = ?;`,
			[locationId]
		);

		return await logger.generateLog(
			"DELETE",
			locationId,
			TABLE_NAME,
			operator.email,
			Number(operator.id)
		);

	}

};
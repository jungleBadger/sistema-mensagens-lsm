"use strict";

const ibm_db = require("ibm_db");
const raiseError = require("./errorHandler").raiseError;

class DBConnectionPool {

	constructor (
		db,
		host,
		port,
		uid,
		password,
		connectionString = "",
		poolSize = 5
	) {
		this.connectionString = connectionString || `DATABASE=${db};HOSTNAME=${host};PORT=${port};UID=${uid};PWD=${password};CURRENTSCHEMA=${process.env.DB2_SCHEMA || "LSMAPP"}`;
		this.pool = new ibm_db.Pool(
			{
				"systemNaming": true
			}
		);
		this.pool.init(poolSize, this.connectionString);
	}

	/**
	 * @method buildSearchQuery
	 * @param {Array<string>} [selectColumns=["*"]] - Optional - TBD.
	 * @param {string} tableName - TBD.
	 * @param {string} [filterColumn="ID"] - Optional - TBD.
	 * @param {string} filterText - TBD.
	 * @param {Array<string>} [extraFilterColumns] - Optional - TBD.
	 * @param {string} [orderBy="ID"] - Optional Order by parameter.
	 * @param {string} [orderDirection="ASC"] - Optional Order direction.
	 * @param {number} [skip=0] - Optional row skipping - useful for pagination.
	 * @param {number} [limit=20] - Optional limit of rows.
	 * @return {Object} Containing the deletion confirmation.
	 */
	static buildSearchQuery (
		selectColumns = ["*"],
		tableName,
		filterColumn = "ID",
		filterText,
		extraFilterColumns = [],
		orderBy = "ID",
		orderDirection = "ASC",
		skip = 0,
		limit = 20
	) {

		if (!tableName && !filterText) {
			return raiseError(
				400,
				"Missing parameters to build search query"
			);
		}

		return {
			"searchQuery": [
				`SELECT ${selectColumns.join(", ")} FROM ${tableName}`,
				`WHERE LOWER(${tableName}.${filterColumn}) LIKE LOWER('%${filterText}%')`,
				extraFilterColumns.map((column) => `OR LOWER(${tableName}.${column}) LIKE LOWER('%${filterText}%')`).join(" "),
				`ORDER BY ${tableName}.${orderBy} ${orderDirection}`,
				`OFFSET ${skip} ROWS FETCH FIRST ${limit} ROWS ONLY`,
				";"
			].join(" "),
			"countQuery": [
				`SELECT COUNT(ID) FROM ${tableName}`,
				`WHERE LOWER(${tableName}.${filterColumn}) LIKE LOWER('%${filterText}%')`,
				extraFilterColumns.map((column) => `OR LOWER(${tableName}.${column}) LIKE LOWER('%${filterText}%')`).join(" "),
				";"
			].join(" ")
		};
	}

	executeRawSqlInstruction (rawSqlInstruction) {
		return new Promise((resolve, reject) => {
			this.pool.open(
				this.connectionString,

				(openErr, conn) => {
					if (openErr) {
						return reject(`Error opening the DB connection: ${openErr.message}`);
					} else {
						conn.query(rawSqlInstruction, (queryErr, operationResult) => {

							if (queryErr) {
								return reject(`Error querying the database: ${queryErr.message}`);
							}

							conn.close((closeError) => {
								return closeError ? reject(`Error closing the connection: ${closeError.message}`) : resolve(operationResult);
							});

						});
					}
				}
			);
		});
	}

	executePreparedSqlInstruction (sqlStringTemplate, paramsArray, resultHandling = "fetchAll") {
		return new Promise((resolve, reject) => {
			this.pool.open(
				this.connectionString,
				(openErr, conn) => {

					if (openErr) {
						reject(`Error opening the DB connection: ${openErr.message}`);
					}

					conn.prepare(sqlStringTemplate, (prepareErr, statement) => {
						if (prepareErr) {
							return reject(`Error preparing SQL statement: ${sqlStringTemplate} with params ${paramsArray}: ${prepareErr.message}`);
						}

						statement.execute(paramsArray, (executeErr, operationResult) => {
							if (executeErr) {
								return reject(`Error executing the SQL statement: ${executeErr.message}`);
							}

							if (resultHandling) {

								operationResult[resultHandling]((resultErr, parsedResult) => {
									if (resultErr) {
										return reject(`Error fetching the results: ${resultErr.message}`);
									}

									statement.close((statementCloseErr) => {
										if (statementCloseErr) {
											return reject(`Error closing the SQL statement: ${statementCloseErr.message}`);
										}

										conn.close((closeError) => {
											return closeError ? reject(`Error closing the connection: ${closeError.message}`) : resolve(parsedResult);
										});

									});
								});
							} else {
								statement.close((statementCloseErr) => {
									if (statementCloseErr) {
										return reject(`Error closing the SQL statement: ${statementCloseErr.message}`);
									}

									conn.close((closeError) => {
										return closeError ? reject(`Error closing the connection: ${closeError.message}`) : resolve(operationResult);
									});

								});
							}

						});
					});
				}
			);
		});
	}

	executeOperationsWithinTransaction (operations = []) {

		return new Promise((resolve, reject) => {
			this.pool.open(
				this.connectionString,
				(openErr, conn) => {

					conn.beginTransaction((err) => {
						if (err) {
							return reject(`Error opening the transaction: ${openErr.message}`);
						} else {

							if (openErr) {
								return reject(`Error opening the DB connection: ${openErr.message}`);
							} else {

								try {
									conn.query(operations.join("; "), (err, result) => {
										if (err) {
											return reject(`Error performing the queries: ${err}`);
										}

										conn.commitTransaction((commitErr) => {

											if (commitErr) {
												conn.rollbackTransaction(() => {
													return reject(`Error commiting transaction: ${commitErr.message}`);
												});
											} else {
												return resolve(result);
											}

										});

									});

								} catch (e) {
									conn.rollbackTransaction(() => {
										return reject(`Error querying the database: ${e.message}`);
									});

								}

							}

						}
					});

				}
			);
		});
	}

}

module.exports = DBConnectionPool;

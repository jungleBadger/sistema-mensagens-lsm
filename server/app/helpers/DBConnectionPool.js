"use strict";

const ibm_db = require("ibm_db");


class DBConnectionPool {

	constructor(
		db,
		host,
		port,
		uid,
		password,
		connectionString = "",
		poolSize = 5
	) {
		this.connectionString = connectionString || `DATABASE=${db};HOSTNAME=${host};PORT=${port};UID=${uid};PWD=${password}`;
		this.pool = new ibm_db.Pool(
			{
				"systemNaming" : true
			}
		);
		this.pool.init(poolSize, this.connectionString);
	}

	executeRawSqlInstruction(rawSqlInstruction) {
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

	executePreparedSqlInstruction(sqlStringTemplate, paramsArray, resultHandling = "fetchAll") {
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
											return reject(`Error closing the SQL statement: ${statementCloseErr.message}`)
										}

										conn.close((closeError) => {
											return closeError ? reject(`Error closing the connection: ${closeError.message}`) : resolve(parsedResult)
										});

									});
								});
							} else {
								statement.close((statementCloseErr) => {
									if (statementCloseErr) {
										return reject(`Error closing the SQL statement: ${statementCloseErr.message}`)
									}

									conn.close((closeError) => {
										return closeError ? reject(`Error closing the connection: ${closeError.message}`) : resolve(operationResult)
									});

								});
							}

						});
					});
				}
			);
		});
	}

}

module.exports = DBConnectionPool;

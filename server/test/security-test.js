"use strict";


const assert = require("chai").assert;
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
chai.should();
const security = require("../app/helpers/security");
const TEST_INPUT = "TEST_KEY";
const CUSTOM_SALT = "123456789123456789123456789123456789";
const LONG_INPUT = "pvFLApf!BPAkfRo*A8zzs.MH!FVTnJUB=KDoMNy~rU8hZ^j&P63db#LBbeCaMk+r";

module.exports = function () {

	describe("Security helper package", () => {
		context("Valid instantiation", () => {
			it("should export an object", () => {
				assert.strictEqual(typeof security, "object");
			});

			it("should export a validateJWT method", () => {
				assert.strictEqual(typeof security.validateJWT, "function");
			});

			it("should export a generateEncryptedDataAsync method", () => {
				assert.strictEqual(typeof security.generateEncryptedDataAsync, "function");
			});

			it("should export a decryptDataAsync method", () => {
				assert.strictEqual(typeof security.decryptDataAsync, "function");
			});

			it("should export a generateHash method", () => {
				assert.strictEqual(typeof security.generateHash, "function");
			});

			it("should export a compareHash method", () => {
				assert.strictEqual(typeof security.compareHash, "function");
			});

			context("generateEncryptedDataAsync method", () => {
				it("should generate a hash in an async manner", async () => {
					let token = await security.generateEncryptedDataAsync(TEST_INPUT);
					assert.strictEqual(typeof token, "string");
				});
			});

			context("decryptDataAsync method", () => {
				it("should decrypt a given data in an async manner", async () => {
					let token = await security.generateEncryptedDataAsync(TEST_INPUT, process.env.APP_SECRET);
					let decoded = await security.decryptDataAsync(token, process.env.APP_SECRET);
					assert.strictEqual(decoded, TEST_INPUT);
				});

				it("should test", async () => {
					let token = await security.generateEncryptedDataAsync(TEST_INPUT, process.env.APP_SECRET);
					let decoded = await security.decryptDataAsync(token, process.env.APP_SECRET);
					assert.strictEqual(decoded, TEST_INPUT);
				});
			});

			context("generateEncryptedDataAsync method", () => {
				it("should generate a hash in an async and deterministic manner", async () => {
					let token = await security.generateEncryptedDataAsync(
						TEST_INPUT,
						CUSTOM_SALT,
						true
					);
					let token2 = await security.generateEncryptedDataAsync(
						TEST_INPUT,
						CUSTOM_SALT,
						true
					);
					let token3 = await security.generateEncryptedDataAsync(
						TEST_INPUT,
						CUSTOM_SALT
					);
					assert.strictEqual(typeof token, "string");
					assert.strictEqual(typeof token2, "string");
					assert.strictEqual(typeof token3, "string");
					assert.strictEqual(token, token2);
					assert.notStrictEqual(token, token3);
				});
			});

			context("decryptDataAsync method", () => {
				it("should decrypt a given data in an async and deterministic manner", async () => {
					let token = await security.generateEncryptedDataAsync(
						TEST_INPUT,
						CUSTOM_SALT,
						true
					);

					let decoded = await security.decryptDataAsync(token, CUSTOM_SALT, true);

					assert.strictEqual(decoded, TEST_INPUT);
				});
			});


			context("generateHash method", () => {
				it("should generate a hash based on a given string", async () => {
					let hash = await security.generateHash(
						LONG_INPUT
					);

					assert.strictEqual(typeof hash, "string");
				});
			});

			context("compareHash method", () => {
				it("should generate a hash based on a given string", async () => {
					let hash = await security.generateHash(
						LONG_INPUT
					);

					let result = await security.compareHash(LONG_INPUT, hash);

					assert.isTrue(result, "Hash validation is working as expected");
				});
			});
		});
	});

};
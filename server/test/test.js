(function (process) {
	"use strict";

	require("dotenv").config({
		"silent": true
	});

	process.env.TEST_ENV = true;

	describe("EPM Platform App", function () {
		require("./security-test")();
	});

}(process));
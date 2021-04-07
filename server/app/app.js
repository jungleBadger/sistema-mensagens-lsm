"use strict";

const dotenv = require("dotenv");
const run = require("./server");

dotenv.config();

(async () => {
	return await run();
})();

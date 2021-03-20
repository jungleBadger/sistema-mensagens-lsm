"use strict";

const dotenv = require("dotenv");
const run = require("./server");

dotenv.config({ "silent": true });

(async () => {
	return await run();
})();

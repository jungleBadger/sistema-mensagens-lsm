"use strict";

const dotenv = require("dotenv");
dotenv.config();
const run = require("./server");


(async () => {
	return await run();
})();

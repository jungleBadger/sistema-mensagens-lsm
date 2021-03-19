"use strict";

import * as dotenv from "dotenv";
import { run } from "./server";
const dotEnvProps: any = { "silent": true };

dotenv.config(dotEnvProps);

(async () => {
    return await run();
})();

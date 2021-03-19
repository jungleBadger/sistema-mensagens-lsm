"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = express_1.Router();
router.get("/test", async (req, res) => {
    return res.send(200).send("ok");
});
exports.default = router;

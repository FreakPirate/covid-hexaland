"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const cookie_parser_1 = tslib_1.__importDefault(require("cookie-parser"));
const express_1 = tslib_1.__importDefault(require("express"));
const morgan_1 = tslib_1.__importDefault(require("morgan"));
const path_1 = tslib_1.__importDefault(require("path"));
const _routes_1 = tslib_1.__importDefault(require("@routes"));
const http_status_codes_1 = require("http-status-codes");
const app = express_1.default();
app.use(express_1.default.static(path_1.default.join("client/build")));
app.use(morgan_1.default("dev"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(cookie_parser_1.default());
app.use(express_1.default.static(path_1.default.join(__dirname, "public")));
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "DELETE");
    next();
});
app.use("/api", _routes_1.default);
app.get("*", (req, res) => {
    res.status(http_status_codes_1.NOT_FOUND).json({
        error: true,
        message: "resource not found",
    });
});
app.get("*", (req, res) => {
    res.sendFile(path_1.default.join("../client/build/index.html"));
});
exports.default = app;
//# sourceMappingURL=server.js.map
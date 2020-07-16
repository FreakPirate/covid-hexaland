"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hexagonValidator = exports.hexagonSchema = void 0;
const tslib_1 = require("tslib");
const fastest_validator_1 = tslib_1.__importDefault(require("fastest-validator"));
const v = new fastest_validator_1.default();
exports.hexagonSchema = {
    name: {
        type: "string",
        optional: false,
        empty: false,
        trim: true,
        size: 20,
    },
    neighbor: {
        type: "string",
        optional: false,
        empty: false,
        trim: true,
        size: 20,
    },
    border: {
        type: "number",
        max: 5,
        min: 0,
        integer: true,
    },
    $$strict: true,
};
exports.hexagonValidator = v.compile(exports.hexagonSchema);
//# sourceMappingURL=hexagonValidation.js.map
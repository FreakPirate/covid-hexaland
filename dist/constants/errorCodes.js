"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ERROR_MESSAGES = exports.ERROR_CODE_PATH_DOES_NOT_EXIST = exports.ERROR_CODE_INVALID_NAME = exports.ERROR_CODE_BORDER_TAKEN = exports.ERROR_CODE_INVALID_NEIGHBOR = exports.ERROR_CODE_HEXAGON_PRESENT = void 0;
exports.ERROR_CODE_HEXAGON_PRESENT = 1;
exports.ERROR_CODE_INVALID_NEIGHBOR = 2;
exports.ERROR_CODE_BORDER_TAKEN = 3;
exports.ERROR_CODE_INVALID_NAME = 4;
exports.ERROR_CODE_PATH_DOES_NOT_EXIST = 5;
exports.ERROR_MESSAGES = {
    [exports.ERROR_CODE_HEXAGON_PRESENT]: "Hexagon name already present",
    [exports.ERROR_CODE_INVALID_NEIGHBOR]: "Neighbor already present",
    [exports.ERROR_CODE_BORDER_TAKEN]: "Border is taken",
    [exports.ERROR_CODE_INVALID_NAME]: "Hexagon not present",
    [exports.ERROR_CODE_PATH_DOES_NOT_EXIST]: "Can not remove %(name)! No other path exists amongst surrounding neighbors",
};
//# sourceMappingURL=errorCodes.js.map
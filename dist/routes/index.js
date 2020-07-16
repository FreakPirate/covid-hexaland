"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = require("express");
const _models_1 = require("@models");
const http_status_codes_1 = require("http-status-codes");
const _validations_1 = require("@validations");
const _constants_1 = require("@constants");
const _shared_1 = require("@shared");
const router = express_1.Router();
router.get("/hexagon", (req, res) => {
    res.status(http_status_codes_1.OK).json(_models_1.Cluster.getInstance().queryAll());
});
router.get("/hexagon/:name", (req, res) => {
    const result = _models_1.Cluster.getInstance().query(req.params.name);
    if (!result) {
        res.status(http_status_codes_1.NOT_FOUND).json({
            error: true,
            message: _constants_1.ERROR_MESSAGES[_constants_1.ERROR_CODE_INVALID_NAME],
        });
    }
    else {
        res.status(http_status_codes_1.OK).json(result);
    }
});
router.post("/hexagon", (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const hexagon = req.body;
    const valid = yield _validations_1.hexagonValidator(hexagon);
    if (valid !== true) {
        res.status(http_status_codes_1.UNPROCESSABLE_ENTITY).json(valid[0]);
        return;
    }
    const error = _models_1.Cluster.getInstance().add(hexagon);
    if (error) {
        _shared_1.logger.error(JSON.stringify(error));
        res.status(http_status_codes_1.UNPROCESSABLE_ENTITY).json({
            error: true,
            message: error,
        });
    }
    else {
        res.status(http_status_codes_1.OK).json({
            success: true,
            message: _constants_1.HEXAGON_ADDED_SUCCESSFULLY,
        });
    }
}));
router.delete("/hexagon/:name", (req, res) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const error = _models_1.Cluster.getInstance().remove(req.params.name);
    if (error) {
        _shared_1.logger.error(JSON.stringify(error));
        res.status(http_status_codes_1.UNPROCESSABLE_ENTITY).json({
            error: true,
            message: error,
        });
    }
    else {
        res.status(http_status_codes_1.OK).json({
            success: true,
            message: _constants_1.HEXAGON_DELETED_SUCCESSFULLY,
        });
    }
}));
exports.default = router;
//# sourceMappingURL=index.js.map
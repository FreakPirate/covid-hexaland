"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cluster = void 0;
const _shared_1 = require("@shared");
const _constants_1 = require("@constants");
class Cluster {
    constructor() {
        this.queryAll = () => {
            const result = {};
            for (const [name, value] of Object.entries(this.cluster)) {
                result[name] = value.neighbors;
            }
            return result;
        };
        this.query = (name) => {
            return this.cluster[name].neighbors;
        };
        this.addNewNode = (name, neighbor, border) => {
            const [neighborX, neighborY] = this.cluster[neighbor].coordinates;
            const newCoordinates = _shared_1.calculateCoordinates(neighborX, neighborY, border);
            this.cluster[name] = {
                neighbors: _shared_1.getNewNeighbors(),
                coordinates: newCoordinates,
            };
            this.cluster[name].neighbors[_shared_1.getOppositeBorder(border)] = neighbor;
            this.cluster[neighbor].neighbors[border] = name;
            this.coordinateMapping[newCoordinates.toString()] = name;
            return newCoordinates;
        };
        this.add = (hexagonData) => {
            if (this.cluster[hexagonData.name]) {
                return _constants_1.ERROR_MESSAGES[_constants_1.ERROR_CODE_HEXAGON_PRESENT];
            }
            if (!this.cluster[hexagonData.neighbor]) {
                return _constants_1.ERROR_MESSAGES[_constants_1.ERROR_CODE_INVALID_NEIGHBOR];
            }
            if (this.cluster[hexagonData.neighbor].neighbors[hexagonData.border]) {
                return _constants_1.ERROR_MESSAGES[_constants_1.ERROR_CODE_BORDER_TAKEN];
            }
            const newCoordinates = this.addNewNode(hexagonData.name, hexagonData.neighbor, hexagonData.border);
            [...Array(6).keys()].forEach((border) => {
                if (_shared_1.getOppositeBorder(border) === hexagonData.border) {
                    return;
                }
                const neighborCoordinates = _shared_1.calculateCoordinates(newCoordinates[0], newCoordinates[1], border);
                if (this.coordinateMapping[neighborCoordinates.toString()]) {
                    const potentialNeighbor = this.coordinateMapping[neighborCoordinates.toString()];
                    this.cluster[hexagonData.name].neighbors[border] = potentialNeighbor;
                    this.cluster[potentialNeighbor].neighbors[_shared_1.getOppositeBorder(border)] =
                        hexagonData.name;
                }
            });
        };
        this.remove = (name) => {
            if (!this.cluster[name]) {
                return _constants_1.ERROR_MESSAGES[_constants_1.ERROR_CODE_INVALID_NAME];
            }
            if (!_shared_1.pathExists(this.cluster, name)) {
                return _constants_1.ERROR_MESSAGES[_constants_1.ERROR_CODE_PATH_DOES_NOT_EXIST];
            }
            const neighbors = this.cluster[name].neighbors;
            neighbors.forEach((neighbor, border) => {
                if (neighbor === null) {
                    return;
                }
                this.cluster[neighbor].neighbors[_shared_1.getOppositeBorder(border)] = null;
            });
            delete this.cluster[name];
        };
        this.cluster = {
            ax: {
                coordinates: [0, 0],
                neighbors: _shared_1.getNewNeighbors(),
            },
        };
        this.coordinateMapping = {
            [[0, 0].toString()]: "ax",
        };
        this.add({
            name: "bx",
            neighbor: "ax",
            border: 1,
        });
        this.add({
            name: "cx",
            neighbor: "bx",
            border: 2,
        });
        this.add({
            name: "dx",
            neighbor: "cx",
            border: 2,
        });
        this.add({
            name: "dx",
            neighbor: "cx",
            border: 2,
        });
        this.add({
            name: "ex",
            neighbor: "dx",
            border: 3,
        });
        this.add({
            name: "fx",
            neighbor: "ex",
            border: 4,
        });
        this.add({
            name: "gx",
            neighbor: "fx",
            border: 4,
        });
        this.add({
            name: "nx",
            neighbor: "cx",
            border: 3,
        });
        this.add({
            name: "hx",
            neighbor: "gx",
            border: 5,
        });
        this.add({
            name: "mx",
            neighbor: "ax",
            border: 3,
        });
    }
}
exports.Cluster = Cluster;
Cluster.getInstance = () => {
    if (!Cluster.instance) {
        Cluster.instance = new Cluster();
    }
    return Cluster.instance;
};
//# sourceMappingURL=cluster.js.map
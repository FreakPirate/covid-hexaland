"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateCoordinates = exports.pathExists = exports.getNewBorders = exports.enqueuePotentialNeighbors = exports.getNewNeighbors = exports.getNeighboringBorders = exports.getOppositeBorder = exports.getNormalizedBorder = void 0;
const _constants_1 = require("@constants");
exports.getNormalizedBorder = (border) => {
    if (border >= _constants_1.MAX_BORDER) {
        return border - _constants_1.MAX_BORDER;
    }
    if (border < _constants_1.MIN_BORDER) {
        return border + _constants_1.MAX_BORDER;
    }
    return border;
};
exports.getOppositeBorder = (border) => {
    return exports.getNormalizedBorder(border + 3);
};
exports.getNeighboringBorders = (border) => {
    return [exports.getNormalizedBorder(border + 1), exports.getNormalizedBorder(border - 1)];
};
exports.getNewNeighbors = () => {
    const newNeighbors = [null, null, null, null, null, null];
    return newNeighbors;
};
exports.enqueuePotentialNeighbors = (queue, cluster, hexagonData, visitedNeighbors) => {
    const neighboringBorders = exports.getNeighboringBorders(hexagonData.border);
    neighboringBorders.forEach((border) => {
        const potentialNeighbor = cluster[hexagonData.neighbor].neighbors[border];
        if (potentialNeighbor && !visitedNeighbors.includes(potentialNeighbor)) {
            visitedNeighbors.push(potentialNeighbor);
            queue.push({
                newHexagon: hexagonData.name,
                currentNeighbor: hexagonData.neighbor,
                newBorder: hexagonData.border,
                potentialNeighbor,
                potentialNeighborBorder: border,
            });
        }
    });
    return queue;
};
exports.getNewBorders = (oldNeighborBorder, newNeighborBorder) => {
    const diff = oldNeighborBorder - newNeighborBorder;
    let newBorderForNeighbor;
    if (diff === -1) {
        newBorderForNeighbor = exports.getNormalizedBorder(exports.getOppositeBorder(oldNeighborBorder) - 1);
    }
    else {
        newBorderForNeighbor = exports.getNormalizedBorder(exports.getOppositeBorder(oldNeighborBorder) + 1);
    }
    const newBorderForHexagon = exports.getOppositeBorder(newBorderForNeighbor);
    return [newBorderForNeighbor, newBorderForHexagon];
};
exports.pathExists = (cluster, hexagonToBeDeleted) => {
    const dummyCluster = JSON.parse(JSON.stringify(cluster));
    const neighbors = dummyCluster[hexagonToBeDeleted].neighbors;
    neighbors.forEach((neighbor, border) => {
        if (neighbor === null) {
            return;
        }
        dummyCluster[neighbor].neighbors[exports.getOppositeBorder(border)] = null;
    });
    delete dummyCluster[hexagonToBeDeleted];
    const validNeighbors = neighbors
        .filter((neighbor) => {
        return neighbor !== null;
    })
        .sort();
    const traversedHexagons = [validNeighbors[0]];
    const queue = [validNeighbors[0]];
    while (queue.length !== 0) {
        const hexagon = queue.shift();
        const dummyNeighbors = dummyCluster[hexagon].neighbors;
        dummyNeighbors.forEach((neighbor) => {
            if (neighbor === null || traversedHexagons.includes(neighbor)) {
                return;
            }
            traversedHexagons.push(neighbor);
            queue.push(neighbor);
        });
    }
    return (JSON.stringify(traversedHexagons
        .filter((hexagon) => validNeighbors.includes(hexagon))
        .sort()) === JSON.stringify(validNeighbors));
};
exports.calculateCoordinates = (x, y, border) => {
    switch (border) {
        case 0:
            return [x, y - 1];
        case 1:
            return [x + 1, y - 1];
        case 2:
            return [x + 1, y];
        case 3:
            return [x, y + 1];
        case 4:
            return [x - 1, y + 1];
        case 5:
            return [x - 1, y];
        default:
            return [x, y];
    }
};
//# sourceMappingURL=clusterOperations.js.map
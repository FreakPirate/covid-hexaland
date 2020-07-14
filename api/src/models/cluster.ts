import {
  ICluster,
  IHexagonInput,
  IPotentialNeighbor,
  TNeighbors,
  ICoordinateMapping,
} from "@typings";
import {
  getNewNeighbors,
  getOppositeBorder,
  enqueuePotentialNeighbors,
  getNewBorders,
  pathExists,
  calculateCoordinates,
} from "@shared";
import {
  ERROR_MESSAGES,
  ERROR_CODE_PATH_DOES_NOT_EXIST,
  ERROR_CODE_HEXAGON_PRESENT,
  ERROR_CODE_INVALID_NEIGHBOR,
  ERROR_CODE_BORDER_TAKEN,
  ERROR_CODE_INVALID_NAME,
} from "@constants";

export class Cluster {
  private static instance: Cluster;
  private cluster!: ICluster;
  private coordinateMapping!: ICoordinateMapping;

  private constructor() {
    this.cluster = {
      ax: {
        coordinates: [0, 0],
        neighbors: getNewNeighbors(),
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

  public static getInstance = (): Cluster => {
    if (!Cluster.instance) {
      Cluster.instance = new Cluster();
    }

    return Cluster.instance;
  };

  public queryAll = () => {
    const result: {
      [key: string]: TNeighbors;
    } = {};

    for (const [name, value] of Object.entries(this.cluster)) {
      result[name] = value.neighbors;
    }
    return result;
  };

  public query = (name: string) => {
    return this.cluster[name].neighbors;
  };

  private addNewNode = (name: string, neighbor: string, border: number) => {
    const [neighborX, neighborY] = this.cluster[neighbor].coordinates;

    const newCoordinates = calculateCoordinates(neighborX, neighborY, border);
    this.cluster[name] = {
      neighbors: getNewNeighbors(),
      coordinates: newCoordinates,
    };

    this.cluster[name].neighbors[getOppositeBorder(border)] = neighbor;
    this.cluster[neighbor].neighbors[border] = name;
    this.coordinateMapping[newCoordinates.toString()] = name;

    return newCoordinates;
  };

  public add = (hexagonData: IHexagonInput) => {
    if (this.cluster[hexagonData.name]) {
      return ERROR_MESSAGES[ERROR_CODE_HEXAGON_PRESENT];
    }

    if (!this.cluster[hexagonData.neighbor]) {
      return ERROR_MESSAGES[ERROR_CODE_INVALID_NEIGHBOR];
    }

    if (this.cluster[hexagonData.neighbor].neighbors[hexagonData.border]) {
      return ERROR_MESSAGES[ERROR_CODE_BORDER_TAKEN];
    }

    // add new hexagon to given neighbor and in coordinate mapping
    const newCoordinates = this.addNewNode(
      hexagonData.name,
      hexagonData.neighbor,
      hexagonData.border
    );

    // For each border of new hexagon calculate neighbor coordinate and check if that neighbor coordinate exist 
    [...Array(6).keys()].forEach((border) => {
      if (getOppositeBorder(border) === hexagonData.border) {
        return;
      }

      const neighborCoordinates = calculateCoordinates(
        newCoordinates[0],
        newCoordinates[1],
        border
      );

      if (this.coordinateMapping[neighborCoordinates.toString()]) {
        const potentialNeighbor = this.coordinateMapping[
          neighborCoordinates.toString()
        ];
        this.cluster[hexagonData.name].neighbors[border] = potentialNeighbor;
        this.cluster[potentialNeighbor].neighbors[getOppositeBorder(border)] =
          hexagonData.name;
      }
    });
  };

  public remove = (name: string) => {
    if (!this.cluster[name]) {
      return ERROR_MESSAGES[ERROR_CODE_INVALID_NAME];
    }

    if (!pathExists(this.cluster, name)) {
      return ERROR_MESSAGES[ERROR_CODE_PATH_DOES_NOT_EXIST];
    }

    const neighbors = this.cluster[name].neighbors;

    /**
     * Deleting mapping of hexagon in question from neighbors
     */
    neighbors.forEach((neighbor, border) => {
      if (neighbor === null) {
        return;
      }

      this.cluster[neighbor].neighbors[getOppositeBorder(border)] = null;
    });

    // Deleting hexagon in question
    delete this.cluster[name];
  };
}

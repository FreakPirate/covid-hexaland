import { ICluster, IHexagonInput, IPotentialNeighbor } from "@typings";
import {
  getNewNeighbors,
  getOppositeBorder,
  enqueuePotentialNeighbors,
  getNewBorders,
  pathExists,
} from "@shared";
import {
  ERROR_MESSAGES,
  ERROR_CODE_PATH_DOES_NOT_EXIST,
  ERROR_CODE_HEXAGON_PRESENT,
  ERROR_CODE_INVALID_NEIGHBOR,
  ERROR_CODE_BORDER_TAKEN,
  ERROR_CODE_INVALID_NAME,
} from "@constants";
import { sprintf } from "sprintf-js";

export class Cluster {
  private static instance: Cluster;
  private cluster!: ICluster;

  private constructor() {
    this.cluster = {
      ax: getNewNeighbors(),
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
  }

  public static getInstance = (): Cluster => {
    if (!Cluster.instance) {
      Cluster.instance = new Cluster();
    }

    return Cluster.instance;
  };

  public queryAll = (): ICluster => {
    return this.cluster;
  };

  public query = (name: string) => {
    return this.cluster[name];
  };

  public add = (hexagonData: IHexagonInput) => {
    if (this.cluster[hexagonData.name]) {
      return ERROR_MESSAGES[ERROR_CODE_HEXAGON_PRESENT];
    }

    if (!this.cluster[hexagonData.neighbor]) {
      return ERROR_MESSAGES[ERROR_CODE_INVALID_NEIGHBOR];
    }

    if (this.cluster[hexagonData.neighbor][hexagonData.border]) {
      return ERROR_MESSAGES[ERROR_CODE_BORDER_TAKEN];
    }

    // add new hexagon to given neighbor and create queue to process further
    const visitedNeighbors = [hexagonData.neighbor];
    this.cluster[hexagonData.name] = getNewNeighbors();
    this.cluster[hexagonData.name][getOppositeBorder(hexagonData.border)] =
      hexagonData.neighbor;
    this.cluster[hexagonData.neighbor][hexagonData.border] = hexagonData.name;

    const queue: IPotentialNeighbor[] = enqueuePotentialNeighbors(
      [],
      this.cluster,
      hexagonData,
      visitedNeighbors
    );

    /**
     * Queue processing
     * Identifying potential neighbors by traversing neighbors of neighbors
     */
    while (queue.length !== 0) {
      const data = queue.shift()!;
      const [border1, border2] = getNewBorders(
        data.potentialNeighborBorder,
        data.newBorder
      );
      this.cluster[data.potentialNeighbor][border1] = data.newHexagon;
      this.cluster[data.newHexagon][border2] = data.potentialNeighbor;

      enqueuePotentialNeighbors(
        queue,
        this.cluster,
        {
          name: data.newHexagon,
          neighbor: data.potentialNeighbor,
          border: border1,
        },
        visitedNeighbors
      );
    }
  };

  public remove = (name: string) => {
    if (!this.cluster[name]) {
      return ERROR_MESSAGES[ERROR_CODE_INVALID_NAME];
    }

    if (!pathExists(this.cluster, name)) {
      return ERROR_MESSAGES[ERROR_CODE_PATH_DOES_NOT_EXIST];
    }

    const neighbors = this.cluster[name];

    /**
     * Deleting mapping of hexagon in question from neighbors
     */
    neighbors.forEach((neighbor, border) => {
      if (neighbor === null) {
        return;
      }

      this.cluster[neighbor][getOppositeBorder(border)] = null;
    });

    // Deleting hexagon in question
    delete this.cluster[name];
  };
}

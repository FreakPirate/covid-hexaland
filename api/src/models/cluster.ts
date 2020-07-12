import { ICluster, IHexagonInput, IPotentialNeighbor } from "@typings";
import {
  getNewNeighbors,
  getOppositeBorder,
  insertNeighborsInQueue,
  getNewBorders,
  pathExists,
} from "@shared";

export class Cluster {
  private static instance: Cluster;
  private cluster!: ICluster;

  private constructor() {
    this.cluster = {
      ax: getNewNeighbors(),
    };
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
      return "hexagon already exist";
    }

    if (!this.cluster[hexagonData.neighbor]) {
      return "invalid neighbor";
    }

    if (this.cluster[hexagonData.neighbor][hexagonData.border]) {
      return "border is taken";
    }

    const traversedHexagons = [hexagonData.neighbor];
    this.cluster[hexagonData.name] = getNewNeighbors();
    this.cluster[hexagonData.name][getOppositeBorder(hexagonData.border)] =
      hexagonData.neighbor;
    this.cluster[hexagonData.neighbor][hexagonData.border] = hexagonData.name;

    const queue: IPotentialNeighbor[] = insertNeighborsInQueue(
      [],
      this.cluster,
      hexagonData,
      traversedHexagons
    );

    while (queue.length !== 0) {
      const data = queue.shift()!;
      const [border1, border2] = getNewBorders(
        data.potentialNeighborBorder,
        data.newBorder
      );
      this.cluster[data.potentialNeighbor][border1] = data.newHexagon;
      this.cluster[data.newHexagon][border2] = data.potentialNeighbor;

      insertNeighborsInQueue(
        queue,
        this.cluster,
        {
          name: data.newHexagon,
          neighbor: data.potentialNeighbor,
          border: border1,
        },
        traversedHexagons
      );
    }
    return null;
  };

  public remove = (name: string) => {
    if (!this.cluster[name]) {
      return "invalid hexagon name";
    }

    if (!pathExists(this.cluster, name)) {
      return `can not remove ${name}`;
    }

    const neighbors = this.cluster[name];

    neighbors.forEach((neighbor, border) => {
      if (neighbor === null) {
        return;
      }

      this.cluster[neighbor][getOppositeBorder(border)] = null;
    });

    delete this.cluster[name];
  };
}

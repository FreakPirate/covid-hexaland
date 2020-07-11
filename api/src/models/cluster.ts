import { ICluster } from "@typings";

export default class Cluster {
  private static instance: Cluster;
  private cluster!: ICluster;

  private constructor() {
    this.cluster = {
      ax: [null, null, null, null, null, null],
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
}

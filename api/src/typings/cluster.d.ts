type TNeighbor = string | null;

export type TNeighbors = [
  TNeighbor,
  TNeighbor,
  TNeighbor,
  TNeighbor,
  TNeighbor,
  TNeighbor
];

export interface ICluster {
  [key: string]: TNeighbors;
}

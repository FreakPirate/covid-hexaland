export type TNeighbor = string | null;

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

export interface IHexagonInput {
  name: string;
  neighbor: string;
  border: number;
}

export interface IPotentialNeighbor {
  newHexagon: string;
  currentNeighbor: string;
  newBorder: number;
  potentialNeighbor: string;
  potentialNeighborBorder: number;
}

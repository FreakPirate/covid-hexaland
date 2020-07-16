export type TNeighbor = string | null;

export type TNeighbors = [
  TNeighbor,
  TNeighbor,
  TNeighbor,
  TNeighbor,
  TNeighbor,
  TNeighbor
];

export type TCoordinate = [number, number];

export interface ICoordinateMapping {
  [coordinate: string]: string;
}

export interface ICluster {
  [key: string]: {
    neighbors: TNeighbors;
    coordinates: TCoordinate;
  };
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

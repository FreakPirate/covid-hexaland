import { MAX_BORDER, MIN_BORDER } from "@constants";
import {
  TNeighbors,
  ICluster,
  IHexagonInput,
  IPotentialNeighbor,
  TCoordinate,
} from "@typings";

/**
 * Normalizes border to fit in range between 0 to 5
 * @param border
 */
export const getNormalizedBorder = (border: number) => {
  if (border >= MAX_BORDER) {
    return border - MAX_BORDER;
  }

  if (border < MIN_BORDER) {
    return border + MAX_BORDER;
  }

  return border;
};

/**
 * Border of new hexagon is opposite of adjacent's border
 * @param border
 */
export const getOppositeBorder = (border: number) => {
  return getNormalizedBorder(border + 3);
};

/**
 * Neighboring borders would be +1 & -1 of the given border
 * @param border
 */
export const getNeighboringBorders = (border: number) => {
  return [getNormalizedBorder(border + 1), getNormalizedBorder(border - 1)];
};

/**
 * Initializer for new hexagon
 */
export const getNewNeighbors = (): TNeighbors => {
  const newNeighbors: TNeighbors = [null, null, null, null, null, null];
  return newNeighbors;
};

/**
 * While adding a new hexagonA to hexagonX need to determine potential neighbors of hexagonA
 * @param queue
 * @param cluster
 * @param hexagonData
 * @param traversedHexagons
 */
export const enqueuePotentialNeighbors = (
  queue: IPotentialNeighbor[],
  cluster: ICluster,
  hexagonData: IHexagonInput,
  visitedNeighbors: string[]
) => {
  const neighboringBorders = getNeighboringBorders(hexagonData.border);
  neighboringBorders.forEach((border) => {
    const potentialNeighbor = cluster[hexagonData.neighbor].neighbors[border];

    // Checking if potential neighbor has already been visited
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

/**
 * To determine borders corresponding new hexagon and potential neighbor
 * @param oldNeighborBorder
 * @param newNeighborBorder
 */
export const getNewBorders = (
  oldNeighborBorder: number,
  newNeighborBorder: number
) => {
  const diff = oldNeighborBorder - newNeighborBorder;
  let newBorderForNeighbor;
  if (diff === -1) {
    newBorderForNeighbor = getNormalizedBorder(
      getOppositeBorder(oldNeighborBorder) - 1
    );
  } else {
    newBorderForNeighbor = getNormalizedBorder(
      getOppositeBorder(oldNeighborBorder) + 1
    );
  }
  const newBorderForHexagon = getOppositeBorder(newBorderForNeighbor);
  return [newBorderForNeighbor, newBorderForHexagon];
};

/**
 * Determining if a path exists between surrounding neighbors other than the hexagon to be deleted
 * @param cluster
 * @param hexagonToBeDeleted
 */
export const pathExists = (cluster: ICluster, hexagonToBeDeleted: string) => {
  /**
   * APPROACH:
   * - Delete the hexagon in question
   * - BFS traversal starting from a random neighbor of the deleted hexagon
   * - Check if all neighbors are reachable
   */
  const dummyCluster: ICluster = JSON.parse(JSON.stringify(cluster));
  const neighbors = dummyCluster[hexagonToBeDeleted].neighbors;

  /**
   * Deleting mapping of hexagon in question from neighbors
   */
  neighbors.forEach((neighbor, border) => {
    if (neighbor === null) {
      return;
    }

    dummyCluster[neighbor].neighbors[getOppositeBorder(border)] = null;
  });

  // deleting hexagon in question
  delete dummyCluster[hexagonToBeDeleted];

  const validNeighbors = neighbors
    .filter((neighbor) => {
      return neighbor !== null;
    })
    .sort();

  const traversedHexagons = [validNeighbors[0]];
  const queue = [validNeighbors[0]];

  /**
   * BFS to create an undirected graph in form of array
   */
  while (queue.length !== 0) {
    const hexagon = queue.shift()!;

    const dummyNeighbors = dummyCluster[hexagon].neighbors;
    dummyNeighbors.forEach((neighbor) => {
      if (neighbor === null || traversedHexagons.includes(neighbor)) {
        return;
      }

      traversedHexagons.push(neighbor);
      queue.push(neighbor);
    });
  }

  /**
   * Checking intersection between original neighbors and reachable hexagons
   */
  return (
    JSON.stringify(
      traversedHexagons
        .filter((hexagon) => validNeighbors.includes(hexagon))
        .sort()
    ) === JSON.stringify(validNeighbors)
  );
};

export const calculateCoordinates = (
  x: number,
  y: number,
  border: number
): TCoordinate => {
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

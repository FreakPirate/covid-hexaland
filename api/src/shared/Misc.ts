import { logger } from "./Logger";
import { MAX_BORDER, MIN_BORDER } from "@constants";
import {
  TNeighbors,
  ICluster,
  IHexagonInput,
  IPotentialNeighbor,
} from "@typings";

export const paramMissingError =
  "One or more of the required parameters was missing.";

export const pErr = (err: Error) => {
  if (err) {
    logger.error(err);
  }
};

export const getRandomInt = () => {
  return Math.floor(Math.random() * 1_000_000_000_000);
};

export const getNormalizedBorder = (border: number) => {
  if (border >= MAX_BORDER) {
    return border - MAX_BORDER;
  }

  if (border < MIN_BORDER) {
    return border + MAX_BORDER;
  }

  return border;
};

export const getOppositeBorder = (border: number) => {
  return getNormalizedBorder(border + 3);
};

export const getNeighboringBorders = (border: number) => {
  return [getNormalizedBorder(border + 1), getNormalizedBorder(border - 1)];
};

export const getNewNeighbors = (): TNeighbors => {
  const newNeighbors: TNeighbors = [null, null, null, null, null, null];
  return newNeighbors;
};

export const insertNeighborsInQueue = (
  queue: IPotentialNeighbor[],
  cluster: ICluster,
  hexagonData: IHexagonInput,
  traversedHexagons: string[]
) => {
  const neighboringBorders = getNeighboringBorders(hexagonData.border);
  neighboringBorders.forEach((border) => {
    const potentialNeighbor = cluster[hexagonData.neighbor][border];
    if (potentialNeighbor && !traversedHexagons.includes(potentialNeighbor)) {
      traversedHexagons.push(potentialNeighbor);
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

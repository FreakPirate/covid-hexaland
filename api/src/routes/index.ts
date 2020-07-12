import { Router, Request, Response } from "express";
import { Cluster } from "@models";
import { NOT_FOUND, OK, UNPROCESSABLE_ENTITY } from "http-status-codes";
import { hexagonValidator } from "@validations";
import {
  ERROR_CODE_INVALID_NAME,
  ERROR_MESSAGES,
  HEXAGON_ADDED_SUCCESSFULLY,
  HEXAGON_DELETED_SUCCESSFULLY,
} from "@constants";
import { logger } from "@shared";

// Init router and path
const router = Router();

/**
 * Operation #1 Part #1: Query All hexagons
 */
router.get("/hexagon", (req: Request, res: Response) => {
  res.status(OK).json(Cluster.getInstance().queryAll());
});

/**
 * Operation #1 Part #2: Query specific hexagon
 */
router.get("/hexagon/:name", (req: Request, res: Response) => {
  const result = Cluster.getInstance().query(req.params.name);

  if (!result) {
    res.status(NOT_FOUND).json({
      error: true,
      message: ERROR_MESSAGES[ERROR_CODE_INVALID_NAME],
    });
  } else {
    res.status(OK).json(result);
  }
});

/**
 * Operation #2: add a new hexagon to cluster
 */
router.post("/hexagon", async (req: Request, res: Response) => {
  const hexagon = req.body;
  const valid = await hexagonValidator(hexagon);

  if (valid !== true) {
    res.status(UNPROCESSABLE_ENTITY).json(valid);
    return;
  }

  const error = Cluster.getInstance().add(hexagon);

  if (error) {
    logger.error(JSON.stringify(error));
    res.status(UNPROCESSABLE_ENTITY).json({
      error: true,
      message: error,
    });
  } else {
    res.status(OK).json({
      success: true,
      message: HEXAGON_ADDED_SUCCESSFULLY,
    });
  }
});

/**
 * Operation #3: Delete a given hexagon from cluster
 */
router.delete("/hexagon/:name", async (req: Request, res: Response) => {
  const error = Cluster.getInstance().remove(req.params.name);

  if (error) {
    logger.error(JSON.stringify(error));
    res.status(UNPROCESSABLE_ENTITY).json({
      error: true,
      message: error,
    });
  } else {
    res.status(OK).json({
      success: true,
      message: HEXAGON_DELETED_SUCCESSFULLY,
    });
  }
});

// Export the base-router
export default router;

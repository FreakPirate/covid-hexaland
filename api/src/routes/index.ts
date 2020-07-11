import { Router, Request, Response } from "express";
import Cluster from "src/models/cluster";
import { NOT_FOUND, OK } from "http-status-codes";

// Init router and path
const router = Router();

// Add sub-routes

router.get("/hexagon", (req: Request, res: Response) => {
  res.status(OK).json(Cluster.getInstance().queryAll());
});

router.get("/hexagon/:name", (req: Request, res: Response) => {
  const result = Cluster.getInstance().query(req.params.name);

  if (!result) {
    res.status(NOT_FOUND).json({
      error: true,
      message: "invalid hexagon name",
    });
  } else {
    res.status(OK).json(result);
  }
});

// Export the base-router
export default router;

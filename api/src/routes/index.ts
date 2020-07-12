import { Router, Request, Response } from "express";
import { Cluster } from "@models";
import { NOT_FOUND, OK, UNPROCESSABLE_ENTITY } from "http-status-codes";
import { hexagonValidator } from "@validations";

// Init router and path
const router = Router();

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

router.post("/hexagon", async (req: Request, res: Response) => {
  const hexagon = req.body;
  const valid = await hexagonValidator(hexagon);

  if (valid !== true) {
    res.status(UNPROCESSABLE_ENTITY).json(valid);
    return;
  }

  const error = Cluster.getInstance().add(hexagon);

  if (error) {
    res.status(UNPROCESSABLE_ENTITY).json({
      error: true,
      message: error,
    });
  } else {
    res.status(OK).json({
      success: true,
      message: "hexagon added successfully!",
    });
  }
});

// Export the base-router
export default router;

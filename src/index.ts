import "./loadEnv";
import app from "@server";
import { logger } from "@shared";

/**
 * Starting server
 */
const port = Number(process.env.PORT || 3000);
app.listen(port, () => {
  logger.info("Express server started on port: " + port);
});

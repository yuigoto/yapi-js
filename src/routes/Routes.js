/**
 * YAPI : Routes/Routes
 * ======================================================================
 * API routing manager.
 * ----------------------------------------------------------------------
 * @author    Fabio Y. Goto
 * @since     0.0.1
 */

// Import modules
import { Router } from "express";

// Import local
import Response from "src/core/Response";
import ResponseError from "src/core/ResponseError";
import Healthcheck from "src/core/Healthcheck";
import Auth from "src/routes/api/Auth";
import Messages from "src/routes/api/Messages";

// Start router
const Routes = Router();

// Define API sub-routes
Routes.use("/auth", Auth);
Routes.use("/messages", Messages);

// Healthcheck route
Routes.use("/healthcheck$", (req, res) => {
  res.send(
    new Response(
      "SUCCESS",
      Healthcheck,
      "",
      null,
      {}
    )
  );
});

// Any unmatched routes
Routes.use(/^\/(.+)/, (req, res) => {
  // Send a 404 only
  res.status(404).send(
    new Response(
      "NULL",
      {},
      "Endpoint not found and/or non-existent.",
      new ResponseError(
        404,
        {},
        "Not Found",
        "Endpoint not found and/or non-existent."
      )
    )
  );
});

// Root API Route
Routes.use("/", (req, res) => {
  res.status(403).send(
    new Response(
      "NULL",
      {},
      "Access to this endpoint was denied.",
      new ResponseError(
        403,
        {},
        "Forbidden",
        "Access to this endpoint was denied."
      )
    )
  );
});

// Export routes object
export default Routes;

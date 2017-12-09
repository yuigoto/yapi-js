/**
 * YAPI : Routes/Routes
 * ======================================================================
 * API routing manager.
 * ----------------------------------------------------------------------
 * @author    Fabio Y. Goto <lab@yuiti.com.br>
 * @since     0.0.1
 */

// Import modules
import express, { Router } from "express";

// Import local
import Response from "src/core/Response";
import Error from "src/core/Error";
import Healthcheck from "src/core/Healthcheck";
import Auth from "src/routes/api/Auth";

// Start router
const Routes = Router();

// Define API sub-routes
Routes.use("/auth", Auth);

// Healthcheck route
Routes.use("/healthcheck$", (req, res) => {
  res.send(
    Response(
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
    Response(
      "NULL",
      {},
      "Endpoint not found and/or non-existent.",
      Error(
        404,
        {},
        "Not Found",
        "Endpoint not found and/or non-existent."
      ),
      {}
    )
  );
});

// Root API Route
Routes.use("/", (req, res) => {
  res.status(403).send(
    Response(
      "NULL",
      {},
      "Access to this endpoint was denied.",
      Error(
        403,
        {},
        "Forbidden",
        "Access to this endpoint was denied."
      ),
      {}
    )
  );
});

// Export routes object
export default Routes;

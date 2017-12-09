/**
 * YAPI : Server
 * ======================================================================
 * Application entry point.
 * ----------------------------------------------------------------------
 * @author    Fabio Y. Goto <lab@yuiti.com.br>
 * @since     0.0.1
 */

// Import libs
// ----------------------------------------------------------------------
import express from "express";
import mongoose from "mongoose";

// Import local modules
// ----------------------------------------------------------------------
import Core from "src/core/Core";
import Routes from "src/routes/Routes";

// Set app properties
// ----------------------------------------------------------------------
const app_port  = process.env.PORT || 3000;
const app_env   = process.env.NODE_ENV || "development";

// Initialize Mongoose
// ----------------------------------------------------------------------

// Set promise
mongoose.Promise = global.Promise;

// Connect to database
mongoose.connect(
  Core.database.url,
  Core.database.options
).then((db) => {
  if (db) {
    // Add first user, if non-existent, here
  }
});

// Fire application
// ----------------------------------------------------------------------

// Set app
const app = express();

// Allow app to receive URL encoded and JSON data
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// Define API routes
app.use("/api", Routes);

// Set all unmatched routes to a 404
app.get(/^\/(.+)/, (req, res) => {
  // Send a 404 only
  res.status(404).send("404");
});

// Set app root
app.get("/", (req, res) => {
  res.send("Invalid Request");
});

// Start listening
const server = app.listen(
  app_port,
  () => {
    const { address, port } = server.address();
    if (app_env === "test") console.log("Firing up delicious tests! =9");
    console.log(`Listening for connections on: ${address}:${port}`);
  }
);

// Export server instance
export default server;

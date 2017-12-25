/**
 * YAPI : Server
 * ======================================================================
 * Application entry point.
 * ----------------------------------------------------------------------
 * @author    Fabio Y. Goto
 * @since     0.0.1
 */
// Set environment variables
require('dotenv').config();

// Import libs
// ----------------------------------------------------------------------
import express from "express";
import mongoose from "mongoose";
import path from "path";

// Import local modules
// ----------------------------------------------------------------------
import Core from "src/core/Core";
import Logger from "src/core/Logger";
import Routes from "src/routes/Routes";
import UserModel from "src/models/User.model";

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
  if (db && app_env !== "development" && app_env !== "test") {
    // Add first user, if non-existent, here
    UserModel.find({}, (err, post) => {
      if (err) {
        Logger(
          "Could not search for users in the database.",
          true,
          "red",
          null,
          true
        );
      } else {
        // Add User
        new UserModel(Core.user).save((err, post) => {
          if (err) {
            Logger(
              "Could not save initial user in the database. Check if it either exists or if you've set everything up correctly.",
              true,
              "red",
              null,
              true
            );
          } else {
            Logger(
              "Successfully addded first user",
              true,
              "orange",
              null,
              true
            );
          }
        });
      }
    });
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

// Set app root
app.use("/", express.static("public"));

// Set app root
app.get("/", (req, res) => {
  res.sendFile(
    path.resolve(__dirname, "../public", "index.html")
  );
});

// Set all unmatched routes to a 404
app.get(/^\/(.+)/, (req, res) => {
  // Send a 404 only
  res.status(404).send("404");
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

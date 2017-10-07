/**
 * YX : YAPI (Yuiti's API)
 * ======================================================================
 * A small API project based in Node, Express and MongoDB.
 * ----------------------------------------------------------------------
 * @author      Fabio Y. Goto <lab@yuiti.com.br>
 * @version     0.0.1
 * @copyright   (c) 2017 Fabio Y. Goto
 */

// Load libs
const async         = require("async");
const express       = require("express");
const bodyParser    = require("body-parser");

// Load local modules
const databaseInit  = require("./src/core/db");
const routes        = require("./src/router");
const userInit      = require("./src/core/userInit");

// Load configuration file and global errors object
global.config       = require("./src/config/config");
global.errors       = require("./src/core/errors");
global.objectId     = require("./src/core/objectId");

// Fire express
const app           = express();

// Initialize DB connection and run server
databaseInit((err, dbs) => {
    // If something happened while initializing the database
    if (err) {
        // Log errors to the console
        console.error("Connection to database has failed!");
        console.error(err);
        
        // Quit application
        process.exit(1);
    }
    
    // Fire the server
    async.series(
        [
            (callback) => {
                // Before server fires, check if there's a super admin
                userInit(dbs.authentication, callback);
            }, 
            (callback) => {
                /**
                 * Local middleware function, used to pass the connection
                 * pool and authentication middleware to the API's subroutes.
                 *
                 * @param {object} req
                 *      Request object
                 * @param {object} res
                 *      Response object
                 * @param {object} next
                 *      Next middleware function, used to call the next one
                 *      in the stack
                 */
                const handler       = (req, res, next) => {
                    // Set handler variables
                    req.dbs = dbs;
                    
                    // Move on the the next one
                    next();
                };
                
                // Set express to parse form-encoded and JSON data
                app.use(bodyParser.urlencoded({extended: true}));
                app.use(bodyParser.json());
                
                // Set router to use app, databases and the auth middleware
                //routes(app, dbs, auth);
                
                app.use(
                    "/api",
                    handler,
                    routes
                );
                
                // Fallback route, in case we need one
                /*
                app.all("*", (req, res) => {
                    res.send("Oi");   
                });
                */
            
                app.listen(
                    3000, 
                    () => {
                        // Just log that we're listening! ;)
                        console.log("Listening to connection on port 3000");
                    }
                );

                callback(null, "Initialized");
            }
        ], 
        (err, results) => {
            console.log(results);
        }
    );
});

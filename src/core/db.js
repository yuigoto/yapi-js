/**
 * YX : YAPI : Core/DB
 * ======================================================================
 * Starts the MongoDB connection pool.
 * ----------------------------------------------------------------------
 * @author      Fabio Y. Goto <lab@yuiti.com.br>
 * @since       0.0.1
 */

// Load libs
const async         = require("async");
const MongoClient   = require("mongodb").MongoClient;
const database      = require("../config/database.json");

/**
 * Parses the database configuration from a JSON file.
 * 
 * @param {object} db 
 *      JSON object containing all the parameters 
 */
const dbParser      = (db) => {
    // Set database and auth params
    let auth        = (db.auth) ? db.user + ":" + db.pass + "@" : "";
    let database    = (db.name !== "") ? "/" + db.name : "";
    let port        = (db.port !== "") ? ":" + db.port : "";
    
    // Building arguments
    let args        = [];
    
    // Add arguments
    if (db.ssl) args.push("ssl=true");
    if (db.auth) args.push("authSource=" + db.auth_source);
    
    if (args.length > 0) {
        args = `?${args.join("&")}`;
    } else {
        args = "";
    }

    if (db.auth === true) {
        return `mongodb://${auth + db.url + port + database + args}`;
    } else {
        return `mongodb://${db.url + port + database}`;
    }
};

// Define authentication URIs
const db = {
    default: async.apply(
        MongoClient.connect, 
        (dbParser)(database.default)
    ), 
    authentication: async.apply(
        MongoClient.connect, 
        (dbParser)(database.authentication)
    ), 
    blog: async.apply(
        MongoClient.connect, 
        (dbParser)(database.blog)
    )
};

// Export
module.exports = function(callback) {
    async.parallel(db, callback);
};

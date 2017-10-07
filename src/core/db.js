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
    let auth_source = (db.auth) ? "?authSource=" + db.auth_source : "";
    let database    = (db.name !== "") ? "/" + db.name : "";
    let port        = (db.port !== "") ? ":" + db.port : "";

    if (db.auth === true) {
        return `mongodb://${auth + db.url + port + database + auth_source}`;
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

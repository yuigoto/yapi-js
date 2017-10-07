/**
 * YX : YAPI : Config/Config
 * ======================================================================
 * Exports the global config object.
 * ----------------------------------------------------------------------
 * @author      Fabio Y. Goto <lab@yuiti.com.br>
 * @since       0.0.1
 */

// Import libs
const crypto    = require("crypto-js/md5");

// Load config JSON files
let user = require("./user.json");
let salt = require("./salt.json");

// Set password, e-mail hash, created and updated date for super user (init)
user.pass = crypto(user.pass, salt.salt).toString();
user.hash = crypto(user.email, salt.salt).toString();
user.data.birthday = new Date(user.data.birthday).toISOString();
user.created = new Date().toISOString();
user.updated = user.created;

// Export configuration
module.exports = {
    version: "0.0.1",
    init: {
        user: user
    },
    security: {
        salt: salt.salt
    }
};

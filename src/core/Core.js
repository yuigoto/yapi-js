/**
 * YAPI : Core/Core
 * ======================================================================
 * Core object.
 * ----------------------------------------------------------------------
 * @author    Fabio Y. Goto
 * @since     0.0.1
 */

// Import libs
import crypto_md5 from "crypto-js/md5";

// Import local modules
import DB from "src/core/DB";
import InitUser from "src/core/InitUser";
import Security from "src/core/Security";

// Import config files
import database_config from "src/config/database.config";

// Create a handle for Init User
let user = InitUser();

// Update user data to include hashed properties
user.pass     = crypto_md5(user.pass, Security.salt).toString();
user.hash     = crypto_md5(user.email, Security.salt).toString();
user.created  = new Date();
user.updated  = user.created;

/**
 * Core object.
 *
 * @type {object}
 */
const Core = {
  database: DB(database_config),
  security: Security,
  user: user
};

// Export core
export default Core;

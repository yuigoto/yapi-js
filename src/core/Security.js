/**
 * YAPI : Core/Security
 * ======================================================================
 * Security object, handles security salt and other hashes used internally.
 *
 * IMPORTANT:
 * Once the security salt is first set and users created, DO NOT CHANGE it,
 * unless you want to wipe everything and start fresh.
 * ----------------------------------------------------------------------
 * @author    Fabio Y. Goto <lab@yuiti.com.br>
 * @since     0.0.1
 */

// Import libs
import crypto_md5 from "crypto-js/md5";

// Import local
import UUID from "src/core/UUID";

// Import config files
import security_config from "src/config/security.config";

/**
 * Holds security-related information.
 *
 * @type {object}
 */
const Security = {
  salt: UUID(crypto_md5(security_config.salt).toString())
};

// Export
export default Security;

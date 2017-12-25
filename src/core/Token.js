/**
 * YAPI : Core/Token
 * ======================================================================
 * Functions to sign/generate a JSON Web Token from a user's auth credentials,
 * and to verify/convert back into credentials.
 * ----------------------------------------------------------------------
 * @author    Fabio Y. Goto
 * @since     0.0.1
 */

// Import libs
import jwt from "jsonwebtoken";

// Import local
import Core from "src/core/Core";

/**
 * Contains all the keys required by the token.
 *
 * @type {string[]}
 * @private
 */
const _keys = [
  "uuid",
  "user_id",
  "user",
  "email",
  "roles",
  "groups",
  "generated",
  "expires",
  "data",
  "is_valid",
  "is_public",
  "display_name"
];

/**
 * Works the same way as TokenToPerson, but it's an unsafe decode.
 *
 * Use it only if you know what you're doing!
 *
 * @param {string} token
 *    Token to be verified
 * @returns {object|boolean}
 * @constructor
 */
const TokenDecode = (token) => {
  // Decode
  let decode = jwt.decode(token);

  // Could not decode, send false
  if (!decode) return false;

  // Retrieve keys from person
  let keys = Object.keys(decode);

  // Key counter (0 === invalid)
  let nums = 0;

  // Check if all keys were properly declared
  for (let key of _keys) {
    if (keys.includes(key)) nums += 1;
  }

  // Return
  return (nums === _keys.length) ? decode : false;
};

/**
 * Converts the token back into a credential object, if valid.
 *
 * Returns false if not.
 *
 * @param {string} token
 *    Token to be verified
 * @returns {object|boolean}
 * @constructor
 */
const TokenToPerson = (token) => {
  // Decodes the token
  try {
    let person = jwt.verify(token, Core.security.salt);

    // Retrieve keys from person
    let keys = Object.keys(person);

    // Key counter (0 === invalid)
    let nums = 0;

    // Check if all keys were properly declared
    for (let key of _keys) {
      if (keys.includes(key)) nums += 1;
    }

    // Return
    return (nums === _keys.length) ? person : false;
  } catch (e) {
    // Log errors to console
    // console.error(e);

    // Return false
    return false;
  }
};

/**
 * Signs and returns a JSON Web Token from the given credentials.
 *
 * If no valid credentials are give, returns false.
 *
 * @param {object} person
 *    Object containing the person's credentials
 * @param {number} expires
 *    Value, in seconds, until token expires
 * @returns {string|boolean}
 * @constructor
 */
const PersonToToken = (person, expires) => {
  // Retrieve keys from person
  let keys = Object.keys(person);

  // Key counter (0 === invalid)
  let nums = 0;

  // Check if all keys were properly declared
  for (let key of _keys) {
    if (keys.includes(key)) nums += 1;
  }

  // If all keys were set, return token
  if (nums === _keys.length) {
    let token = jwt.sign(
      person,
      Core.security.salt,
      {
        expiresIn: expires
      }
    );

    // Return token
    return token;
  }

  // Return false as fallback
  return false;
};

// Export function
export default {
  decode: TokenDecode,
  fromPerson: PersonToToken,
  toPerson: TokenToPerson
};

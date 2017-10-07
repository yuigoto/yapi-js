/**
 * YX : YAPI : Core/Auth
 * ======================================================================
 * Express middleware to verify/validate JSON Web Tokens.
 * ----------------------------------------------------------------------
 * @author      Fabio Y. Goto <lab@yuiti.com.br>
 * @since       0.0.1
 */

// Import libs
const jwt           = require("jsonwebtoken");

/**
 * Middleware function, used to validate and verify the user token.
 *
 * @param {object} req
 *      Request object
 * @param {object} res
 *      Response object
 * @param {object} next
 *      Next middleware function, used to call the next one in the stack
 * @returns {mixed}
 */
const auth = (req, res, next) => {
    // Fetch token from the request's body
    let token = req.body.token || req.query.token || req.headers["authorization"];
    
    // If the token was declared...
    if (token) {
        // Use JWT to verify it, by using the security salt
        jwt.verify(token, global.config.security.salt, (err, decoded) => {
            // Get current time
            const now   = new Date().getTime();
            
            // If an error occurred
            if (err) {
                // Validation failed
                return res.json({
                    error: global.errors(true)
                });
            }
            
            // Checks if token expired
            if (decoded.expires - now <= 0) {
                res.send({
                    "message": "",
                    "client": {},
                    "members": {},
                    "date": new Date().toISOString(),
                    "error": global.errors(
                        true,
                        "Token expired.",
                        {},
                        0
                    )
                });
            } else {
                // Set decoded token
                req.decoded = decoded;
    
                // Proceed to the next middleware function
                next();
            }
        });
    } else {
        return res.status(403).json({
            error: global.errors(true)
        });
    }
};

// Export auth module
module.exports = auth;

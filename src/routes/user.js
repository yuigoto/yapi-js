/**
 * YX : YAPI : Routes/User
 * ======================================================================
 * Handles user authentication, token validation and profile management.
 * ----------------------------------------------------------------------
 * @author      Fabio Y. Goto <lab@yuiti.com.br>
 * @since       0.0.1
 */

// Import libs
const jwt       = require("jsonwebtoken");
const async     = require("async");
const crypto    = require("crypto-js/md5");

/**
 * User routes exporter.
 *
 * @param {express.Router} router
 *      Express router instance, handled by the main router
 * @param {object} auth
 *      Authentication middleware function, since globals won't work :/
 */
module.exports = (router, auth) => {
    router.get("/me", auth, (req, res) => {
        // Get DB and token
        const db    = req.dbs.authentication;
        const token = req.decoded;
        const now   = new Date().getTime();
    
        // Generic error message
        const msgs = {
            "message": "",
            "client": {},
            "members": {},
            "date": new Date().toISOString(),
            "error": global.errors(
                true,
                "",
                {},
                0
            )
        };
    
        // Find user
        db.collection("sys_users").findOne(
            {
                user: token.user
            },
            (err, user) => {
                // If error
                if (err) {
                    // Set error message and data
                    msgs.error.errorMessage = "An error ocurred.";
                    msgs.error.data = err;
                }
            
                if (user) {
                    // Clear errors
                    msgs.error.error = false;
                    msgs.error.errorCode = 1;
                
                    // Set data
                    msgs.members = {
                        user: user
                    };
                }
            
                // Send JSON output
                res.send(msgs);
            }
        );
    });
    
    /**
     * Token test/validation.
     */
    router.get("/token", auth, (req, res) => {
        res.send({
            "message": "",
            "client": {},
            "members": {
                "token": req.decoded
            },
            "date": new Date().toISOString(),
            "error": global.errors(
                false,
                "",
                {},
                1
            )
        });
    });
    
    /**
     * Authentication entrypoint.
     */
    router.post("/auth", (req, res) => {
        // Set login request data
        const username = req.body.user;
        const password = crypto(
            req.body.pass,
            global.config.security.salt
        ).toString();
        
        // Get DB
        const db = req.dbs.authentication;
        
        // Generic error message
        const msgs = {
            "message": "",
            "client": {},
            "members": {},
            "date": new Date().toISOString(),
            "error": global.errors(
                true,
                "",
                {},
                0
            )
        };
        
        // Start async waterfall
        async.waterfall(
            [
                (callback) => {
                    // Check if user exists
                    db.collection("sys_users").count({user: username}, (err, count) => {
                        if (count > 0) {
                            // Proceed to next async
                            callback(null, true);
                        } else {
                            // Set message
                            msgs.error.errorMessage = "User not found.";
                            
                            // Send error
                            res.send(msgs);
                            
                            // Stop async
                            callback("stop", false);
                        }
                    });
                },
                (result, callback) => {
                    // Fetch user data and check block
                    db.collection("sys_users").findOne({user: username}, (err, user) => {
                        // If the user's broken, this flag will be true
                        let broken  = false;
                        
                        // Generic error message
                        
                        // General error
                        if (err) {
                            // Set message
                            msgs.error.errorMessage = "General error.";
                            // Set broken
                            broken = true;
                        }
                        
                        // Banned/deleted account
                        if (!broken && user.is_delete) {
                            // Set message
                            msgs.error.errorMessage = "User account banned.";
                            // Set broken
                            broken = true;
                        }
    
                        // Locked account
                        if (!broken && user.is_locked) {
                            // Set message
                            msgs.error.errorMessage = "User account locked.";
                            // Set broken
                            broken = true;
                        }
    
                        // Locked account
                        if (!broken && !user.is_active) {
                            // Set message
                            msgs.error.errorMessage = "Account not yet activated.";
                            // Set broken
                            broken = true;
                        }
                        
                        // Invalid password
                        if (!broken && user.pass != password) {
                            // Set message
                            msgs.error.errorMessage = "Invalid password.";
                            // Set broken
                            broken = true;
                        }
                        
                        // If broken, stop async and throw message
                        if (broken) {
                            // Throw JSON
                            res.send(msgs);
                            
                            // Stop
                            callback("stop", false);
                        } else {
                            // Proceed
                            callback(null, user);
                        }
                    });
                },
                (result, callback) => {
                    // Set expire date and access token
                    const expires = 60 * 60 * 24;
                    const person = {
                        user_id: result._id,
                        user: result.user,
                        name: result.data.f_name,
                        role: result.role,
                        groups: result.groups,
                        expires: new Date().getTime() + (expires * 1000)
                    };
                    
                    // Insert token and send
                    db.collection("sys_token").insertOne(person, (err, data) => {
                        // General error
                        if (err) {
                            // Set message
                            msgs.error.errorMessage = "General error.";
                            // Set broken
                            broken = true;
                        }
                        
                        if (data.result.ok) {
                            let token = jwt.sign(
                                data.ops[0],
                                global.config.security.salt,
                                {
                                    expiresIn: expires
                                }
                            );
                            
                            // Set token in msgs
                            msgs.members = {
                                person: person,
                                token: token
                            };
                            
                            // Clear messages and error
                            msgs.error.error = false;
                            msgs.error.errorCode = 1;
                            msgs.error.errorMessage = "";
                            
                            // Send JSON response
                            res.send(msgs);
                        }
                        
                        // Proceed
                        callback(null, true);
                    });
                }
            ],
            (err, res) => {
                console.log(err);
            }
        );
    });
};

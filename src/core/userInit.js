/**
 * YX : YAPI : Core/UserInit
 * ======================================================================
 * Used with the Async chain on `server.js`, used to check if there's a
 * super administrator in the database already.
 *
 * If there's no super administrator in the database, then creates one.
 *
 * Super administrator settings should come from the configuration files!
 * ----------------------------------------------------------------------
 * @author      Fabio Y. Goto <lab@yuiti.com.br>
 * @since       0.0.1
 */

/**
 * Creates a user, if none exists already.
 *
 * @param {object} db
 *      Database connection (from the global pool)
 * @param {function} callback
 *      Callback method, used by async to move on to the next function
 */
const userCreate = (db, callback) => {
    // Check if there's a user in the database already
    db.collection("sys_users").count((err, count) => {
        // If an error occurred, end async
        if (err) if (callback) callback("stop", false);
        
        // If there's no user
        if (count < 1) {
            // Fetch initial super user data from global
            const user  = global.config.init.user;
            
            // Insert user into the database
            db.collection("sys_users").insertOne(user, (err, res) => {
                if (err) {
                    // Log error message
                    console.log("User couldn't be added to the database.");
                    
                    // Log error data
                    console.log(err);
                } else if (!res) {
                    // Log error message
                    console.log("User couldn't be added to the database.");
                } else {
                    // Yay!
                    console.log("Super administrator added successfully.");
                }
                
                // Execute callback
                if (callback) callback(null, false);
            });
        } else {
            // Just execute the async callback
            if (callback) callback(null, false);
        }
    });
};

// Export function
module.exports = userCreate;

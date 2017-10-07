/**
 * YX : YAPI : Router
 * ======================================================================
 * Main application router, manages all API routes and endpoints.
 * ----------------------------------------------------------------------
 * @author      Fabio Y. Goto <lab@yuiti.com.br>
 * @since       0.0.1
 */

// Load libs
const path          = require("path");
const router        = require("express").Router({mergeParams: true});

// Require local routes
const core_dir      = path.resolve("./src/core");
const routes_dir    = path.resolve("./src/routes");
const auth          = require(core_dir + "/auth");
const userRoutes    = require(routes_dir + "/user");

userRoutes(router, auth);

/**
 * Simple healthcheck route.
 */
router.route("/healthcheck").get((req, res) => {
    // Send healthcheck data
    res.send({
        "error": errors,
        "message": "",
        "client": {},
        "members": {
            "system": "YAPI (Yuiti's API)",
            "version": global.config.version
        },
        "date": new Date().toISOString(),
        "error": global.errors(false, "", {}, 1)
    });
});

/**
 * Fallback route.
 */
router.route("*").all((req, res) => {
    // Send data
    res.send({
        "message": "",
        "client": {},
        "members": {},
        "date": new Date().toISOString(),
        "error": global.errors(false, "", {}, 1)
    });
});

// Export router module
module.exports = router;

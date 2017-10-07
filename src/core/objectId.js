/**
 * YX : YAPI : Core/ObjectID
 * ======================================================================
 * Returns a function that generates/returns an object ID.
 * ----------------------------------------------------------------------
 * @author      Fabio Y. Goto <lab@yuiti.com.br>
 * @since       0.0.1
 */

// Load libs
const ObjectID = require("mongodb").ObjectID;

// Export function
module.exports = (id) => {
    return ObjectID(id);
};

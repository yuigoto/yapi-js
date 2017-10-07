/**
 * YX : YAPI : Core/Errors
 * ======================================================================
 * Error message handler.
 * ----------------------------------------------------------------------
 * @author      Fabio Y. Goto <lab@yuiti.com.br>
 * @since       0.0.1
 */

/**
 * Generates a pre-formatted error message.
 *
 * @param {boolean} is_error
 *      If the message is for an error, default: true
 * @param {string} message
 *      Short message about the error
 * @param {object} data
 *      Error data, can be an object or string
 * @param {integer} code
 *      Error code
 * @returns {object}
 */
const errors = (is_error, message, data, code) => {
    // Error object
    let errors = {
        error: is_error || false,
        errorMessage: message,
        errorCode: code || 0,
        data: data || {}
    };
    
    // Return
    return errors;
};

// Export module
module.exports = errors;

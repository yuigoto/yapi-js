/**
 * YAPI : Core/Response
 * ======================================================================
 * Returns a pre-formatted POJO for use in API response data.
 * ----------------------------------------------------------------------
 * @author    Fabio Y. Goto <lab@yuiti.com.br>
 * @since     0.0.1
 */

/**
 * Returns a pre-formatted Response object for API end points.
 *
 * @param {string} status
 *    Status, should be either SUCCESS, ERROR, FAIL or NULL
 * @param {*} data
 *    Response data
 * @param {string} message
 *    Response message, if neeeded
 * @param {Error} error
 *    Error message
 * @param {object} client
 *    Information about the user client/raw data
 * @returns {object}
 * @constructor
 */
const Response = (
  status = null,
  data = null,
  message = null,
  error = null,
  client = null
) => {
  return {
    status: (error) ? "ERROR" : ((status) ? status : "FAIL"),
    client: client || {},
    data: data || {},
    date: new Date().toISOString(),
    error: error || {},
    message: message || ""
  };
};

// Export
export default Response;

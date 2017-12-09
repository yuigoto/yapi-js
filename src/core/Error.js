/**
 * YAPI : Core/Error
 * ======================================================================
 * Returns a pre-formatted POJO containing error information.
 * ----------------------------------------------------------------------
 * @author    Fabio Y. Goto <lab@yuiti.com.br>
 * @since     0.0.1
 */

/**
 * Returns a POJO error object.
 *
 * @param {number} code
 *    HTTP request error code
 * @param {*} data
 *    Error data, string or stack trace
 * @param {string} title
 *    Error title
 * @param {string} description
 *    Error description
 * @returns {object}
 * @constructor
 */
const Error = (
  code = null,
  data = null,
  title = null,
  description = null
) => {
  return {
    code: code || 400,
    data: data || {},
    title: title || "Unknown error",
    description: description || ""
  }
};

// Export
export default Error;

/**
 * YAPI : Core/ResponseError
 * ======================================================================
 * Response error message/data/status handler.
 * ----------------------------------------------------------------------
 * @author    Fabio Y. Goto
 * @since     0.0.1
 */
export default class ResponseError {
  /**
   * @param {number} code
   *    Error code, can be either an HTTP request code or any other type, as
   *    long as it's a number
   * @param {object} data
   *    Object containing information about the error, can be a call-stack or
   *    other type
   * @param {string} title
   *    String with the error's title/short description
   * @param {string} description
   *    String with the full error message/description
   */
  constructor(code, data, title, description) {
    this.code         = code || 400;
    this.data         = (typeof(data) === "object" && data) ? data : {};
    this.title        = title || "Unknown error";
    this.description  = description || "";
  }
}

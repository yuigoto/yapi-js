/**
 * YAPI : Core/Response
 * ======================================================================
 * Creates an instance of a pre-formatted response, which can then be returned
 * by the API.
 * ----------------------------------------------------------------------
 * @author    Fabio Y. Goto
 * @since     0.0.1
 */

// Import local
import ResponseError from "src/core/ResponseError";
import Logger from "src/core/Logger";

// Response class
export default class Response {
  /**
   * Class constructor.
   *
   * @param {string} status
   *    Status flag, should be either one of: SUCCESS, FAIL, ERROR or VOID
   * @param {object} data
   *    Object containing the response data, also holds the error data, if
   *    `error` is set
   * @param {string} message
   *    Optional response message, will also host the response error message,
   *    if the `error` param is set
   * @param {ResponseError} error
   *    If the response is an error-type, this should hold a reference to an
   *    instance of `ResponseError`, declaring this automatically sets the
   *    `status` flag as "ERROR"
   */
  constructor(status, data, message, error) {
    // Set initial response values
    this.status   = (status) ? status : "VOID";
    this.data     = (typeof(data) === "object" && data) ? data : {};
    this.message  = message || "";
    this.date     = new Date().toISOString();

    // Checks if error is defined
    if (error && error instanceof ResponseError) {
      // Set error in data
      this.data.error = error;

      // Update status
      this.status     = "ERROR";

      // Update message
      this.message    = error.description;
    }

    // Validates status
    if (!this._validateStatus()) {
      // Throw error if status is not valid
      Logger(
        `Status "${this.status}" is not a valid one.`,
        true,
        "red",
        null,
        true
      );
    }
  }

  /**
   * Validates the response status.
   *
   * @returns {boolean}
   * @private
   */
  _validateStatus() {
    /**
     * List containing all the valid status flags.
     *
     * @type {string[]}
     */
    const list = ["SUCCESS", "ERROR", "FAIL", "VOID"];

    // Throw an error if invalid
    return list.includes(this.status);
  }
}

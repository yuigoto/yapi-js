/**
 * YAPI : Core/UUID
 * ======================================================================
 * UUID string formatter.
 * ----------------------------------------------------------------------
 * @author    Fabio Y. Goto <lab@yuiti.com.br>
 * @since     0.0.1
 */

/**
 * Formats and returns a 32 char long, hexadecimal, UUID string as a
 * pre-formatted 8-4-4-4-12 string.
 *
 * @param {string} string
 *    UUID for formatting, usually a md5 hash
 * @returns {string|boolean}
 * @constructor
 */
const UUID = (string) => {
  // String should be no less/more than 32 characters long
  if (string.length < 32 || string.length > 32) return false;
  if (!string.match(/^([a-f0-9]{32})$/)) return false;

  return string.replace(
    /^([a-f0-9]{8})([a-f0-9]{4})([a-f0-9]{4})([a-f0-9]{4})([a-f0-9]{12})$/,
    "$1-$2-$3-$4-$5"
  );
};

// Export
export default UUID;

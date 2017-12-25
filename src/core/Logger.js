/**
 * YAPI : Core/Logger
 * ======================================================================
 * Simple coloured console message logger, not the fanciest, but works.
 * ----------------------------------------------------------------------
 * @author    Fabio Y. Goto
 * @since     0.0.1
 */

/**
 * Contains all the available colors for background.
 *
 * @type {object}
 */
const COLORS_BG = {
  black: "\x1b[40m",
  red: "\x1b[41m",
  green: "\x1b[42m",
  yellow: "\x1b[43m",
  blue: "\x1b[44m",
  magenta: "\x1b[45m",
  cyan: "\x1b[46m",
  white: "\x1b[47m"
};

/**
 * Contains all the available colors for foreground/text.
 *
 * @type {object}
 */
const COLORS_FG = {
  black: "\x1b[30m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m"
}

/**
 * Logs a coloured message into the console, which can be either a common
 * log or an error log.
 *
 * @param {string} message
 *    Message to be logged into the console
 * @param {boolean} is_error
 *    Toggles `console.error`, instead of `console.log`, if the message is
 *    an error message
 * @param {string} color
 *    Foreground/text color, from the available set
 * @param {string} background
 *    Background color, from the available set
 * @param {boolean} bright
 *    Toggles a brighter color
 * @param {boolean} underline
 *    Toggles text underline
 */
const Logger = (
  message,
  is_error = false,
  color = "white",
  background = "black",
  bright = false,
  underline = false
) => {
  // Validate message
  message     = (typeof(message) === "string") ? message : "Unknown message type";
  is_error    = (is_error === true);

  // Validate colors
  color       = (COLORS_FG[color]) ? COLORS_FG[color] : COLORS_FG.white;
  background  = (COLORS_BG[background]) ? COLORS_BG[background] : COLORS_BG.black;

  // Check brightness and underlining
  bright      = (bright === true) ? "\x1b[1m" : "";
  underline   = (underline === true) ? "\x1b[4m" : "";

  // Logs message
  if (is_error === true) {
    console.error(`${color + background + bright + underline + message}`);
  } else {
    console.log(`${color + background + bright + underline + message}`);
  }
};

// Export the function
export default Logger;

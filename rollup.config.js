/**
 * YAPI : Rollup Config
 * ======================================================================
 * Config file for RollUp, so it can properly generate a bundled build
 * for the project.
 * ----------------------------------------------------------------------
 * @author    Fabio Y. Goto
 * @since     0.0.1
 */

// Import libs
import babel from "rollup-plugin-babel";
import babelrc from "babelrc-rollup";
import includePaths from "rollup-plugin-includepaths";

// Config
export default {
  input: "src/server.js",
  output: {
    file: "dist/server.js",
    format: "cjs"
  },
  plugins: [
    babel(babelrc()),
    includePaths({
      include: {},
      paths: ["src/config"],
      external: [],
      extensions: [".json"]
    })
  ]
};

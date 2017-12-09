/**
 * YAPI : Config/Database
 * ======================================================================
 * Contains database-related configuration.
 * ----------------------------------------------------------------------
 * @author    Fabio Y. Goto <lab@yuiti.com.br>
 * @since     0.0.1
 */

/**
 * Database data object.
 *
 * @type {object}
 */
const Config = {
  url: [
    "localhost"
  ],
  port: "27017",
  name: "",
  authSource: "admin",
  user: "[USERNAME]",
  pass: "[PASSWORD]",
  ssl: true,
  replicaSet: "replicaSetName"
};

// Export
export default Config;

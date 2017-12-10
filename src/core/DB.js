/**
 * YAPI : Core/DB
 * ======================================================================
 * Database configuration parser.
 * ----------------------------------------------------------------------
 * @author    Fabio Y. Goto <lab@yuiti.com.br>
 * @since     0.0.1
 */

/**
 * Keys that should exist in the database config, even if not required.
 *
 * @type {string[]}
 */
const keys = [
  "url",
  "port",
  "name",
  "authSource",
  "user",
  "pass",
  "ssl",
  "replicaSet"
];

/**
 * Parses the config file/JSON provided and returns an object, ready
 * to be used by Mongoose.
 *
 * @param {object} config
 *    Config from object/JSON file
 * @returns {boolean|object}
 * @constructor
 */
const DB = (config) => {
  // Is input undefined or null?
  if (config === undefined || config === null) return false;

  // Is input not an object?
  if (typeof(config) !== "object") return false;

  // Check valid keys for input
  for (let key of keys) {
    if (!(key in config)) return false;
  }

  // Set database and auth params
  let database  = (config.name !== "") ? `/${config.name}` : "";
  let port      = (config.port !== "") ? `:${config.port}` : "";
  let url;

  // Is URL an array?
  if (Array.isArray(config.url)) {
    // Item array
    let list = [];

    // Push URLs into list
    for (let item of config.url) {
      list.push(item + port);
    }

    // Set url
    url = `mongodb://${list.join(",") + database}`;
  } else {
    url = `mongodb://${config.url + port + database}`;
  }

  // Returns object
  return {
    url: url,
    options: {
      auth: {
        authSource: config.authSource,
        replicaSet: config.replicaSet,
        ssl: config.ssl
      },
      user: config.user,
      pass: config.pass,
      useMongoClient: true
    }
  };
};

// Export function
export default DB;

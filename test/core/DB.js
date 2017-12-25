/**
 * YAPI : Test/Core/DB
 * ======================================================================
 * Tests the DB object/configuration parser.
 * ----------------------------------------------------------------------
 * @author    Fabio Y. Goto
 * @since     0.0.1
 */

// Sets NODE_ENV to "test"
process.env.NODE_ENV = "test";

// Import libs
import { expect, should } from "chai";

// Import local
import DB from "src/core/DB";

// Fire up Should
should();

// Execute tests
const Test = () => {
  describe("DB", () => {
    it("Should be a function", done => {
      expect(DB).to.be.a("Function");
      done();
    });

    it("Should return false if input is not anobject/JSON", done => {
      expect(DB()).to.be.a("Boolean").equal(false);
      expect(DB(198046512)).to.be.a("Boolean").equal(false);
      expect(DB("q oi43iehksdmx")).to.be.a("Boolean").equal(false);
      done();
    });

    it("Should accept input only if it has all fields, even if empty", done => {
      // Declare test input A
      let test_a = {
        url: "localhost",
        port: "27017",
        name: "",
        authSource: "",
        user: "user",
        pass: "pass",
        ssl: true,
        replicaSet: ""
      };

      // Declare test input B
      let test_b = {
        port: "27017",
        name: "",
        authSource: "",
        user: "user",
        pass: "pass",
        ssl: true,
        replicaSet: ""
      };

      expect(DB(test_a)).to.not.be.a("Boolean");
      expect(DB(test_b)).to.be.a("Boolean").equal(false);
      done();
    });

    it("Must return an object, with specific fields, with valid input", done => {
      // Define inputs
      let input_a = {
        url: "localhost",
        port: "27017",
        name: "database",
        authSource: "admin",
        user: "user",
        pass: "pass",
        ssl: true,
        replicaSet: ""
      };

      // Fetch config
      let dbconfig = DB(input_a);
      let { url, options } = dbconfig;
      let { auth } = options;

      // Test
      expect(dbconfig).to.be.a("Object");
      expect(dbconfig).to.have.property("url");
      expect(dbconfig).to.have.property("options");

      // Test URL
      expect(url).to.be.a("String");

      // Test options object
      expect(options).to.be.a("Object");
      expect(options).to.have.property("auth");
      expect(options).to.have.property("user");
      expect(options).to.have.property("pass");
      expect(options).to.have.property("useMongoClient");
      expect(options.auth).to.be.a("Object");
      expect(options.user).to.be.a("String");
      expect(options.pass).to.be.a("String");
      expect(options.useMongoClient).to.be.a("Boolean");

      // Test auth object
      expect(auth).to.have.property("authSource");
      expect(auth).to.have.property("replicaSet");
      expect(auth).to.have.property("ssl");
      expect(auth.authSource).to.be.a("String");
      expect(auth.replicaSet).to.be.a("String");
      expect(auth.ssl).to.be.a("Boolean");
      done();
    });
  });
};

// Export test function
export default Test;

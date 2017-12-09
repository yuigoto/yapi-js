/**
 * YAPI : Test/Core/DB
 * ======================================================================
 * Tests the database config parser.
 * ----------------------------------------------------------------------
 * @author    Fabio Y. Goto <lab@yuiti.com.br>
 * @since     0.0.1
 */

// Sets NODE_ENV to "test"
process.env.NODE_ENV = "test";

// Import libs
import chai, { expect, should } from "chai";

// Import local
import DB from "src/core/DB";

// Fire up Should
should();

// Execute tests
describe("DB Config", () => {
  it("DB should be a function", done => {
    expect(DB).to.be.a("Function");
    done();
  });

  describe("Should...", () => {
    it("Return false if input is not an object/JSON", done => {
      expect(DB()).to.be.a("Boolean").equal(false);
      expect(DB(1906132)).to.be.a("Boolean").equal(false);
      expect(DB("32g69t60513")).to.be.a("Boolean").equal(false);
      done();
    });

    it("Accept the input only if it has predefined fields", done => {
      // Define inputs
      let input_a = {
        url: "localhost",
        port: "27017",
        name: "",
        authSource: "",
        user: "user",
        pass: "pass",
        ssl: true,
        replicaSet: ""
      };

      let input_b = {
        port: "27017",
        name: "",
        authSource: "",
        user: "user",
        pass: "pass",
        ssl: true,
        replicaSet: ""
      };

      // Test
      expect(DB(input_a)).to.not.be.a("Boolean");
      expect(DB(input_b)).to.be.a("Boolean").equal(false);
      done();
    });

    it("Should return an object, with specific fields", done => {
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
});

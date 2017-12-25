/**
 * YAPI : Test/Core/Core
 * ======================================================================
 * Tests the Core object.
 * ----------------------------------------------------------------------
 * @author    Fabio Y. Goto
 * @since     0.0.1
 */

// Sets NODE_ENV to "test"
process.env.NODE_ENV = "test";

// Import libs
import { expect, should } from "chai";

// Import local
import Core from "src/core/Core";
import DB from "src/core/DB";
import InitUser from "src/core/InitUser";
import Security from "src/core/Security";

// Import config files
import database_config from "src/config/database.config";

// Fire up Should
should();

// Execute tests
const Test = () => {
  // Core base
  describe("Core", () => {
    it("Core should be an object", done => {
      expect(Core).to.be.a("Object");
      done();
    });

    // Database Object
    describe("Database", () => {
      it("Should have a database property", done => {
        expect(Core).to.have.property("database").to.be.a("Object");
        done();
      });

      it("Database should be of the Database type", done => {
        expect(Core.database).to.deep.equal(DB(database_config));
        done();
      });
    });

    describe("Security", () => {
      it("Should have a security property", done => {
        expect(Core).to.have.property("security").to.be.a("Object");
        done();
      });

      it("Database should be of the Security type", done => {
        expect(Core.security).to.deep.equal(Security);
        done();
      });
    });

    describe("Initial User", () => {
      it("Should have a user property", done => {
        expect(Core).to.have.property("user").to.be.a("Object");
        done();
      });

      it("Should have all properties from the UserInit object", done => {
        let keys = Object.keys(InitUser());
        expect(Core.user).to.include.all.keys(keys);
        done();
      });

      it("Should also have the unique hash, created and updated date", done => {
        let keys = ["hash", "created", "updated"];
        expect(Core.user).to.include.all.keys(keys);
        done();
      });
    });
  });
};

// Export test function
export default Test;

/**
 * YAPI : Test/Core/Healthcheck
 * ======================================================================
 * Tests the Healthcheck response.
 * ----------------------------------------------------------------------
 * @author    Fabio Y. Goto
 * @since     0.0.1
 */

// Sets NODE_ENV to "test"
process.env.NODE_ENV = "test";

// Import libs
import { expect, should } from "chai";

// Import local
import Healthcheck from "src/core/Healthcheck";

// Fire up Should
should();

// Execute tests
const Test = () => {
  describe("Healthcheck", () => {
    it("Must be an object", done => {
      expect(Healthcheck).to.be.a("Object");
      done();
    });

    it("Should have: name, author, version, license and copyright", done => {
      expect(Healthcheck).to.have.property("name").to.be.a("String");
      expect(Healthcheck).to.have.property("author").to.be.a("String");
      expect(Healthcheck).to.have.property("version").to.be.a("String");
      expect(Healthcheck).to.have.property("license").to.be.a("String");
      expect(Healthcheck).to.have.property("copyright").to.be.a("String");
      done();
    });
  });
};

// Export test function
export default Test;

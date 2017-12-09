/**
 * YAPI : Test/Core/UUID
 * ======================================================================
 * Tests the UUID function.
 * ----------------------------------------------------------------------
 * @author    Fabio Y. Goto <lab@yuiti.com.br>
 * @since     0.0.1
 */

// Sets NODE_ENV to "test"
process.env.NODE_ENV = "test";

// Import libs
import chai, { expect, should } from "chai";

// Import local
import UUID from "src/core/UUID";

// Fire up Should
should();

// Execute tests
describe("UUID", () => {
  it("UUID should be a function", done => {
    expect(UUID).to.be.a("Function");
    done();
  });

  describe("Should...", () => {
    it("Return false if input < 32 || input > 32", done => {
      expect(UUID("0123adc")).to.be.a("Boolean").equal(false);
      expect(UUID("0123456789abcdef0123456789abcdef012378"))
        .to.be.a("Boolean").equal(false);
      done();
    });

    it("Return false if input is not hexadecimal", done => {
      expect(UUID("6r4r9w3d1n6h4s9h4t5w7s9g4t3s7s9f2q9f"))
        .to.be.a("Boolean").equal(false);
      done();
    });

    it("Accept a 32 char hex string and not return false", done => {
      expect(UUID("0123456789abcdef0123456789abcdef"))
        .to.not.be.a("Boolean");
      done();
    });

    it("Return a properly formatted 8-4-4-4-12 string, if valid", done => {
      expect(UUID("0123456789abcdef0123456789abcdef"))
        .to.be.a("String")
        .match(/^([a-f0-9]{8})(-([a-f0-9]{4})){3}-([a-f0-9]{12})$/);
      done();
    });
  });
});

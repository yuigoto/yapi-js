/**
 * YAPI : Core/Security
 * ======================================================================
 * Tests the Security object.
 * ----------------------------------------------------------------------
 * @author    Fabio Y. Goto <lab@yuiti.com.br>
 * @since     0.0.1
 */

// Sets NODE_ENV to "test"
process.env.NODE_ENV = "test";

// Import libs
import chai, { expect, should } from "chai";

// Import local
import Security from "src/core/Security";

// Fire up Should
should();

// Execute tests
describe("Security", () => {
  it("Security should be an object", done => {
    expect(Security).to.be.a("Object");
    done();
  });

  it("Security salt should be set", done => {
    expect(Security)
      .to.have.property("salt")
      .to.match(/^([a-f0-9]{8})(-([a-f0-9]{4})){3}-([a-f0-9]{12})$/);
    done();
  });
});

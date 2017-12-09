/**
 * YAPI : Core/Error
 * ======================================================================
 * Tests the error method.
 * ----------------------------------------------------------------------
 * @author    Fabio Y. Goto <lab@yuiti.com.br>
 * @since     0.0.1
 */

// Sets NODE_ENV to "test"
process.env.NODE_ENV = "test";

// Import libs
import chai, { expect, should } from "chai";

// Import local
import Error from "src/core/Error";

// Fire up Should
should();

// Execute tests
describe("Error", () => {
  it("DB should be a function", done => {
    expect(Error).to.be.a("Function");
    done();
  });

  describe("Should...", () => {
    // Instance of error
    let error = Error();

    it("Return must be an object", done => {
      expect(error).to.be.an("Object");
      done();
    });

    it("Must contain: code, data, title and description", done => {
      expect(error).to.have.property("code");
      expect(error).to.have.property("data");
      expect(error).to.have.property("title");
      expect(error).to.have.property("description");
      done();
    });

    it("Code must be a number", done => {
      expect(error).to.have.property("code")
        .to.be.a("Number");
      done();
    });

    it("Title and description should be strings", done => {
      expect(error).to.have.property("title")
        .to.be.a("String");
      expect(error).to.have.property("description")
        .to.be.a("String");
      done();
    });
  });
});

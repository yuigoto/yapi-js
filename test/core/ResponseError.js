/**
 * YAPI : Test/Core/ResponseError
 * ======================================================================
 * Test for the ResponseError class and its instances.
 * ----------------------------------------------------------------------
 * @author    Fabio Y. Goto
 * @since     0.0.1
 */

// Sets NODE_ENV to "test"
process.env.NODE_ENV = "test";

// Import libs
import { expect, should } from "chai";

// Import local
import ResponseError from "src/core/ResponseError";

// Fire up Should
should();

// Execute tests
const Test = () => {
  describe("ResponseError", () => {
    it("Should be a function", done => {
      expect(ResponseError).to.be.a("Function");
      done();
    });

    it("Objects derived from it should be an instance of 'ResponseError`", done => {
      let error = new ResponseError();
      expect(error).to.be.an.instanceof(ResponseError);
      done();
    });

    it("Instances should be an 'unknown error', code 400, if input is empty", done => {
      let error = new ResponseError();
      expect(error).to.be.an.instanceof(ResponseError);
      expect(error).to.have.property("code").to.be.a("Number").equal(400);
      expect(error).to.have.property("data").to.be.a("Object").deep.equal({});
      expect(error).to.have.property("title").to.be.a("String")
        .equal("Unknown error");
      expect(error).to.have.property("description").to.be.a("String")
        .equal("");
      done();
    });

    it("Instances should have the attributes assigned on the constructor", done => {
      let error = new ResponseError(401, {}, "Errored", "This is a test");
      expect(error).to.be.an.instanceof(ResponseError);
      expect(error).to.have.property("code").to.be.a("Number").equal(401);
      expect(error).to.have.property("data").to.be.a("Object").deep.equal({});
      expect(error).to.have.property("title").to.be.a("String")
        .equal("Errored");
      expect(error).to.have.property("description").to.be.a("String")
        .equal("This is a test");
      done();
    });
  });
};

// Export test function
export default Test;

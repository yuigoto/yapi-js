/**
 * YAPI : Test/Core/Response
 * ======================================================================
 * Tests for the Response object class.
 * ----------------------------------------------------------------------
 * @author    Fabio Y. Goto
 * @since     0.0.1
 */

// Sets NODE_ENV to "test"
process.env.NODE_ENV = "test";

// Import libs
import { expect, should } from "chai";

// Import local
import Expressions from "src/core/Expressions";
import Response from "src/core/Response";
import ResponseError from "src/core/ResponseError";

// Fire up Should
should();

// Execute tests
const Test = () => {
  describe("Response", () => {
    it("Should be a function", done => {
      expect(Response).to.be.a("Function");
      done();
    });

    it("Objects derived from it should be an instance of 'Response`", done => {
      let response = new Response();
      expect(response).to.be.an.instanceof(Response);
      done();
    });

    it("Response status should be one of SUCCESS, ERROR, FAIL or VOID", done => {
      let response = new Response();
      expect(response).to.be.an.instanceof(Response);
      expect(response.status).to.be.oneOf(["SUCCESS", "ERROR", "FAIL", "VOID"]);
      done();
    });

    it("Empty responses should have status 'VOID', empty data and message", done => {
      let response = new Response();
      expect(response).to.be.an.instanceof(Response);
      expect(response).to.have.property("status")
        .to.be.a("String").equal("VOID");
      expect(response).to.have.property("data")
        .to.be.a("Object").deep.equal({});
      expect(response).to.have.property("message")
        .to.be.a("String").equal("");
      done();
    });

    it("A response should have a date attribute as an ISO string", done => {
      let response = new Response();
      expect(response).to.be.an.instanceof(Response);
      expect(response).to.have.property("date")
        .to.be.a("String")
        .match(Expressions.date_iso);
      done();
    });

    it("A response instance should only accept objects for `data` attribute", done => {
      let response_a = new Response(null, "hello", "", null);
      let response_b = new Response(null, {hello: "Hi!"}, "", null);
      expect(response_a).to.be.an.instanceof(Response);
      expect(response_a).to.have.property("data")
        .to.be.a("Object").deep.equal({});
      expect(response_b).to.be.an.instanceof(Response);
      expect(response_b).to.have.property("data")
        .to.be.a("Object").deep.equal({hello: "Hi!"});
      done();
    });

    it("If declared, `error` should be an instance of ResponseError", done => {
      let response_a = new Response(null, null, "", new ResponseError());
      let response_b = new Response(null, null, "", "hello");

      expect(response_a).to.be.an.instanceof(Response);
      expect(response_a).to.have.property("data")
        .to.have.property("error")
        .to.be.an.instanceof(ResponseError);
      expect(response_b).to.be.an.instanceof(Response);
      expect(response_b).to.have.property("data")
        .to.not.have.property("error");
      done();
    });

    it("When a valid `error` is declared, status should be `ERROR`", done => {
      let response = new Response(null, null, "", new ResponseError());
      expect(response).to.be.an.instanceof(Response);
      expect(response).to.have.property("status").equal("ERROR");
      expect(response).to.have.property("data")
        .to.have.property("error")
        .to.be.an.instanceof(ResponseError);
      done();
    });

    it("When a valid `error` is declared, message should mirror the its description", done => {
      let response = new Response(
        null,
        null,
        "",
        new ResponseError(403, {}, "Unknown error", "This is an error!")
      );
      expect(response).to.be.an.instanceof(Response);
      expect(response).to.have.property("status").equal("ERROR");
      expect(response).to.have.property("data")
        .to.have.property("error")
        .to.be.an.instanceof(ResponseError);
      expect(response).to.have.property("message")
        .equal(response.data.error.description);
      done();
    });
  });
};

// Export test function
export default Test;

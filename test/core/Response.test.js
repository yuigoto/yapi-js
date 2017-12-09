/**
 * YAPI : Core/Response
 * ======================================================================
 * Tests the Response function and object.
 * ----------------------------------------------------------------------
 * @author    Fabio Y. Goto <lab@yuiti.com.br>
 * @since     0.0.1
 */

// Sets NODE_ENV to "test"
process.env.NODE_ENV = "test";

// Import libs
import chai, { expect, should } from "chai";

// Import local
import Response from "src/core/Response";
import Error from "src/core/Error";

// Fire up Should
should();

// Execute tests
describe("Response", () => {
  it("DB should be a function", done => {
    expect(Response).to.be.a("Function");
    done();
  });

  describe("Should", () => {
    // Instance of response
    let response = Response();

    it("Return must be an object", done => {
      expect(response).to.be.an("Object");
      done();
    });

    it("Return must contain: client, data, date, error and message", done => {
      expect(response).to.have.property("status");
      expect(response).to.have.property("client");
      expect(response).to.have.property("data");
      expect(response).to.have.property("date");
      expect(response).to.have.property("error");
      expect(response).to.have.property("message");
      done();
    });

    it("Some members must be of exclusive type", done => {
      expect(response.status).to.be.a("String");
      expect(response.client).to.be.a("Object");
      expect(response.date).to.be.a("String");
      expect(response.message).to.be.a("String");
      done();
    });

    it("Status should be SUCCESS, ERROR, FAIL or NULL", done => {
      expect(response.status).to.be.oneOf(["SUCCESS", "ERROR", "FAIL", "NULL"]);
      done();
    });

    describe("If error is defined", () => {
      let error = Response(
        "",
        {},
        "Test message",
        Error()
      );

      it("Regardless of status provided, should be ERROR in the end", done => {
        expect(error.status).to.be.a("String").equal("ERROR");
        done();
      });

      it("Should be equal to the output of Error alone", done => {
        expect(error.error).to.deep.equal(Error());
        done();
      });

      it("Error should have all properties from Error", done => {
        expect(error.error).to.have.property("code");
        expect(error.error).to.have.property("data");
        expect(error.error).to.have.property("title");
        expect(error.error).to.have.property("description");
        done();
      });
    });
  });
});

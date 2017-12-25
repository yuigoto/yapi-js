/**
 * YAPI : Test/Server
 * ======================================================================
 * Tests the server and basic API.
 * ----------------------------------------------------------------------
 * @author    Fabio Y. Goto
 * @since     0.0.1
 */

// Sets NODE_ENV to "test"
process.env.NODE_ENV = "test";

// Import libs
import chai, { expect, should } from "chai";
import chai_http from "chai-http";

// Import tests
import CoreTest from "test/core/Core";
import DBTest from "test/core/DB";
import ExpressionsTest from "test/core/Expressions";
import HealthcheckTest from "test/core/Healthcheck";
import InitUserTest from "test/core/InitUser";
import ResponseTest from "test/core/Response";
import ResponseErrorTest from "test/core/ResponseError";
import SecurityTest from "test/core/Security";
import TokenTest from "test/core/Token";
import UUIDTest from "test/core/UUID";

// Import route tests
import AuthRouteTest from "test/api/Auth";
import MessagesRouteTest from "test/api/Messages";

// Import local
import server from "src/server";
import Healthcheck from "src/core/Healthcheck";

// Fire up Should
should();
chai.use(chai_http);

// Test all Core items first
/*
CoreTest();
DBTest();
ExpressionsTest();
HealthcheckTest();
InitUserTest();
ResponseErrorTest();
ResponseTest();
SecurityTest();
TokenTest();
UUIDTest();
*/

// Execute tests
describe("Server", () => {
  describe("Status", () => {
    it("Server was properly started", done => {
      chai.request(server)
        .get("/").end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
    });

    it("Unmatched routes should go 404", done => {
      chai.request(server)
        .get("/unmatched-route")
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.text).to.be.a("String").equal("404");
          done();
        });
    });

    it("Root route should return 200, and contain the documentation.", done => {
      chai.request(server)
        .get("/")
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.text).to.be.a("String")
            .match(/^\<\!DOCTYPE\shtml\>/);
          done();
        });
    });
  });

  describe("API", () => {
    it("Root endpoint should return data, but access is Forbidden", done => {
      chai.request(server)
        .get("/api")
        .end((err, res) => {
          expect(res).to.have.status(403);
          expect(res.body.data).to.have.property("error").to.be.a("Object");
          expect(res.body.data.error.title).to.be.a("String").equal("Forbidden");
          done();
        });
    });

    it("Healthcheck should return some basic installation info", done => {
      chai.request(server)
        .get("/api/healthcheck")
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.status).to.be.a("String").equal("SUCCESS");
          expect(res.body.data).to.not.have.property("error");
          expect(res.body.data).to.be.a("Object").deep.equal(Healthcheck);
          done();
        });
    });

    it("Unmatched routes should go 404", done => {
      chai.request(server)
        .get("/api/not-existing-endpoint-at-all-yo")
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.have.property("error").to.be.a("Object");
          expect(res.body.error.title).to.be.a("String").equal("Not Found");
        });
      done();
    });

    // Test Auth Endpoints
    // AuthRouteTest();
    MessagesRouteTest();
  });
});

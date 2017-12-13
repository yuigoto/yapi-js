/**
 * YAPI : Server
 * ======================================================================
 * Tests the server and basic API.
 * ----------------------------------------------------------------------
 * @author    Fabio Y. Goto <lab@yuiti.com.br>
 * @since     0.0.1
 */

// Sets NODE_ENV to "test"
process.env.NODE_ENV = "test";

// Import libs
import chai, { expect, should } from "chai";
import chai_http from "chai-http";
import mongoose from "mongoose";

// Import local
import server from "src/server";
import Healthcheck from "src/core/Healthcheck";

// Fire up Should
should();
chai.use(chai_http);

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
          expect(res.body).to.have.property("error").to.be.a("Object");
          expect(res.body.error.title).to.be.a("String").equal("Forbidden");
          done();
        });
    });

    it("Healthcheck should return some basic installation info", done => {
      chai.request(server)
        .get("/api/healthcheck")
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property("error").deep.equal({});
          expect(res.body.status).to.be.a("String").equal("SUCCESS");
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
  });
});

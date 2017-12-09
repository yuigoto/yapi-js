/**
 * YAPI : API/Auth
 * ======================================================================
 * Tests the Authentication API route.
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
import Core from "src/core/Core";
import Token from "src/core/Token";
import Expressions from "src/core/Expressions";
import InitUser from "src/core/InitUser";

// Import Auth models
import User from "src/models/User.model";
import AuthToken from "src/models/AuthToken.model";

// Fire up Should
should();
chai.use(chai_http);

// Set test user
const TestUser = InitUser();

// Execute tests
describe("API/Auth", () => {
  // Define a token
  let token;

  // Before everything, clean users
  before(done => {
    User.remove({}, () => {
      AuthToken.remove({}, () => {
        done();
      });
    });
  });

  // Before each step, clear and set default user
  beforeEach(done => {
    User.remove({}, () => {
      let user = new User(Core.user).save((err) => {
        AuthToken.remove({}, () => {
          if (err) {
            done(false);
          } else {
            done();
          }
        });
      });
    });
  });

  it("Sending data to unmatched route should be forbidden", done => {
    chai.request(server)
      .get("/api/auth/hello-world")
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res.body).to.have.property("status").equal("ERROR");
        expect(res.body).to.have.property("error").to.be.a("Object");
        expect(res.body.error).to.have.property("title").equal("Forbidden");
        done();
      });
  });

  it("No GET requests allowed for authentication", done => {
    chai.request(server)
      .get("/api/auth")
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res.body).to.have.property("status").equal("ERROR");
        expect(res.body).to.have.property("error").to.be.a("Object");
        expect(res.body.error).to.have.property("title").equal("Forbidden");
        done();
      });
  });

  it("User should not be able to send an empty POST request", done => {
    chai.request(server)
      .post("/api/auth")
      .send({})
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body).to.have.property("status").equal("ERROR");
        expect(res.body).to.have.property("error").to.be.a("Object");
        expect(res.body.error).to.have.property("title").equal("Unauthorized");
        done();
      });
  });

  it("User should not be able to send only the password", done => {
    chai.request(server)
      .post("/api/auth")
      .send({
        pass: TestUser.pass
      })
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body).to.have.property("status").equal("ERROR");
        expect(res.body).to.have.property("error").to.be.a("Object");
        expect(res.body.error).to.have.property("title").equal("Unauthorized");
        done();
      });
  });

  it("User should not be able to send both username and e-mail", done => {
    chai.request(server)
      .post("/api/auth")
      .send({
        user: TestUser.user,
        email: TestUser.email
      })
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body).to.have.property("status").equal("ERROR");
        expect(res.body).to.have.property("error").to.be.a("Object");
        expect(res.body.error).to.have.property("title").equal("Unauthorized");
        done();
      });
  });

  it("User should not be able to login with only e-mail", done => {
    chai.request(server)
      .post("/api/auth")
      .send({
        email: TestUser.email
      })
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body).to.have.property("status").equal("ERROR");
        expect(res.body).to.have.property("error").to.be.a("Object");
        expect(res.body.error).to.have.property("title").equal("Unauthorized");
        done();
      });
  });

  it("User should not be able to login with only username", done => {
    chai.request(server)
      .post("/api/auth")
      .send({
        user: TestUser.user
      })
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body).to.have.property("status").equal("ERROR");
        expect(res.body).to.have.property("error").to.be.a("Object");
        expect(res.body.error).to.have.property("title").equal("Unauthorized");
        done();
      });
  });

  it("Invalid login should return a SUCCESS message, but empty data", done => {
    chai.request(server)
      .post("/api/auth")
      .send({
        user: "nonexistent",
        pass: "ThisIsAPassword"
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("status").equal("SUCCESS");
        expect(res.body).to.have.property("message").equal(
          "Username/e-mail address not registered in the database."
        );
        expect(res.body).to.have.property("data").deep.equal({});
        done();
      });
  });

  it("Invalid password should return ERROR, with 401 code", done => {
    chai.request(server)
      .post("/api/auth")
      .send({
        user: TestUser.user,
        pass: "ThisIsAPassword"
      })
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body).to.have.property("status").equal("ERROR");
        expect(res.body).to.have.property("message").equal(
          "Invalid password."
        );
        expect(res.body).to.have.property("error").to.be.a("Object");
        expect(res.body.error).to.have.property("description")
          .to.be.a("String").equal("Invalid password.");
        done();
      });
  });

  it("If a user's status is deleted, user can't log in", done => {
    User.remove({}, () => {
      // Copy user data
      let temp_user = Object.assign({}, Core.user);
      temp_user.is_delete = true;

      // Add new ser
      let user = new User(temp_user).save((err, post) => {
        if (err) {
          done(false);
        } else {
          chai.request(server)
            .post("/api/auth")
            .send({
              user: TestUser.user,
              pass: TestUser.pass
            })
            .end((err, res) => {
              expect(res).to.have.status(401);
              expect(res.body).to.have.property("status").equal("ERROR");
              expect(res.body).to.have.property("message").equal(
                "This user account is/was marked for deletion and cannot be recovered."
              );
              expect(res.body).to.have.property("error").to.be.a("Object");
              expect(res.body.error).to.have.property("description")
                .to.be.a("String")
                .equal("This user account is/was marked for deletion and cannot be recovered.");
              done();
            });
        }
      });
    });
  });

  it("If a user's status is banned, user can't log in", done => {
    User.remove({}, () => {
      // Copy user data
      let temp_user = Object.assign({}, Core.user);
      temp_user.is_banned = true;

      // Add new ser
      let user = new User(temp_user).save((err, post) => {
        if (err) {
          done(false);
        } else {
          chai.request(server)
            .post("/api/auth")
            .send({
              user: TestUser.user,
              pass: TestUser.pass
            })
            .end((err, res) => {
              expect(res).to.have.status(401);
              expect(res.body).to.have.property("status").equal("ERROR");
              expect(res.body).to.have.property("message").equal(
                "User account banned."
              );
              expect(res.body).to.have.property("error").to.be.a("Object");
              expect(res.body.error).to.have.property("description")
                .to.be.a("String")
                .equal("User account banned.");
              done();
            });
        }
      });
    });
  });

  it("If a user's status is locked (is_active === false), user can't log in", done => {
    User.remove({}, () => {
      // Copy user data
      let temp_user = Object.assign({}, Core.user);
      temp_user.is_active = false;

      // Add new ser
      let user = new User(temp_user).save((err, post) => {
        if (err) {
          done(false);
        } else {
          chai.request(server)
            .post("/api/auth")
            .send({
              user: TestUser.user,
              pass: TestUser.pass
            })
            .end((err, res) => {
              expect(res).to.have.status(401);
              expect(res.body).to.have.property("status").equal("ERROR");
              expect(res.body).to.have.property("message").equal(
                "User account locked, please activate it before logging in."
              );
              expect(res.body).to.have.property("error").to.be.a("Object");
              expect(res.body.error).to.have.property("description")
                .to.be.a("String")
                .equal("User account locked, please activate it before logging in.");
              done();
            });
        }
      });
    });
  });

  it("If a user's status is blocked by the admin, user can't log in", done => {
    User.remove({}, () => {
      // Copy user data
      let temp_user = Object.assign({}, Core.user);
      temp_user.is_blocked = true;

      // Add new ser
      let user = new User(temp_user).save((err, post) => {
        if (err) {
          done(false);
        } else {
          chai.request(server)
            .post("/api/auth")
            .send({
              user: TestUser.user,
              pass: TestUser.pass
            })
            .end((err, res) => {
              expect(res).to.have.status(401);
              expect(res.body).to.have.property("status").equal("ERROR");
              expect(res.body).to.have.property("message").equal(
                "User account blocked by the administrator."
              );
              expect(res.body).to.have.property("error").to.be.a("Object");
              expect(res.body.error).to.have.property("description")
                .to.be.a("String")
                .equal("User account blocked by the administrator.");
              done();
            });
        }
      });
    });
  });

  it("Valid user login should return success and a token", done => {
    chai.request(server)
      .post("/api/auth")
      .send({
        user: TestUser.user,
        pass: TestUser.pass
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("status").equal("SUCCESS");
        expect(res.body).to.have.property("data").to.be.a("Object");
        expect(res.body.data).to.have.property("token").to.be.a("String");
        done();
      });
  });

  it("Token should have all basic fields", done => {
    chai.request(server)
      .post("/api/auth")
      .send({
        user: TestUser.user,
        pass: TestUser.pass
      })
      .end((err, res) => {
        // Extract token
        let token   = res.body.data.token;
        let decoded = Token.toPerson(token);

        expect(decoded).to.have.property("uuid").to.be.a("String");
        expect(decoded).to.have.property("user_id").to.be.a("String");
        expect(decoded).to.have.property("display_name").to.be.a("String");
        expect(decoded).to.have.property("user").to.be.a("String");
        expect(decoded).to.have.property("email").to.be.a("String");
        expect(decoded).to.have.property("roles").to.be.a("Array");
        expect(decoded).to.have.property("groups").to.be.a("Array");
        expect(decoded).to.have.property("generated").to.be.a("String")
          .match(Expressions.date_iso);
        expect(decoded).to.have.property("data").to.be.a("Array");
        expect(decoded).to.have.property("is_valid").to.be.a("Boolean");
        expect(decoded).to.have.property("is_public").to.be.a("Boolean");

        done();
      });
  });

  it("Sending an invalid token to validate should return an error", done => {
    chai.request(server)
      .post("/api/auth/validate")
      .send({
        token: "THIS-IS-NOT-A-TOKEN-YOU-DUNCE!"
      }).end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body).to.have.property("status").equal("ERROR");
        expect(res.body).to.have.property("error").to.be.a("Object");
        expect(res.body.error).to.have.property("title")
          .to.be.a("String")
          .equal("Invalid Token");
        expect(res.body.error).to.have.property("description")
          .to.be.a("String")
          .equal("Invalid token provided.");
        done();
      });
  });

  it("Sending a valid token should return a person object", done => {
    chai.request(server)
      .post("/api/auth")
      .send({
        user: TestUser.user,
        pass: TestUser.pass
      })
      .end((err, res) => {
        // Extract token
        let token   = res.body.data.token;

        // Post token and check response
        chai.request(server)
          .post("/api/auth/validate")
          .send({
            token: token
          })
          .end((err, res) => {
            // Get person object
            let person = res.body.data.person;

            expect(res.body.data).to.have.property("person")
              .to.be.a("Object");
            expect(person).to.have.property("uuid").to.be.a("String");
            expect(person).to.have.property("user_id").to.be.a("String");
            expect(person).to.have.property("display_name").to.be.a("String");
            expect(person).to.have.property("user").to.be.a("String");
            expect(person).to.have.property("email").to.be.a("String");
            expect(person).to.have.property("roles").to.be.a("Array");
            expect(person).to.have.property("groups").to.be.a("Array");
            expect(person).to.have.property("generated").to.be.a("String")
              .match(Expressions.date_iso);
            expect(person).to.have.property("data").to.be.a("Array");
            expect(person).to.have.property("is_valid").to.be.a("Boolean");
            expect(person).to.have.property("is_public").to.be.a("Boolean");
            done();
          });
      });
  });
});

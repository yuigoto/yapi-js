import User from "../../src/models/User.model";

/**
 * YAPI : API/Messages
 * ======================================================================
 * Test API for Messaging CRUD.
 * ----------------------------------------------------------------------
 * @author    Fabio Y. Goto
 * @since     0.0.2
 */

// Sets NODE_ENV to "test"
process.env.NODE_ENV = "test";

// Import libs
import chai, { expect, should } from "chai";
import chai_http from "chai-http";

// Import local
import server from "src/server";
import Core from "src/core/Core";
import Token from "src/core/Token";
import Expressions from "src/core/Expressions";
import InitUser from "src/core/InitUser";

// Import models
import Message from "src/models/Message.model";
import AuthToken from "src/models/AuthToken.model";

// Fire up Should
should();
chai.use(chai_http);

// Set test user and test post ID
let test_user, post_id;

// Execute tests
const Test = () => {
  describe("Messages", () => {
    // Before everything, clear and set default user
    before(done => {
      Message.remove({}, () => {
        User.remove({}, () => {
          let user = new User(Core.user).save((err, post) => {
            // Set test user
            test_user = post;

            // Remove all tokens
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
    });

    it("Sending data to unmatched route should be forbidden", done => {
      chai.request(server)
        .get("/api/auth/hello-world")
        .end((err, res) => {
          expect(res).to.have.status(403);
          expect(res.body).to.have.property("status").equal("ERROR");
          expect(res.body.data).to.have.property("error")
            .to.be.a("Object");
          expect(res.body.data.error).to.have.property("title")
            .equal("Forbidden");
          done();
        });
    });

    it("GET from the base with no posts should return no members and count 0", done => {
      chai.request(server)
        .get("/api/messages")
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property("status").equal("SUCCESS");
          expect(res.body.data).to.have.property("count")
            .to.be.a("Number").equal(0);
          expect(res.body.data).to.have.property("members")
            .to.be.a("Array").deep.equal([]);
          done();
        });
    });

    it("You should not be able to post without a valid token", done => {
      let post = {
        message: "This message should not be posted."
      };

      chai.request(server)
        .post("/api/messages")
        .send(post)
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body).to.have.property("status").equal("ERROR");
          expect(res.body.data).to.have.property("error").to.be.a("Object");
          expect(res.body.data.error).to.have.property("description")
            .to.be.a("String")
            .equal("You don't have permission to post messages.");
          done();
        });
    });

    it("You should not be able to post without a message", done => {
      chai.request(server)
        .post("/api/messages")
        .set(
          "Authorization",
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNWEzYTIzZmI4NjZlZjgyMTY4Y2MyMjBlIiwidXNlciI6ImFkbWluIiwiZW1haWwiOiJsYWJAeXVpdGkuY29tLmJyIiwicm9sZXMiOlsic3VwZXIiLCJhZG1pbiIsIndyaXRlIiwicmVhZCJdLCJncm91cHMiOlsic3VwZXIiLCJhZG1pbiJdLCJnZW5lcmF0ZWQiOiIyMDE3LTEyLTIwVDA4OjQ5OjAzLjg4N1oiLCJleHBpcmVzIjoxNTEzODQ2MTQzODg3LCJkYXRhIjpbXSwiaXNfdmFsaWQiOnRydWUsImlzX3B1YmxpYyI6ZmFsc2UsImRpc3BsYXlfbmFtZSI6IkFkbWluIFlBUEkiLCJ1dWlkIjoiNTU3YzlmNDgtNmIyMy03MGQxLTkzMmYtODI1NDY2NTBlMzJhIiwiaWF0IjoxNTEzNzU5NzQzLCJleHAiOjE1MTM4NDYxNDN9.myWKDVlHaKok4DrkJuulq5tmCg7IraG4tikEBH0H2-o"
        )
        .send({})
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property("status").equal("ERROR");
          expect(res.body.data).to.have.property("error").to.be.a("Object");
          expect(res.body.data.error).to.have.property("description")
            .to.be.a("String")
            .equal("You just can't post a message without a proper message, can you?");
          done();
        });
    });

    it("A successful post should return 'SUCCESS' and the post data", done => {
      chai.request(server)
        .post("/api/messages")
        .set(
          "Authorization",
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNWEzYTIzZmI4NjZlZjgyMTY4Y2MyMjBlIiwidXNlciI6ImFkbWluIiwiZW1haWwiOiJsYWJAeXVpdGkuY29tLmJyIiwicm9sZXMiOlsic3VwZXIiLCJhZG1pbiIsIndyaXRlIiwicmVhZCJdLCJncm91cHMiOlsic3VwZXIiLCJhZG1pbiJdLCJnZW5lcmF0ZWQiOiIyMDE3LTEyLTIwVDA4OjQ5OjAzLjg4N1oiLCJleHBpcmVzIjoxNTEzODQ2MTQzODg3LCJkYXRhIjpbXSwiaXNfdmFsaWQiOnRydWUsImlzX3B1YmxpYyI6ZmFsc2UsImRpc3BsYXlfbmFtZSI6IkFkbWluIFlBUEkiLCJ1dWlkIjoiNTU3YzlmNDgtNmIyMy03MGQxLTkzMmYtODI1NDY2NTBlMzJhIiwiaWF0IjoxNTEzNzU5NzQzLCJleHAiOjE1MTM4NDYxNDN9.myWKDVlHaKok4DrkJuulq5tmCg7IraG4tikEBH0H2-o"
        )
        .send({
          text: "Hi! I am a message!"
        })
        .end((err, res) => {
          // Set post ID, so we can use it later
          post_id = res.body.data.post._id;

          expect(res).to.have.status(200);
          expect(res.body).to.have.property("status").equal("SUCCESS");
          expect(res.body.data).to.have.property("post").to.be.a("Object");
          expect(res.body.data.post).to.have.property("text")
            .to.be.a("String")
            .equal("Hi! I am a message!");
          done();
        });
    });

    it("If a message's set, should return count and member list", done => {
      // Post message
      new Message({
        user_id: test_user._id,
        text: "This is just a simple, single test message."
      }).save((err, post) => {
        chai.request(server)
          .get("/api/messages")
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.have.property("status").equal("SUCCESS");
            expect(res.body.data).to.have.property("count")
              .to.be.a("Number").above(0);
            expect(res.body.data).to.have.property("members")
              .to.be.a("Array").to.have.lengthOf(2);
            done();
          });
      });
    });

    it("If a message's set, should return count and member list", done => {
      // Set new text
      let post = {
        text: "Hola!"
      };
      chai.request(server)
        .put("/api/messages/" + post_id)
        .set(
          "Authorization",
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNWEzYTIzZmI4NjZlZjgyMTY4Y2MyMjBlIiwidXNlciI6ImFkbWluIiwiZW1haWwiOiJsYWJAeXVpdGkuY29tLmJyIiwicm9sZXMiOlsic3VwZXIiLCJhZG1pbiIsIndyaXRlIiwicmVhZCJdLCJncm91cHMiOlsic3VwZXIiLCJhZG1pbiJdLCJnZW5lcmF0ZWQiOiIyMDE3LTEyLTIwVDA4OjQ5OjAzLjg4N1oiLCJleHBpcmVzIjoxNTEzODQ2MTQzODg3LCJkYXRhIjpbXSwiaXNfdmFsaWQiOnRydWUsImlzX3B1YmxpYyI6ZmFsc2UsImRpc3BsYXlfbmFtZSI6IkFkbWluIFlBUEkiLCJ1dWlkIjoiNTU3YzlmNDgtNmIyMy03MGQxLTkzMmYtODI1NDY2NTBlMzJhIiwiaWF0IjoxNTEzNzU5NzQzLCJleHAiOjE1MTM4NDYxNDN9.myWKDVlHaKok4DrkJuulq5tmCg7IraG4tikEBH0H2-o"
        )
        .send(post)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property("status").equal("SUCCESS");
          expect(res.body.data).to.have.property("count")
            .to.be.a("Number").above(0);
          expect(res.body.data).to.have.property("members")
            .to.be.a("Array").to.have.lengthOf(2);
          done();
        });
    });
  });
};

// Export test function
export default Test;

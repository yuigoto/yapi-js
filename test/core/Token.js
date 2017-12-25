/**
 * YAPI : Test/Core/Token
 * ======================================================================
 * Tests the Token validator.
 * ----------------------------------------------------------------------
 * @author    Fabio Y. Goto
 * @since     0.0.1
 */

// Sets NODE_ENV to "test"
process.env.NODE_ENV = "test";

// Import libs
import { expect, should } from "chai";
import jwt from "jsonwebtoken";

// Import local
import InitUser from "src/core/InitUser";
import Security from "src/core/Security";
import Token from "src/core/Token";

// Fire up Should
should();

// Define test user data
const User = {
  user_id: "01234567890123456789",
  user: InitUser().user,
  email: InitUser().email,
  pass: InitUser().pass,
  roles: InitUser().roles,
  groups: InitUser().groups,
  generated: new Date().toISOString(),
  expires: new Date().getTime() + (60 * 60 * 24 * 2),
  data: [],
  is_valid: true,
  is_public: false,
  display_name: "Hello Name",
  uuid: "01234567-89ab-cdef-0123-456789abcdef"
};

// Execute tests
const Test = () => {
  describe("Token", () => {
    it("Should be an object", done => {
      expect(Token).to.be.a("Object");
      done();
    });

    it("Should contain `decode`, `fromPerson` and `toPerson` functions", done => {
      expect(Token).to.have.property("decode").to.be.a("Function");
      expect(Token).to.have.property("fromPerson").to.be.a("Function");
      expect(Token).to.have.property("toPerson").to.be.a("Function");
      done();
    });

    it("Should be able to encode a proper JSON Web Token", done => {
      let time = 60 * 60 * 24 * 2;

      expect(Token.fromPerson(User, time)).to.be.a("String")
        .equal(jwt.sign(User, Security.salt, { expiresIn: time } ));
      done();
    });

    it("Should be able to decode a proper JSON Web Token", done => {
      let time = 60 * 60 * 24 * 2;
      let token = Token.fromPerson(User, time);
      let person = Token.toPerson(token);
      let keys = Object.keys(person);

      for (let i in User) {
        expect(keys.includes(i)).to.be.a("Boolean").equal(true);
      }
      done();
    });

    it("Should be able to do an unsafe decode of a token", done => {
      let time = 60 * 60 * 24 * 2;
      let token = Token.fromPerson(User, time);
      let person = Token.decode(token);
      let keys = Object.keys(person);

      for (let i in User) {
        expect(keys.includes(i)).to.be.a("Boolean").equal(true);
      }
      done();
    });
  });
};

// Export test function
export default Test;

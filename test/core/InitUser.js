/**
 * YAPI : Test/Core/InitUser
 * ======================================================================
 * Tests the initial user object.
 * ----------------------------------------------------------------------
 * @author    Fabio Y. Goto
 * @since     0.0.1
 */

// Sets NODE_ENV to "test"
process.env.NODE_ENV = "test";

// Import libs
import { expect, should } from "chai";

// Import local
import InitUser from "src/core/InitUser";

// Fire up Should
should();

// Execute tests
const Test = () => {
  describe("InitUser", () => {
    let user = InitUser();

    it("InitUser should be an object", done => {
      expect(user).to.be.a("Object");
      done();
    });

    it("Should have all properties of a common user", done => {
      expect(user).to.have.property("user").to.be.a("String");
      expect(user).to.have.property("email").to.be.a("String");
      expect(user).to.have.property("pass").to.be.a("String");
      expect(user).to.have.property("data").to.be.a("Array");
      expect(user).to.have.property("groups").to.be.a("Array");
      expect(user).to.have.property("roles").to.be.a("Array");
      expect(user).to.have.property("is_active").to.be.a("Boolean");
      expect(user).to.have.property("is_banned").to.be.a("Boolean");
      expect(user).to.have.property("is_blocked").to.be.a("Boolean");
      expect(user).to.have.property("is_delete").to.be.a("Boolean");
      done();
    });

    it("Login data should be equal to repo defaults", done => {
      expect(user.user).to.equal("admin");
      expect(user.pass).equal("admin@yapi");
      expect(user.email).equal("lab@yuiti.com.br");
      done();
    });

    it("Should belong to all admin groups", done => {
      expect(user.groups).to.deep.equal(["super", "admin"]);
      done();
    });

    it("All roles must be set", done => {
      expect(user.roles).to.deep.equal(["super", "admin", "write", "read"]);
      done();
    });

    it("Status should not be blocked", done => {
      expect(user.is_active).to.equal(true);
      expect(user.is_banned).to.equal(false);
      expect(user.is_blocked).to.equal(false);
      expect(user.is_delete).to.equal(false);
      done();
    });
  });
};

// Export test function
export default Test;

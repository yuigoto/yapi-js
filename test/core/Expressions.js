/**
 * YAPI : Test/Core/Expressions
 * ======================================================================
 * Tests the regular expressions in the Expressions object.
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

// Fire up Should
should();

// Execute tests
const Test = () => {
  describe("Expressions", () => {
    it("Should be an object", done => {
      expect(Expressions).to.be.a("Object");
      done();
    });

    it("Should have all the basic properties from a list", done => {
      let keys = Object.keys(Expressions);
      let list = ["date_iso", "email", "uuid", "cpf", "cnpj"];

      for (let i of keys) {
        expect(i).to.be.oneOf(list);
      }
      done();
    });

    it("Should validate a ISODate string", done => {
      expect(Expressions.date_iso.test(new Date().toISOString()))
        .to.be.a("Boolean").equal(true);
      done();
    });

    it("Should validate multiple e-mail address types", done => {
      expect(Expressions.email.test("lab@yuiti.com.br"))
        .to.be.a("Boolean").equal(true);
      expect(Expressions.email.test("this_name@test-email.com"))
        .to.be.a("Boolean").equal(true);
      expect(Expressions.email.test("usuario@banco.bradesco"))
        .to.be.a("Boolean").equal(true);
      expect(Expressions.email.test("username@game.ninja"))
        .to.be.a("Boolean").equal(true);
      done();
    });

    it("Should validate an UUID with/without hyphens", done => {
      expect(Expressions.uuid.test("0123456789abcdef0123456789abcdef"))
        .to.be.a("Boolean").equal(true);
      expect(Expressions.uuid.test("01234567-89ab-cdef-0123-456789abcdef"))
        .to.be.a("Boolean").equal(true);
      done();
    });

    it("Should validate CPF numbers", done => {
      // Test CPF numbers
      let cpf = [
        "13869862165",
        "17601182495",
        "234.535.492-52",
        "527.405.616-44"
      ];

      for (let i of cpf) {
        expect(Expressions.cpf.test(i)).to.be.a("Boolean").equal(true);
      }
      done();
    });

    it("Should validate CNPJ numbers", done => {
      // Test CPF numbers
      let cnpj = [
        "87.860.522/0001-41",
        "33.624.969/0001-92",
        "72717164000145",
        "27635234000161"
      ];

      for (let i of cnpj) {
        expect(Expressions.cnpj.test(i)).to.be.a("Boolean").equal(true);
      }
      done();
    });
  });
};

// Export test function
export default Test;

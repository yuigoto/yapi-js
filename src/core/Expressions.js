/**
 * YAPI : Core/Expressions
 * ======================================================================
 * A POJO that holds some regular expressions for commonly used strings.
 * ----------------------------------------------------------------------
 * @author    Fabio Y. Goto
 * @since     0.0.1
 */

/**
 * Stores regular expressions for commonly used string types in the system.
 *
 * @type {object}
 */
const Expressions = {
  // ISO string date
  date_iso: /^([0-9]{4})(\-[0-9]{2}){2}T(:?[0-9]{2}){3}\.[0-9]{3}Z$/,
  // E-mail address
  email: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,9})$/,
  // Unique IDs
  uuid: /^([a-fA-F0-9]{8})(-?[a-fA-F0-9]{4}){3}(-?[a-fA-F0-9]{12})$/,
  // CPF (Brazilian Natural Person Registry)
  cpf: /^(\.?[0-9]{3}){3}-?([0-9]{2})$/,
  // CNPJ (Brazilian Legal Person Registry)
  cnpj: /^([0-9]{2})(\.?[0-9]{3}){2}\/?([0-9]{4})\-?([0-9]{2})$/
};

// Export
export default Expressions;

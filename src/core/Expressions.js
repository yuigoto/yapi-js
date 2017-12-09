/**
 * YAPI : Core/Expressions
 * ======================================================================
 * A POJO that holds some regular expressions for commonly used strings.
 * ----------------------------------------------------------------------
 * @author    Fabio Y. Goto <lab@yuiti.com.br>
 * @since     0.0.1
 */

/**
 * Stores regular expressions for commonly used string types in the system.
 *
 * @type {object}
 */
const Expressions = {
  // ISO string date
  date_iso: /^([0-9]{4})\-([0-9]{2})\-([0-9]{2})T([0-9]{2}):([0-9]{2}):([0-9]{2}).([0-9]{3})Z$/,
  // E-mail address
  email: /^([A-Za-z0-9\-\_]+)((\.|\+)([A-Za-z0-9\-\_]+))*@[A-Za-z0-9\-\_]+(\.[A-Za-z0-9]+)*(\.[A-Za-z0-9]{2,9})$/,
  // Unique IDs
  uuid: /^([a-f0-9]{8})(-([a-f0-9]{4})){3}-([a-f0-9]{12})$/,
  // CPF (Brazilian Natural Person Registry)
  cpf: /^([0-9]{3}).([0-9]{3}).([0-9]{3})\-([0-9]{2})$/,
  // CNPJ (Brazilian Legal Person Registry)
  cnpj: /^([0-9]{2}).([0-9]{3}).([0-9]{3})\/([0-9]{4})\-([0-9]{2})$/
};

// Export
export default Expressions;

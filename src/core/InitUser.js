/**
 * YAPI : Core/InitUser
 * ======================================================================
 * Initial user object, this is the user added to the database when first
 * initialized.
 * ----------------------------------------------------------------------
 * @author    Fabio Y. Goto
 * @since     0.0.1
 */

/**
 * Initial user data.
 *
 * @type {object}
 */
const InitUser = () => {
  return {
    user: "admin",
    pass: "admin@yapi",
    email: "lab@yuiti.com.br",
    data: [
      {
        name: "f_name",
        value: "Admin"
      },
      {
        name: "m_name",
        value: ""
      },
      {
        name: "l_name",
        value: "YAPI"
      }
    ],
    groups: [
      "super",
      "admin"
    ],
    roles: [
      "super",
      "admin",
      "write",
      "read"
    ],
    is_active: true,
    is_banned: false,
    is_blocked: false,
    is_delete: false
  };
};

// Export data
export default InitUser;

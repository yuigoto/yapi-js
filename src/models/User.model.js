/**
 * YAPI : Models/User
 * ======================================================================
 * Basic User account schema/model.
 * ----------------------------------------------------------------------
 * @author    Fabio Y. Goto
 * @since     0.0.1
 */

// Import libs
import mongoose, { Schema } from "mongoose";

// Import UserData key pair subschema
import {
  ModelSchema as UserDataSchema
} from "src/models/subschemas/UserData.model";

/**
 * Returns the display, according to the data saved in the user's profile.
 *
 * @param {object} data
 *    An object containing the user's display name or "Anonymous User", if
 *    none is given
 * @returns {string}
 * @constructor
 */
export const UserDisplayName = (data) => {
  let name = [];
  let keys = ["f_name", "m_name", "l_name"];

  for (let k of keys) {
    for (let i = 0; i < data.length; i++) {
      let curr = data[i];

      if (curr.name === k && curr.value !== "") {
        name.push(curr.value);
        break;
      }
    }
  }

  if (name.length < 1) {
    return name.join("Anonymous User");
  } else {
    return name.join(" ");
  }
};

// Export Schema (Can be imported/nested into other schemas)
export const ModelSchema = new Schema({
  user: {
    type: String,
    unique: [
      true,
      "Username already registered in the database"
    ],
    required: [
      true,
      "Username is mandatory"
    ],
    minlength: [
      5,
      "Username should be at least 5 characters long"
    ],
    maxlength: [
      32,
      "Username should be at most 32 characters long"
    ],
    match: [
      /^([a-zA-Z0-9\_]+)$/,
      "Should only contain numbers, letters and underscore"
    ]
  },
  pass: {
    type: String,
    required: [
      true,
      "Please type a password"
    ]
  },
  email: {
    type: String,
    unique: [
      true,
      "E-mail address already registered in the database"
    ],
    required: [
      true,
      "E-mail address is mandatory"
    ],
    match: [
      /^([A-Za-z0-9\-\_]+)((\.|\+)([A-Za-z0-9\-\_]+))*@[A-Za-z0-9\-\_]+(\.[A-Za-z0-9]+)*(\.[A-Za-z0-9]{2,9})$/,
      "Please, insert a valid e-mail address"
    ]
  },
  hash: {
    type: String,
    unique: true,
    required: true
  },
  data: {
    type: [UserDataSchema]
  },
  roles: {
    type: [String],
    required: true,
    default: ["read"]
  },
  groups: {
    type: [String],
    required: true,
    default: ["users"]
  },
  is_active: {
    type: Boolean,
    default: true
  },
  is_banned: {
    type: Boolean,
    default: false
  },
  is_blocked: {
    type: Boolean,
    default: false
  },
  is_delete: {
    type: Boolean,
    default: false
  },
  created: {
    type: Date,
    default: Date.now()
  },
  updated: {
    type: Date,
    default: Date.now()
  }
});

// Export Model (default)
export default mongoose.model("user", ModelSchema, "sys_users");

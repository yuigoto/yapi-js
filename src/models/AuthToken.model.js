/**
 * YAPI : Models/AuthToken
 * ======================================================================
 * Stores objects with token data, used to validate/check access and, also,
 * to check for public key access.
 * ----------------------------------------------------------------------
 * @author    Fabio Y. Goto
 * @since     0.0.1
 */

// Import libs
import mongoose, { Schema } from "mongoose";

// Import local
import Expressions from "src/core/Expressions";

// Import UserData key pair subschema
import {
  ModelSchema as UserDataSchema
} from "src/models/subschemas/UserData.model";

// Export Schema (Can be imported/nested into other schemas)
export const ModelSchema = new Schema({
  uuid: {
    type: String,
    required: true,
    match: Expressions.uuid
  },
  user_id: {
    type: String,
    required: true
  },
  display_name: {
    type: String,
    required: true
  },
  user: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    match: Expressions.email
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
  generated: {
    type: Date,
    required: true
  },
  expires: {
    type: Number,
    required: true
  },
  data: {
    type: [UserDataSchema],
    default: []
  },
  is_valid: {
    type: Boolean,
    required: true
  },
  is_public: {
    type: Boolean,
    required: true
  }
});

// Export Model (default)
export default mongoose.model("user_token", ModelSchema, "sys_token_data");

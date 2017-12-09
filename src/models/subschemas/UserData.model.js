/**
 * YAPI : Models/SubSchemas/UserData
 * ======================================================================
 * Key/Value pair subschema.
 *
 * Not restricted to user data only, named so because it's the first
 * purpose it was built for. :)
 * ----------------------------------------------------------------------
 * @author    Fabio Y. Goto <lab@yuiti.com.br>
 * @since     0.0.1
 */

// Import libs
import mongoose, { Schema } from "mongoose";

// Export Schema (Can be imported/nested into other schemas)
export const ModelSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  value: {
    type: Object,
    required: true
  }
});

// Export Model (default)
export default mongoose.model("user_data", ModelSchema, "sys_users_data");

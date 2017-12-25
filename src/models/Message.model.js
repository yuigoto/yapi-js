/**
 * YAPI : Models/Message
 * ======================================================================
 * Example model for text messages.
 * ----------------------------------------------------------------------
 * @author    Fabio Y. Goto
 * @since     0.0.1
 */

// Import libs
import mongoose, { Schema } from "mongoose";

// Import local
import Expressions from "src/core/Expressions";

// Export Schema (Can be imported/nested into other schemas)
export const ModelSchema = new Schema({
  user_id: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: [
      true,
      "Type a message, will ya?"
    ]
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
export default mongoose.model("users_messages", ModelSchema, "users/messages");

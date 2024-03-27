import mongoose from "mongoose";
import { NoteSchema } from "./noteSchema";


const UserSchema = new mongoose.Schema({
  id: {
    type: String,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  token: {
    type: String,
  },
  notes: [NoteSchema],
});

export const User = mongoose.model("User", UserSchema);

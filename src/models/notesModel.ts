import mongoose from "mongoose";

export const NoteSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    requried: true,
  },
  body: {
    type: String,
    required: true,
  },
  date: {
    type: String,
  },
});

export const Note = mongoose.model("Notes", NoteSchema);

import { Router } from "express";
import { Note } from "../../models/notesModel";
import verifyUser from "../../middlewares/verifyUser";
import { User } from "../../models/userModel";
import { Mongoose } from "mongoose";

const notesRouter = Router();

notesRouter.use(verifyUser);

//add notes
notesRouter.post("/notes", async (req, res, next) => {
  try {
    const { id, title, body }: { id: string; title: string; body: string } =
      req.body;

    if (title.length < 1 || body.length < 1) {
      return res.status(400).send("title and body needed");
    }

    const note = new Note({
      id: id,
      title: title,
      body: body,
      date: Date.now().toString(),
    });

    const user = res.locals.user as InstanceType<typeof User>;

    user.notes.push(note);
    await user.save();
    return res.status(200).json({
      success: true,
      message: "Notes saved successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(400).send(error);
  }
});

//delete note
notesRouter.delete("/notes/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const token = req.headers["authorization"];

    const user = res.locals.user as InstanceType<typeof User>;
    const index = user.notes.findIndex((it) => it.id === id);

    user.notes.splice(index, 1);

    await user.save();
    return res.send(200).json({
      success: true,
      message: "note deleted",
    });

    return res.status(400).send("error");
  } catch (error) {
    console.error(error);
    return res.status(400).send(error);
  }
});

//get all notes
notesRouter.get("/notes", async (req, res, next) => {
  try {
    const user = res.locals.user as InstanceType<typeof User>;
    return res.status(200).json({
      success: true,
      data: user.notes,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
});

//update note
notesRouter.post("/notes", async (req, res, next) => {
  try {
    const { id, title, body }: { id: string; title: string; body: string } =
      req.body;
    if (title.length < 1 || body.length < 1) {
      return res.status(400).send("title and body needed");
    }

    const user = res.locals.user as InstanceType<typeof User>;
    const index = user.notes.findIndex((it) => it.id === id);

    user.notes[index].title = title;
    user.notes[index].body = body;

    await user.save();
    return res.status(200).json({
      success: true,
      message: "note updated successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(400).send(error);
  }
});

export default notesRouter;

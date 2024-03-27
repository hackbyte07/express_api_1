import { Router } from "express";
import { Note } from "../../schema/noteSchema";
import getAndVerifyUser from "../../utils/jsonTokenVerifier";

const notesRouter = Router();

//add notes
notesRouter.post("/notes", async (req, res) => {
  try {
    const { id, title, body }: { id: string; title: string; body: string } =
      req.body;
    const token = req.headers["authorization"];

    if (title.length < 1 || body.length < 1) {
      return res.status(400).send("title and body needed");
    }

    if (token !== undefined) {
      const user = await getAndVerifyUser(token);
      if (user !== undefined) {
        const note = new Note({
          id: id,
          title: title,
          body: body,
          date: Date.now().toString(),
        });

        user.notes.push(note);
        await user.save();
        return res.status(200).json({
          success: true,
          message: "Notes saved successfully",
        });
      }
    }
    return res.status(400).send("unknown error");
  } catch (error) {
    console.error(error);
    return res.status(400).send(error);
  }
});

//delete note
notesRouter.delete("/notes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const token = req.headers["authorization"];
    if (token !== undefined) {
      const user = await getAndVerifyUser(token);
      if (user !== undefined) {
        const index = user.notes.findIndex((it) => it.id === id);

        user.notes.splice(index, 1);

        await user.save();
        return res.send(200).json({
          success: true,
          message: "note deleted",
        });
      }
    }
    return res.status(400).send("error");
  } catch (error) {
    console.error(error);
    return res.status(400).send(error);
  }
});

//get all notes
notesRouter.get("/notes", async (req, res) => {
  try {
    const token = req.headers["authorization"];
    if (token !== undefined) {
      const user = await getAndVerifyUser(token);
      if (user !== undefined) {
        return res.status(200).json({
          success: true,
          data: user.notes,
        });
      }
    }
    return res.status(400).send("error");
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
});

//update note
notesRouter.post("/notes", async (req, res, next) => { });

export default notesRouter;

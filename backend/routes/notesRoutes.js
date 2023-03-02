const express = require("express");
const router = express.Router();
const notesController = require("../controllers/notesController");
const verifyJWT = require("../middleware/verifyJWT");

router.use(verifyJWT); // Use the `verifyJWT` middleware to check for authorization

router
  .route("/")
  .get(notesController.getAllNotes) // If authorized, retrieve all notes
  .post(notesController.createNewNote) // If authorized, create a new note
  .patch(notesController.updateNote) // If authorized, update a note
  .delete(notesController.deleteNote); // If authorized, delete a note

module.exports = router;

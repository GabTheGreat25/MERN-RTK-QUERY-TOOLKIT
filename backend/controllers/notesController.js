const Note = require("../models/Note");
const User = require("../models/User");
const asyncHandler = require("express-async-handler");

/**
 * @desc    Get all notes
 * @route   GET /notes
 * @access  Private
 */

const getAllNotes = asyncHandler(async (req, res) => {
  // Get all notes from MongoDB
  const notes = await Note.find()
    // Apply the lean() method to improve query performance by returning plain JS objects instead of Mongoose documents
    .lean()
    // Apply the exec() method to execute the query and get a Promise that resolves with the query result
    .exec();

  // If there are no notes
  // Note: Using optional chaining and the nullish coalescing operator to handle
  // the case where notes is null or empty.
  if (!notes?.length) {
    return res.status(400).json({ message: "No notes found" });
  }

  // Note: Using Promise.all() to wait for all the async operations to complete
  // before sending the response. The map() function is used to transform each note
  // object to include the username property.
  const notesWithUser = await Promise.all(
    notes.map(async (note) => {
      // Find the user associated with the note and return their username
      // Note: Using .lean() and .exec() here to return a plain JavaScript object
      // instead of a Mongoose document, and to improve performance.
      const user = await User.findById(note.user).lean().exec();
      return { ...note, username: user.username };
    })
  );

  // Send the response with the notes and usernames
  res.json(notesWithUser);
});

/**
 * @desc    Create new note
 * @route   POST /notes
 * @access  Private
 */
const createNewNote = asyncHandler(async (req, res) => {
  const { user, title, text } = req.body;

  // Confirm all required fields are present in the request body
  if (!user || !title || !text) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Check if a note with the same title already exists
  const duplicate = await Note.findOne({ title }).lean().exec();

  if (duplicate) {
    // Return a 409 Conflict status if a note with the same title already exists
    return res.status(409).json({ message: "Duplicate note title" });
  }

  // Create and save the new note
  const note = await Note.create({ user, title, text });

  if (note) {
    // Return a 201 Created status if the new note was successfully created and saved
    return res.status(201).json({ message: "New note created" });
  } else {
    // Return a 400 Bad Request status if the request data was invalid
    return res.status(400).json({ message: "Invalid note data received" });
  }
});

/**
 * @desc    Update a note
 * @route   PATCH /notes/:id
 * @access  Private
 */
const updateNote = asyncHandler(async (req, res) => {
  const { id, user, title, text, completed } = req.body;

  // Confirm all required fields are present in the request body
  if (!id || !user || !title || !text || typeof completed !== "boolean") {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Find the note to update by ID
  const note = await Note.findById(id).exec();

  if (!note) {
    // Return a 400 Bad Request status if the note to update was not found
    return res.status(400).json({ message: "Note not found" });
  }

  // Check if a note with the same title already exists, but allow renaming of the original note
  const duplicate = await Note.findOne({ title }).lean().exec();

  if (duplicate && duplicate?._id.toString() !== id) {
    // Return a 409 Conflict status if a note with the same title already exists
    return res.status(409).json({ message: "Duplicate note title" });
  }

  // Update the note with the new data and save
  note.user = user;
  note.title = title;
  note.text = text;
  note.completed = completed;

  const updatedNote = await note.save();

  // Return the title of the updated note in the response body
  res.json(`'${updatedNote.title}' updated`);
});

// @desc Delete a note
// @route DELETE /notes/:id
// @access Private
const deleteNote = asyncHandler(async (req, res) => {
  const { id } = req.body;

  // Confirm that an ID was provided in the request body
  if (!id) {
    return res.status(400).json({ message: "Note ID required" });
  }

  // Confirm that the note with the given ID exists in the database
  const note = await Note.findById(id).exec();

  if (!note) {
    return res.status(400).json({ message: "Note not found" });
  }

  // Delete the note from the database using the `deleteOne` method
  const result = await note.deleteOne();

  // Send a response to the client indicating that the note was successfully deleted
  const reply = `Note '${result.title}' with ID ${result._id} deleted`;

  res.json(reply);
});

module.exports = {
  getAllNotes,
  createNewNote,
  updateNote,
  deleteNote,
};

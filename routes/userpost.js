const express = require('express');
const router = express.Router();
const fetchUser = require('../middleware/fetchUser');
const User = require("../models/User");
const Note = require('../models/Note.js');
const { body, validationResult } = require('express-validator');

// ROUTE 1: Get All the Notes using: GET "/api/notes/getuser". Login required
router.get('/fetchallnotes', fetchUser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id });
        res.json(notes)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

// ROUTE 2: Add a new Note using: POST "/api/notes/addnote". Login required
router.post('/addnote', fetchUser, [
    body('title', 'Enter a valid title').isLength({ min: 3 })], async (req, res) => {
        try {
            userId = req.user.id;
            const Name = await User.findById(userId)
              .select("-password")
              .select("-date")
              .select("-_id")
              .select("-__v")
              .select("-email");
            
            try {
                const { title } = req.body;
    
                // If there are errors, return Bad request and the errors
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({ errors: errors.array() });
                }
                const note = new Note({
                    title, user: req.user.id,Name:Name.name
                })
                const savedNote = await note.save()
    
                res.json(savedNote)
    
            } catch (error) {
                console.error(error.message);
                res.status(500).send("Internal Server Error");
            }
        }
           catch (error) {
            console.log(error.message);
            res.status(500).send("Enternal sever error");
          }})

// ROUTE 3: Update an existing Note using: PUT "/api/notes/updatenote". Login required
router.put('/updatenote/:id', fetchUser, async (req, res) => {
    const { title } = req.body;
    try {
        // Create a newNote object
        const newNote = {};
        if (title) { newNote.title = title };

        // Find the note to be updated and update it
        let note = await Note.findById(req.params.id);
        if (!note) { return res.status(404).send("Not Found") }

        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }
        note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.json({ note });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

// ROUTE 4: Delete an existing Note using: DELETE "/api/notes/deletenote". Login required
router.delete('/deletenote/:id', fetchUser, async (req, res) => {
    try {
        // Find the note to be delete and delete it
        let note = await Note.findById(req.params.id);
        if (!note) { return res.status(404).send("Not Found") }

        // Allow deletion only if user owns this Note
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        note = await Note.findByIdAndDelete(req.params.id)
        res.json({ "Success": "Note has been deleted", note: note });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})


module.exports = router;
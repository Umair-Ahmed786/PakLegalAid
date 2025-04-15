const express = require('express');
const router = express.Router();
const fetchUser = require('../middleware/fetchuser');
const Notes = require('../models/Notes');
const { body, validationResult } = require('express-validator');

// Get all notes ....... login required
router.get('/fetchallnotes', fetchUser, async (req, res) => {

    try {
        const notes = await Notes.find({ user: req.user.id });
        res.send(notes)
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Error occured' });  // Send an error response
    }

});

// add  notes ....... login required
router.post('/addnote', fetchUser, [
    body('title', 'Enter a Valid title').isLength({ min: 5 }),
    body('description', 'Enter a Valid description').isLength({ min: 5 }),
    body('tag', 'Please Enter valid tags').isLength({ min: 3 }),
], async (req, res) => {

    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { title, description, tag } = req.body;

        const notes = new Notes({
            title, description, tag, user: req.user.id
        })

        const saved_note = await notes.save();
        return res.json(saved_note)

    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Error occured' });  // Send an error response
    }


});


//update notes ===>>>  login required (put request)
router.put('/updatenote/:id', fetchUser, async (req, res) => {

    try {
        const { title, description, tag } = req.body;

        //created new note
        const newnote = {};
        if (title) { newnote.title = title }
        if (description) { newnote.description = description }
        if (tag) { newnote.tag = tag }

        //finding the note
        const note = await Notes.findById(req.params.id);

        if (!note) {
            return res.status(404).send("Not found");
        }

        if (note.user.toString() !== req.user.id) {
            return res.status(404).send("Not allowed");
        }

        const note2 = await Notes.findByIdAndUpdate(req.params.id, { $set: newnote }, { new: true });
        return res.json(note2)
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Error occured' });  // Send an error response
    }

});

//delete notes ===>>>  login required (delete request)
router.delete('/deletenote/:id', fetchUser, async (req, res) => {

    try {


        //finding the note
        let note = await Notes.findById(req.params.id);

        if (!note) {
            return res.status(404).send("Not found");
        }

        if (note.user.toString() !== req.user.id) {
            return res.status(404).send("Not allowed");
        }

        note = await Notes.findByIdAndDelete(req.params.id);
        return res.json({ "success": "note succesfully deleted" })
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Error occured' });  // Send an error response
    }

});

module.exports = router;

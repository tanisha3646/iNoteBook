const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const fetchuser = require("../middleware/fetchUser");
const { body, validationResult } = require('express-validator');

// ROUTE-1 : Get all the notes of a user using Get "api/notes/fetchallnotes" --> Login required
router.get('/fetchallnotes', fetchuser, async (req, res)=>{
    try{
        const notes = await Note.find({user: req.user.id});
        res.send(notes);
    }
    catch(err){
        console.error(err);
        res.status(500).send("Some error occured");
    }
});

// ROUTE-2 : Add a new note of a user using Post "api/notes/addnote" --> Login required
router.post('/addnote', fetchuser, [
    body("title", "Enter a valid name").isLength({min:2}),
    body("description", "Description must be 5 characters long").isLength({min:5})
], async (req, res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {title, description, tag} = req.body;
    try{
        const { title, description, tag } = req.body;
        const note = new Note({
            title, description, tag, user: req.user.id
        })
        const savedNote = await note.save()

        res.json(savedNote)
    }
    catch(err){
        console.error(err);
        res.status(500).send("Some error occured");
    }
});

// ROUTE-3: Update an existing note of a user using PUT "api/notes/updatenote" --> Login required
router.put('/updatenote/:id', fetchuser, [
    body("title", "Title must be alteast 2 character long").isLength({min:2}),
    body("description", "Description must be 5 characters long").isLength({min:5})
], async (req, res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {title, description, tag} = req.body;
    try{
        const newNote  = {};
        if(title){newNote.title = title};
        if(description){newNote.description = description};
        if(tag){newNote.tag = tag};

        // Find the note to be updated and update it
        let note = await Note.findById(req.params.id);
        if(!note){return res.status(404).send("Not Found")}
        
        if(note.user.toString() !== req.user.id){
            return res.status(401).send("Not Allowed");
        }

    note = await Note.findByIdAndUpdate(req.params.id, {$set: newNote}, {new:true})
    res.json({note});
    }
    catch(err){
        console.error(err);
        res.status(500).send(err);
    }
});

// ROUTE-4: Delete an existing note of a user using DELETE "api/notes/deleteNote" --> Login required
router.delete('/deleteNote/:id', fetchuser, async (req, res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {title, description, tag} = req.body;
    try{

        // Find the note to be deleted and delete it
        let note = await Note.findById(req.params.id);
        if(!note){return res.status(404).send("Not Found")}
        
        if(note.user.toString() !== req.user.id){
            return res.status(401).send("Not Allowed");
        }

        note = await Note.findByIdAndDelete(req.params.id)
        res.json({"success" : "Notes has been deleted"});
    }
    catch(err){
        console.error(err);
        res.status(500).send(err);
    }
});

module.exports = router;
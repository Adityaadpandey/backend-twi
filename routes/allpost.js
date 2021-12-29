const express = require('express');
const router = express.Router();
const Note = require('../models/Note.js');
// const { body, validationResult } = require('express-validator');


router.get('/fetchall',  async (req, res) => {
    try {
        const notes = await Note.find().sort({date: -1});
        res.json(notes)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})


module.exports = router

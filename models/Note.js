const mongoose = require('mongoose');
const { Schema }  = mongoose;

const NotesSchema = new Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },
    Name:{
        type:'string',
        required:true,
    },
    title:{
        type: 'string',
        required : true,
    },
    // description: {
    //     type: 'string',
    //     required : true,
    // },
    date:{
        type: Date,
        default: Date.now,
    }

})
const Note =  mongoose.model('Notes',NotesSchema);
module.exports = Note
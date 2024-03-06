const { default: mongoose } = require('mongoose');
const { Schema } = mongoose;
const connectToMongo = require('../db');

const nteSchema = new Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required:true
    },
    title : {
        type: String,
        required:true
    },
    description : {
        type: String,
        required:true
    },
    tag : {
        type: String,
        default: 'General'
    },
    date : {
        type: String,
        default: Date.now
    }
})

module.exports = mongoose.model('note',nteSchema)
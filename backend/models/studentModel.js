const mongoose = require('mongoose')

const studentSchema = mongoose.Schema({
    name :{
        type: String,
        required: true
    },
    dob: {
        type: Date,
        required: true,
        //todo : set max date limit
    },
    email : {
        type: String,
        required: true
    },
    gender : {
        type: String,
        enum : ['male','female','other'], 
        default: 'other' 
    },
    studentNumber : {
        type : String, 
        required : true
    },
    image : {
        type : mongoose.Schema.Types.ObjectId,
        ref: "image"
    }
})



module.exports = ImageModel = mongoose.model('student',studentSchema)

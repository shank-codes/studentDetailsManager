const mongoose = require('mongoose')
const passportLocalMongoose = require("passport-local-mongoose");

const studentSchema = mongoose.Schema({
    name :{
        type: String,
        required: true
    },
    dob: {
        type: String,
        required: true,
        //todo : set max date limit
    },
    email : {
        type: String,
        required: true
    },
    gender : {
        type: String,
        enum : ['Male','Female','Other'], 
        default: 'Other' 
    },
    // studentNumber : {
    //     type : String, 
    //     required : true
    // },
    image : {
        type : mongoose.Schema.Types.ObjectId,
        ref: "image"
    },
    isAdmin : {
        type: Boolean,
        default: false
    }
})

studentSchema.plugin(passportLocalMongoose)

module.exports = ImageModel = mongoose.model('student',studentSchema)

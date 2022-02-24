const mongoose = require('mongoose')

const imageSchema = mongoose.Schema({
    imageName: {
        type:String,
        required: true
    }
})

module.exports = ImageModel = mongoose.model('image',imageSchema)

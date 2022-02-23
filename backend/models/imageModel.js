const express = require('express')
const mongoose = require('mongoose')

const imageSchema = mongoose.Schema({
    imageName: {
        type:String,
        required: true
    },
    image:{
        data : Buffer,
        contentType: String
    }
})

module.exports = ImageModel = mongoose.model('imageModel',imageSchema)

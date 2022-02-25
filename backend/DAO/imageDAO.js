const imageModel = require('../models/imageModel')

exports.saveImage = async (imageName)=> {
    try {
        const newImage = new imageModel(
            {
                imageName:imageName,
            }
        )
        const savedImage = await newImage.save()
        return {success:true, image: savedImage}
    }
    catch(err) {
        console.log(err)
        return {success:false, Error:err}
    }
}

exports.getImages = async () => {
    try{
        let imageDatas = await imageModel.find({})
        return {success:true, records:imageDatas}
    }
    catch(err) {
        return {success: false, Error:err}
    }
}

exports.deleteImage = async(imageId) => {
    try{
        let image = await imageModel.findByIdAndDelete(imageId)
        return {success:true, image:image}
    }
    catch(err) {
        return {success: false, Error:err}
    }
}

exports.updateImage = async(imageId, imageName) => {
    try {
        let updatedImage = await imageModel.findByIdAndUpdate(imageId,{imageName: imageName})
        return {success:true, updatedImage: updatedImage}
    }
    catch(err) {
        return {success:false, Error: err}
    }
}

exports.getImageById = async (imageId) => {
    try{
        let imageData = await imageModel.findById(imageId)
        return {success:true, image:imageData}
    }
    catch(err) {
        return {success: false, Error:err}
    }
}
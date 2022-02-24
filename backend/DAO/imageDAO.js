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
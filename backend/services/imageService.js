const imageDAO = require('../DAO/imageDAO')
const fs = require('fs')

exports.saveImage = async (imageName)=> {
    try {
        const savedImage = await imageDAO.saveImage(imageName)
        if(savedImage.success){
            return {success:true, images: savedImage}
        }
        else 
        throw new Error("error in service")
    }
    catch(err) {
        return {success:false, Error:err}
    }
}

exports.getImages = async () => {
    try{
        let imageDatas = await imageDAO.getImages()
        console.log(imageDatas)
        if(imageDatas.success)
        return {success:true, images: imageDatas}
        else 
        throw new Error("cannot get images")
    }
    catch(err) {
        return {success: false, Error:err}
    }
}

exports.deleteImage = async(imageId) => {
    try{
        let deletedImage = await imageDAO.deleteImage(imageId)

        fs.unlink(
            "public/uploads/" + deletedImage.image.imageName,
            (err, files) => {
              if (err) throw err;
            }
          );

        console.log('image deleted successfully')
        return {success:true, image:deletedImage.image}
    }
    catch(err) {
        return {success: false, Error:err}
    }
}

exports.updateImage = async(imageId, imageName) => {
    try {
        let image = await imageDAO.updateImage(imageId,imageName)
        return {success:true, updatedImage: image.updatedImage}
    }
    catch(err) {
        return {success:false, Error: err}
    }
}

exports.getImageById = async (imageId) => {
    try{
        let imageData = await imageDAO.getImageById(imageId)
        return {success:true, image:imageData.image}
    }
    catch(err) {
        return {success: false, Error:err}
    }
}
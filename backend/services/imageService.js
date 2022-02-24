const imageDAO = require('../DAO/imageDAO')

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
        let image = await imageDAO.deleteImage(imageId)
        console.log('image deleted successfully')
        return {success:true, image:image.image}
    }
    catch(err) {
        return {success: false, Error:err}
    }
}
const imageDAO = require('../DAO/imageDAO')

exports.saveImage = async (imageName, data)=> {
    try {
        const savedImage = await imageDAO.saveImage(imageName,data)
        if(savedImage.success)
        return {success:true, image: savedImage}
        else 
        throw new Error("error in service")
    }
    catch(err) {
        return {success:false, Error:err}
    }
}
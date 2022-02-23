const imageModel = require('../models/imageModel')

exports.saveImage = async (imageName, data)=> {
    try {
        const newImage = new imageModel(
            {
                imageName:imageName,
                image: {
                    data: data,
                    contentType: 'image/png'
                }
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
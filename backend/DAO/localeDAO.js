const localeModel = require('../models/localeModel')

const engTranslations = require('../locales/en/translation.json')
const hiTranslations = require('../locales/hi/translation.json')
const knTranslations = require('../locales/kn/translatino.json')

exports.saveLocale = async ()=> {
    try {
        const locale =new localeModel({
            en: engTranslations,
            hi: hiTranslations,
            kn: knTranslations
        })
        const savedLocale = await locale.save();
        console.log(savedLocale)

        return savedLocale;
    }
    catch(err) {
        console.log(err)
        return {success:false, Error:err}
    }
}

exports.getTranslations = async(lang) =>  {
    try {
        const translationArray = await localeModel.find()
        const translationFirstElement = translationArray[0]
        return translationFirstElement[lang];
    }
    catch(err) {
        console.log(err)
        return {success:false, Error:err}
    }
}
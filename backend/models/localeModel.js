const mongoose = require('mongoose')

const localeSchema = mongoose.Schema({
    en: {

    },
    hi: {

    },
    kn: {

    }

})


module.exports = LocaleModel = mongoose.model('locale',localeSchema)

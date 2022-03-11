const i18next = require("i18next");
const localeDAO = require('./DAO/localeDAO')

// if no language parameter is passed, let's try to use the node.js system's locale
const systemLocale = Intl.DateTimeFormat().resolvedOptions().locale;
console.log(`i18n: ${systemLocale}`);

let engTranslations,hiTranslations,knTranslations;
var getTranslations = async() => {
  try {
    engTranslations = await localeDAO.getTranslations('en');
    hiTranslations = JSON.stringify(await localeDAO.getTranslations('hi'));
    console.log(hiTranslations)
    knTranslations = await localeDAO.getTranslations('kn')
  }
  catch(err) {
    console.log(err)
  }
}
getTranslations()

i18next.init({
  fallbackLng: "en",
  resources: {
    en: {
      translation: engTranslations
      //translation: require("./locales/en/translation.json"),
    },
    hi: {
      translation: hiTranslations
      //translation: require("./locales/hi/translation.json"),
    },
    kn: {
      translation: knTranslations
      //translation: require("./locales/kn/translatino.json"),
    },
  }
});

module.exports = (lng) => i18next.getFixedT(lng || systemLocale);


// const localeDAO = require('../DAO/localeDAO')

// const transRes = await localeDAO.getTranslations('en')
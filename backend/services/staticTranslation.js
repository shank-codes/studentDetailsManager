const i18n = require("../i18n");
const localePage = require("../locales/en/translation.json");

const localeDAO = require("../DAO/localeDAO");

var getTranslations = async (language) => {
  try {
    if (language === "hi") {
      return await localeDAO.getTranslations("hi");
    } else if (language === "kn") {
      return await localeDAO.getTranslations("kn");
    } else {
      return await localeDAO.getTranslations("en");
    }
  } catch (err) {
    console.log(err);
  }
};

exports.translate = async (language, pageName) => {
  const context = localePage[pageName];
  //const lang = i18n(language);
  //console.log(lang)

  const keys = Object.keys(context);

  // print all keys
  console.log(keys);

  const staticTranslations = await getTranslations(language);
  const langObj = {};

  keys.forEach((key, index) => {
    let temp = staticTranslations[pageName];
    langObj[key] = temp[key];
    console.log(key, ":", pageName, ".", key);
  });
  console.log(langObj);

  return langObj;
};

const i18n = require("../i18n");
const localePage = require("../locales/en/translation.json");

exports.translate = async (language,pageName) => {
  const context = localePage[pageName];
  const lang = i18n(language);

  const keys = Object.keys(context);

  // print all keys

  console.log(keys);
  const langObj ={}

  keys.forEach((key, index) => {
      langObj[key] = lang(pageName+"."+key)
    console.log(`${key}: ${lang(pageName+"."+key)}`);
  });
  console.log(langObj)

  return langObj
};

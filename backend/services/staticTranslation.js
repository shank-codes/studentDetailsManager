const i18n = require("../i18n");
const pageObj = require("../locales/en/translation.json");

exports.translate = async (language,objStr) => {
  const context = pageObj[objStr];
  const lang = i18n(language);

  const keys = Object.keys(context);

  // print all keys

  console.log(keys);
  const langObj ={}

  keys.forEach((key, index) => {
      langObj[key] = lang(objStr+"."+key)
    console.log(`${key}: ${lang(objStr+"."+key)}`);
  });
  console.log(langObj)

  return langObj
  //console.log(`here ${context}`);
};

const i18next = require('i18next')

// if no language parameter is passed, let's try to use the node.js system's locale
const systemLocale = Intl.DateTimeFormat().resolvedOptions().locale
console.log(`i18n: ${systemLocale}`)

i18next
  .init({
    fallbackLng: 'en',
    resources: {
      en: {
        translation: require('./locales/en/translation.json')
      },
      hi: {
        translation: require('./locales/hi/translation.json')
      },
      kn: {
        translation: require('./locales/kn/translatino.json')
      }
    }
  })

module.exports = (lng) => i18next.getFixedT(lng || systemLocale)
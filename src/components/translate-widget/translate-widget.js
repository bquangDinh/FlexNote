import CustomSelect from '../custom-select/index.vue';
import { debounce } from "debounce";

var langs = {
  'af': 'Afrikaans',
  'sq': 'Albanian',
  'am': 'Amharic',
  'ar': 'Arabic',
  'hy': 'Armenian',
  'az': 'Azerbaijani',
  'eu': 'Basque',
  'be': 'Belarusian',
  'bn': 'Bengali',
  'bs': 'Bosnian',
  'bg': 'Bulgarian',
  'ca': 'Catalan',
  'ceb': 'Cebuano',
  'ny': 'Chichewa',
  'zh-cn': 'Chinese Simplified',
  'zh-tw': 'Chinese Traditional',
  'co': 'Corsican',
  'hr': 'Croatian',
  'cs': 'Czech',
  'da': 'Danish',
  'nl': 'Dutch',
  'en': 'English',
  'eo': 'Esperanto',
  'et': 'Estonian',
  'tl': 'Filipino',
  'fi': 'Finnish',
  'fr': 'French',
  'fy': 'Frisian',
  'gl': 'Galician',
  'ka': 'Georgian',
  'de': 'German',
  'el': 'Greek',
  'gu': 'Gujarati',
  'ht': 'Haitian Creole',
  'ha': 'Hausa',
  'haw': 'Hawaiian',
  'iw': 'Hebrew',
  'hi': 'Hindi',
  'hmn': 'Hmong',
  'hu': 'Hungarian',
  'is': 'Icelandic',
  'ig': 'Igbo',
  'id': 'Indonesian',
  'ga': 'Irish',
  'it': 'Italian',
  'ja': 'Japanese',
  'jw': 'Javanese',
  'kn': 'Kannada',
  'kk': 'Kazakh',
  'km': 'Khmer',
  'ko': 'Korean',
  'ku': 'Kurdish (Kurmanji)',
  'ky': 'Kyrgyz',
  'lo': 'Lao',
  'la': 'Latin',
  'lv': 'Latvian',
  'lt': 'Lithuanian',
  'lb': 'Luxembourgish',
  'mk': 'Macedonian',
  'mg': 'Malagasy',
  'ms': 'Malay',
  'ml': 'Malayalam',
  'mt': 'Maltese',
  'mi': 'Maori',
  'mr': 'Marathi',
  'mn': 'Mongolian',
  'my': 'Myanmar (Burmese)',
  'ne': 'Nepali',
  'no': 'Norwegian',
  'ps': 'Pashto',
  'fa': 'Persian',
  'pl': 'Polish',
  'pt': 'Portuguese',
  'ma': 'Punjabi',
  'ro': 'Romanian',
  'ru': 'Russian',
  'sm': 'Samoan',
  'gd': 'Scots Gaelic',
  'sr': 'Serbian',
  'st': 'Sesotho',
  'sn': 'Shona',
  'sd': 'Sindhi',
  'si': 'Sinhala',
  'sk': 'Slovak',
  'sl': 'Slovenian',
  'so': 'Somali',
  'es': 'Spanish',
  'su': 'Sundanese',
  'sw': 'Swahili',
  'sv': 'Swedish',
  'tg': 'Tajik',
  'ta': 'Tamil',
  'te': 'Telugu',
  'th': 'Thai',
  'tr': 'Turkish',
  'uk': 'Ukrainian',
  'ur': 'Urdu',
  'uz': 'Uzbek',
  'vi': 'Vietnamese',
  'cy': 'Welsh',
  'xh': 'Xhosa',
  'yi': 'Yiddish',
  'yo': 'Yoruba',
  'zu': 'Zulu'
};
langs = Object.assign({}, ...Object.keys(langs).map(x => ({[x]: {key: x, label: langs[x]} })));
const Translate = (function(){
  const TRANSLATION_API_KEY = process.env.TRANSLATION_API_KEY;

  return {
    translate: async function(sourceLang, targetLang, text){
      var apiUrl = `https://www.googleapis.com/language/translate/v2?key=${TRANSLATION_API_KEY}`;
      var params = {
        source: sourceLang,
        target: targetLang,
        q: text
      };

      Object.keys(params).forEach(function(key){
        apiUrl += '&' + key + '=' + params[key];
      });

      let finalResponse = null;

      await fetch(apiUrl)
      .then(function(response) { return response.json() })
      .then(function(response) {
        if(response && response !== null){
          finalResponse =  {
            sourceLang: sourceLang,
            targetLang: targetLang,
            sourceText: text,
            translatedText: response.data.translations[0].translatedText
          };
        }
      })
      .catch(function(error) { console.error(error) });

      return finalResponse;
    }
  }
})();

var that = null;

export default {
  name: 'translate-widget',
  components: {
    CustomSelect
  },
  props: {
    selectedText: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      languageOptions: langs,
      firstLanguage: langs['en'].key,
      targetLanguage: langs['vi'].key,
      firstLanguageInput: this.selectedText,
      targetLanguageOutput: '',
      delayTyping: null
    }
  },
  created: function(){
    that = this;
  },
  computed: {
  },
  mounted () {
    //first translate if user has selected text
    var doFirstTranslate = async function(){
      if(that.firstLanguageInput.trim() !== ""){
        let result = await Translate.translate(that.firstLanguage, that.targetLanguage, that.firstLanguageInput);
        console.log(result);
        if(result !== null){
          that.targetLanguageOutput = result.translatedText;
        }else{
          that.targetLanguageOutput = "";
        }
      }
    }

    doFirstTranslate();
  },
  methods: {
    debounceTranslate: debounce(async function(){
      if(that.firstLanguageInput.trim() !== ""){
        let result = await Translate.translate(that.firstLanguage, that.targetLanguage, that.firstLanguageInput);
        console.log(result);
        if(result !== null){
          that.targetLanguageOutput = result.translatedText;
        }else{
          that.targetLanguageOutput = "";
        }
      }
    }, 400)
  }
}



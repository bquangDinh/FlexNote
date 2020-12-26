/*-----Child components-----*/
import CustomSelect from '../custom-select/index.vue';

/*-----Library-----*/

/*-----Services-----*/
import { keyLabelLangs, Translate } from '../../services/translate';

const EXCEED_WORDS_LIMIT = 20;

//https://stackoverflow.com/a/53486112
function debounce (fn, delay) {
  var timeoutID = null
  return function () {
    clearTimeout(timeoutID)
    var args = arguments
    var that = this
    timeoutID = setTimeout(function () {
      fn.apply(that, args)
    }, delay)
  }
}

export default {
  name: 'translate-widget',
  components: {
    CustomSelect
  },
  props: {
    highlightedText: {
      type: String,
      require: true,
      validator: function(value){
        return value !== '';
      }
    },
    widgetNameProp: {
      type: String,
      default: 'translate',
      validator: function(value){
        return value !== '';
      }
    },
    currentWidget: {
      type: String,
      default: 'wiki',
      validator: function(value){
        return value !== '';
      }
    }
  },
  watch: {
    firstLanguage: {
      handler (val, oldVal){
        this.shouldDoTranslate = true;
      }
    },
    targetLanguage: {
      handler (val, oldVal){
        this.shouldDoTranslate = true;
      }
    },
    highlightedText: {
      immediate: true,
      handler (val, oldVal){
        this.firstLanguageInput = val;
      }
    },
    firstLanguageInput: debounce(function (val, oldVal){
      this.debouncedInput = val;
    }, 500),
    debouncedInput: {
      immediate: true,
      handler (val, oldVal){
        if(val !== oldVal){
          this.shouldDoTranslate = true;
        }else{
          this.shouldDoTranslate = false;
        }
      }
    },
    translatedText: {
      handler (val, oldVal){
        this.oldTranslatedText = val;
      }
    }
  },
  data () {
    return {
      languageOptions: keyLabelLangs,
      firstLanguage: keyLabelLangs['en'],
      targetLanguage: keyLabelLangs['vi'],  
      firstLanguageInput: this.highlightedText,
      showExceedWarning: false,
      EXCEED_WORDS_LIMIT: EXCEED_WORDS_LIMIT,
      oldTranslatedText: '',
      shouldDoTranslate: false,
      widgetName: this.widgetNameProp,
      debouncedInput: this.highlightedText
    }
  },
  asyncComputed: {
    translatedText: {
      get(){
        if(this.currentWidget !== this.widgetName){
          return this.oldTranslatedText;
        }
        
        if(!this.shouldDoTranslate){
          return this.oldTranslatedText;
        }

        if(this.debouncedInput.length > EXCEED_WORDS_LIMIT){
          this.showExceedWarning = true;
          return '';
        }

        if(this.debouncedInput.trim() === ''){
          return '';
        } 

        this.showExceedWarning = false;
        this.shouldDoTranslate = false;

        return this.debounceTranslate(
          this.firstLanguage.key, 
          this.targetLanguage.key, 
          this.debouncedInput, 
          400)
        .then(response => {
          return response;
        });
      },
      default: 'Translating...',
    }
  },
  mounted () {
  },
  methods: {
    /**
     * Translate text after milisec
     * @param {String} firstLangKey the key of the first language. See more detail in services/translate.js
     * @param {String} targetLangKey the key of the first language. See more detail in services/translate.js
     * @param {String} text the input text to translate 
     * @param {*int} milisec wait after milisection before executing translating
     * @returns return a promise that the text is going to be translated
     */
    debounceTranslate: async function(firstLangKey, targetLangKey, text, milisec){
      let result = '';
      
      if(text && text.trim() !== ''){
        let translated = await Translate(firstLangKey, targetLangKey, text);
        result = translated.translatedText;
      }

      return result;
    },
    revertTranslate: function(){
      let temp = this.firstLanguage;
      this.firstLanguage = this.targetLanguage;
      this.targetLanguage = temp;
    }
  }
}



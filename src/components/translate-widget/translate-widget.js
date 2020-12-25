/*-----Child components-----*/
import CustomSelect from '../custom-select/index.vue';

/*-----Library-----*/

/*-----Services-----*/
import { keyLabelLangs, Translate } from '../../services/translate';

const EXCEED_WORDS_LIMIT = 20;

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
    shouldTranslate: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    highlightedText: {
      immediate: true,
      handler (val, oldVal){
        if(val !== oldVal){
          this.firstLanguageInput = val;
        }else{
          this.shouldTranslate = false;
        }
      }
    },
    firstLanguageInput: {
      handler (val, oldVal){
        if(val !== oldVal){
          this.shouldTranslate = true;
        }else{
          this.shouldTranslate = false;
        }
      }
    },
    shouldTranslate: {
      immediate: true,
      handler (val, oldVal){
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
      oldTranslatedText: ''
    }
  },
  asyncComputed: {
    translatedText: {
      get(){
        if(this.firstLanguageInput.length > EXCEED_WORDS_LIMIT){
          this.showExceedWarning = true;
          return '';
        }

        if(this.firstLanguageInput.trim() === ''){
          return '';
        }

        if(!this.shouldTranslate){
          return this.oldTranslatedText;
        }

        this.showExceedWarning = false;
        return this.debounceTranslate(
          this.firstLanguage.key, 
          this.targetLanguage.key, 
          this.firstLanguageInput, 
          400)
        .then(response => {
          return response;
        });
      },
      default: 'Translating...'
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
        await new Promise(resolve => {
          setTimeout(resolve, milisec);
        });

        let translated = await Translate(firstLangKey, targetLangKey, text);
        result = translated.translatedText;
      }

      return result;
    },
    revertTranslate: function(){
      this.shouldTranslate = true;
      let temp = this.firstLanguage;
      this.firstLanguage = this.targetLanguage;
      this.targetLanguage = temp;
    }
  }
}



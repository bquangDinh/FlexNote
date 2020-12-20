import CustomSelect from '../custom-select/index.vue';
import { debounce } from "debounce";
import { keyLabelLangs, Translate } from '../../services/translate';

var that = null;
const EXCEED_WORDS_LIMIT = 20;

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
  watch: {
    selectedText: {
      immediate: true,
      handler (val, oldVal){
        if(typeof val !== 'undefined' && val !== '' && val.trim() !== '' && val !== oldVal){
          that.firstLanguageInput = val;
          that.debounceTranslate();
        }
      }
    }
  },
  data () {
    return {
      languageOptions: keyLabelLangs,
      firstLanguage: keyLabelLangs['en'],
      targetLanguage: keyLabelLangs['vi'],
      firstLanguageInput: this.selectedText,
      targetLanguageOutput: '',
      showExceedWarning: false,
      EXCEED_WORDS_LIMIT: EXCEED_WORDS_LIMIT
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

        if(that.firstLanguageInput.length >= that.EXCEED_WORDS_LIMIT){
          that.showExceedWarning = true;
          console.log("reach limit");
          return;
        }else{
          that.showExceedWarning = false;
        }


        let result = await Translate(that.firstLanguage.key, that.targetLanguage.key, that.firstLanguageInput);
        console.log(result);
        if(result !== null && result.translatedText !== ''){
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

        if(that.firstLanguageInput.length >= that.EXCEED_WORDS_LIMIT){
          that.showExceedWarning = true;
          console.log("reach limit");
          return;
        }else{
          that.showExceedWarning = false;
        }

        let result = await Translate(that.firstLanguage.key, that.targetLanguage.key, that.firstLanguageInput);
        console.log(result);
        if(result !== null && result.translatedText !== ''){
          that.targetLanguageOutput = result.translatedText;
        }else{
          that.targetLanguageOutput = "";
        }
      }
    }, 400),
    revertTranslate: function(){
      let temp = this.firstLanguage;
      this.firstLanguage = this.targetLanguage;
      this.targetLanguage = temp;
      this.debounceTranslate();
    }
  }
}



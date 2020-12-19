import CustomSelect from '../custom-select/index.vue';
import langs from 'google-translate-api/languages';
import translate from 'google-translate-api';

export default {
  name: 'translate-widget',
  components: {
    CustomSelect
  },
  props: [],
  data () {
    return {
      languageOptions: langs,
      firstLanguage: '',
      targetLanguage: '',
      firstLanguageInput: '',
      targetLanguageOutput: ''
    }
  },
  computed: {

  },
  mounted () {
    //remove all functions in langs
    Object.filter = (obj, predicate) => 
      Object.keys(obj)
            .filter(key => predicate(obj[key]))
            .reduce( (res, key) => (res[key] = obj[key], res), {});
    
    this.languageOptions = Object.filter(this.languageOptions, lang => typeof lang !== 'function');
    console.log(this.languageOptions);

    //remove this extend, don't want to mess up everything :))
    //will comment this code if I really want to use it
    delete Object.filter;
  },
  methods: {
    
  }
}



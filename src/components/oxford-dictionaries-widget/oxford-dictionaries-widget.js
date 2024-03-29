/*-----Child components-----*/
import CustomSelect from '../custom-select/index.vue';

/*-----Library-----*/

/*-----Services-----*/
import { keyLabelLangs, searchOnOxford } from '../../services/oxford-dictionaries';

/**
 * Wait an amount of time before searching the input text on Oxford API
 * @param {String} sourceLang the key of the source language. More detain in services/oxford-dictionaries.js
 * @param {String} text the input text
 * @param {int} milisec the amount of time before getting the input text, likes the waiting time
 * @returns {Promise} return a promise
 */
async function debounceOxford(sourceLang, text, milisec){
  let result = null;
  if(text && text.trim() !== ''){
    await new Promise(resolve => {
      setTimeout(resolve, milisec);
    });

    result = await searchOnOxford(sourceLang, text);
  }

  return result;
}

/**
 * Get the object associate with the given key if exist.
 * @param {Object} object the object is going to be filtered
 * @param {String} property the searching property
 * @param {Function} cfn the conditional function used to check an additional condition 
 * @returns {Object} if the key exist, then returns an object associate with that key
 * @returns {null} if the key doesn't exist, or failed the conditional function
 */
//refer: https://stackoverflow.com/a/15523704
function filterOne(object, property, cfn = null){
  //refer: https://eslint.org/docs/rules/no-prototype-builtins
  if(Object.prototype.hasOwnProperty.call(object, property)){
    if(typeof cfn === 'function'){
      return cfn(object[property]) ? object : null;
    }
    
    return object;
  }

  let keys = Object.keys(object);

  for(let i = 0; i < keys.length; ++i){
    if(typeof object[keys[i]] === 'object'){
      let o = filterOne(object[keys[i]], property, cfn);
      if(o !== null) return o;
    }
  }

  return null;
}

/**
 * Generate an unique ID.
 * @param  {String} prefix specify a prefix to the ID, default is an empty string 
 * @return {String} Return an uniue ID as a string
 */
function generateID(prefix = ''){
  return prefix + Math.random().toString(36).substr(2, 9);
}

export default {
  name: 'oxford-dictionaries-widget',
  components: {
    CustomSelect
  },
  props: {
    highlightedText: {
      type: String,
      require: true,
      validator: function(value){
        return value.trim() !== ''
      }
    },
    widgetNameProp: {
      type: String,
      default: 'dictionaries',
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
    highlightedText: {
      immediate: true,
      handler (val, oldVal){
        if(val !== oldVal){
          this.word = val;
          this.shouldDoOxford = true;

          if(this.widgetName === this.currentWidget){      
            this.fetchResult();
          }
        }else{
          this.shouldDoOxford = false;
        }
      }
    },
    word: {
      handler (val, oldVal){
        if(val !== oldVal){
          if(val.trim().toLowerCase() !== this.oldSearchTerm.trim().toLowerCase()){
            this.shouldDoOxford = true;
          }else{
            this.shouldDoOxford = false;
          }
        }else{
          this.shouldDoOxford = false;
        }
      }
    },
    currentWidget: {
      immediate: true,
      handler (val, oldVal){
        if(this.widgetName === val){
          //user activate this widget
          this.fetchResult();
        }
      }
    },
    sourceLanguage: {
      handler (val, oldVal){
        this.shouldDoOxford = true;
        this.fetchResult();
      }
    },
    result: {
      handler (val, oldVal){
        this.oldResult = val;
      }
    },
    lexicalEntries: {
      handler (val, oldVal){
      }
    }
  },
  data () {
    return {
      languageOptions: keyLabelLangs,
      sourceLanguage: keyLabelLangs['en-us'],
      word: this.highlightedText,
      oldResult: {},
      result: {},
      lexicalEntries: {},
      uid: generateID(),
      warningText: '',
      shouldDoOxford: false,
      widgetName: this.widgetNameProp,
      oldSearchTerm: ''
    }
  },
  mounted () {
  },
  methods: {
    fetchPageWithOxford: async function(){
        //user don't activate the widget yet
        if(this.widgetName !== this.currentWidget) return {};

        if(!this.shouldDoOxford) {
          if(typeof this.oldResult.results !== 'undefined'){
            this.warningText = "Result's already loaded.";
          }else{
            this.warningText = "No results found!";
          }
          return this.oldResult;
        }

        if(this.word.trim() === '') {
          this.warningText = 'Empty word detected!';
          return {};
        }
        if(this.word.split(' ').length > 1){
          this.warningText = 'Multiple word detected! Please enter only one word.';
          return this.oldResult;
        }

        this.warningText = "Loading...";

        let response = await searchOnOxford(this.sourceLanguage.key, this.word);

        if(typeof response.results === 'undefined'){
          this.warningText = "No entry found matching for the given word. You should enter the root form of the word. For example: (not root) pixels --> (root) pixel";
          return {};
        }
        
        this.warningText = '';

        return response;
    },
    fetchResult: async function(){
      this.result = await this.fetchPageWithOxford();
      if(this.result === {}) this.lexicalEntries = {};

      let et = filterOne(this.result, 'lexicalEntries');
      this.lexicalEntries = et !== null ? et['lexicalEntries'] : {};

      //when doing fetching, disable shoudOxford to prevent spam
      this.shouldDoOxford = false;

      this.oldSearchTerm = this.word;
    },
  }
}



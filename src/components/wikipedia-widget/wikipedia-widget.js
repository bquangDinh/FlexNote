import WikipediaWidgetFooter from '../wikipedia-widget-footer/index.vue';

const APP_DEBUG = process.env.APP_DEBUG || 'true';

export default {
  name: 'wikipedia-widget',
  components: {
    WikipediaWidgetFooter
  },
  props: {
    highlightedText: {
      type: String,
      require: true,
      validator: function(value){
        return value !== '';
      }
    }
  },
  watch: {
    highlightedText: {
      immediate: true,
      handler (val, oldVal){
        this.text = val;
      }
    },
    text: {
      immediate: true,
      async handler (val, oldVal){
        let WIKI_URL = "https://en.wikipedia.org/wiki/";
        let _src = WIKI_URL;
        let titles = [];

        if(this.options.keepOriginalResults){
          titles = [this.text.replace(' ','_')];
        }else{
          titles = await this.searchWiki(this.text);
        }
        
        let MAX_RESULTS = 5;

        if(titles !== null){
          _src += titles[0];
            
          if(titles.length > MAX_RESULTS){
            titles = titles.slice(1, MAX_RESULTS + 1);
            this.currentResultsList = titles;
            console.log(this.currentResultsList);
          }
        }
        
        if(APP_DEBUG){
          console.log('Wikipedia Src: ' + _src);
        }

        this.iframeSrc = _src;
      }
    }
  },
  data () {
    return {
      options: {
        keepOriginalResults: false,
      },
      text: this.highlightedText,
      currentResultsList: [],
      iframeSrc: "https://en.wikipedia.org/wiki/"
    }
  },
  computed: {
  },
  mounted () {
  },
  methods: {
    /**
     * Searching for article on wikipedia by term.
     * @param {String} term term to seach on wiki
     * @returns {Array} return wikipedia available titles
     */
    searchWiki: async function(term){  
      let params = {
        action: 'query',
        list: 'search',
        srsearch: term,
        format: 'json'
      };
      let API_URL = "https://en.wikipedia.org/w/api.php";
      let completeApiURL = API_URL + '?origin=*';

      //merge url by provided params
      Object.keys(params).forEach(key => {
        completeApiURL += '&' + key + '=' + params[key];
      });

      //fetch data
      let responses = null;

      await fetch(completeApiURL)
      .then(function(response) { return response.json(); })
      .then(function(response) {
        if(typeof response.query.search !== 'undefined' && response.query.search !== null){
          responses = response.query.search.map(item => item.title);
        }
      })
      .catch(err => console.log(err));

      if(APP_DEBUG){
        console.log('Wikipedia responses: ', responses);
      }

      return responses;
    },
  }
}



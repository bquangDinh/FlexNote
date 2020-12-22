import Log from '../log/index.vue';
import TranslateWidget from '../translate-widget/index.vue';

export default {
  name: 'notepad',
  components: {
    Log,
    TranslateWidget
  },
  props: {
    activateNotePad: {
      type: Boolean
    },
    highlightedText: {
      type: String,
      default: ''
    }
  },
  watch: {
    highlightedText: {
      immediate: true,
      handler (val, oldVal){
        console.log(val, oldVal);
        this.currentSelectedText = val;
        this.setFetchConfig();
      }
    }
  },
  data () {
    return {
      position: {
        x1: 0, // current left
        y1: 0, // current top
        x2: 0, // last left
        y2: 0, // last top
      },
      styleObject: { top: '20px', left: '55vw' },
      isDragging: false,
      fetchConfig: {
        wikipediaFetchUrl: "https://en.wikipedia.org/wiki/Main_Page",
        wikipediaResultsList: []
      },
      currentSelectedText: this.highlightedText,
      currentSection: 'wiki'
    }
  },
  computed: {

  },
  mounted () {

  },
  methods: {
    changeSection: function(sectioName){
      this.currentSection = sectioName;
    },
    mousedown: function(e){
      this.isDragging = true;
      this.position.x2 = e.clientX;
      this.position.y2 = e.clientY;
    },
    mousemove: function(e){
      if(this.isDragging){
        this.position.x1 = this.position.x2 - e.clientX;
        this.position.y1 = this.position.y2 - e.clientY;

        this.position.x2 = e.clientX;
        this.position.y2 = e.clientY;

        //update style object
        this.styleObject = {
          top: (e.target.getBoundingClientRect().top - this.position.y1) + 'px',
          left: (e.target.getBoundingClientRect().left - this.position.x1) + 'px'
        }
      }
    },
    mouseup: function(e){
      this.isDragging = false;
    },
    fetchWikiByTerm: async function(term){
      var that = this;

      let params = {
        action: 'query',
        list: 'search',
        srsearch: term,
        format: 'json'
      };
      let responseUrl = '';
      let apiUrl = "https://en.wikipedia.org/w/api.php"; 
      let wikiUrl = "https://en.wikipedia.org/wiki/";

      let completeApiUrl = apiUrl + "?origin=*";

      Object.keys(params).forEach(function(key){
        completeApiUrl += '&' + key + '=' + params[key];
      });

      await fetch(completeApiUrl)
      .then(function(response) { return response.json() })
      .then(function(response) {
        if(response.query.search.length > 0){
          responseUrl = wikiUrl + response.query.search[0].title;
          console.log(response.query.search);
          if(response.query.search.length > 5){
            that.fetchConfig.wikipediaResultsList = response.query.search.slice(1, 6).map(item => item.title);
          }else{
            that.fetchConfig.wikipediaResultsList = response.query.search.map(item => item.title);
          }
        }      
      })
      .catch(function(error) { console.error(error) });

      return responseUrl;
    },
    setFetchConfig: async function(){
      this.fetchConfig.wikipediaFetchUrl = await this.fetchWikiByTerm(this.currentSelectedText);
    },
    setWikipediaUrlByTitle: async function(titleObj){
      let title = titleObj.name.trim().replace(' ', '_');
      let url = '';
      this.currentSelectedText = title;

      if(titleObj.keepOriginal){
        let wikiUrl = "https://en.wikipedia.org/wiki/";
        url = wikiUrl + title;
        this.fetchConfig.wikipediaFetchUrl = url;
      }else{
        this.fetchConfig.wikipediaFetchUrl = await this.fetchWikiByTerm(title);
      }
    },
    closeNotePad: function(){
      this.hide();
    }
  }
}



import Log from '../log/index.vue';

export default {
  name: 'notepad',
  components: {
    Log
  },
  props: [],
  data () {
    return {
      isShowing: false,
      position: {
        x1: 0, // current left
        y1: 0, // current top
        x2: 0, // last left
        y2: 0, // last top
      },
      styleObject: { top: '20px', left: '55vw' },
      isDragging: false,
      fetchConfig: {
        wikipediaFetchUrl: "https://en.wikipedia.org/wiki/Main_Page"
      }
    }
  },
  computed: {

  },
  mounted () {

  },
  methods: {
    show: function(){
      //TODO: reset position if the notepad outsider viewport
      //this.styleObject = { top: '20px', left: '55vw' };
      this.isShowing = true;
    },
    hide: function(){
      this.isShowing = false
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
    setFetchConfig: async function(selectedText){
      var fetchWikiByTerm = async function(term){
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
          }      
        })
        .catch(function(error) { console.error(error) });

        return responseUrl;
      };

      this.fetchConfig.wikipediaFetchUrl = await fetchWikiByTerm(selectedText);
    },
    closeNotePad: function(){
      this.hide();
    }
  }
}



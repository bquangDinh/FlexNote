import { HIGHLIGHT_STYLES } from '../../modules/highlight-handler';

var HighlightChromeStorage = (function(){
  let HIGHLIGHTS_STORAGE_KEY = 'highlight_storage';
  let HIGHLIGHTS_LIST_KEY = 'highlights';
  let HIGHLIGHTS_RANGY_SERIALIZED = 'rangy';
  let HIGHLIGHT_RECENT_REMOVED = 'highlight_removed';

  if(typeof chrome.storage === 'undefined'){
    return false;
  }

  return {
    loadHighlightsFromUrl: function(url, callback){
      chrome.storage.sync.get(function(cfg){
        if(typeof cfg[url][HIGHLIGHTS_STORAGE_KEY] === 'undefined'){
          return false;
        }

        if(typeof cfg[url][HIGHLIGHTS_STORAGE_KEY][HIGHLIGHTS_LIST_KEY] === 'undefined'){
          return false;
        }

        if(typeof callback !== 'function'){
          return false;
        }

        let highlights = cfg[url][HIGHLIGHTS_STORAGE_KEY][HIGHLIGHTS_LIST_KEY];

        callback(highlights);
      });
    },
    removeHighlightById: function(highlightId, url, callback){
      chrome.storage.sync.get(function(cfg){
        if(typeof cfg[url][HIGHLIGHTS_STORAGE_KEY] === 'undefined'){
          return false;
        }

        if(typeof cfg[url][HIGHLIGHTS_STORAGE_KEY][HIGHLIGHTS_LIST_KEY] === 'undefined'){
          return false;
        }

        //remove highlight from list
        delete cfg[url][HIGHLIGHTS_STORAGE_KEY][HIGHLIGHTS_LIST_KEY][highlightId];

        if(typeof cfg[url][HIGHLIGHTS_STORAGE_KEY][HIGHLIGHTS_RANGY_SERIALIZED] === 'undefined'){
          return false;
        }

        //remove highlight from rangy serialized string
        let serializedRangy = cfg[url][HIGHLIGHTS_STORAGE_KEY][HIGHLIGHTS_RANGY_SERIALIZED];
        let newHighlights = [];

        serializedRangy.split('|').forEach(serialized => {
          if(serialized !== 'type:textContent'){
            let id = serialized.slice(serialized.length - 37, serialized.length - 1);
            
            if(id !== highlightId){
              newHighlights.push(serialized);
            }
          }
        });

        let newSerializedRangy = 'type:textContent|';
        if(newHighlights.length === 0){
          newSerializedRangy = '';
        }else{
          newSerializedRangy += newHighlights.join('|');
        }
        
        cfg[url][HIGHLIGHTS_STORAGE_KEY][HIGHLIGHTS_RANGY_SERIALIZED] = newSerializedRangy;

        cfg[url][HIGHLIGHTS_STORAGE_KEY][HIGHLIGHT_RECENT_REMOVED] = highlightId;

        chrome.storage.sync.set(cfg, function(){
          if(typeof callback === 'function') callback(cfg);
        });
      });
    },
    chromeStorageOnChange: function(callback){
      chrome.storage.onChanged.addListener((changes, namespace) => {
        if(typeof callback === 'function'){
          callback(changes);
        }
      });
    }
  };
})();


export default {
  name: 'highlighter-widget',
  components: {},
  props: [],
  data () {
    return {
      mainHighlights: {},
      pageURL: window.location.href
    }
  },
  watch: {
  },
  computed: {
    mainHighlightsList: {
      get(){
        var highlightlist = {
          importants: [],
          reviews: [],
          terms: [],
          examples: [],
          others: []
        };
        var self = this;
        var highlights = Object.assign({}, self.mainHighlights);

        Object.keys(highlights).forEach(key => {

          if(highlights[key].classColor === HIGHLIGHT_STYLES.IMPORTANT.NAME){
            highlights[key].classColor = highlights[key].classColor.replace('-','_').replace('--','__');
            highlightlist.importants.push(highlights[key]);
          }

          if(highlights[key].classColor === HIGHLIGHT_STYLES.REVIEW.NAME){
            highlights[key].classColor = highlights[key].classColor.replace('-','_').replace('--','__');
            highlightlist.reviews.push(highlights[key]);
          }

          if(highlights[key].classColor === HIGHLIGHT_STYLES.TERM.NAME){
            highlights[key].classColor = highlights[key].classColor.replace('-','_').replace('--','__');
            highlightlist.terms.push(highlights[key]);
          }

          if(highlights[key].classColor === HIGHLIGHT_STYLES.EXAMPLE.NAME){
            highlights[key].classColor = highlights[key].classColor.replace('-','_').replace('--','__');
            highlightlist.examples.push(highlights[key]);
          }

          if(highlights[key].classColor === HIGHLIGHT_STYLES.OTHER.NAME){
            highlights[key].classColor = highlights[key].classColor.replace('-','_').replace('--','__');
            highlightlist.others.push(highlights[key]);
          }

          return highlightlist;
        });

        return highlightlist;
      }
    },
    isHighlightEmpty: {
      get(){
        return  this.mainHighlightsList.importants.length === 0 &&
                this.mainHighlightsList.reviews.length === 0 &&
                this.mainHighlightsList.terms.length === 0 &&
                this.mainHighlightsList.examples.length === 0 &&
                this.mainHighlightsList.others.length === 0;
      }
    }
  },
  mounted () {
    /*Load all existing highlights of this url*/
    var self = this;
    HighlightChromeStorage.loadHighlightsFromUrl(this.pageURL, function(data){
      self.mainHighlights = data;
    });

    //start listening for changes of chrome storage
    HighlightChromeStorage.chromeStorageOnChange(function(changes){
      let HIGHLIGHTS_STORAGE_KEY = 'highlight_storage';
      let HIGHLIGHTS_LIST_KEY = 'highlights';

      let newData = changes[self.pageURL].newValue;

      if(typeof newData === 'undefined' || newData === null){
        return;
      }

      if(typeof newData[HIGHLIGHTS_STORAGE_KEY] === 'undefined'){
        return;
      }

      if(typeof newData[HIGHLIGHTS_STORAGE_KEY][HIGHLIGHTS_LIST_KEY] === 'undefined'){
        return;
      }

      self.mainHighlights = newData[HIGHLIGHTS_STORAGE_KEY][HIGHLIGHTS_LIST_KEY];
    });
  },
  methods: {
    removeHighlight: function(highlightId){
      HighlightChromeStorage.removeHighlightById(highlightId, this.pageURL, function(data){
      });
    },
    scrollToHighlight: function(highlightId){
      let element = document.getElementById(highlightId);
      
      if(element){
        let posY = element.getBoundingClientRect().top + window.scrollY;
        let offsetY = window.screen.height * 0.5;

        window.scroll({
          top: posY - offsetY,
          behavior: 'smooth'
        });
      }
    }
  }
}



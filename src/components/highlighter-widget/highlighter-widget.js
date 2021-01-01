
var HighlightChromeStorage = (function(){
  let HIGHLIGHTS_STORAGE_KEY = 'highlight_storage';
  let HIGHLIGHTS_LIST_KEY = 'highlights';
  let HIGHLIGHTS_RANGY_SERIALIZED = 'rangy';

  if(typeof chrome.storage === 'undefined'){
    console.error('Storage not found');
    return false;
  }

  return {
    loadHighlightsFromUrl: function(url, callback){
      chrome.storage.sync.get(function(cfg){
        if(typeof cfg[url][HIGHLIGHTS_STORAGE_KEY] === 'undefined'){
          console.error('No highlight storage found');
          return false;
        }

        if(typeof cfg[url][HIGHLIGHTS_STORAGE_KEY][HIGHLIGHTS_LIST_KEY] === 'undefined'){
          console.error('No highlights found');
          return false;
        }

        if(typeof callback !== 'function'){
          console.error('Callback is not a function');
          return false;
        }

        let highlights = cfg[url][HIGHLIGHTS_STORAGE_KEY][HIGHLIGHTS_LIST_KEY];

        callback(highlights);
      });
    },
    chromeStorageOnChange: function(callback){
      chrome.storage.onChanged.addListener((changes, namespace) => {
        console.log('Changed: ', changes, namespace);

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
        var highlightlist = [];
        var self = this;
        var highlights = Object.assign({}, self.mainHighlights);

        console.log('Hello', highlights);
        Object.keys(highlights).forEach(key => {
          console.log('Highlight key ', key);
          highlights[key].classColor = highlights[key].classColor.replace('-','_').replace('--','__');
          highlightlist.push(highlights[key]);
        });

        console.log('List', highlightlist);

        return highlightlist;
      }
    }
  },
  mounted () {
    /*Load all existing highlights of this url*/
    var self = this;
    HighlightChromeStorage.loadHighlightsFromUrl(this.pageURL, function(data){
      self.mainHighlights = data;
      console.log('Got data', self.mainHighlights);
      console.log(Object.keys(self.mainHighlights));
    });

    //start listening for changes of chrome storage
    HighlightChromeStorage.chromeStorageOnChange(function(changes){
      let HIGHLIGHTS_STORAGE_KEY = 'highlight_storage';
      let HIGHLIGHTS_LIST_KEY = 'highlights';

      let newData = changes[self.pageURL].newValue;

      if(typeof newData === 'undefined' || newData === null){
        console.error('Changes is invalid');
        return;
      }

      if(typeof newData[HIGHLIGHTS_STORAGE_KEY] === 'undefined'){
        console.error('No storage found for this url');
        return;
      }

      if(typeof newData[HIGHLIGHTS_STORAGE_KEY][HIGHLIGHTS_LIST_KEY] === 'undefined'){
        console.error('No highlights found for this url');
        return;
      }

      self.mainHighlights = newData[HIGHLIGHTS_STORAGE_KEY][HIGHLIGHTS_LIST_KEY];
    });
  },
  methods: {

  }
}



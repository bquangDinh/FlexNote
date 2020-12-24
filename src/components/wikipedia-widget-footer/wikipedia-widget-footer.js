/*-----Child Components-----*/
import SelectList from '../select-list/index.vue';

export default {
  name: 'wikipedia-widget-footer',
  components: {
    SelectList
  },
  props: {
    highlightedText: {
      type: String,
      require: true,
    },
    wikiResultsList: {
      type: Array,
      default: []
    },
    originalResultsInput: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      isShowing: true,
    }
  },
  computed: {
    wordLength: function(){
      return this.highlightedText.length;
    }
  },
  mounted () {

  },
  methods: {
    sendChoiceToWiki: function(name){
      this.$emit('wikipedia-term-select-output', name);
    },
  }
}



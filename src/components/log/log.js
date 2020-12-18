import SlickList from '../slick-list/index.vue';

export default {
  name: 'log',
  components: {
    SlickList
  },
  props: {
    header: {
      type: String
    },
    wikiResultsList: {
      type: Array,
      default: []
    }
  },
  data () {
    return {
      items: this.wikiResultsList,
      shouldHide: false
    }
  },
  computed: {

  },
  mounted () {

  },
  methods: {
    hideLog: function(e){
      this.shouldHide = true;
    },
    showLog: function(e){
      this.shouldHide = false;
    },
    switchLogDisplay: function(e){
      this.shouldHide = !this.shouldHide;
    },
    sendNameBacktoNotePad: function(nameObj){
      this.$emit('wikipedia-fetch-result', nameObj);
    }
  }
}



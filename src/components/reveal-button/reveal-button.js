
export default {
  name: 'reveal-button',
  components: {},
  props: [],
  data () {
    return {
      isShowing: false,
      styleObject: { left:  '0px', top: '0px'},
    }
  },
  computed: {

  },
  mounted () {

  },
  methods: {
    show: function(){
      this.isShowing = true;
    },
    hide: function(){
      this.isShowing = false;
    },
    setPosition: function(x, y){
      let offsetY = 10;

      this.styleObject = {
        left: x + 'px',
        top: (y + offsetY) + 'px'
      }
    },
    openFlexNote: function(e){

    },
  }
}



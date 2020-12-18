export default {
  name: 'slick-list',
  components: {},
  props: {
    items:{
      type: Array
    }
  },
  data () {
    return {
      keepOriginal: true
    }
  },
  computed: {

  },
  mounted () {
    console.log(this.items)
  },
  methods: {
    sendNameBacktoParent: function(name){
      this.$emit('choose-name', {
        name: name,
        keepOriginal: this.keepOriginal
      });
    }
  }
}



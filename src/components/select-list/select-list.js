
export default {
  name: 'select-list',
  components: {},
  props: {
    items: {
      type: Array,
      default: []
    }
  },
  data () {
    return {

    }
  },
  computed: {

  },
  mounted () {

  },
  methods: {
    select: function(item){
      this.$emit('select-item', item);
    }
  }
}



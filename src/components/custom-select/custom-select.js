
export default {
  name: 'custom-select',
  components: {},
  props: {
    options: {
      type: Object,
      default: {}
    },
    defaultOption: {
      type: Object,
      default: {}
    }
  },
  data () {
    return {
      currentSelected: this.defaultOption,
      active: false
    }
  },
  computed: {

  },
  mounted () {

  },
  methods: {
    selectOption: function(item){
      this.active = false;
      this.currentSelected = item;
      this.$emit('output', this.currentSelected);
    },
    showSelect: function(){
      this.active = true;
    },
    hideSelect: function(){
      this.active = false;
    }
  }
}



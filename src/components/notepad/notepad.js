/*-----Child components-----*/
import WikipediaWidget from '../wikipedia-widget/index.vue';
import TranslateWidget from '../translate-widget/index.vue';
import OxfordDictionariesWidget from '../oxford-dictionaries-widget/index.vue';
import FeedbackWidget from '../feedback-widget/index.vue';

export default {
  name: 'notepad',
  components: {
    WikipediaWidget,
    TranslateWidget,
    OxfordDictionariesWidget,
    FeedbackWidget
  },
  props: {
    showNotePad: {
      type: Boolean,
      default: false,
    },
    highlightedText: {
      type: String,
      require: true,
      validator: function(value){
        return value.trim() !== '';
      }
    }
  },
  watch: {
    showNotePad: {
      immediate: true,
      handler (val, oldVal){
        this.isNotePadShowing = val;
      }
    },
    highlightedText: {
      immediate: true,
      handler (val, oldVal){
      }
    },
  },
  data: function() {
    return {
      dragging: {
        position: {
          last: {
            x: 0,
            y: 0,
          },
          current: {
            x: 0,
            y: 0
          }
        },
        isDragging: false
      },
      styleObject: {
        top: '20px',
        left: '55vw'
      },
      isNotePadShowing: this.showNotePad,
      currentSection: 'wiki',
    }
  },
  computed: {

  },
  mounted () {

  },
  methods: {
    /*Dragging Events*/
    mousedown: function(e){
      this.dragging.isDragging = true;
      this.dragging.position.last = {
        x: e.clientX,
        y: e.clientY
      };
    },
    mousemove: function(e){
      if(this.dragging.isDragging){
        this.dragging.position.current = {
          x: this.dragging.position.last.x - e.clientX,
          y: this.dragging.position.last.y - e.clientY
        };

        this.dragging.position.last = {
          x: e.clientX,
          y: e.clientY
        };

        this.styleObject = {
          top: 
          (e.target.getBoundingClientRect().top 
          - this.dragging.position.current.y) + 'px',
          left: 
          (e.target.getBoundingClientRect().left 
          - this.dragging.position.current.x) + 'px'
        }
      }
    },
    mouseup: function(e){
      this.dragging.isDragging = false;
    },
    /*Button Events*/
    changeSection: function(sectionName){
      this.currentSection = sectionName;
    },
    closeNotePad: function(e){
      this.isNotePadShowing = false;
      this.$emit('notepad-close');
    }
  }
}



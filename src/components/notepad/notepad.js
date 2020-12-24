/*-----Child components-----*/
import WikipediaWidget from '../wikipedia-widget/index.vue';
import TranslateWidget from '../translate-widget/index.vue';

export default {
  name: 'notepad',
  components: {
    WikipediaWidget,
    TranslateWidget
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
        if(val !== oldVal){
          this.oldHighlightedText = oldVal;
        }
        console.log(val, oldVal);
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
      shouldTranslate: false,
      oldHighlightedText: this.highlightedText,
      notTheFirstTime: false
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
      
      //show change once
      if(this.currentSection !== 'wiki' && this.notTheFirstTime == false){
        this.notTheFirstTime = true;
      }

      //user head to translate widget
      if(sectionName === 'translate'){
        //check if this is the first time
        if(this.notTheFirstTime === false){
          this.shouldTranslate = true;

          //disable this option
          this.notTheFirstTime = true;
        }else{
          //means this is the second time
          if(this.highlightedText !== this.oldHighlightedText){
            this.shouldTranslate = true;
            this.oldHighlightedText = this.highlightedText;
          }else{
            this.shouldTranslate = false;
          }
        }
      }
    },
    closeNotePad: function(e){
      this.isNotePadShowing = false;
      this.$emit('notepad-close');
    }
  }
}



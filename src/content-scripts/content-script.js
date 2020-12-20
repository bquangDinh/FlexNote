import Vue from 'vue'
import wrap from '@vue/web-component-wrapper';

import NotePad from '../components/notepad/index.vue';

import SelectionMenu from 'selection-menu';

/*FontAwesome*/
import { library } from '@fortawesome/fontawesome-svg-core';
import { faWikipediaW } from '@fortawesome/free-brands-svg-icons';
import { faHighlighter, faLanguage, faAtlas, faTimes, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

/*Add every using icon to library*/
library.add(faWikipediaW, faLanguage, faAtlas, faHighlighter, faTimes, faChevronDown, faChevronUp);

//register FontAwesomeIcon component to Vuejs
Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.config.productionTip = false;

/*Helper functions*/

/*Generate an unique ID*/
var generateID = function(){
    return '_' + Math.random().toString(36).substr(2, 9);
};

/*---------end helper functions---------*/

/*Create app root for Vuejs*/
/*This is where the Vuejs app live*/
const NotepadWrappedElement = wrap(Vue, NotePad);
customElements.define('flex-note-component', NotepadWrappedElement);

var flexnote = document.createElement('flex-note-component')
document.body.insertBefore(flexnote, document.body.firstChild);
console.log(NotepadWrappedElement);
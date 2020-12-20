import Vue from 'vue'
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
var appContainer = document.createElement("div")
document.body.insertBefore(appContainer, document.body.firstChild);

/*Initialize all instance once, and then reuse them*/

var NotePadInstance = (function(){
    var instance = null;

    return {
        initialize: function(){
            if(!instance || instance === null || typeof instance === 'undefined'){
                let componentClass = Vue.extend(NotePad);

                let _instance = new componentClass();
                _instance.$mount();
                appContainer.appendChild(_instance.$el);
                
                instance = _instance;
            }

            return instance;
        },
        getInstance: function(){
            return (!instance || instance === null || typeof instance === 'undefined')
            ? this.initialize() : instance;
        }
    }
})();

var notepad = NotePadInstance.getInstance();

var uniqueID = generateID();
var buttonTemplate = `
    <button id="flexnote-btn-${uniqueID}">FlexNote</button>
`;

var selectionMenu = new SelectionMenu({
    container: document.body,
    content: buttonTemplate,
    handler: function(e){
        notepad.show();
        notepad.setCurrentSelectedText(this.selectedText);
        notepad.setFetchConfig(this.selectedText);
        this.hide(true);
    },
    onselect: function(e){
        console.log(this.selectedText);
    }
});

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
var appID = 'flex-note' + generateID();

var treeHead = document.createElement('div');
treeHead.id = appID;
document.body.insertBefore(treeHead, document.body.firstChild);

var parent = document.createElement('div');
var holder = document.createElement('div');
var shadow = treeHead.attachShadow({ mode: 'open' });

foo.loadStyles(parent);

parent.appendChild(holder);
shadow.appendChild(parent);

var app = new Vue({
    el: holder,
    data: function(){
        return {
            showNotePad: false,
            highlightedText: ''
        }
    },
    methods: {
        runNotePad: function(){
            this.showNotePad = true;
        },
        hideNotePad: function(){
            this.showNotePad = false;
        },
        setHighlightedText: function(text){
            console.log('changed text');
            this.highlightedText = text.trim();
        }
    },
    render: function(createElement){
        var that = this;
        return createElement(NotePad, {
            props: {
                activateNotePad : that.showNotePad,
                highlightedText: that.highlightedText
            }
        })
    }
});

var uniqueID = generateID();
var buttonTemplate = `
    <button id="flexnote-btn-${uniqueID}">FlexNote</button>
`;

var selectionMenu = new SelectionMenu({
    container: document.body,
    content: buttonTemplate,
    handler: function(e){
        app.runNotePad();
        app.setHighlightedText(this.selectedText);
        this.hide(true);
    },
    onselect: function(e){
        console.log(this.selectedText);
    }
});
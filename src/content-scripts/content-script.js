/*-----Vue-----*/
import Vue from 'vue';

/*-----Vue User-defined components-----*/

/*-----Vue User-defined components > Single instance components-----*/
import NotePad from '../components/notepad/index.vue';

/*-----Vue third-parties libaries-----*/
/*-----Vue third-parties libaries > FontAwesome-----*/
import { library } from '@fortawesome/fontawesome-svg-core';

/*-----FontAwesome Brand Icons-----*/
import { faWikipediaW } from '@fortawesome/free-brands-svg-icons';

/*-----FontAwesome Solid Icons-----*/
import { 
    faHighlighter, 
    faLanguage, 
    faAtlas, 
    faTimes, 
    faChevronDown, 
    faChevronUp, 
    faExternalLinkAlt,
    faEyeSlash,
    faCommentAlt
} from '@fortawesome/free-solid-svg-icons';

/*-----FontAwesome Components-----*/
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

/*-----Vue third-parties libaries > vue-async-computed-----*/
import AsyncComputed from 'vue-async-computed'

/*-----Vue third-parties libaries > Vue Custom Element-----*/
import vueCustomElement from 'vue-custom-element';

/*-----Other libaries-----*/
import SelectionMenu from 'selection-menu';

/*-----Modules-----*/
import DomHandler from '../modules/dom-handler';
import GoogleStorageHandler from '../modules/google-storage-handler';

/*-----Helper Functions-----*/

/**
 * Generate an unique ID.
 * @param  {String} prefix specify a prefix to the ID, default is an empty string 
 * @return {String} Return an uniue ID as a string
 */
function generateID(prefix = ''){
    return prefix + Math.random().toString(36).substr(2, 9);
}

/**
 * @summary Preprocess text format.
 * @description Use this when setting NotePad's prop. Just to make sure
 * NotePad component will not have to deal with poor text format
 * @param {String} text the text which is going to be processed 
 */
function preprocessText(text){
    text = text.trim();
    return text;
}

/*-----Main Here-----*/
/*Initialize every third-parties VueJS libaries*/
Vue.use(AsyncComputed);
Vue.use(vueCustomElement);

/*Initialize FontAwesome*/
//Register every using icons to library
library.add(
    faWikipediaW, 
    faLanguage, 
    faAtlas, 
    faHighlighter, 
    faTimes, 
    faChevronDown, 
    faChevronUp,
    faExternalLinkAlt,
    faEyeSlash,
    faCommentAlt
);

//register FontAwesome Component to VueJS
Vue.component('font-awesome-icon', FontAwesomeIcon);

//TODO: Explain this line
Vue.config.productionTip = false;

/*Get properties from .env*/
var APP_NAME = process.env.APP_NAME || 'flex-note';
var APP_DEBUG = process.env.APP_DEBUG || 'true';

/*Generate an app ID*/
var appID = APP_NAME + generateID('-');

/*Create app root for VueJS and insert it to DOM*/
var treeHead = document.createElement('div');
treeHead.id = appID;

/*App will live in the parent DOM*/
var parent = document.createElement('div');

/*App will be mounted in the holder DOM*/
var holder = document.createElement('div');

/*Create shadow root for the app*/
var shadow = treeHead.attachShadow({ mode: 'open' });

/*Load styles to shadow root via parent DOM
 *If we don't do this step, the app will run without any styles
 *We can actually do it through vue-style-loader, but I've stucked trying to wrap
 *the notepad components in a wrapper. So we do it manually
*/
//TODO: rename foo and load styles

import { css_loader }  from '../../css-loader-shim';

css_loader.loadStyles(parent);

/*Insert the app into main DOM*/
parent.appendChild(holder);
shadow.appendChild(parent);
document.body.insertBefore(treeHead, document.body.firstChild);

/*Create the app*/
var App = new Vue({
    el: holder,
    data: function(){
        return {
            userHighlightedText: '',
            showNotePad: false
        }
    },
    methods: {
        /**
         * Show and change the notepad's data via the highlighting text
         * @param {String} highlightedText the text which the user is highlighting on the web
         */
        runNotePad: function(highlightedText = ''){
            this.showNotePad = true;
            this.userHighlightedText = highlightedText;
        }
    },
    mounted: function(){
        var self = this;
        this.$refs.myNotePad.$on('notepad-close', function(e){
            self.showNotePad = false;
        });
    },
    render: function(createElement){
        var self = this;
        return createElement(
            NotePad
            , {
            props: {
                showNotePad: self.showNotePad,
                highlightedText: self.userHighlightedText
            },
            ref: 'myNotePad',
        })
    }
});

/*-----Highlighter-----*/
/*Initialize*/
document.onreadystatechange = function(){
    var state = document.readyState;

    if(state === 'complete'){
        console.log('loaded');

        HighlightHandler.initialize();
        HighlightHandler.loadHighlightsFromStorage();
    }
}

/*Create an interactive menu*/
var COMMANDS_LIST = {
    OPEN_FLEXPAD: 'open-flexpad',
    HIGHLIGHT: 'highlight',
    ADD_NOTE: 'add-note'
};

var menuID = APP_NAME + '-menu' + generateID('-');
var menuContainer = document.createElement('div');
menuContainer.id = menuID;
menuContainer.innerHTML = `
    <button data-command='${COMMANDS_LIST.OPEN_FLEXPAD}'>Open Flexpad</button>
    <button data-command='${COMMANDS_LIST.HIGHLIGHT}'>Highlight</button>
    <button data-command='${COMMANDS_LIST.ADD_NOTE}'>Add Note</button>
`;

/*Create interactive button*/
var showNotePadButtonID = APP_NAME + '-btn' + generateID('-');
var showNotePadButton = document.createElement('button');
showNotePadButton.id = showNotePadButtonID;
showNotePadButton.innerHTML = 'Open Flexpad';

/*Button Style*/
let buttonStyle = document.createElement('style');

buttonStyle.textContent = `
    #${showNotePadButtonID}{
        padding: 10px;
        border-radius: 10px;
        border: 0;
        -webkit-box-shadow: 1px 1px 6px 0px rgba(50, 50, 50, 0.75);
        -moz-box-shadow:    1px 1px 6px 0px rgba(50, 50, 50, 0.75);
        box-shadow:         1px 1px 6px 0px rgba(50, 50, 50, 0.75);
    }
`;

/*Append button to shadow DOM*/
//shadow.appendChild(buttonStyle);
//shadow.appendChild(showNotePadButton);
shadow.appendChild(menuContainer);

/*Menu Click Events*/
function openFlexpad(highlightedText){
    highlightedText = preprocessText(highlightedText);
    App.runNotePad(highlightedText);
}

function quickHighlight(highlightedText){
    //highlight the text
    let serializedHighlight = HighlightHandler.highlightSelection();

    //save highlight
    HighlightHandler.saveHighlightSelectionToStorage({
        content: highlightedText
    }, serializedHighlight);  
}

import HighlightHandler from '../modules/highlight-handler';

/*Initialize SelectionMenu*/
new SelectionMenu({
    container: document.body,
    content: menuContainer,
    //fix bug here
    minlength: 1,
    //SelectionMenu will call handler after user click the button
    handler: function(e){
        let command = e.target.dataset.command;

        if(command === COMMANDS_LIST.OPEN_FLEXPAD){
            openFlexpad(this.selectedText);
        }

        if(command === COMMANDS_LIST.HIGHLIGHT){
            quickHighlight(this.selectedText);
        }

        //hide the button
        this.hide(true);
    },
    //SelectionMenu will call this function after user have selected a text on a webpage
    //Use this for debug only
    onselect: function(e){
        
    }
});

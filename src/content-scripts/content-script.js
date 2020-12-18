import Vue from 'vue'
import App from '../App.vue'
import RevealButton from '../components/reveal-button/index.vue';
import NotePad from '../components/notepad/index.vue';

/*Create app root for Vuejs*/
/*This is where the Vuejs app live*/
var appContainer = document.createElement("div")
document.body.insertBefore(appContainer, document.body.firstChild);

/*Initialize all instance once, and then reuse them*/
var FlexNoteButtonInstance = (function(){
    var instance = null;

    return {
        initialize: function(){
            if(instance === null){
                //first, extend Vue so the return will be a class, not an object
                let componentClass = Vue.extend(RevealButton);
                
                //create an instance will all props data set to default
                let _instance = new componentClass();
                _instance.$mount();
                appContainer.appendChild(_instance.$el);
                instance = _instance;
            }

            return instance;
        },
        getInstance: function(){
            return instance === null ? this.initialize() : instance;
        }
    }
})();

var flexnoteButton = FlexNoteButtonInstance.getInstance();

document.addEventListener('mouseup', function(e){
    let textSelection = window.getSelection().toString();

    if(textSelection !== ''){
        flexnoteButton.show();
        flexnoteButton.setPosition(e.pageX, e.pageY);
    }else{
        flexnoteButton.hide();
    }
});
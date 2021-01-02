import { faSketch } from '@fortawesome/free-brands-svg-icons';
import rangy from 'rangy/lib/rangy-core';
require('rangy/lib/rangy-classapplier');
require('rangy/lib/rangy-highlighter');
import { v4 as uuidv4 } from 'uuid';

export const HIGHLIGHT_COLORS = {
    IMPORTANT: {
        NAME: 'important',
        BACKGROUND_COLOR: '#E7958C',
        FOREGROUND_COLOR: '#000000',
    },
    REVIEW: {
        NAME: 'review',
        BACKGROUND_COLOR: '#f1c40f',
        FOREGROUND_COLOR: '#000000',
    },
    TERM: {
        NAME: 'term',
        BACKGROUND_COLOR: '#2ecc71',
        FOREGROUND_COLOR: '#000000',
    },
    OTHER: {
        NAME: 'other',
        BACKGROUND_COLOR: '#f39c12',
        FOREGROUND_COLOR: '#000000'
    },
    EXAMPLE: {
        NAME: 'example',
        BACKGROUND_COLOR: '#D18BED',
        FOREGROUND_COLOR: '#000000'
    }
}

export const HIGHLIGHT_STYLES = {
    IMPORTANT: {
        CSS_SELECTOR: "[class*='highlight-flexnote--important-']",
        NAME: 'highlight-flexnote--important',
        STYLE: `
            background   : ${HIGHLIGHT_COLORS.IMPORTANT.BACKGROUND_COLOR};
            color        : ${HIGHLIGHT_COLORS.IMPORTANT.FOREGROUND_COLOR};
            border-radius: 5px;
            cursor       : pointer;
            position     : relative;
            box-shadow   : ${HIGHLIGHT_COLORS.IMPORTANT.BACKGROUND_COLOR} 0px 0px 0.35em;
            -webkit-box-shadow: ${HIGHLIGHT_COLORS.IMPORTANT.BACKGROUND_COLOR} 0px 0px 0.35em;
            -moz-box-shadow   : ${HIGHLIGHT_COLORS.IMPORTANT.BACKGROUND_COLOR} 0px 0px 0.35em;
        `
    },
    REVIEW: {
        CSS_SELECTOR: "[class*='highlight-flexnote--review-']",
        NAME: 'highlight-flexnote--review',
        STYLE: `
            background   : ${HIGHLIGHT_COLORS.REVIEW.BACKGROUND_COLOR};
            color        : ${HIGHLIGHT_COLORS.REVIEW.FOREGROUND_COLOR};
            border-radius: 5px;
            cursor       : pointer;
            position     : relative;
            box-shadow   : ${HIGHLIGHT_COLORS.REVIEW.BACKGROUND_COLOR} 0px 0px 0.35em;
            -webkit-box-shadow: ${HIGHLIGHT_COLORS.REVIEW.BACKGROUND_COLOR} 0px 0px 0.35em;
            -moz-box-shadow   : ${HIGHLIGHT_COLORS.REVIEW.BACKGROUND_COLOR} 0px 0px 0.35em;
        `
    },
    TERM: {
        CSS_SELECTOR: "[class*='highlight-flexnote--term-']",
        NAME: 'highlight-flexnote--term',
        STYLE: `
            background   : ${HIGHLIGHT_COLORS.TERM.BACKGROUND_COLOR};
            color        : ${HIGHLIGHT_COLORS.TERM.FOREGROUND_COLOR};
            border-radius: 5px;
            cursor       : pointer;
            position     : relative;
            box-shadow   : ${HIGHLIGHT_COLORS.TERM.BACKGROUND_COLOR} 0px 0px 0.35em;
            -webkit-box-shadow: ${HIGHLIGHT_COLORS.TERM.BACKGROUND_COLOR} 0px 0px 0.35em;
            -moz-box-shadow   : ${HIGHLIGHT_COLORS.TERM.BACKGROUND_COLOR} 0px 0px 0.35em;
        `
    },
    OTHER: {
        CSS_SELECTOR: "[class*='highlight-flexnote--other-']",
        NAME: 'highlight-flexnote--other',
        STYLE: `
            background   : ${HIGHLIGHT_COLORS.OTHER.BACKGROUND_COLOR};
            color        : ${HIGHLIGHT_COLORS.OTHER.FOREGROUND_COLOR};
            border-radius: 5px;
            cursor       : pointer;
            position     : relative;
            box-shadow   : ${HIGHLIGHT_COLORS.OTHER.BACKGROUND_COLOR} 0px 0px 0.35em;
            -webkit-box-shadow: ${HIGHLIGHT_COLORS.OTHER.BACKGROUND_COLOR} 0px 0px 0.35em;
            -moz-box-shadow   : ${HIGHLIGHT_COLORS.OTHER.BACKGROUND_COLOR} 0px 0px 0.35em;
        `
    },
    EXAMPLE: {
        CSS_SELECTOR: "[class*='highlight-flexnote--example-']",
        NAME: 'highlight-flexnote--example',
        STYLE: `
            background   : ${HIGHLIGHT_COLORS.EXAMPLE.BACKGROUND_COLOR};
            color        : ${HIGHLIGHT_COLORS.EXAMPLE.FOREGROUND_COLOR};
            border-radius: 5px;
            cursor       : pointer;
            position     : relative;
            box-shadow   : ${HIGHLIGHT_COLORS.EXAMPLE.BACKGROUND_COLOR} 0px 0px 0.35em;
            -webkit-box-shadow: ${HIGHLIGHT_COLORS.EXAMPLE.BACKGROUND_COLOR} 0px 0px 0.35em;
            -moz-box-shadow   : ${HIGHLIGHT_COLORS.EXAMPLE.BACKGROUND_COLOR} 0px 0px 0.35em;
        `
    }
};

export const HighlightHandler = (function(){
    var highlighter = null;

    /*Private methods*/
    function restoreHighlights(serializedRangy){
        if(!highlighter){
            console.error('Highlighter is not initialized');
            return false;
        }

        highlighter.deserialize(serializedRangy);
    }

    function addClassApplierToHighlighter(className, options){
        if(!highlighter){
            console.error('Highlighter is not initialized');
            return false;
        }

        let classApplier = rangy.createClassApplier(className, options);

        highlighter.addClassApplier(classApplier);

        return classApplier;
    }

    /*Google Storage for Highlight*/
    var HighlightChromeStorage = (function(){
        let HIGHLIGHTS_STORAGE_KEY = 'highlight_storage';
        let HIGHLIGHTS_LIST_KEY = 'highlights';
        let HIGHLIGHTS_RANGY_SERIALIZED = 'rangy';
        let HIGHLIGHT_RECENT_REMOVED = 'highlight_removed';
        let urlAsKey = window.location.href;

        if(typeof chrome.storage === 'undefined'){
            console.error('Storage not found');
            return false;
        }

        return {
            addHighlightSelectionToStorage: function(highlightInfo, rangySerialized, callback){
                chrome.storage.sync.get(function(cfg){
                    let idAsKey = highlightInfo.id;

                    if(idAsKey === null){
                        console.error('Highlight doesnt have an id');
                        return false;
                    }

                    if(typeof cfg[urlAsKey] === 'undefined') cfg[urlAsKey] = {};

                    if(typeof cfg[urlAsKey][HIGHLIGHTS_STORAGE_KEY] !== 'undefined'){
                        cfg[urlAsKey][HIGHLIGHTS_STORAGE_KEY][HIGHLIGHTS_RANGY_SERIALIZED] = rangySerialized;
                        cfg[urlAsKey][HIGHLIGHTS_STORAGE_KEY][HIGHLIGHTS_LIST_KEY][idAsKey] = highlightInfo;
                    }else{
                        cfg[urlAsKey][HIGHLIGHTS_STORAGE_KEY] = {};
                        cfg[urlAsKey][HIGHLIGHTS_STORAGE_KEY][HIGHLIGHTS_RANGY_SERIALIZED] = rangySerialized;
                        cfg[urlAsKey][HIGHLIGHTS_STORAGE_KEY][HIGHLIGHTS_LIST_KEY] = {};
                        cfg[urlAsKey][HIGHLIGHTS_STORAGE_KEY][HIGHLIGHTS_LIST_KEY][idAsKey] = highlightInfo;
                    }

                    chrome.storage.sync.set(cfg, function(){
                        //TODO: remove console.log, and call callback only                     
                        if(typeof callback === 'function') callback();
                    });
                });
            },
            removeHighlightSelectionFromStorage: function(element, callback = null){
                let highlight = highlighter.getHighlightForElement(element);
                let idAsKey = element.id;

                if(highlight){
                    highlighter.removeHighlights([highlight]);

                    let newSerialize = highlighter.serialize();

                    //update storage
                    chrome.storage.sync.get(function(cfg){
                        if(typeof cfg[urlAsKey] === 'undefined'){
                            console.warn('Storage empty');
                            return false;
                        }

                        if(typeof cfg[urlAsKey][HIGHLIGHTS_STORAGE_KEY] === 'undefined'){
                            console.warn('Highlight empty');
                            return false;
                        }
                        
                        //TODO: remove highlight info
                        delete cfg[urlAsKey][HIGHLIGHTS_STORAGE_KEY][HIGHLIGHTS_LIST_KEY][idAsKey];

                        //update rangySerialized string
                        cfg[urlAsKey][HIGHLIGHTS_STORAGE_KEY][HIGHLIGHTS_RANGY_SERIALIZED] = newSerialize;

                        chrome.storage.sync.set(cfg, function(){
                            if(typeof callback === 'function'){
                                callback();
                            }
                        });
                    });
                }
            },
            updateHighlightSelectionFromStorage: function(){
                return false;
            },
            loadHighlightsFromStorage: function(){
                chrome.storage.sync.get(function(cfg){
                    if(typeof cfg[urlAsKey] === 'undefined'){
                        console.warn('Storage empty');
                        return false;
                    }

                    if(typeof cfg[urlAsKey][HIGHLIGHTS_STORAGE_KEY] === 'undefined'){
                        console.warn('No highlights found');
                        return false;
                    }

                    if(typeof cfg[urlAsKey][HIGHLIGHTS_STORAGE_KEY][HIGHLIGHTS_RANGY_SERIALIZED] === 'undefined'){
                        console.warn('No serialized string rangy found, something went wrong !');
                        //TODO: any solution to prevent this???
                        return false;
                    }

                    let rangy = cfg[urlAsKey][HIGHLIGHTS_STORAGE_KEY][HIGHLIGHTS_RANGY_SERIALIZED];

                    //load all the style of existing highlights
                    let highlights = cfg[urlAsKey][HIGHLIGHTS_STORAGE_KEY][HIGHLIGHTS_LIST_KEY];

                    Object.keys(highlights).forEach(key => {
                        addClassApplierToHighlighter(highlights[key].classSelectorId, {
                            ignoreWhiteSpace: true,
                            onElementCreate: function(el, cl){
                                el.id = highlights[key].id;
                                el.classList.add('highlight-flexnote');
                            }
                        })
                    });

                    //restore highlights
                    restoreHighlights(rangy);
                });
            },
            getHighlightContentFromStorage: function(highlightId, callback){
                chrome.storage.sync.get(function(cfg){
                    if(typeof cfg[urlAsKey] === 'undefined'){
                        console.warn('Storage empty');
                        return false;
                    }

                    if(typeof cfg[urlAsKey][HIGHLIGHTS_STORAGE_KEY] === 'undefined'){
                        console.warn('No highlight storage found');
                        return false;
                    }

                    if(typeof cfg[urlAsKey][HIGHLIGHTS_STORAGE_KEY][HIGHLIGHTS_LIST_KEY] === 'undefined'){
                        console.warn('No highlights found');
                        return false;
                    }

                    if(typeof callback !== 'function'){
                        console.error('Callback function is invalid');
                        return false;
                    }

                    let contentOfHighlight = cfg[urlAsKey][HIGHLIGHTS_STORAGE_KEY][HIGHLIGHTS_LIST_KEY][highlightId]['content'];

                    callback(contentOfHighlight);
                });
            }
        }
    })();

    return { 
        initialize: function(){
            if(typeof rangy === 'undefined'){
                console.error('rangy is not defined');
                return false;
            }

            /** Initialize Rangy*/
            rangy.init();
            
            /*Create Highlighter instance*/
            highlighter = rangy.createHighlighter();

            /*Load all styles to Highlighter Class Applier*/
            let style = document.createElement('style');
            
            Object.keys(HIGHLIGHT_STYLES).forEach(key => {
                let classSelector = HIGHLIGHT_STYLES[key].CSS_SELECTOR;
                let className = HIGHLIGHT_STYLES[key].NAME;
                let classContent = HIGHLIGHT_STYLES[key].STYLE;
                //let classApplier = rangy.createClassApplier(className, {
                //    ignoreWhiteSpace: true,
                //    onElementCreate: function(el, cl){
                //        console.log(cl);
                //        if(el){
                //            //TODO: add variable instead
                //            console.log('Owned by global');
                //            el.classList.add('highlight-flexnote');
                //            el.id = 'highlight-' + uuid;
                //        }
                //    }
                //});
                //highlighter.addClassApplier(classApplier);

                style.textContent += `
                    ${classSelector}{
                        ${classContent}
                    }
                `;
            });

            /*Append style to document*/
            document.body.insertBefore(style, document.body.firstChild);

            /*Load all existing highlights which are stored in Chrome Storage*/
            HighlightChromeStorage.loadHighlightsFromStorage();
        },
        highlightSelection: function(highlightedText, highlightColorClass = HIGHLIGHT_STYLES.REVIEW.NAME){
            if(!highlighter){
                console.error('Highlighter is not initialized');
                return false;
            }
            
            //generate a new id
            let uuid = uuidv4();
            let classSelectorId = highlightColorClass + '-' + uuid;

            //create a new class applier for this element only
            addClassApplierToHighlighter(classSelectorId, {
                ignoreWhiteSpace: true,
                onElementCreate: function(el, cl){
                    el.id = uuid;
                    el.classList.add('highlight-flexnote');
                }
            });

            highlighter.highlightSelection(classSelectorId);

            let serialized = highlighter.serialize();

            HighlightChromeStorage.addHighlightSelectionToStorage({
                content: highlightedText,
                id: uuid,
                classSelectorId: classSelectorId,
                classColor: highlightColorClass,
            }, serialized);
        },  
        unhighlightSelection: function(element){
            HighlightChromeStorage.removeHighlightSelectionFromStorage(element);
        },
        getContentOfHighlight: function(highlightId, callback){
            HighlightChromeStorage.getHighlightContentFromStorage(highlightId, callback);
        }
    };
})();

/*
const HighlightHandler = (function(){
    var highlightRanges = function(ranges, id){
        var mark = document.createElement('mark');
        mark.id = 'flexpad-mark-' + id;
        ranges.surroundContents(mark);
    };

    var getSafeRanges = function(originalRange){

        var safeRanges = [];
        var commonContainer = originalRange.commonAncestorContainer;

        if(originalRange.startContainer === commonContainer || originalRange.endContainer === commonContainer){
            safeRanges.push(originalRange);
            return safeRanges;
        }
        
        //find the start DOM
        let startDOM = null;

        for(let i = originalRange.startContainer; i != commonContainer; i = i.parentNode){
            startDOM = i;
        }

        console.log(startDOM);

        //find the end DOM
        let endDOM = null;

        for(let i = originalRange.endContainer; i != commonContainer; i = i.parentNode){
            endDOM = i;
        }

        console.log(endDOM);

        //iterate from startDOM to endDOM using siblings
        for(let i = startDOM; i != endDOM.nextSibling; i = i.nextSibling){
            //process the startDOM
            if(i === startDOM){
                console.log('Start DOM');
                if(i.nodeType === 3){
                    let r = document.createRange();
                    r.setStart(i, originalRange.startOffset);
                    r.setEndAfter(i);
                    safeRanges.push(r);
                }else{
                    let children = DomHandler.findAllTextNodes(i);
                    console.log(children);
                    console.log(originalRange.startOffset);
                    let beginHighlight = false;
                    for(let j = 0; j < children.length; ++j){
                        if(originalRange.startOffset === 0 || children[j] === originalRange.startContainer) beginHighlight = true;

                        if(beginHighlight){
                            if(children[j] === originalRange.startContainer){
                                let r = document.createRange();
                                r.setStart(children[j], originalRange.startOffset);
                                r.setEndAfter(children[j]);
                                safeRanges.push(r);
                            }else{
                                let r = document.createRange();
                                r.setStartBefore(children[j]);
                                r.setEndAfter(children[j]);
                                safeRanges.push(r);
                                console.log(r);
                            }
                        }                
                    }
                } 
            }
            else if(i === endDOM){
                console.log('End DOM');
                if(i.nodeType === 3){
                    let r = document.createRange();
                    r.setStartBefore(i);
                    r.setEnd(i, originalRange.endOffset);
                    safeRanges.push(r);
                }else{
                    let children = DomHandler.findAllTextNodes(i);
                    for(let j = 0; j < children.length; ++j){

                        if(children[j] === originalRange.endContainer){
                            let r = document.createRange();
                            r.setStartBefore(children[j]);
                            r.setEnd(children[j], originalRange.endOffset);
                            safeRanges.push(r);
                            break;
                        }

                        let r = document.createRange();
                        r.setStartBefore(children[j]);
                        r.setEndAfter(children[j]);
                        safeRanges.push(r);
                        console.log(r);
                    }
                } 
            }else
            {
                console.log('Middle DOM');
                let childrenTextNodes = DomHandler.findAllTextNodes(i);
                console.log(childrenTextNodes);
                childrenTextNodes.forEach(textNode => {
                    let r = document.createRange();
                    r.setStartBefore(textNode);
                    r.setEndAfter(textNode);
                    safeRanges.push(r);
                });
            }
        }

        return safeRanges;
    }

    return{
        highlightSelection: function(highlightId = null){
            var userSelection = window.getSelection().getRangeAt(0);
            console.log(userSelection);
            let ranges = getSafeRanges(userSelection);

            if(highlightId === null) highlightId = uuidv4();

            ranges.forEach(range => {
                highlightRanges(range, highlightId);
            });

            return {
                id: highlightId,
                originalRange: userSelection
            }
        },
        highlightFromOriginalRange: function(originalRange, highlightId){
            let ranges = getSafeRanges(originalRange);
            ranges.forEach(range => {
                highlightRanges(range, highlightId);
            });
        },
    };
})();

export default HighlightHandler;
*/
import rangy from 'rangy/lib/rangy-core';
require('rangy/lib/rangy-classapplier');
require('rangy/lib/rangy-highlighter');

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
        NAME: 'highlight-flexnote--important',
        STYLE: `
            background   : ${HIGHLIGHT_COLORS.IMPORTANT.BACKGROUND_COLOR};
            color        : ${HIGHLIGHT_COLORS.IMPORTANT.FOREGROUND_COLOR};
            border-radius: 5px;
        `
    },
    REVIEW: {
        NAME: 'highlight-flexnote--review',
        STYLE: `
            background   : ${HIGHLIGHT_COLORS.REVIEW.BACKGROUND_COLOR};
            color        : ${HIGHLIGHT_COLORS.REVIEW.FOREGROUND_COLOR};
            border-radius: 5px;
        `
    },
    TERM: {
        NAME: 'highlight-flexnote--term',
        STYLE: `
            background   : ${HIGHLIGHT_COLORS.TERM.BACKGROUND_COLOR};
            color        : ${HIGHLIGHT_COLORS.TERM.FOREGROUND_COLOR};
            border-radius: 5px;
        `
    },
    OTHER: {
        NAME: 'highlight-flexnote--other',
        STYLE: `
            background   : ${HIGHLIGHT_COLORS.OTHER.BACKGROUND_COLOR};
            color        : ${HIGHLIGHT_COLORS.OTHER.FOREGROUND_COLOR};
            border-radius: 5px;
        `
    },
    EXAMPLE: {
        NAME: 'highlight-flexnote--example',
        STYLE: `
            background   : ${HIGHLIGHT_COLORS.EXAMPLE.BACKGROUND_COLOR};
            color        : ${HIGHLIGHT_COLORS.EXAMPLE.FOREGROUND_COLOR};
            border-radius: 5px;
        `
    }
};

const HighlightHandler = (function(){
    var highlighter = null;

    return {
        initialize: function(){
            /*Init Rangy*/
            rangy.init();
            highlighter = rangy.createHighlighter();

            /*load styles*/
            let style = document.createElement('style');

            Object.keys(HIGHLIGHT_STYLES).forEach(key => {
                let className = HIGHLIGHT_STYLES[key].NAME;
                let classContent = HIGHLIGHT_STYLES[key].STYLE;

                highlighter.addClassApplier(rangy.createClassApplier(className), {
                    ignoreWhiteSpace: true
                });

                style.textContent += `
                    .${className}{
                        ${classContent}
                    }
                `;
            });
            /*Append style to document*/
            document.body.insertBefore(style, document.body.firstChild);

        },
        highlightSelection: function(){
            if(highlighter){
                highlighter.highlightSelection(HIGHLIGHT_STYLES.REVIEW.NAME);
                return highlighter.serialize();
            }

            console.error('Highlighter is not initialized');
            return null;
        },
        restoreHighlights: function(serializedHighlight){
            console.log(serializedHighlight);
            if(highlighter){
                highlighter.deserialize(serializedHighlight);
            }else{
                console.error('Highlighter is not initialized');
            } 
        },
        saveHighlightSelectionToStorage: function(highlightInfo, rangySerialized){
            /*
            Highlight Info Structure:
                content: <String>
            */

            if(typeof chrome.storage === 'undefined'){
                console.error('No storage found');
                return false;
            }

            let HIGHLIGHTS_STORAGE_KEY = 'highlight_storage';
            let HIGHLIGHTS_LIST_KEY = 'highlights';
            let HIGHLIGHTS_RANGY_SERIALIZED = 'rangy';

            let urlAsKey = window.location.href;

            chrome.storage.sync.get(function(cfg){
                console.log(cfg);

                if(typeof cfg[urlAsKey] === 'undefined') cfg[urlAsKey] = {};

                if(typeof cfg[urlAsKey][HIGHLIGHTS_STORAGE_KEY] !== 'undefined'){
                    cfg[urlAsKey][HIGHLIGHTS_STORAGE_KEY][HIGHLIGHTS_RANGY_SERIALIZED] = rangySerialized;
                    cfg[urlAsKey][HIGHLIGHTS_STORAGE_KEY][HIGHLIGHTS_LIST_KEY].push(highlightInfo);
                }else{
                    cfg[urlAsKey][HIGHLIGHTS_STORAGE_KEY] = {};
                    cfg[urlAsKey][HIGHLIGHTS_STORAGE_KEY][HIGHLIGHTS_RANGY_SERIALIZED] = rangySerialized;
                    cfg[urlAsKey][HIGHLIGHTS_STORAGE_KEY][HIGHLIGHTS_LIST_KEY] = [highlightInfo];
                }

                chrome.storage.sync.set(cfg, function(){
                    console.log('Saved highlight to Chrome Storage');
                });
            });

            return true;
        },
        loadHighlightsFromStorage: function(){
            if(typeof chrome.storage === 'undefined') {
                console.error('No storage found');
                return false;
            }

            let HIGHLIGHTS_STORAGE_KEY = 'highlight_storage';
            let HIGHLIGHTS_LIST_KEY = 'highlights';
            let HIGHLIGHTS_RANGY_SERIALIZED = 'rangy';

            let urlAsKey = window.location.href;

            var self = this;

            chrome.storage.sync.get(function(cfg){
                if(typeof cfg[urlAsKey] === 'undefined'){
                    console.warn('Empty storage');
                    return false;
                }

                if(typeof cfg[urlAsKey][HIGHLIGHTS_STORAGE_KEY] === 'undefined'){
                    console.warn('No highlights found');
                    return false;
                }

                if(typeof cfg[urlAsKey][HIGHLIGHTS_STORAGE_KEY][HIGHLIGHTS_RANGY_SERIALIZED] === 'undefined'){
                    console.warn('No rangy serialized string found, something went wrong !');
                    return false;
                }

                let rangy = cfg[urlAsKey][HIGHLIGHTS_STORAGE_KEY][HIGHLIGHTS_RANGY_SERIALIZED];

                console.log('Loaded rangy', rangy);

                self.restoreHighlights(rangy);
            });
        }
    }
})();

export default HighlightHandler;

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
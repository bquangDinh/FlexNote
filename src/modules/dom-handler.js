const DomHandler = (function(){
    return {
        serializeDOM: function(dom){
            if(dom === document.body){
                return document.body.tagName.toLowerCase();
            }

            var ix = 0;
            var siblings = dom.parentNode.childNodes;

            for(let i = 0; i < siblings.length; ++i){
                let sibling = siblings[i];

                if(sibling === dom) return this.serializeDOM(sibling.parentNode) + ' > ' + dom.tagName.toLowerCase() + ':nth-of-type(' + (ix + 1) + ')';

                if(sibling.nodeType === 1 && sibling.tagName === dom.tagName) ++ix;
            }
        },
        deserializeDOM: function(path){
            console.log('DOM path: ' + path);
            let node = document.querySelector(path);
            console.log(node);
            return node;
        },
        findAllTextNodes: function(root){
            var all = [];
            for (root = root.firstChild; root ; root = root.nextSibling){
                if(root.nodeType === 3) all.push(root);
                else all = all.concat(this.findAllTextNodes(root));
            }
    
            return all;
        }
    }
})();

export default DomHandler;
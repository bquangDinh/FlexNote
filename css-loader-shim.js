var css_loader = (function(){
    return {
        loadStyles: function(el){
            var styles = window['import_styles'] || [];

            styles.forEach(style => {
                el.appendChild(style);
            });
    
            //TODO: delete import_styles
            delete window['import_styles'];
        }
    }
})();

module.exports = function(elem){
    window['import_styles'] = window['import_styles'] || [];
    window['import_styles'].push(elem);
}

module.exports.css_loader = css_loader;
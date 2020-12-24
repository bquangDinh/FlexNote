module.exports = function(elem){
    window['import_styles'] = window['import_styles'] || [];

    import_styles.push(elem);

    window['css_loader'] = window['css_loader'] || {};
    window['css_loader'].loadStyles = function(el){
        import_styles.forEach(style => {
            el.appendChild(style);
        });

        //TODO: delete import_styles
        delete window['import_styles'];
    }
}
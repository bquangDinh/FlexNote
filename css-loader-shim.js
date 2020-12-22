module.exports = function(elem){
    window['import_styles'] = window['import_styles'] || [];

    import_styles.push(elem);

    window['foo'] = window['foo'] || {};
    window['foo'].loadStyles = function(el){
        import_styles.forEach(style => {
            el.appendChild(style);
        });

        //TODO: delete import_styles
    }
}
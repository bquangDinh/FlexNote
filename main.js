//$("body").append("<iframe class='gip-upper-layer' id='wtf' src='https://www.google.com/search?igu=1'></iframe>")

var ID = function(){
    return '_' + Math.random().toString(36).substr(2, 9);
};

var PopupButton = (function(){
    let isInitialized = false;
    let template = $("<button class='gip-btn'>Reveal</button>");
    let currentID = null;

    return {
        //create a button at current mouse position
        initialize: function(mouseX, mouseY){
            if(isInitialized == false){
                currentID = ID();
                let offsetY = 20;

                $(template).prop('id',currentID);
                $(template).css('left', mouseX);
                $(template).css('top',mouseY + offsetY);
                $('body').append(template);

                isInitialized = true;
            }
        },
        getCurrentTemplate: function(){
            return $("#" + currentID);
        },
        Destroy: function(){
            if(isInitialized){
                $("#" + currentID).remove();
                isInitialized = false;
            }
        }
    }
})();

var WikipediaAPI = (function(){
    var baseurl = "https://en.wikipedia.org/w/api.php";
    var wikiUrl = "https://en.wikipedia.org/wiki/";

    return{
        searchByKeyWord: async function(keyword){
            let params = {
                action: 'query',
                list: 'search',
                srsearch: keyword,
                format: "json"
            }
            let responseUrl = null;

            completeUrl = baseurl + "?origin=*";

            //iterator all keys of the params
            Object.keys(params).forEach(function(key){
                completeUrl += '&' + key + '=' + params[key];
            });

            await fetch(completeUrl)
            .then(function(response) { return response.json() })
            .then(function(response) { 
                renderUrl = wikiUrl + response.query.search[0].title;
                responseUrl = renderUrl;
            })
            .catch(function(error) { console.log(error); });

            return responseUrl;
        }
    }
})();

var NotePad = (function(){
    let templatesID = ID();

    let template = `
        <div class="gip-upper-layer" id="gip-container-1">
        <!--Tabs Bar-->
        <div class="gip-tabs">
            <input type="radio" id="gip-tab1" name="gip-tab-control" checked>
            <input type="radio" id="gip-tab2" name="gip-tab-control">
            <input type="radio" id="gip-tab3" name="gip-tab-control">
            <input type="radio" id="gip-tab4" name="gip-tab-control">
        
            <ul>
                <li title="Wikipedia">
                    <label for="gip-tab1" role="button">
                        <i class="fab fa-wikipedia-w"></i>
                        
                    </label>
                </li>
                <li title="Translate">
                    <label for="gip-tab2" role="button">
                        <i class="fas fa-language"></i>
                     
                    </label>
                </li>
                <li title="Oxford Dictionaries">
                    <label for="gip-tab3" role="button">
                        <i class="fas fa-spell-check"></i>
                      
                    </label>
                </li>
                <li title="Your Highlights">
                    <label for="gip-tab4" role="button">
                        <i class="fas fa-highlighter"></i>
                        
                    </label>
                </li>
            </ul>

            <div class="slider">
                <div class="indicator"></div>
            </div>

            <div class="content">
                <section>
                    <iframe id="gip-wiki-iframe-${templatesID}" src="https://en.wikipedia.org/wiki/Main_Page" frameborder="0"></iframe>
                </section>
                <section></section>
                <section></section>
                <section></section>
            </div>
        </div>
    </div>
    `;
    var isNotepadShowing = false;

    return {
        openNotePad: function(inputs){
            if(isNotepadShowing == false){
                $('body').append(template);
                isNotepadShowing = true;
            }

            $("#gip-wiki-iframe-" + templatesID).attr("src", inputs.wiki.renderurl);
        },
        destroyNotePad: function(){
            if(isNotepadShowing){
                $("#gip-container-1").remove();
            }
        }
    }
})();


$(document).on('click', async function(e){
    var textSelection = window.getSelection().toString();

    if(textSelection !== ''){
        let wikiRenderUrl = await WikipediaAPI.searchByKeyWord(textSelection);
        console.log(wikiRenderUrl);

        //pack it up
        let notepadInputs = {
            wiki: {
                renderurl: wikiRenderUrl
            }
        }
        NotePad.openNotePad(notepadInputs);

        /*
        var wikipediaUrl = "https://en.wikipedia.org/w/api.php"; 
        var params = {
            action: 'query',
            list: 'search',
            srsearch: window.getSelection().toString(),
            format: "json"
        }

        wikipediaUrl = wikipediaUrl + "?origin=*";
        Object.keys(params).forEach(function(key){
            wikipediaUrl += '&' + key + "=" + params[key];
        });

        fetch(wikipediaUrl)
        .then(function(response) { return response.json() })
        .then(function(response) {
            newUrl = "https://en.wikipedia.org/wiki/" + response.query.search[0].title
            $("#wtf").attr("src",newUrl);
        })
        .catch(function(error) { console.log(error); });
        */
    }

});
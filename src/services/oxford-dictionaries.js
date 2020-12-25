import https from 'https';

export const languages = {
    'en-gb': 'United Kingdom English',
    'en-us': 'English',
    'es'   : 'Spanish',
    'fr'   : 'French',
    'gu'   : 'Gujarati',
    'hi'   : 'Hindi',
    'lv'   : 'Latvian (Lettish)',
    'ro'   : 'Romanian',
    'sw'   : 'Swahili (Kiswahili)',
    'ta'   : 'Tamil'
};

export const keyLabelLangs = Object.assign({}, ...Object.keys(languages).map(x => ({ [x]: {key:x, label: languages[x]} })));

export async function searchOnOxford(sourceLang, text){
    //pre-process input text
    //remove any unnessecery whitespaces
    text = text.trim();

    let response = null;

    if(text === ''){
        console.error('Empty words detected');
        return response;
    }

    if(text.split(' ').length > 1){
        console.error('Multiple words detected');
        return response;
    }

    const OXFORD_DICTIONARIES_API_KEY = process.env.OXFORD_DICTIONARIES_API_KEY;
    const OXFORD_DICTIONARIES_API_APP_ID = process.env.OXFORD_DICTIONARIES_API_APP_ID;

    if(!OXFORD_DICTIONARIES_API_KEY || !OXFORD_DICTIONARIES_API_APP_ID){
        console.error('Oxford Dictionaries key not found');
        return response;
    }

    let apiURL = 'https://od-api.oxforddictionaries.com/api/v2/entries/';
    apiURL += sourceLang + '/' + text + '?strictMatch=false';
    
    let headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('app_key', OXFORD_DICTIONARIES_API_KEY);
    headers.append('app_id', OXFORD_DICTIONARIES_API_APP_ID);
    
    let request = new Request('https://powerful-inlet-19005.herokuapp.com/' + apiURL, {
        method: 'GET',
        headers: new Headers({
            'Accept': 'application/json',
            'app_key': OXFORD_DICTIONARIES_API_KEY,
            'app_id': OXFORD_DICTIONARIES_API_APP_ID,
        }),
        mode: 'cors'
    });

    for(let val of request.headers.values()){
        console.log(val);
    }

    await fetch(request)
    .then(function(_response) { return _response.json(); })
    .then(function(_response) {
        response = _response;
    })
    .catch(function(err) { console.error(err); });

    return response;
}

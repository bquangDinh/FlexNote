const GoogleStorageHandler = (function(){
    return{
        set: function(key, data, callback){
            let obj = {};
            obj[key] = data;

            chrome.storage.local.set(obj, callback);
        },
        get: function(key, callback){
            chrome.storage.local.get([key], callback);
        },
    }
})();

export default GoogleStorageHandler;
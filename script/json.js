/* 
 * Timemap.js Copyright 2008 Nick Rabinowitz.
 * Licensed under the MIT License (see LICENSE.txt)
 */

/**
 * @fileOverview
 * JSON Loaders (JSONP, JSON String)
 *
 * @author Nick Rabinowitz (www.nickrabinowitz.com)
 */
 
// for JSLint
/*global TimeMap */

/**
 * @class
 * JSONP loader class - expects a service that takes a callback function name as
 * the last URL parameter.
 *
 * <p>The jsonp loader assumes that the JSON can be loaded from a url to which a 
 * callback function name can be appended, e.g. "http://www.test.com/getsomejson.php?callback="
 * The loader then appends a nonce function name which the JSON should include.
 * This works for services like Google Spreadsheets, etc., and accepts remote URLs.</p>
 *
 * @example Usage in TimeMap.init():
 
    datasets: [
        {
            title: "JSONP Dataset",
            type: "jsonp",
            options: {
                url: "http://www.test.com/getsomejson.php?callback="
            }
        }
    ]
 *
 * @constructor
 * @param {Object} options          All options for the loader:<pre>
 *   {Array} url                        URL of JSON service to load, callback name left off
 *   {Function} preloadFunction         Function to call on data before loading
 *   {Function} transformFunction       Function to call on individual items before loading
 * </pre>
 */
TimeMap.loaders.jsonp = function(options) {
    // get standard functions and document
    TimeMap.loaders.mixin(this, options);
     
    /**
     * Function to call on data object before loading
     * @name TimeMap.loaders.jsonp#preload
     * @function
     * @parameter {Object} data     Data to preload
     * @return {Array} data         Array of item data
     */
     
    /**
     * Function to call on a single item data object before loading
     * @name TimeMap.loaders.jsonp#transform
     * @function
     * @parameter {Object} data     Data to transform
     * @return {Object} data        Transformed data for one item
     */
    
    /**
     * URL to load, with missing callback parameter
     * @example "http://www.example.com/myjsonservice?callback="
     * @type String
     */
    this.url = options.url;
};

/**
 * JSONP load function.
 *
 * @param {TimeMapDataset} dataset  Dataset to load data into
 * @param {Function} callback       Function to call once data is loaded
 */
TimeMap.loaders.jsonp.prototype.load = function(dataset, callback) {
    var loader = this;
    // get items
    TimeMap.loaders.jsonp.read(this.url, function(result) {
        // load
        var items = loader.preload(result);
        dataset.loadItems(items, loader.transform);
        // callback
        callback();
    });
};

/**
 * Static - for naming callback functions
 * @type int
 */
TimeMap.loaders.jsonp.counter = 0;

/**
 * Static - reads JSON from a URL, assuming that the service is set up to apply
 * a callback function specified in the URL parameters.
 *
 * @param {String}      jsonUrl     URL to load, missing the callback function name
 * @param {function}    f           Callback function to apply to returned data
 */
TimeMap.loaders.jsonp.read = function(url, f) {
    // Define a unique function name
    var callbackName = "_" + TimeMap.loaders.jsonp.counter++;

    TimeMap.loaders.jsonp[callbackName] = function(result) {
        // Pass result to user function
        f(result);
        // Delete the callback function
        delete TimeMap.loaders.jsonp[callbackName];
    };

    // Create a script tag, set its src attribute and add it to the document
    // This triggers the HTTP request and submits the query
    var script = document.createElement("script");
    script.src = url + "TimeMap.loaders.jsonp." + callbackName;
    document.body.appendChild(script);
};

/**
 * Static - cancel all current JSONP requests
 * (note that this doesn't cancel the load, just the callback)
 */
TimeMap.loaders.jsonp.cancelAll = function() {
    var namespace = TimeMap.loaders.jsonp;
    for (var i in namespace){
        // XXX: this is too cludgy - callback functions need their own namespace
		if (i.substr(0,1) == '_'){
			namespace[i] = function(){
				delete namespace[i];
			};
		}
	}
};

/**
 * @class
 * JSON string loader factory - expects a plain JSON array.
 *
 * <p>The json_string loader assumes an array of items in plain JSON, with no
 * callback function - this will require a local URL.</p>
 * <p>Note that this loader requires lib/json2.pack.js.</p>
 *
 * @augments TimeMap.loaders.remote
 *
 * @requires lib/json2.pack.js
 *
 * @example Usage in TimeMap.init():
 
    datasets: [
        {
            title: "JSON String Dataset",
            type: "json_string",
            options: {
                url: "mydata.json"    // Must be a local URL
            }
        }
    ]
 *
 * @param {Object} options          All options for the loader:<pre>
 *   {Array} url                        URL of JSON service to load, callback name left off
 *   {Function} preloadFunction         Function to call on data before loading
 *   {Function} transformFunction       Function to call on individual items before loading
 * </pre>
 * @return {TimeMap.loaders.remote} Remote loader configured for JSON strings
 */
TimeMap.loaders.json_string = function(options) {
    var loader = new TimeMap.loaders.remote(options);
    
    /**
     * Parse a JSON string into a JavaScript object, using the json2.js library.
     * @name TimeMap.loaders.json_string#parse
     * @param {String} json     JSON string to parse
     * @returns {Object}        Parsed JavaScript object
     */
    loader.parse = JSON.parse;
    
    return loader;
};

// Probably the default json loader should be json_string, not
// jsonp. I may change this in the future, so I'd encourage you to use
// the specific one you want.
TimeMap.loaders.json = TimeMap.loaders.jsonp;

/**
 * Facebook JavaScript Pixel Metadata Scrape Trigger
 * 
 * This is an IIFE designed for use as a Google Tag Manager Tag, but could
 * also be converted to a named function to call at will.
 *
 * The following function pulls source code from Facebook's pixel
 * external JavaScript to re-trigger the reading and sending of 
 * metadata via the pixel. 
 * 
 * Sources: 
 * [1] PIXELJS https://connect.facebook.net/signals/config/{{ pixel id }}?v=2.9.15&r=stable
 * [2] EVENTSJS https://connect.facebook.net/en_US/fbevents.js
 *  
 * Uniminify.com was used on both files, so the reference line numbers
 * should not be expected to match the source code. Nor should they be expected 
 * to be permanent.
 * 
 * Variable and function name may have been changed to allow them to be used
 * outside of their minified context.
 *
 */

(function(){
    
    //PIXELJS line 20793
    var ca = function(a, b, c) {
        return "string" != typeof a ? "" : a.length < c && 0 === b ? a : [].concat(m()(a)).slice(b, b + c).join("")
    };
    
    //PIXELJS line 20796    
    var U = function(a, b) {
        return ca(a, 0, b)
    }

    //EVENTSJS line 4432                            
    var e = window.fbq.getFbeventsModules("SignalsFBEventsUtils");

    //PIXELJS line 22799
    var o = e.FBSet;
    
    //Transposing or setting if variables for use in A() below
    var j = U;
    var r = 500; //Delay in milliseconds
    var h = document.head;

    //PIXELJS line 17021
    function A() {
        var a = new o(["og", "product", "music", "video", "article", "book", "profile", "website", "twitter"]),
            b = {},
            c = h.querySelectorAll("meta[property]");
        for (var d = 0; d < c.length; d++) {
            var e = c[d],
                f = e.getAttribute("property");
            e = e.getAttribute("content");
            if (typeof f === "string" && f.indexOf(":") !== -1 && typeof e === "string" && a.has(f.split(":")[0])) {
                e = j(e, r);
                var g = b[f];
                g != null && w(f) ? Array.isArray(g) ? b[f].push(e) : b[f] = [g, e] : b[f] = e
            }
        }
        return b || void 0
    }

    //PIXELJS line 17833
    var a = Object.assign || function(a) {
                            for (var b = 1; b < arguments.length; b++) {
                                var c = arguments[b];
                                for (var d in c) Object.prototype.hasOwnProperty.call(c, d) && (a[d] = c[d])
                            }
                            return a
                        }

    //Convenience variable added. The EVENTSJS has a longer process for this
    //that's not necessary here.
    var og = A();
    
    //PIXELJS 17082
    //Note that ONLY the OpenGraph Metadata is set. If you're using another
    //method, you will need to pluck those collection methods from PIXELJS                 
    var l = {
        DataLayer: [],
        Meta: [],
        OpenGraph: og,
        "Schema.org": []
    };                        

    //PIXELJS 17088    
    l = a({}, l, {
        "JSON-LD": []
    });

    //Get pixel IDS
    var pixids = Object.keys(window.fbq.instance.pixelsByID)

    //Loop over the pixel ids and fire the Metadata collection for each
    for(var p=0;p<pixids.length;p++){
        
        //EVENTSJS 4284
        //Bypassing the pixel's methods of trackSingleSystem() and 
        //trackSingleGeneric() to simplify and grab only what we need.
        var z = window.fbq.instance.getDefaultSendData(pixids[p], 'Microdata', null);
    
        //EVENTSJS 4285
        //Adding the Metadata to the request payload
        z.customData = l;
        
        //EVENTSJS 4286
        z.customParameters = {es: 'automatic'};
    
        //EVENTSJS 4289
        z.customParameters = a({}, z.customParameters, {tm: "" + 3});
        
        //EVENTSJS 4292
        window.fbq.instance.fire(z, !1);
    }
    
})();


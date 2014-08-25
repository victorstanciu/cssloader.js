(function () {

    var css = {};
    var loader = {};

    /**
     * Reads all the currently-loaded CSS files
     */
    loader.init = function ()
    {
        var links = document.getElementsByTagName('link');
        if (links.length) {
            for (var i = 0; i < links.length; i++) {
                if (links[i].getAttribute('rel') == 'stylesheet') {
                    css[links[i].getAttribute('href')] = links[i];
                }
            };
        }
    };

    /**
     * Loads a CSS file. If the file is already loaded enable it.
     * If the file is already enabled, do nothing.
     * The callback function is called when the CSS file has been loaded and inserted into the DOM
     *
     * @param  string   source
     * @param  Function callback
     */
    loader.load = function (source, callback)
    {
        if (typeof css[source] != 'undefined') {
            var node = css[source];
            if (node.getAttribute('disabled') == true) {
                node.setAttribute('disabled', false);
            }
            if (typeof callback == 'function') {
                return callback();
            }
        }

        var node = document.createElement("link");

        node.setAttribute("rel", "stylesheet");
        node.setAttribute("type", "text/css");
        node.setAttribute("href", source);

        document.getElementsByTagName("head")[0].appendChild(node);

        css[source] = node;

        if (typeof callback == 'function') {
            /**
             * Cross-browser hack that allows checking when a CSS file has been loaded
             * Asigning the CSS url as an img's src property will trigger the img's error
             * event when the CSS is loaded and the browser realizes it's not a valid image
             */
            var img = document.createElement('img');
                img.onerror = callback;
                img.setAttribute('src', source);
        }
    };

    /**
     * Completely removes a CSS file from the DOM
     */
    loader.remove = function (source)
    {
        css[source].parentNode.removeChild(css[source]);
        delete css[source];
    };

    loader.replace = function (source, target, callback)
    {
        if (typeof css[source] != 'undefined') {
            loader.remove(source);
        }

        loader.load(target, callback);
    };

    if (typeof define === 'function' && define.amd) {
        define(function () {
            return loader;
        });
    } else {
        window.cssloader = loader;
    }

})();
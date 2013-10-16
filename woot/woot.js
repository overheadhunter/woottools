/*
 * MIT license (full version in LICENSE file).
 * Copyright 2013 sebastianstenzel.de
 *
 * Depends on mootools core-1.4.5+ and mootools-more:Utilities/Asset 1.4.0.1+
 * For browsers, that don't support hashchange events (http://caniuse.com/hashchange),
 * please include this fix too: http://mootools.net/forge/p/mootools_onhashchange_event
 */
 

// Namespace for woottools
woot = {};

if (!wootScriptLocation) {
	wootScriptLocation = '.';
}

// load script, woottools consist of. 
Asset.javascript(wootScriptLocation+'/woot/stringExtensions.js');
Asset.javascript(wootScriptLocation+'/woot/arrayExtensions.js');
Asset.javascript(wootScriptLocation+'/woot/modules.js', {
	onLoad: function() {
		if (woot.modulePaths) {
			woot.moduleCache = new woot.ModuleCache(woot.modulePaths);
		} else {
			throw Error("woottools configuration invalid. Please define woot.modulePaths!");
		}
	}
});
Asset.javascript(wootScriptLocation+'/woot/moduleExecutors.js');
Asset.javascript(wootScriptLocation+'/woot/router.js', {
	onLoad: function() {
		if (woot.routes) {
			woot.router = new woot.Router(woot.routes);
		} else {
			throw Error("woottools configuration invalid. Please define woot.routes!");
		}
	}
});
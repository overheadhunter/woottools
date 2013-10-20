/*
 * MIT license (full version in LICENSE file).
 * Copyright 2013 sebastianstenzel.de
 *
 * Depends on mootools core-1.4.5+ and mootools-more:Utilities/Asset 1.4.0.1+
 * For browsers, that don't support hashchange events (http://caniuse.com/hashchange),
 * please include this fix too: http://mootools.net/forge/p/mootools_onhashchange_event
 */

// normally defined in 00_namespace.js:
woot = {
	modulePaths: {},
	routes: {}
};

if (!wootScriptLocation) {
	wootScriptLocation = '.';
}

// load script, woottools consist of. 
Asset.javascript(wootScriptLocation+'/woot/01_consoleStub.js');
Asset.javascript(wootScriptLocation+'/woot/01_stringExtensions.js');
Asset.javascript(wootScriptLocation+'/woot/01_arrayExtensions.js');
Asset.javascript(wootScriptLocation+'/woot/10_router.js');
Asset.javascript(wootScriptLocation+'/woot/20_modules.js');
Asset.javascript(wootScriptLocation+'/woot/21_moduleExecutors.js');

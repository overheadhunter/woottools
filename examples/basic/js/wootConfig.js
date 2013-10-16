/* Modules */

woot.modulePaths = {
	"home": "js/modules/home.js",
	"search": "js/modules/search.js",
	"echo": "js/modules/echo.js"
};

/* Routing */

woot.routes = {
	
	"/home": function(routingContext) {
		woot.moduleCache.getModule("home", {'executor': 'replaceDom', 'obj': $('siteContent')});
	},
	
	"/search/q:[0-9a-z]": function(routingContext) {
		woot.moduleCache.getModule("search", {'executor': 'replaceDom', 'obj': $('siteContent'), 'routingContext': routingContext});
	},
	
	"/echo": function(routingContext) {
		woot.moduleCache.getModule("echo", {'executor': 'replaceDom', 'obj': $('siteContent')});
	}
	
};

/* Modules */

woot.modulePaths = {
	"home": "js/modules/home.js",
	"search": "js/modules/search.js",
	"echo": "js/modules/echo.js"
};

/* Routing */

woot.routes = {
	
	"/home": function(routingContext) {
		woot.loadModule("home").replaceDom($('siteContent'));
	},
	
	"/search/q:[0-9a-z]": function(routingContext) {
		woot.loadModule("search").replaceDom($('siteContent'), routingContext);
	},
	
	"/echo": function(routingContext) {
		woot.loadModule("echo").replaceDom($('siteContent'));
	}
	
};
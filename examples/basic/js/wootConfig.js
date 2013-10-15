/* Modules */

woot.modulePaths = {
	"echo": "js/modules/echo.js"
};

/* Routing */

woot.routes = {
	
	"/home": function(routingContext) {
		$('siteContent').set('text', 'you\'re at home');
	},
	
	"/search/q:[0-9a-z]": function(routingContext) {
		$('siteContent').set('text', 'you have searched for ' + routingContext.q);
	},
	
	"/echo": function(routingContext) {
		woot.moduleCache.getModule("echo", function(module) {
			$('siteContent').grab(module.dom);
		});
	}
	
};

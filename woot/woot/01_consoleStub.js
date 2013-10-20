/*
 * MSIE (yes I know...) doesn't offer a console object, if the developer tools are closed.
 */
 
 if (!window.console) {
 	console = {
 		debug: function(){},
 		log: function(){},
 		info: function(){},
 		warn: function(){},
 		error: function(){},
 		assert: function(){}
 	}
 }